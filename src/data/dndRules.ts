import { Ability, AbilityScores, Character, CharacterClass, Item, Race, Spell } from '../types/dnd';

export interface RaceDetail {
  name: Race;
  description: string;
  bonus: Partial<AbilityScores>;
  traits: string[];
}

export interface ClassDetail {
  name: CharacterClass;
  description: string;
  hitDie: string;
  hitDieMax: number;
  primaryAbility: Ability;
  proficiencies: string[];
  startingItems: Item[];
  startingSpells?: Spell[];
}

export const RACES: Record<Race, RaceDetail> = {
  Human: {
    name: 'Human',
    description: 'Versatile and adaptable, driven by ambition and boundless curiosity.',
    bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    traits: ['Versatile (+1 to all Ability Scores)', 'Bonus Proficiency in Survival'],
  },
  'High Elf': {
    name: 'High Elf',
    description: 'Graceful beings of ancient lineage, attuned to arcane mysteries and the wild woods.',
    bonus: { dex: 2, int: 1 },
    traits: ['Darkvision (60ft)', 'Keen Senses (Perception proficiency)', 'Fey Ancestry (Charm resist)'],
  },
  'Mountain Dwarf': {
    name: 'Mountain Dwarf',
    description: 'Resilient and unyielding like granite, masters of stonecraft and martial vigor.',
    bonus: { con: 2, str: 2 },
    traits: ['Dwarven Resilience (Poison resist)', 'Darkvision (60ft)', 'Dwarven Armor Training'],
  },
  Halfling: {
    name: 'Halfling',
    description: 'Nimble, warm-hearted wanderers blessed with uncanny luck and stealth.',
    bonus: { dex: 2, cha: 1 },
    traits: ['Lucky (Reroll natural 1s)', 'Brave (Advantage vs Frightened)', 'Halfling Nimbleness'],
  },
  Tiefling: {
    name: 'Tiefling',
    description: 'Carrying an infernal heritage, their piercing gaze and silver tongue command presence.',
    bonus: { cha: 2, int: 1 },
    traits: ['Darkvision (60ft)', 'Hellfire Resistance (Fire resist)', 'Thaumaturgy Cantrip'],
  },
};

