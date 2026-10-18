import React, { useEffect, useRef } from 'react';
import { Sparkles, Shield, Coins, AlertCircle, CheckCircle2, Swords, Compass } from 'lucide-react';
import { TurnEntry } from '../types/dnd';

interface ChronicleStreamProps {
  history: TurnEntry[];
  isLoading: boolean;
  combatState?: {
    inCombat: boolean;
    enemyName?: string;
    enemyHp?: number;
    enemyMaxHp?: number;
    enemyAction?: string;
  };
}

export const ChronicleStream: React.FC<ChronicleStreamProps> = ({
  history,
  isLoading,
  combatState,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  return (
    <div className="space-y-6 pb-6">
      {/* Active Combat Card (if in combat) */}
      {combatState && combatState.inCombat && (
        <div className="bg-[#181520] border-2 border-rose-600/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-950/80 border border-rose-600/40 rounded-xl text-rose-400">
                <Swords className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
                  Encounter in Progress
                </span>
                <h3 className="font-fantasy text-lg font-bold text-rose-100">
                  {combatState.enemyName || 'Hostile Adversary'}
                </h3>
              </div>
            </div>

            {combatState.enemyHp !== undefined && combatState.enemyMaxHp !== undefined && (
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-rose-300">
                  {combatState.enemyHp} / {combatState.enemyMaxHp} HP
                </span>
                <div className="w-28 bg-slate-900 h-2 rounded-full overflow-hidden mt-1 border border-rose-900/40">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, (combatState.enemyHp / combatState.enemyMaxHp) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {combatState.enemyAction && (
            <p className="text-xs text-rose-200/90 italic mt-3 pt-2.5 border-t border-rose-900/30">
              "{combatState.enemyAction}"
            </p>
          )}
        </div>
      )}

      {/* Narrative Turns Stream */}
      {history.map((turn, index) => {
        const isLatest = index === history.length - 1;

        return (
          <article
            key={turn.id}
            className={`bg-[#121927] border rounded-2xl p-5 md:p-7 shadow-lg transition-all ${
              isLatest
                ? 'border-amber-600/30 shadow-amber-950/20'
                : 'border-slate-800/80 text-slate-300'
            }`}
          >
            {/* Turn Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-fantasy text-xs font-bold text-amber-400">
                  Turn {turn.turnNumber}
                </span>
                {turn.title && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">{turn.title}</span>
                  </>
                )}
              </div>
              <span className="text-slate-500 text-[11px]">
                Dungeon Master
              </span>
            </div>

            {/* Narrative Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed space-y-3 font-normal">
              {turn.text.split('\n\n').map((paragraph, pIdx) => {
                if (!paragraph.trim()) return null;
                // Render dialogue with warmth
                const isQuote = paragraph.trim().startsWith('"') || paragraph.trim().startsWith('“');
                return (
                  <p
                    key={pIdx}
                    className={isQuote ? 'italic text-amber-100/90 pl-3 border-l-2 border-amber-500/40' : ''}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Attached Dice Roll Card */}
            {turn.rollDetails && (
              <div className="mt-4 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-fantasy font-bold text-xs ${
                      turn.rollDetails.isCrit
                        ? 'bg-amber-500 text-amber-950 shadow-md ring-2 ring-amber-400'
                        : turn.rollDetails.isFumble
                        ? 'bg-rose-700 text-white ring-2 ring-rose-500'
                        : turn.rollDetails.isSuccess
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {turn.rollDetails.naturalRoll}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      {turn.rollDetails.skillName} Check (DC {turn.rollDetails.dc})
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Natural {turn.rollDetails.naturalRoll} + Mod ({turn.rollDetails.modifier >= 0 ? `+${turn.rollDetails.modifier}` : turn.rollDetails.modifier}) = Total {turn.rollDetails.total}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold">
                  {turn.rollDetails.isCrit ? (
                    <span className="text-amber-300 font-bold">Natural 20 · Critical Success</span>
                  ) : turn.rollDetails.isFumble ? (
                    <span className="text-rose-400 font-bold">Natural 1 · Critical Fumble</span>
                  ) : turn.rollDetails.isSuccess ? (
                    <span className="text-emerald-400">Success</span>
                  ) : (
                    <span className="text-rose-400">Failure</span>
                  )}
                </div>
              </div>
            )}
          </article>
        );
      })}

      {/* DM Thinking / Streaming Indicator */}
      {isLoading && (
        <div className="bg-[#121927] border border-amber-600/20 rounded-2xl p-6 shadow-md animate-pulse flex items-center gap-3 text-sm text-amber-300">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-fantasy tracking-wide">
            The Dungeon Master weaves the tale...
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
