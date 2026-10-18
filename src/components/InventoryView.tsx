import React, { useState } from 'react';
import { Shield, Sparkles, Coins, Package, Check, Trash2, Heart } from 'lucide-react';
import { Character, Item } from '../types/dnd';
import { sound } from '../utils/audio';

interface InventoryViewProps {
  character: Character;
  onUpdateCharacter: (updated: Character) => void;
  onItemUsedMessage?: (msg: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  character,
  onUpdateCharacter,
  onItemUsedMessage,
}) => {
  const [filter, setFilter] = useState<'all' | 'weapon' | 'armor' | 'potion' | 'misc'>('all');

  const filteredItems = character.inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Equip / Unequip gear
  const handleToggleEquip = (itemId: string) => {
    sound.playClick();
    const updatedInventory = character.inventory.map((item) => {
      if (item.id === itemId) {
        return { ...item, equipped: !item.equipped };
      }
      // If equipping armor, unequip other armors
      if (item.type === 'armor' && character.inventory.find(i => i.id === itemId)?.type === 'armor') {
        return { ...item, equipped: false };
      }
      return item;
    });

    // Recalculate AC based on newly equipped armor
    const equippedArmor = updatedInventory.find(i => i.type === 'armor' && i.equipped);
    const equippedShield = updatedInventory.find(i => i.name.toLowerCase().includes('shield') && i.equipped);
    const dexMod = Math.floor((character.abilities.dex - 10) / 2);

    let newAc = 10 + dexMod;
    if (equippedArmor) {
      if (equippedArmor.name.includes('Chain')) newAc = 16;
      else if (equippedArmor.name.includes('Scale')) newAc = 14 + Math.min(2, dexMod);
      else if (equippedArmor.name.includes('Leather')) newAc = 11 + dexMod;
      else if (equippedArmor.name.includes('Robes')) newAc = 10 + dexMod;
    }
    if (equippedShield) {
      newAc += 2;
    }

    onUpdateCharacter({
      ...character,
      armorClass: newAc,
      inventory: updatedInventory,
    });
  };

  // Consume potion
  const handleUsePotion = (item: Item) => {
    if (item.quantity <= 0) return;
    sound.playHeal();

    // Roll 2d4 + 2
    const roll = Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1 + 2;
    const newHp = Math.min(character.hp.max, character.hp.current + roll);
    const healedAmount = newHp - character.hp.current;

    const updatedInventory = character.inventory
      .map((i) => {
        if (i.id === item.id) {
          return { ...i, quantity: i.quantity - 1 };
        }
        return i;
      })
      .filter((i) => i.quantity > 0);

    onUpdateCharacter({
      ...character,
      hp: {
        ...character.hp,
        current: newHp,
      },
      inventory: updatedInventory,
    });

    if (onItemUsedMessage) {
      onItemUsedMessage(`Drank ${item.name} and recovered ${healedAmount} HP!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Wealth and Capacity Header */}
      <div className="bg-[#121927] border border-amber-900/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
            Adventurer's Haversack
          </span>
          <h1 className="font-fantasy text-2xl font-bold text-amber-100 mt-1">
            Equipment & Relics
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Items found in ruins, looted from monsters, or acquired from frontier merchants persist in your inventory.
          </p>
        </div>

        {/* Gold Pouch */}
        <div className="bg-slate-900/90 border border-amber-600/30 rounded-xl px-5 py-3 flex items-center gap-3 shrink-0">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Purse Balance
            </span>
            <span className="font-fantasy text-xl font-bold text-amber-300 tabular-nums">
              {character.gold} GP
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Filter Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-amber-600/30 text-amber-200 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Items ({character.inventory.length})
        </button>
        <button
          onClick={() => setFilter('weapon')}
          className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'weapon'
              ? 'bg-amber-600/30 text-amber-200 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Weapons
        </button>
        <button
          onClick={() => setFilter('armor')}
          className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'armor'
              ? 'bg-amber-600/30 text-amber-200 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Armor & Shields
        </button>
        <button
          onClick={() => setFilter('potion')}
          className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'potion'
              ? 'bg-amber-600/30 text-amber-200 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Potions & Draughts
        </button>
        <button
          onClick={() => setFilter('misc')}
          className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            filter === 'misc'
              ? 'bg-amber-600/30 text-amber-200 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Relics & Misc
        </button>
      </div>

      {/* Item Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#121927] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No items found in this section of your haversack.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isEquipped = item.equipped;
            const isPotion = item.type === 'potion';
            const isEquippable = item.type === 'weapon' || item.type === 'armor';

            return (
              <div
                key={item.id}
                className={`bg-[#121927] border rounded-xl p-4 transition-all ${
                  isEquipped
                    ? 'border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-fantasy font-bold text-sm text-amber-100">
                        {item.name}
                      </h3>
                      {item.quantity > 1 && (
                        <span className="text-xs font-mono text-slate-400">
                          ×{item.quantity}
                        </span>
                      )}
                      {isEquipped && (
                        <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Equipped
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="capitalize">{item.type}</span>
                      <span className="text-slate-600">·</span>
                      <span className="capitalize text-amber-300/80">{item.rarity}</span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono">{item.value} GP</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isEquippable && (
                      <button
                        onClick={() => handleToggleEquip(item.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                          isEquipped
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-600/40 hover:bg-amber-900/80'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isEquipped ? 'Unequip' : 'Equip'}
                      </button>
                    )}

                    {isPotion && (
                      <button
                        onClick={() => handleUsePotion(item)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-900/80 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Drink</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  {item.description}
                </p>

                {(item.damageOrAC || item.effect) && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs font-mono text-amber-300/90 font-medium">
                    {item.damageOrAC || item.effect}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