export const CLASSES: Record<CharacterClass, ClassDetail> = {
  Fighter: {
    name: 'Fighter',
    description: 'Master of martial combat, armored warfare, and weapon disciplines.',
    hitDie: 'd10',
    hitDieMax: 10,
    primaryAbility: 'str',
    proficiencies: ['All Armor', 'Shields', 'Simple & Martial Weapons', 'Athletics'],
    startingItems: [
      { id: 'item_longsword', name: 'Tempered Longsword', type: 'weapon', rarity: 'common', description: 'A finely balanced versatile blade.', quantity: 1, equipped: true, value: 15, damageOrAC: '1d8+STR Slashing' },
      { id: 'item_chainmail', name: 'Ringed Chain Mail', type: 'armor', rarity: 'common', description: 'Interlocking steel rings over padded gambeson.', quantity: 1, equipped: true, value: 75, damageOrAC: '16 AC' },
      { id: 'item_shield', name: 'Oak & Iron Shield', type: 'armor', rarity: 'common', description: 'Sturdy wooden heater shield with steel rim.', quantity: 1, equipped: true, value: 10, damageOrAC: '+2 AC' },
      { id: 'item_potion_1', name: 'Potion of Healing', type: 'potion', rarity: 'common', description: 'Red herbal draught restoring 2d4+2 HP.', quantity: 2, value: 50, effect: 'Heals 2d4+2 HP' },
    ],
  },
  Wizard: {
    name: 'Wizard',
    description: 'Scholarly practitioner who weaves the fabric of reality through study and incantation.',
    hitDie: 'd6',
    hitDieMax: 6,
    primaryAbility: 'int',
    proficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Arcana', 'History'],
    startingItems: [
      { id: 'item_staff', name: 'Carved Ash Quarterstaff', type: 'weapon', rarity: 'common', description: 'An inscribed wooden staff tipped with polished amethyst.', quantity: 1, equipped: true, value: 5, damageOrAC: '1d6+STR Bludgeoning' },
      { id: 'item_robes', name: "Scholar's Traveling Robes", type: 'armor', rarity: 'common', description: 'Reinforced linen robes with enchanted thread.', quantity: 1, equipped: true, value: 10, damageOrAC: '11 AC + DEX' },
      { id: 'item_spellbook', name: 'Leatherbound Spellbook', type: 'misc', rarity: 'uncommon', description: 'Vellum parchment filled with intricate glyphs and formulas.', quantity: 1, value: 50 },
      { id: 'item_potion_1', name: 'Potion of Healing', type: 'potion', rarity: 'common', description: 'Red herbal draught restoring 2d4+2 HP.', quantity: 2, value: 50, effect: 'Heals 2d4+2 HP' },
    ],
    startingSpells: [
      { id: 'spl_magic_missile', name: 'Magic Missile', level: 1, school: 'Evocation', description: 'Three glowing darts of magical force strike automatically.', damageOrEffect: '3d4+3 Force Damage' },
      { id: 'spl_shield', name: 'Shield', level: 1, school: 'Abjuration', description: 'An invisible arcane barrier repels incoming strikes.', damageOrEffect: '+5 AC until next turn' },
      { id: 'spl_fire_bolt', name: 'Fire Bolt', level: 0, school: 'Evocation', description: 'Hurl a fiery mote at a target within range.', damageOrEffect: '1d10 Fire Damage' },
    ],
  },
  Rogue: {
    name: 'Rogue',
    description: 'A scoundrel who uses stealth, deception, and precise strikes to overcome foes.',
    hitDie: 'd8',
    hitDieMax: 8,
    primaryAbility: 'dex',
    proficiencies: ['Light Armor', 'Simple Weapons', 'Hand Crossbows', 'Rapiers', 'Shortswords', 'Stealth', 'Thieves Tools'],
    startingItems: [
      { id: 'item_rapier', name: 'Needlepoint Rapier', type: 'weapon', rarity: 'common', description: 'Quick piercing dueling sword.', quantity: 1, equipped: true, value: 25, damageOrAC: '1d8+DEX Piercing' },
      { id: 'item_shortbow', name: 'Yew Shortbow', type: 'weapon', rarity: 'common', description: 'Light bow with quiver of 20 arrows.', quantity: 1, value: 25, damageOrAC: '1d6+DEX Piercing' },
      { id: 'item_leather_armor', name: 'Cured Leather Armor', type: 'armor', rarity: 'common', description: 'Supple boiled leather tailored for silence.', quantity: 1, equipped: true, value: 20, damageOrAC: '11 AC + DEX' },
      { id: 'item_thieves_tools', name: "Lockpicks & Thieves' Tools", type: 'misc', rarity: 'common', description: 'Delicate steel picks and wire tensioners.', quantity: 1, value: 25 },
      { id: 'item_potion_1', name: 'Potion of Healing', type: 'potion', rarity: 'common', description: 'Red herbal draught restoring 2d4+2 HP.', quantity: 2, value: 50, effect: 'Heals 2d4+2 HP' },
    ],
  },
  Cleric: {
    name: 'Cleric',
    description: 'A priestly champion who wields divine magic in service of a higher power.',
    hitDie: 'd8',
    hitDieMax: 8,
    primaryAbility: 'wis',
    proficiencies: ['Light & Medium Armor', 'Shields', 'Simple Weapons', 'Religion', 'Insight'],
    startingItems: [
      { id: 'item_mace', name: 'Silvered Flanged Mace', type: 'weapon', rarity: 'common', description: 'A heavy blessed iron mace.', quantity: 1, equipped: true, value: 15, damageOrAC: '1d6+STR Bludgeoning' },
      { id: 'item_scale_mail', name: 'Forged Scale Mail', type: 'armor', rarity: 'common', description: 'Overlapping brass and iron scales.', quantity: 1, equipped: true, value: 50, damageOrAC: '14 AC + DEX (max 2)' },
      { id: 'item_holy_symbol', name: 'Sunburst Reliquary Amulet', type: 'misc', rarity: 'uncommon', description: 'Gilded divine focus consecrated in Dawnlight.', quantity: 1, equipped: true, value: 25 },
      { id: 'item_potion_1', name: 'Potion of Healing', type: 'potion', rarity: 'common', description: 'Red herbal draught restoring 2d4+2 HP.', quantity: 2, value: 50, effect: 'Heals 2d4+2 HP' },
    ],
    startingSpells: [
      { id: 'spl_cure_wounds', name: 'Cure Wounds', level: 1, school: 'Evocation', description: 'Touch a creature to channel divine healing light.', damageOrEffect: 'Heals 1d8+WIS HP' },
      { id: 'spl_sacred_flame', name: 'Sacred Flame', level: 0, school: 'Evocation', description: 'Flame-like radiance descends on a foe.', damageOrEffect: '1d8 Radiant Damage' },
      { id: 'spl_bless', name: 'Bless', level: 1, school: 'Enchantment', description: 'Bless allies with +1d4 to attack rolls and saving throws.', damageOrEffect: '+1d4 to d20 rolls' },
    ],
  },
  Ranger: {
    name: 'Ranger',
    description: 'A warrior of the untamed frontier who tracks quarry with deadly precision.',
    hitDie: 'd10',
    hitDieMax: 10,
    primaryAbility: 'dex',
    proficiencies: ['Light & Medium Armor', 'Shields', 'Simple & Martial Weapons', 'Survival', 'Perception'],
    startingItems: [
      { id: 'item_longbow', name: 'Heartwood Longbow', type: 'weapon', rarity: 'common', description: 'Carved from ancient oak, with 30 broadhead arrows.', quantity: 1, equipped: true, value: 50, damageOrAC: '1d8+DEX Piercing' },
      { id: 'item_shortswords', name: 'Dual Border Shortswords', type: 'weapon', rarity: 'common', description: 'Paired hunting blades.', quantity: 2, value: 20, damageOrAC: '1d6+DEX Piercing' },
      { id: 'item_studded_leather', name: 'Studded Leather Cuirass', type: 'armor', rarity: 'common', description: 'Tough hide reinforced with iron rivets.', quantity: 1, equipped: true, value: 45, damageOrAC: '12 AC + DEX' },
      { id: 'item_potion_1', name: 'Potion of Healing', type: 'potion', rarity: 'common', description: 'Red herbal draught restoring 2d4+2 HP.', quantity: 2, value: 50, effect: 'Heals 2d4+2 HP' },
    ],
    startingSpells: [
      { id: 'spl_hunters_mark', name: "Hunter's Mark", level: 1, school: 'Divination', description: 'Mystically mark a quarry for extra damage on each hit.', damageOrEffect: '+1d6 Damage per hit' },
    ],
  },
  Barbarian: {
    name: 'Barbarian',
    description: 'A fierce warrior who enters a battle trance of primal instinct and endurance.',
    hitDie: 'd12',
    hitDieMax: 12,
    primaryAbility: 'str',
    proficiencies: ['Light & Medium Armor', 'Shields', 'Simple & Martial Weapons', 'Athletics', 'Intimidation'],
    startingItems: [
      { id: 'item_greataxe', name: 'Bearded Greataxe', type: 'weapon', rarity: 'common', description: 'Massive dual-crescent axe forged in cold steel.', quantity: 1, equipped: true, value: 30, damageOrAC: '1d12+STR Slashing' },
      { id: 'item_handaxes', name: 'Throwing Handaxes', type: 'weapon', rarity: 'common', description: 'Balanced for both chopping and throwing.', quantity: 2, value: 10, damageOrAC: '1d6+STR Slashing' },
      { id: 'item_potion_1', name: 'Potion of Healing', type: 'potion', rarity: 'common', description: 'Red herbal draught restoring 2d4+2 HP.', quantity: 2, value: 50, effect: 'Heals 2d4+2 HP' },
    ],
  },
};

