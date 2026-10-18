import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback narrative generator for seamless offline / zero-key play
function generateProceduralFallback(
  character: any,
  action: string,
  rollDetails?: any,
  location?: string
) {
  const charName = character?.name || 'Adventurer';
  const charClass = character?.characterClass || 'Fighter';
  const loc = location || 'The Whispering Pines Ruins';

  let outcomeText = '';
  let hpChange = 0;
  let xpEarned = 50;
  let goldEarned = 0;
  let lootEarned: any[] = [];

  if (rollDetails) {
    if (rollDetails.isCrit) {
      outcomeText = `A legendary display of prowess! Your natural 20 resonates through ${loc}. Your ${charClass} reflexes strike true with flawless precision.`;
      xpEarned = 100;
      goldEarned = 25;
      lootEarned.push({
        id: `item_${Date.now()}`,
        name: 'Gilded Elven Sigil Ring',
        type: 'misc',
        rarity: 'uncommon',
        description: 'An ancient signet ring hums with residual abjuration wards.',
        quantity: 1,
        value: 40,
      });
    } else if (rollDetails.isFumble) {
      outcomeText = `Misfortune strikes! A critical fumble leaves you exposed on the uneven stone floor, straining your balance as the chamber shivers.`;
      hpChange = -3;
    } else if (rollDetails.isSuccess) {
      outcomeText = `Success! With a roll of ${rollDetails.total} against DC ${rollDetails.dc}, you master the trial with classic ${charClass} finesse.`;
      xpEarned = 65;
      goldEarned = 10;
    } else {
      outcomeText = `Your attempt falls short (Total ${rollDetails.total} vs DC ${rollDetails.dc}). The stone resists your efforts, and a momentary jolt rattles your senses.`;
      hpChange = -2;
    }
  }

  return {
    narration: `${outcomeText}\n\nYou press onward through the moss-shrouded corridors of ${loc}. Ancient elven reliefs carved into the basalt walls depict the War of the Starfall. Ahead, the corridor branches toward a moonlit courtyard where a shattered fountain glows with soft cerulean luminescence, while a winding stairwell plunges deeper into the crypt vaults below. The air is cold and carries the faint scent of wild ozone and crushed pine needles.`,
    locationName: loc,
    environmentDescription: 'Ancient stone corridor overgrown with luminescent blue lichen and mountain moss',
    suggestedActions: [
      {
        id: 'act_1',
        label: 'Inspect the moonlit fountain for arcane residue',
        skillCheck: { ability: 'int', skillName: 'Arcana', dc: 12 },
        flavor: 'Channel your knowledge of ancient weave craft to detect hidden enchantments.',
      },
      {
        id: 'act_2',
        label: 'Descend quietly into the crypt vaults',
        skillCheck: { ability: 'dex', skillName: 'Stealth', dc: 13 },
        flavor: 'Tread lightly upon the fractured flagstones to avoid alerting denizens below.',
      },
      {
        id: 'act_3',
        label: 'Search the perimeter walls for concealed switches',
        skillCheck: { ability: 'wis', skillName: 'Perception', dc: 12 },
        flavor: 'Run your fingers along the stone carvings looking for hollow joints or glyphs.',
      },
      {
        id: 'act_4',
        label: 'Take a defensive stance and call out a cautious greeting',
        flavor: 'Test whether any sentient allies or guardians inhabit the sanctuary.',
      },
    ],
    lootEarned,
    xpEarned,
    goldEarned,
    hpChange,
  };
}

