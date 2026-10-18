import React from 'react';
import { Shield, Heart, Zap, Sparkles, BookOpen, Award, Flame } from 'lucide-react';
import { Ability, Character } from '../types/dnd';
import { formatModifier, getModifier, XP_TABLE } from '../data/dndRules';

interface CharacterDrawerProps {
  character: Character;
  onClose?: () => void;
}

const SKILL_LIST: { name: string; ability: Ability }[] = [
  { name: 'Acrobatics', ability: 'dex' },
  { name: 'Animal Handling', ability: 'wis' },
  { name: 'Arcana', ability: 'int' },
  { name: 'Athletics', ability: 'str' },
  { name: 'Deception', ability: 'cha' },
  { name: 'History', ability: 'int' },
  { name: 'Insight', ability: 'wis' },
  { name: 'Intimidation', ability: 'cha' },
  { name: 'Investigation', ability: 'int' },
  { name: 'Medicine', ability: 'wis' },
  { name: 'Nature', ability: 'int' },
  { name: 'Perception', ability: 'wis' },
  { name: 'Performance', ability: 'cha' },
  { name: 'Persuasion', ability: 'cha' },
  { name: 'Religion', ability: 'int' },
  { name: 'Sleight of Hand', ability: 'dex' },
  { name: 'Stealth', ability: 'dex' },
  { name: 'Survival', ability: 'wis' },
];

export const CharacterDrawer: React.FC<CharacterDrawerProps> = ({ character }) => {
  const xpPercent = Math.min(100, Math.round((character.xp / character.nextLevelXp) * 100));

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Hero Header Card */}
      <div className="bg-[#121927] border border-amber-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>{character.race}</span>
              <span className="text-slate-600">·</span>
              <span>Level {character.level} {character.characterClass}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{character.alignment}</span>
            </div>
            <h1 className="font-fantasy text-2xl md:text-3xl font-extrabold text-amber-100 mt-1">
              {character.name}
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-xl">
              {character.backstory}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-right shrink-0">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Experience
            </span>
            <span className="font-mono text-sm font-bold text-amber-300">
              {character.xp} / {character.nextLevelXp} XP
            </span>
            <div className="w-32 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combat Vitals Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2.5 bg-rose-950/60 border border-rose-600/30 rounded-lg text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Hit Points
              </span>
              <span className="font-mono text-base font-bold text-rose-300 tabular-nums">
                {character.hp.current} / {character.hp.max}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/60 border border-amber-600/30 rounded-lg text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Armor Class
              </span>
              <span className="font-mono text-base font-bold text-amber-300 tabular-nums">
                {character.armorClass}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2.5 bg-sky-950/60 border border-sky-600/30 rounded-lg text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Speed & Initiative
              </span>
              <span className="font-mono text-base font-bold text-sky-300 tabular-nums">
                {character.speed}ft · {formatModifier(getModifier(character.abilities.dex))}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-950/60 border border-indigo-600/30 rounded-lg text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Proficiency
              </span>
              <span className="font-mono text-base font-bold text-indigo-300 tabular-nums">
                +{character.proficiencyBonus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Six Ability Scores */}
      <div>
        <h2 className="font-fantasy text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">
          Core Ability Scores & Modifiers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((stat) => {
            const score = character.abilities[stat];
            const mod = getModifier(score);
            return (
              <div
                key={stat}
                className="bg-[#121927] border border-amber-900/20 rounded-xl p-3.5 text-center shadow-md hover:border-amber-500/40 transition-colors"
              >
                <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {stat === 'str' && 'Strength'}
                  {stat === 'dex' && 'Dexterity'}
                  {stat === 'con' && 'Constitution'}
                  {stat === 'int' && 'Intelligence'}
                  {stat === 'wis' && 'Wisdom'}
                  {stat === 'cha' && 'Charisma'}
                </span>
                <span className="font-fantasy text-2xl font-black text-amber-100 my-1 block">
                  {formatModifier(mod)}
                </span>
                <span className="inline-block text-xs font-mono px-2 py-0.5 bg-slate-900 rounded text-slate-400">
                  Score {score}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spells & Cantrips (if caster) */}
      {character.spells && character.spells.length > 0 && (
        <div className="bg-[#121927] border border-amber-900/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h2 className="font-fantasy text-sm font-bold text-amber-200 uppercase tracking-wider">
              Grimoire & Known Spells
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {character.spells.map((spl) => (
              <div
                key={spl.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-fantasy font-bold text-sm text-amber-200">
                    {spl.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {spl.level === 0 ? 'Cantrip' : `Level ${spl.level}`} · {spl.school}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {spl.description}
                </p>
                <div className="mt-2 text-xs font-mono font-semibold text-amber-300/90">
                  {spl.damageOrEffect}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Proficiencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="bg-[#121927] border border-amber-900/20 rounded-2xl p-5 shadow-lg">
          <h2 className="font-fantasy text-sm font-bold text-amber-200 uppercase tracking-wider mb-3">
            Skill Modifiers
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {SKILL_LIST.map((s) => {
              const abilityScore = character.abilities[s.ability];
              const baseMod = getModifier(abilityScore);
              const isProf = character.proficiencies.some((p) =>
                p.toLowerCase().includes(s.name.toLowerCase())
              );
              const totalSkillMod = baseMod + (isProf ? character.proficiencyBonus : 0);

              return (
                <div
                  key={s.name}
                  className="flex items-center justify-between py-1 border-b border-slate-800/40"
                >
                  <span className={isProf ? 'text-amber-200 font-medium' : 'text-slate-400'}>
                    {isProf ? '✦ ' : ''}{s.name}
                  </span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {formatModifier(totalSkillMod)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traits & Training */}
        <div className="bg-[#121927] border border-amber-900/20 rounded-2xl p-5 shadow-lg space-y-4">
          <div>
            <h2 className="font-fantasy text-sm font-bold text-amber-200 uppercase tracking-wider mb-2">
              Racial Traits & Talents
            </h2>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {character.proficiencies.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <h2 className="font-fantasy text-sm font-bold text-amber-200 uppercase tracking-wider mb-1">
              Rest & Recovery Pools
            </h2>
            <div className="text-xs text-slate-300 flex items-center justify-between">
              <span>Hit Dice Pool:</span>
              <span className="font-mono font-bold text-amber-300">
                {character.hitDice.current} / {character.hitDice.total} ({character.hitDice.die})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
