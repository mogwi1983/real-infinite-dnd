import React, { useState } from 'react';
import { Shield, Sparkles, Wand2, Compass, Dice5, Check } from 'lucide-react';
import { Character, CharacterClass, Race } from '../types/dnd';
import { CLASSES, createDefaultCharacter, formatModifier, getModifier, RACES } from '../data/dndRules';
import { sound } from '../utils/audio';

interface CharacterCreatorModalProps {
  onComplete: (character: Character) => void;
}

const RANDOM_NAMES = [
  'Aelarion Nightbreeze',
  'Valerius Ironheart',
  'Lyra Moonwhisper',
  'Balthazar Stonehammer',
  'Kaelen Crownguard',
  'Morgran Deepforge',
  'Sariel Dawntracker',
  'Rowan Bramblethorn',
  'Ignis Ashendown',
  'Vespera Spellweaver',
];

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('Aelarion Nightbreeze');
  const [selectedRace, setSelectedRace] = useState<Race>('High Elf');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('Fighter');

  const previewChar = createDefaultCharacter(name, selectedRace, selectedClass);
  const raceDetails = RACES[selectedRace];
  const classDetails = CLASSES[selectedClass];

  const handleRandomName = () => {
    sound.playClick();
    const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    setName(RANDOM_NAMES[randomIndex]);
  };

  const handleStart = () => {
    sound.playLevelUp();
    onComplete(previewChar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f1624] border border-amber-600/30 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            D&D 5th Edition Character Creation
          </span>
          <h1 className="font-fantasy text-2xl md:text-3xl font-extrabold text-amber-100 mt-1">
            Forge Your Hero of Eldoria
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl mx-auto">
            Choose your race and class to venture into the eternal wilds, ancient elven sanctuaries, and forgotten crypts.
          </p>
        </div>

        {/* Character Moniker Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Hero Name & Moniker
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161f30] border border-amber-900/30 rounded-lg px-3.5 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-500 font-medium"
              placeholder="Enter hero name..."
            />
          </div>
          <button
            onClick={handleRandomName}
            className="w-full sm:w-auto px-4 py-2 mt-4 sm:mt-4 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/40 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Dice5 className="w-4 h-4" />
            <span>Random Name</span>
          </button>
        </div>

        {/* Two-Column Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Race Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
              1. Choose Race
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(RACES) as Race[]).map((r) => {
                const isSelected = selectedRace === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRace(r);
                    }}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-fantasy font-bold text-sm">{r}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {RACES[r].description}
                    </p>
                  </button>
                );
              })}
            </div>
            {/* Selected Race Traits */}
            <div className="mt-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800/60 text-xs">
              <span className="text-amber-400 font-semibold block mb-1">Racial Traits:</span>
              <ul className="text-slate-400 space-y-0.5">
                {raceDetails.traits.map((trait, i) => (
                  <li key={i}>• {trait}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
              2. Choose Class
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(CLASSES) as CharacterClass[]).map((c) => {
                const isSelected = selectedClass === c;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      sound.playClick();
                      setSelectedClass(c);
                    }}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-fantasy font-bold text-sm">{c}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {CLASSES[c].description}
                    </p>
                  </button>
                );
              })}
            </div>
            {/* Selected Class Proficiencies */}
            <div className="mt-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800/60 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-amber-400 font-semibold">Hit Die: {classDetails.hitDie}</span>
                <span className="text-slate-400">Primary: {classDetails.primaryAbility.toUpperCase()}</span>
              </div>
              <p className="text-slate-400">
                Proficiencies: {classDetails.proficiencies.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Live Hero Attributes Summary */}
        <div className="bg-slate-950/80 border border-amber-900/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Combat Baseline & Ability Scores
            </span>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-rose-400 font-bold tabular-nums">HP: {previewChar.hp.max}</span>
              <span className="text-amber-300 font-bold tabular-nums">AC: {previewChar.armorClass}</span>
              <span className="text-sky-300 font-bold tabular-nums">Speed: {previewChar.speed}ft</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 text-center">
            {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((stat) => {
              const score = previewChar.abilities[stat];
              const mod = getModifier(score);
              return (
                <div key={stat} className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    {stat}
                  </span>
                  <span className="font-fantasy text-base font-bold text-amber-200">
                    {score}
                  </span>
                  <span className="block text-xs font-mono font-semibold text-amber-400/90">
                    {formatModifier(mod)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Adventure Action */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-amber-950 font-extrabold text-base rounded-xl shadow-xl transition-all font-fantasy tracking-wider cursor-pointer"
          >
            Begin Journey into Eldoria
          </button>
        </div>
      </div>
    </div>
  );
};
