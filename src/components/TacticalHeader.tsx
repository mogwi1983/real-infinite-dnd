import React from 'react';
import { Compass, Sparkles, ScrollText, Swords } from 'lucide-react';

interface TacticalHeaderProps {
  location: string;
  environment: string;
  activeQuestTitle?: string;
  turnNumber: number;
  inCombat?: boolean;
  enemyName?: string;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  location,
  environment,
  activeQuestTitle,
  turnNumber,
  inCombat,
  enemyName,
}) => {
  return (
    <div className="bg-[#121927] border-b border-amber-900/20 px-6 py-3.5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Location & Atmosphere */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 text-amber-200">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <h2 className="font-fantasy text-sm font-semibold text-amber-100 truncate">
              {location}
            </h2>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-400 tabular-nums">Turn {turnNumber}</span>
            {inCombat && (
              <>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5" />
                  Combat: {enemyName || 'Hostile'}
                </span>
              </>
            )}
          </div>
          <p className="text-slate-400 text-xs italic truncate">
            {environment}
          </p>
        </div>

        {/* Active Quest Teaser */}
        {activeQuestTitle && (
          <div className="flex items-center gap-2 text-slate-400 shrink-0 self-start md:self-center">
            <ScrollText className="w-3.5 h-3.5 text-amber-500/80" />
            <span className="text-slate-500">Active Quest:</span>
            <span className="text-amber-200/90 font-medium truncate max-w-xs">
              {activeQuestTitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
