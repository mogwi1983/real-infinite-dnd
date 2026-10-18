export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type Race = 'Human' | 'High Elf' | 'Mountain Dwarf' | 'Halfling' | 'Tiefling';

export type CharacterClass = 'Fighter' | 'Wizard' | 'Rogue' | 'Cleric' | 'Ranger' | 'Barbarian';

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
  quantity: number;
  equipped?: boolean;
  value: number; // gold pieces
  damageOrAC?: string;
  effect?: string;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  description: string;
  damageOrEffect: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  reward: string;
  location?: string;
}

export interface Character {
  id: string;
  name: string;
  race: Race;
  characterClass: CharacterClass;
  level: number;
  xp: number;
  nextLevelXp: number;
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  hitDice: {
    current: number;
    total: number;
    die: string;
  };
  armorClass: number;
  speed: number;
  proficiencyBonus: number;
  abilities: AbilityScores;
  inventory: Item[];
  gold: number;
  spells: Spell[];
  activeQuests: Quest[];
  backstory: string;
  alignment: string;
  proficiencies: string[];
}

export interface SkillCheck {
  ability: Ability;
  skillName: string;
  dc: number;
}

export interface DMActionChoice {
  id: string;
  label: string;
  skillCheck?: SkillCheck;
  flavor?: string;
}

export interface RollResult {
  naturalRoll: number;
  modifier: number;
  total: number;
  dc: number;
  isSuccess: boolean;
  isCrit: boolean;
  isFumble: boolean;
  ability: Ability;
  skillName: string;
}

export interface TurnEntry {
  id: string;
  turnNumber: number;
  type: 'dm_narrative' | 'player_action' | 'dice_roll' | 'combat_event' | 'loot_event' | 'rest_event';
  title?: string;
  text: string;
  rollDetails?: RollResult;
  timestamp: number;
}

export interface TurnResponse {
  narration: string;
  locationName: string;
  environmentDescription: string;
  suggestedActions: DMActionChoice[];
  combatState?: {
    inCombat: boolean;
    enemyName?: string;
    enemyHp?: number;
    enemyMaxHp?: number;
    enemyAction?: string;
  };
  lootEarned?: Item[];
  xpEarned?: number;
  goldEarned?: number;
  hpChange?: number;
  questUpdate?: {
    title: string;
    status: 'active' | 'completed';
    description: string;
  };
}

export interface GameState {
  character: Character | null;
  history: TurnEntry[];
  currentTurn: number;
  currentLocation: string;
  currentEnvironment: string;
  suggestedActions: DMActionChoice[];
  combatState?: {
    inCombat: boolean;
    enemyName?: string;
    enemyHp?: number;
    enemyMaxHp?: number;
    enemyAction?: string;
  };
  isLoading: boolean;
  activeRollRequest?: {
    actionLabel: string;
    skillCheck: SkillCheck;
    pendingActionType: 'dm_choice' | 'custom';
    customActionText?: string;
  } | null;
}
