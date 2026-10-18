import React, { useState } from 'react';
import { Moon, Flame, Heart, X, Sparkles } from 'lucide-react';
import { Character } from '../types/dnd';
import { getModifier } from '../data/dndRules';
import { sound } from '../utils/audio';

interface CampModalProps {
  isOpen: boolean;
  character: Character;
  onClose: () => void;
  onShortRest: (healedHp: number, diceSpent: number) => void;
  onLongRest: () => void;
}

export const CampModal: React.FC<CampModalProps> = ({
  isOpen,
  character,
  onClose,
  onShortRest,
  onLongRest,
}) => {
  const [restLog, setRestLog] = useState<string | null>(null);

  if (!isOpen) return null;

  const conMod = getModifier(character.abilities.con);

  const handleSpendHitDie = () => {
    if (character.hitDice.current <= 0) {
      setRestLog('You have no remaining Hit Dice to spend until a Long Rest.');
      return;
    }

    sound.playHeal();
    const dieMax = parseInt(character.hitDice.die.replace('d', ''), 10) || 8;
    const roll = Math.floor(Math.random() * dieMax) + 1;
    const totalHealed = Math.max(1, roll + conMod);

    onShortRest(totalHealed, 1);
    setRestLog(`Rolled ${character.hitDice.die} (${roll}) + CON (${conMod >= 0 ? `+${conMod}` : conMod}) = recovered ${totalHealed} HP.`);
  };

  const handleExecuteLongRest = () => {
    sound.playHeal();
    onLongRest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f1624] border border-amber-600/30 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950/60 border border-amber-600/30 rounded-lg text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
                Sanctuary of the Trail
              </span>
              <h2 className="font-fantasy text-lg font-bold text-amber-100">
                Make Camp & Rest
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Vitals */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 my-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block">Current Health:</span>
            <span className="font-mono font-bold text-rose-300 text-sm">
              {character.hp.current} / {character.hp.max} HP
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">Hit Dice Remaining:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {character.hitDice.current} / {character.hitDice.total} ({character.hitDice.die})
            </span>
          </div>
        </div>

        {/* Rest Options */}
        <div className="space-y-4">
          {/* Short Rest */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-fantasy font-bold text-sm text-amber-200">
                  Short Rest (1 Hour)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Catch your breath and bind wounds. Spend Hit Dice to regain health without sleeping through the night.
                </p>
              </div>
              <button
                onClick={handleSpendHitDie}
                disabled={character.hitDice.current <= 0 || character.hp.current >= character.hp.max}
                className="px-3.5 py-1.5 bg-amber-950/70 hover:bg-amber-900/90 border border-amber-600/40 text-amber-200 text-xs font-semibold rounded-lg transition-all shrink-0 disabled:opacity-40"
              >
                Spend 1 Hit Die
              </button>
            </div>
          </div>

          {/* Long Rest */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-fantasy font-bold text-sm text-indigo-200">
                    Long Rest (8 Hours)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set a secure perimeter and sleep. Fully restores all Hit Points, half of expended Hit Dice, and all spell slots.
                </p>
              </div>
              <button
                onClick={handleExecuteLongRest}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-lg shadow-md transition-all shrink-0 font-fantasy"
              >
                Take Long Rest
              </button>
            </div>
          </div>
        </div>

        {/* Rest Log */}
        {restLog && (
          <div className="mt-4 p-3 bg-amber-950/30 border border-amber-600/30 rounded-xl text-xs text-amber-300 animate-fade-in">
            {restLog}
          </div>
        )}
      </div>
    </div>
  );
};
