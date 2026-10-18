import React from 'react';
import { Scroll, Award, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { Character, Quest } from '../types/dnd';

interface QuestsViewProps {
  character: Character;
}

export const QuestsView: React.FC<QuestsViewProps> = ({ character }) => {
  const activeQuests = character.activeQuests.filter((q) => q.status === 'active');
  const completedQuests = character.activeQuests.filter((q) => q.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#121927] border border-amber-900/30 rounded-2xl p-6 shadow-xl">
        <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
          Campaign Chronicle
        </span>
        <h1 className="font-fantasy text-2xl font-bold text-amber-100 mt-1">
          Quests & Heroic Deeds
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Track your ongoing objectives across the realm of Eldoria and review milestones sanctioned by the Dungeon Master.
        </p>
      </div>

      {/* Active Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Scroll className="w-4 h-4 text-amber-400" />
          <h2 className="font-fantasy text-base font-bold text-amber-200 uppercase tracking-wider">
            Active Quests ({activeQuests.length})
          </h2>
        </div>

        {activeQuests.length === 0 ? (
          <div className="bg-[#121927] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            No active quests right now. Explore deeper into Eldoria to uncover new rumors!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-[#121927] border border-amber-600/30 rounded-2xl p-5 shadow-md relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-fantasy font-bold text-base text-amber-100">
                      {quest.title}
                    </h3>
                    {quest.location && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400/90 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{quest.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-1 bg-amber-950/60 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-300 shrink-0">
                    Active
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {quest.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reward: <strong className="text-amber-200">{quest.reward}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Deeds Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <h2 className="font-fantasy text-base font-bold text-emerald-200 uppercase tracking-wider">
            Completed Deeds & Legends ({completedQuests.length})
          </h2>
        </div>

        {completedQuests.length === 0 ? (
          <div className="bg-[#121927] border border-slate-800/60 rounded-2xl p-6 text-center text-slate-500 text-xs">
            Completed quests and historic feats will be memorialized here as your campaign progresses.
          </div>
        ) : (
          <div className="space-y-3">
            {completedQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-[#121927] border border-emerald-900/30 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-fantasy font-semibold text-sm text-slate-200">
                      {quest.title}
                    </h4>
                    <p className="text-xs text-slate-400">{quest.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400/90 shrink-0">
                  Completed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
