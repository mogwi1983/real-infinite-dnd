import React, { useState } from 'react';
import { Sparkles, Send, Dices, ChevronRight } from 'lucide-react';
import { DMActionChoice } from '../types/dnd';
import { sound } from '../utils/audio';

interface ActionConsoleProps {
  suggestedActions: DMActionChoice[];
  isLoading: boolean;
  onSelectAction: (choice: DMActionChoice) => void;
  onSubmitCustomAction: (actionText: string) => void;
}

export const ActionConsole: React.FC<ActionConsoleProps> = ({
  suggestedActions,
  isLoading,
  onSelectAction,
  onSubmitCustomAction,
}) => {
  const [customText, setCustomText] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || isLoading) return;
    sound.playClick();
    onSubmitCustomAction(customText.trim());
    setCustomText('');
  };

  return (
    <div className="bg-[#0f1624]/95 border-t border-amber-900/30 p-4 md:p-6 sticky bottom-0 z-30 backdrop-blur-md shadow-2xl">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider">
          <span>Choose Your Action</span>
          <span className="text-slate-500 font-normal normal-case">
            Select a suggested maneuver or write your own intent
          </span>
        </div>

        {/* 3-4 Preselected Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedActions.map((choice) => {
            const hasCheck = !!choice.skillCheck;
            return (
              <button
                key={choice.id}
                disabled={isLoading}
                onClick={() => {
                  sound.playClick();
                  onSelectAction(choice);
                }}
                className="text-left p-3.5 bg-[#141c2c] hover:bg-[#1a253a] border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all shadow-sm group disabled:opacity-50 disabled:pointer-events-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-fantasy font-semibold text-xs md:text-sm text-amber-100 group-hover:text-amber-200 transition-colors">
                      {choice.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                  </div>
                  {choice.flavor && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {choice.flavor}
                    </p>
                  )}
                </div>

                {hasCheck && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                    <Dices className="w-3.5 h-3.5" />
                    <span>
                      Requires {choice.skillCheck?.skillName} Check (DC {choice.skillCheck?.dc})
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Action Input Form */}
        <form onSubmit={handleCustomSubmit} className="relative mt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              disabled={isLoading}
              placeholder="Or declare your own unique action (e.g. 'I cast Shield and leap over the altar')..."
              className="w-full bg-[#141c2c] border border-slate-800 focus:border-amber-500/80 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !customText.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5 font-fantasy disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Act</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
