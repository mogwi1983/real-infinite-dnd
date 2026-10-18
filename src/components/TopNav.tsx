import React from 'react';
import { Volume2, VolumeX, Shield, Moon } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopNavProps {
  activeTab: 'chronicle' | 'character' | 'inventory' | 'quests';
  setActiveTab: (tab: 'chronicle' | 'character' | 'inventory' | 'quests') => void;
  onOpenRest: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  characterName?: string;
  characterClass?: string;
  level?: number;
  hp?: { current: number; max: number };
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenRest,
  isMuted,
  onToggleMute,
  characterName,
  characterClass,
  level,
  hp,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c121d]/90 backdrop-blur-md border-b border-amber-900/20 px-6 py-3 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600/30 to-amber-900/40 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold font-fantasy text-sm shadow-inner">
          20
        </div>
        <div className="flex flex-col">
          <span className="font-fantasy text-lg font-bold tracking-wider text-amber-100 whitespace-nowrap">
            Realm of Eldoria
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (single-line, clean text with underline active state) */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('chronicle');
          }}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'chronicle'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Chronicle
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('character');
          }}
          className={`transition-colors whitespace-nowrap py-1 flex items-center gap-2 ${
            activeTab === 'character'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Character Sheet</span>
          {hp && (
            <span className="text-xs text-slate-400 tabular-nums">
              (HP {hp.current}/{hp.max})
            </span>
          )}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('inventory');
          }}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'inventory'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Inventory & Gear
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('quests');
          }}
          className={`transition-colors whitespace-nowrap py-1 ${
            activeTab === 'quests'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Quests & Deeds
        </button>
      </nav>

      {/* Zone 3: 1 primary action + Sound control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 rounded-md transition-colors"
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenRest();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/40 rounded-md shadow-sm transition-all whitespace-nowrap hover:shadow-amber-900/30"
        >
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span>Rest & Camp</span>
        </button>
      </div>
    </header>
  );
};