export const XP_TABLE: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
};

export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Generate base character using race and class
export function createDefaultCharacter(name: string, race: Race, charClass: CharacterClass): Character {
  const raceData = RACES[race];
  const classData = CLASSES[charClass];

  // Standard Array baseline: 15, 14, 13, 12, 10, 8 assigned based on primary class needs
  let baseAbilities: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

  switch (charClass) {
    case 'Fighter':
      baseAbilities = { str: 15, con: 14, dex: 13, wis: 12, cha: 10, int: 8 };
      break;
    case 'Wizard':
      baseAbilities = { int: 15, dex: 14, con: 13, wis: 12, cha: 10, str: 8 };
      break;
    case 'Rogue':
      baseAbilities = { dex: 15, con: 13, int: 14, cha: 12, wis: 10, str: 8 };
      break;
    case 'Cleric':
      baseAbilities = { wis: 15, con: 14, str: 13, cha: 12, dex: 10, int: 8 };
      break;
    case 'Ranger':
      baseAbilities = { dex: 15, wis: 14, con: 13, str: 12, int: 10, cha: 8 };
      break;
    case 'Barbarian':
      baseAbilities = { str: 15, con: 14, dex: 13, wis: 12, cha: 10, int: 8 };
      break;
  }

  // Apply Racial Bonuses
  const abilities: AbilityScores = {
    str: baseAbilities.str + (raceData.bonus.str || 0),
    dex: baseAbilities.dex + (raceData.bonus.dex || 0),
    con: baseAbilities.con + (raceData.bonus.con || 0),
    int: baseAbilities.int + (raceData.bonus.int || 0),
    wis: baseAbilities.wis + (raceData.bonus.wis || 0),
    cha: baseAbilities.cha + (raceData.bonus.cha || 0),
  };

  const conMod = getModifier(abilities.con);
  const dexMod = getModifier(abilities.dex);
  const startingHp = classData.hitDieMax + conMod;

  // Calculate AC based on starting equipment
  let ac = 10 + dexMod;
  if (charClass === 'Fighter') ac = 18; // Chain mail (16) + Shield (2)
  if (charClass === 'Barbarian') ac = 10 + dexMod + conMod; // Unarmored Defense
  if (charClass === 'Rogue') ac = 11 + dexMod; // Leather
  if (charClass === 'Cleric') ac = 14 + Math.min(2, dexMod) + 2; // Scale mail + Shield
  if (charClass === 'Ranger') ac = 12 + dexMod; // Studded leather
  if (charClass === 'Wizard') ac = 10 + dexMod; // Robes

  return {
    id: `char_${Date.now()}`,
    name: name.trim() || 'Aelarion',
    race,
    characterClass: charClass,
    level: 1,
    xp: 0,
    nextLevelXp: 300,
    hp: {
      current: startingHp,
      max: startingHp,
      temp: 0,
    },
    hitDice: {
      current: 1,
      total: 1,
      die: classData.hitDie,
    },
    armorClass: ac,
    speed: race === 'Mountain Dwarf' || race === 'Halfling' ? 25 : 30,
    proficiencyBonus: 2,
    abilities,
    inventory: [...classData.startingItems],
    gold: 35,
    spells: classData.startingSpells ? [...classData.startingSpells] : [],
    activeQuests: [
      {
        id: 'quest_1',
        title: 'The Whispers of Sylvandra',
        description: 'Investigate the glowing sigils appearing around the overgrown Elven temple in the Whispering Pines wilderness.',
        status: 'active',
        reward: '150 XP and Ancient Artifact',
        location: 'Whispering Pines Ruins',
      },
    ],
    backstory: `A courageous ${race} ${charClass} journeying to the borderlands of Eldoria seeking glory, ancient relics, and the truth behind the awakening ruins.`,
    alignment: 'Neutral Good',
    proficiencies: [...classData.proficiencies, ...raceData.traits],
  };
}
