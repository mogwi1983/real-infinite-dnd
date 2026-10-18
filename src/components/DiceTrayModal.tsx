import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, RefreshCw, X } from 'lucide-react';
import { Ability, Character, RollResult, SkillCheck } from '../types/dnd';
import { formatModifier, getModifier } from '../data/dndRules';
import { sound } from '../utils/audio';

interface DiceTrayModalProps {
  isOpen: boolean;
  actionTitle: string;
  skillCheck: SkillCheck;
  character: Character;
  onRollComplete: (result: RollResult) => void;
  onCancel: () => void;
}

export const DiceTrayModal: React.FC<DiceTrayModalProps> = ({
  isOpen,
  actionTitle,
  skillCheck,
  character,
  onRollComplete,
  onCancel,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [naturalRoll, setNaturalRoll] = useState<number>(20);
  const [rollMode, setRollMode] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');
  const [rollResult, setRollResult] = useState<RollResult | null>(null);

  // Compute modifier
  const abilityScore = character.abilities[skillCheck.ability] ?? 10;
  const abilityMod = getModifier(abilityScore);

  // Check if character is proficient in this skill
  const isProficient = character.proficiencies.some(p =>
    p.toLowerCase().includes(skillCheck.skillName.toLowerCase())
  );
  const totalMod = abilityMod + (isProficient ? character.proficiencyBonus : 0);

  useEffect(() => {
    if (isOpen) {
      setHasRolled(false);
      setIsRolling(false);
      setRollResult(null);
    }
  }, [isOpen]);

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setHasRolled(false);
    sound.playDiceRoll();

    // Roll dynamics
    let roll1 = Math.floor(Math.random() * 20) + 1;
    let roll2 = Math.floor(Math.random() * 20) + 1;
    let finalNat = roll1;

    if (rollMode === 'advantage') {
      finalNat = Math.max(roll1, roll2);
    } else if (rollMode === 'disadvantage') {
      finalNat = Math.min(roll1, roll2);
    }

    setTimeout(() => {
      setNaturalRoll(finalNat);
      setIsRolling(false);
      setHasRolled(true);

      const total = finalNat + totalMod;
      const isCrit = finalNat === 20;
      const isFumble = finalNat === 1;
      const isSuccess = isCrit ? true : isFumble ? false : total >= skillCheck.dc;

      sound.playDiceImpact(isCrit, isFumble);

      const result: RollResult = {
        naturalRoll: finalNat,
        modifier: totalMod,
        total,
        dc: skillCheck.dc,
        isSuccess,
        isCrit,
        isFumble,
        ability: skillCheck.ability,
        skillName: skillCheck.skillName,
      };

      setRollResult(result);
    }, 1300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#111726] border border-amber-600/30 rounded-xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Background ambient radial glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span className="uppercase tracking-wider">{skillCheck.skillName} Check</span>
              <span className="text-slate-600">·</span>
              <span className="uppercase tracking-wider">DC {skillCheck.dc}</span>
            </div>
            <h3 className="font-fantasy text-lg font-bold text-amber-100 mt-0.5">
              {actionTitle}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isRolling}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roll Mode Selector */}
        <div className="flex items-center justify-center gap-2 mt-4 p-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => setRollMode('normal')}
            disabled={isRolling || hasRolled}
            className={`flex-1 py-1.5 rounded transition-colors ${
              rollMode === 'normal'
                ? 'bg-amber-600/40 text-amber-200 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setRollMode('advantage')}
            disabled={isRolling || hasRolled}
            className={`flex-1 py-1.5 rounded transition-colors ${
              rollMode === 'advantage'
                ? 'bg-emerald-600/40 text-emerald-200 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Advantage
          </button>
          <button
            onClick={() => setRollMode('disadvantage')}
            disabled={isRolling || hasRolled}
            className={`flex-1 py-1.5 rounded transition-colors ${
              rollMode === 'disadvantage'
                ? 'bg-rose-600/40 text-rose-200 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Disadvantage
          </button>
        </div>

        {/* 3D Animated Dice Arena */}
        <div className="py-8 flex flex-col items-center justify-center min-h-[220px]">
          <div
            onClick={!isRolling && !hasRolled ? handleRoll : undefined}
            className={`relative w-28 h-28 cursor-pointer select-none transition-transform duration-300 ${
              !isRolling && !hasRolled ? 'hover:scale-105 active:scale-95' : ''
            }`}
          >
            {/* Outer polyhedral glow */}
            <div
              className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                isRolling
                  ? 'bg-amber-500/20 blur-xl animate-pulse'
                  : hasRolled && rollResult?.isCrit
                  ? 'bg-amber-400/30 blur-2xl'
                  : hasRolled && rollResult?.isFumble
                  ? 'bg-rose-600/30 blur-2xl'
                  : 'bg-amber-600/10 blur-lg'
              }`}
            />

            {/* Simulated 3D D20 Polygon */}
            <div
              className={`w-full h-full rounded-2xl flex items-center justify-center border-2 shadow-2xl relative ${
                isRolling
                  ? 'animate-dice-tumble border-amber-400 bg-gradient-to-br from-amber-900 to-amber-950 text-amber-200'
                  : hasRolled && rollResult?.isCrit
                  ? 'border-amber-400 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 ring-4 ring-amber-400/40'
                  : hasRolled && rollResult?.isFumble
                  ? 'border-rose-600 bg-gradient-to-br from-rose-950 via-slate-900 to-black text-rose-400 ring-4 ring-rose-600/40'
                  : 'border-amber-500/50 bg-gradient-to-br from-[#1d273a] via-[#151d2d] to-[#0f1624] text-amber-200'
              }`}
            >
              {/* Subtle faceted polygon overlay */}
              <div className="absolute inset-2 border border-amber-500/20 rounded-lg pointer-events-none rotate-45" />

              <span className="font-fantasy font-black text-4xl tabular-nums tracking-tighter drop-shadow-md">
                {isRolling ? '?' : naturalRoll}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            {isRolling
              ? 'Tumbling across the tavern table...'
              : hasRolled
              ? 'Die has settled!'
              : 'Click the d20 or press Roll to test your fate'}
          </p>
        </div>

        {/* Calculation & Breakdown */}
        {hasRolled && rollResult && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs mb-4 animate-fade-in">
            <div className="flex items-center justify-between text-slate-300">
              <span>Natural Roll:</span>
              <span className="font-mono font-bold">{rollResult.naturalRoll}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 mt-1">
              <span>
                {skillCheck.ability.toUpperCase()} Modifier ({formatModifier(abilityMod)})
                {isProficient && ` + Proficiency (+${character.proficiencyBonus})`}:
              </span>
              <span className="font-mono font-bold">{formatModifier(rollResult.modifier)}</span>
            </div>
            <div className="border-t border-slate-800 mt-2 pt-2 flex items-center justify-between font-semibold">
              <span className="text-slate-200">Total Check:</span>
              <span className="text-sm font-mono font-bold text-amber-300">
                {rollResult.total} vs DC {skillCheck.dc}
              </span>
            </div>

            {/* Outcome Banner */}
            <div className="mt-3 text-center py-2 px-3 rounded font-bold text-sm tracking-wide">
              {rollResult.isCrit ? (
                <div className="text-amber-300 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>CRITICAL SUCCESS (NATURAL 20)!</span>
                </div>
              ) : rollResult.isFumble ? (
                <div className="text-rose-400 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>CRITICAL FUMBLE (NATURAL 1)!</span>
                </div>
              ) : rollResult.isSuccess ? (
                <div className="text-emerald-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SUCCESS! (Passed DC {skillCheck.dc})</span>
                </div>
              ) : (
                <div className="text-rose-400 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>FAILURE (Missed DC {skillCheck.dc})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-4">
          {!hasRolled ? (
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold rounded-lg shadow-md transition-all font-fantasy tracking-wider disabled:opacity-50"
            >
              {isRolling ? 'Rolling...' : 'Roll d20'}
            </button>
          ) : (
            <button
              onClick={() => rollResult && onRollComplete(rollResult)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold rounded-lg shadow-lg transition-all font-fantasy tracking-wider"
            >
              Continue Adventure with Outcome
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
