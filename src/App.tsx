import React, { useState, useEffect } from 'react';
import { Character, DMActionChoice, RollResult, SkillCheck, TurnEntry, TurnResponse } from './types/dnd';
import { createDefaultCharacter, XP_TABLE } from './data/dndRules';
import { sound } from './utils/audio';
import { TopNav } from './components/TopNav';
import { TacticalHeader } from './components/TacticalHeader';
import { ChronicleStream } from './components/ChronicleStream';
import { ActionConsole } from './components/ActionConsole';
import { CharacterCreatorModal } from './components/CharacterCreatorModal';
import { CharacterDrawer } from './components/CharacterDrawer';
import { InventoryView } from './components/InventoryView';
import { QuestsView } from './components/QuestsView';
import { DiceTrayModal } from './components/DiceTrayModal';
import { CampModal } from './components/CampModal';
import { RotateCcw, Download, Upload, CheckCircle2 } from 'lucide-react';

const SAVE_KEY = 'eldoria_dnd_save_v1';

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [history, setHistory] = useState<TurnEntry[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [currentLocation, setCurrentLocation] = useState<string>('The Whispering Pines Outpost');
  const [currentEnvironment, setCurrentEnvironment] = useState<string>(
    'A misty frontier pine forest at twilight, with ancient overgrown stone monoliths'
  );
  const [suggestedActions, setSuggestedActions] = useState<DMActionChoice[]>([]);
  const [combatState, setCombatState] = useState<TurnResponse['combatState']>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chronicle' | 'character' | 'inventory' | 'quests'>('chronicle');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals state
  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
  const [pendingRoll, setPendingRoll] = useState<{
    actionTitle: string;
    skillCheck: SkillCheck;
    customActionText?: string;
  } | null>(null);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.character) {
          setCharacter(parsed.character);
          setHistory(parsed.history || []);
          setCurrentTurn(parsed.currentTurn || 1);
          setCurrentLocation(parsed.currentLocation || 'The Whispering Pines Outpost');
          setCurrentEnvironment(parsed.currentEnvironment || 'A misty pine forest');
          setSuggestedActions(parsed.suggestedActions || []);
          setCombatState(parsed.combatState);
        }
      }
    } catch (e) {
      console.error('Failed to parse save game:', e);
    }
  }, []);

  // Autosave
  useEffect(() => {
    if (character) {
      const stateToSave = {
        character,
        history,
        currentTurn,
        currentLocation,
        currentEnvironment,
        suggestedActions,
        combatState,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    }
  }, [character, history, currentTurn, currentLocation, currentEnvironment, suggestedActions, combatState]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Turn resolution with server-side DM API
  const sendDMRequest = async (
    charState: Character,
    actionText: string,
    rollDetails?: RollResult,
    isFirstTurn?: boolean
  ) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/dm/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: charState,
          action: actionText,
          rollDetails: rollDetails || null,
          currentLocation,
          recentHistory: history.slice(-4).map((h) => ({
            type: h.type,
            text: h.text,
          })),
          isFirstTurn,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const turnData: TurnResponse = await res.json();

      // Process Narrative turn entry
      const newTurnNumber = currentTurn + (isFirstTurn ? 0 : 1);
      setCurrentTurn(newTurnNumber);

      const newEntry: TurnEntry = {
        id: `turn_${Date.now()}`,
        turnNumber: newTurnNumber,
        type: 'dm_narrative',
        title: turnData.locationName,
        text: turnData.narration,
        rollDetails: rollDetails || undefined,
        timestamp: Date.now(),
      };

      setHistory((prev) => [...prev, newEntry]);
      setCurrentLocation(turnData.locationName);
      setCurrentEnvironment(turnData.environmentDescription);
      setSuggestedActions(turnData.suggestedActions || []);
      setCombatState(turnData.combatState);

      // Process character updates: HP, XP, Gold, Loot, Quests
      let updatedChar = { ...charState };

      // HP change
      if (turnData.hpChange) {
        const nextHp = Math.max(0, Math.min(updatedChar.hp.max, updatedChar.hp.current + turnData.hpChange));
        updatedChar.hp = {
          ...updatedChar.hp,
          current: nextHp,
        };
        if (turnData.hpChange < 0) {
          showToast(`Took ${Math.abs(turnData.hpChange)} damage!`);
        } else {
          showToast(`Restored ${turnData.hpChange} Hit Points.`);
        }
      }

      // XP & Leveling
      if (turnData.xpEarned) {
        const newXp = updatedChar.xp + turnData.xpEarned;
        let newLevel = updatedChar.level;
        let nextLevelXp = updatedChar.nextLevelXp;

        // Check level thresholds
        if (newXp >= updatedChar.nextLevelXp) {
          newLevel += 1;
          sound.playLevelUp();
          const conMod = Math.floor((updatedChar.abilities.con - 10) / 2);
          const dieMax = parseInt(updatedChar.hitDice.die.replace('d', ''), 10) || 8;
          const hpIncrease = Math.max(1, Math.floor(dieMax / 2) + 1 + conMod);

          updatedChar.hp = {
            current: updatedChar.hp.max + hpIncrease,
            max: updatedChar.hp.max + hpIncrease,
            temp: 0,
          };
          updatedChar.hitDice = {
            current: updatedChar.hitDice.total + 1,
            total: updatedChar.hitDice.total + 1,
            die: updatedChar.hitDice.die,
          };
          nextLevelXp = XP_TABLE[newLevel + 1] || nextLevelXp * 2;
          showToast(`✦ LEVEL UP! Reached Level ${newLevel}! Max HP increased by ${hpIncrease}!`);
        }

        updatedChar.level = newLevel;
        updatedChar.xp = newXp;
        updatedChar.nextLevelXp = nextLevelXp;
      }

      // Gold
      if (turnData.goldEarned) {
        updatedChar.gold += turnData.goldEarned;
        showToast(`Acquired ${turnData.goldEarned} Gold Pieces.`);
      }

      // Loot
      if (turnData.lootEarned && turnData.lootEarned.length > 0) {
        updatedChar.inventory = [...updatedChar.inventory, ...turnData.lootEarned];
        showToast(`Found new item: ${turnData.lootEarned[0].name}!`);
      }

      // Quest update
      if (turnData.questUpdate) {
        const existingQuest = updatedChar.activeQuests.find(
          (q) => q.title.toLowerCase() === turnData.questUpdate?.title.toLowerCase()
        );
        if (existingQuest) {
          existingQuest.status = turnData.questUpdate.status;
          existingQuest.description = turnData.questUpdate.description;
        } else {
          updatedChar.activeQuests.push({
            id: `quest_${Date.now()}`,
            title: turnData.questUpdate.title,
            description: turnData.questUpdate.description,
            status: turnData.questUpdate.status,
            reward: 'Glory and Treasure',
          });
        }
      }

      setCharacter(updatedChar);
    } catch (err) {
      console.error('Turn resolution error:', err);
      showToast('The Dungeon Master paused to gather thoughts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Starting game after character creation
  const handleCharacterCreated = (newChar: Character) => {
    setCharacter(newChar);
    setHistory([]);
    setCurrentTurn(1);
    setCurrentLocation('The Whispering Pines Outpost');
    sendDMRequest(
      newChar,
      `I am ${newChar.name}, a Level 1 ${newChar.race} ${newChar.characterClass}. I have just arrived at the Whispering Pines Outpost on the frontier of Eldoria to begin my adventure. Introduce the setting and present my initial dilemma.`,
      undefined,
      true
    );
  };

  // Player selected a DM choice card
  const handleSelectAction = (choice: DMActionChoice) => {
    if (!character) return;

    if (choice.skillCheck) {
      // Action requires a d20 roll
      setPendingRoll({
        actionTitle: choice.label,
        skillCheck: choice.skillCheck,
      });
      setIsDiceModalOpen(true);
    } else {
      // Passive action
      sendDMRequest(character, choice.label);
    }
  };

  // Player typed a custom action
  const handleSubmitCustomAction = (customText: string) => {
    if (!character) return;

    // Check if the action obviously implies a skill check (e.g. stealth, attack, search)
    const lower = customText.toLowerCase();
    let implicitCheck: SkillCheck | null = null;

    if (lower.includes('sneak') || lower.includes('hide') || lower.includes('stealth')) {
      implicitCheck = { ability: 'dex', skillName: 'Stealth', dc: 12 };
    } else if (lower.includes('search') || lower.includes('look') || lower.includes('investigate')) {
      implicitCheck = { ability: 'wis', skillName: 'Perception', dc: 12 };
    } else if (lower.includes('jump') || lower.includes('climb') || lower.includes('force') || lower.includes('push')) {
      implicitCheck = { ability: 'str', skillName: 'Athletics', dc: 13 };
    } else if (lower.includes('cast') || lower.includes('spell') || lower.includes('magic')) {
      implicitCheck = { ability: 'int', skillName: 'Arcana', dc: 12 };
    } else if (lower.includes('convince') || lower.includes('persuade') || lower.includes('lie') || lower.includes('bribe')) {
      implicitCheck = { ability: 'cha', skillName: 'Persuasion', dc: 12 };
    }

    if (implicitCheck) {
      setPendingRoll({
        actionTitle: customText,
        skillCheck: implicitCheck,
        customActionText: customText,
      });
      setIsDiceModalOpen(true);
    } else {
      sendDMRequest(character, customText);
    }
  };

  // Completed d20 roll
  const handleRollComplete = (rollResult: RollResult) => {
    setIsDiceModalOpen(false);
    if (!character || !pendingRoll) return;

    const actionText = pendingRoll.customActionText || pendingRoll.actionTitle;
    setPendingRoll(null);
    sendDMRequest(character, actionText, rollResult);
  };

  // Rest handlers
  const handleShortRest = (healedHp: number, diceSpent: number) => {
    if (!character) return;
    const newHp = Math.min(character.hp.max, character.hp.current + healedHp);
    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, current: newHp },
      hitDice: {
        ...character.hitDice,
        current: Math.max(0, character.hitDice.current - diceSpent),
      },
    };
    setCharacter(updatedChar);
  };

  const handleLongRest = () => {
    if (!character) return;
    const restoredDice = Math.min(
      character.hitDice.total,
      character.hitDice.current + Math.max(1, Math.floor(character.hitDice.total / 2))
    );
    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, current: character.hp.max },
      hitDice: { ...character.hitDice, current: restoredDice },
    };
    setCharacter(updatedChar);

    // Prompt DM for night campfire narrative
    sendDMRequest(
      updatedChar,
      'I set up camp, light a small fire, and take a 8-hour Long Rest to recover. Narrate what happens during the night in this location and the following dawn.'
    );
  };

  // Restart / New Game
  const handleNewGame = () => {
    if (window.confirm('Are you sure you want to embark with a new character? Your current hero and campaign progress will be replaced.')) {
      localStorage.removeItem(SAVE_KEY);
      setCharacter(null);
      setHistory([]);
      setCurrentTurn(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRest={() => setIsCampModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(sound.toggleMute())}
        characterName={character?.name}
        characterClass={character?.characterClass}
        level={character?.level}
        hp={character?.hp}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {!character ? (
          <CharacterCreatorModal onComplete={handleCharacterCreated} />
        ) : (
          <>
            {/* Tactical Environment Header */}
            <TacticalHeader
              location={currentLocation}
              environment={currentEnvironment}
              activeQuestTitle={character.activeQuests[0]?.title}
              turnNumber={currentTurn}
              inCombat={combatState?.inCombat}
              enemyName={combatState?.enemyName}
            />

            {/* Tab Views */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
              {activeTab === 'chronicle' && (
                <>
                  <ChronicleStream
                    history={history}
                    isLoading={isLoading}
                    combatState={combatState}
                  />
                  <ActionConsole
                    suggestedActions={suggestedActions}
                    isLoading={isLoading}
                    onSelectAction={handleSelectAction}
                    onSubmitCustomAction={handleSubmitCustomAction}
                  />
                </>
              )}

              {activeTab === 'character' && (
                <CharacterDrawer character={character} />
              )}

              {activeTab === 'inventory' && (
                <InventoryView
                  character={character}
                  onUpdateCharacter={setCharacter}
                  onItemUsedMessage={showToast}
                />
              )}

              {activeTab === 'quests' && (
                <QuestsView character={character} />
              )}
            </div>
          </>
        )}
      </main>

      {/* Persistent Footer Actions */}
      {character && (
        <footer className="border-t border-slate-800/80 bg-[#0c121d] px-6 py-3 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Realm of Eldoria v1.0</span>
            <span aria-hidden="true">·</span>
            <span>Autosaved locally</span>
          </div>
          <button
            onClick={handleNewGame}
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Forge New Hero</span>
          </button>
        </footer>
      )}

      {/* Interactive 3D Dice Modal */}
      {character && pendingRoll && (
        <DiceTrayModal
          isOpen={isDiceModalOpen}
          actionTitle={pendingRoll.actionTitle}
          skillCheck={pendingRoll.skillCheck}
          character={character}
          onRollComplete={handleRollComplete}
          onCancel={() => {
            setIsDiceModalOpen(false);
            setPendingRoll(null);
          }}
        />
      )}

      {/* Camp & Rest Modal */}
      {character && (
        <CampModal
          isOpen={isCampModalOpen}
          character={character}
          onClose={() => setIsCampModalOpen(false)}
          onShortRest={handleShortRest}
          onLongRest={handleLongRest}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-amber-950/95 border border-amber-500/60 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs md:text-sm font-semibold flex items-center gap-2 animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