// POST /api/dm/narrate - AI Dungeon Master turn handler
app.post('/api/dm/narrate', async (req: Request, res: Response) => {
  try {
    const { character, action, rollDetails, currentLocation, recentHistory, isFirstTurn } = req.body;

    if (!ai) {
      // Offline fallback
      const fallback = generateProceduralFallback(character, action, rollDetails, currentLocation);
      return res.json(fallback);
    }

    const systemPrompt = `You are the master Dungeon Master (DM) for a solo high-fantasy Dungeons & Dragons 5e adventure set in the realm of Eldoria.
The campaign never ends and is packed with rich D&D lore, tactical challenges, atmospheric descriptions, exploration, NPCs, and combat encounters.
Always write in the immersive second-person ('You...').
Keep the tone grounded in classic high-fantasy (ancient ruins, mysterious wilderness, old magic, heroic deeds).

Return a strictly structured JSON response conforming to the schema:
- narration: 2 to 3 paragraphs of compelling, evocative narrative prose detailing the immediate consequence of the player's action/roll and describing the emerging situation.
- locationName: The current location (e.g., 'Whispering Pines Ruins', 'The Sunken Hall of Arches', 'Deepstone Crypts').
- environmentDescription: 1-line vivid atmosphere sensory summary.
- suggestedActions: Exactly 3 to 4 distinct tactical choices. Include a skill check (ability, skillName, and DC between 10 and 18) for any action involving risk, stealth, combat, perception, athletics, or arcane feats.
- combatState: (optional) if an encounter is triggered or active, include inCombat (boolean), enemyName, enemyHp, enemyMaxHp, and enemyAction.
- lootEarned: (optional) array of new items found (id, name, type, rarity, description, quantity, value, damageOrAC).
- xpEarned: (optional) XP points awarded for overcoming obstacles (usually 30 to 150 XP).
- goldEarned: (optional) gold coins discovered.
- hpChange: (optional) integer damage taken (negative) or health recovered (positive).
- questUpdate: (optional) object with title, status ('active' or 'completed'), and description.`;

    const userMessage = JSON.stringify({
      isFirstTurn: !!isFirstTurn,
      character: {
        name: character.name,
        race: character.race,
        class: character.characterClass,
        level: character.level,
        hp: character.hp,
        armorClass: character.armorClass,
        abilities: character.abilities,
        inventory: character.inventory.map((i: any) => i.name),
        activeQuests: character.activeQuests.map((q: any) => q.title),
      },
      currentLocation: currentLocation || 'The Whispering Pines Ruins',
      playerAction: action || 'Begin the adventure',
      diceRollResult: rollDetails || null,
      recentContext: recentHistory?.slice(-4) || [],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nGame State:\n${userMessage}` }] },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narration: { type: Type.STRING },
            locationName: { type: Type.STRING },
            environmentDescription: { type: Type.STRING },
            suggestedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  flavor: { type: Type.STRING },
                  skillCheck: {
                    type: Type.OBJECT,
                    properties: {
                      ability: { type: Type.STRING, enum: ['str', 'dex', 'con', 'int', 'wis', 'cha'] },
                      skillName: { type: Type.STRING },
                      dc: { type: Type.INTEGER },
                    },
                    required: ['ability', 'skillName', 'dc'],
                  },
                },
                required: ['id', 'label'],
              },
            },
            combatState: {
              type: Type.OBJECT,
              properties: {
                inCombat: { type: Type.BOOLEAN },
                enemyName: { type: Type.STRING },
                enemyHp: { type: Type.INTEGER },
                enemyMaxHp: { type: Type.INTEGER },
                enemyAction: { type: Type.STRING },
              },
            },
            lootEarned: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['weapon', 'armor', 'potion', 'scroll', 'misc'] },
                  rarity: { type: Type.STRING, enum: ['common', 'uncommon', 'rare', 'legendary'] },
                  description: { type: Type.STRING },
                  quantity: { type: Type.INTEGER },
                  value: { type: Type.INTEGER },
                  damageOrAC: { type: Type.STRING },
                },
                required: ['id', 'name', 'type', 'rarity', 'description', 'quantity', 'value'],
              },
            },
            xpEarned: { type: Type.INTEGER },
            goldEarned: { type: Type.INTEGER },
            hpChange: { type: Type.INTEGER },
            questUpdate: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['active', 'completed'] },
                description: { type: Type.STRING },
              },
              required: ['title', 'status', 'description'],
            },
          },
          required: ['narration', 'locationName', 'environmentDescription', 'suggestedActions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini DM Error:', err);
    // Provide procedural fallback so the game flow never hangs
    const { character, action, rollDetails, currentLocation } = req.body;
    const fallback = generateProceduralFallback(character, action, rollDetails, currentLocation);
    return res.json(fallback);
  }
});

// Dev or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Realm of Eldoria D&D Server running on port ${PORT}`);
  });
}

startServer();
