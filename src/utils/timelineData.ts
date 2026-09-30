import { Quest } from '../types/quest';

/**
 * High-flavor starter completed quests for the hero's chronicle timeline
 */
export const DEFAULT_COMPLETED_TIMELINE: Quest[] = [
  {
    id: 'completed-quest-1',
    title: 'The Whispering Crypt of Morvath',
    summary: 'Purged the restless specters haunting the Morvath catacombs and recovered the lost funerary chalice for the Dawnlight order.',
    recommendedLevel: 14,
    difficulty: 'Novice',
    type: 'dungeon',
    location: {
      name: 'Catacombs of Morvath',
      region: 'Ashen Barrens',
      biome: 'Crypt / Underdark',
    },
    giver: {
      name: 'Father Kenneth',
      title: 'High Priest of the Dawn',
      faction: 'Dawnlight Vigil',
      dialogueHook: 'The ancient tomb seals have fractured; peace must be restored before the new moon.',
    },
    objectives: [
      { id: 'c-obj-1', text: 'Cleanse the eastern burial chamber of wraiths', completed: true },
      { id: 'c-obj-2', text: 'Retrieve the Sanctified Chalice from the altar', completed: true },
      { id: 'c-obj-3', text: 'Consecrate the central sarcophagus with holy water', completed: true },
    ],
    rewards: {
      gold: 450,
      exp: 620,
      items: [
        {
          id: 'item-comp-1',
          name: 'Sunfire Relic of Kenneth',
          type: 'relic',
          rarity: 'rare',
          effect: '+15 Holy damage against undead & illuminates dark tunnels',
          description: 'A polished brass phylactery pulsing with warm consecrated sunlight.',
        },
      ],
      reputation: {
        faction: 'Dawnlight Vigil',
        amount: 250,
      },
      bonusRewardText: 'Blessed by Father Kenneth (+5% holy magic resistance for the party)',
    },
    flavorText: 'The wailing shadows subsided into calm golden dust as holy water touched the altar.',
    notes: 'The eastern crypt corridor had frost runes carved into the stones. Bring fire scrolls next time.',
    tags: ['Undead', 'Holy', 'Catacombs', 'Novice'],
    status: 'completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    completedAt: Date.now() - 1000 * 60 * 60 * 36, // 36 hours ago
  },
  {
    id: 'completed-quest-2',
    title: 'Bounty: Grimtooth the Hill Troll',
    summary: 'Tracked and slew the giant troll raiding merchant caravans along the rocky crags of Amber Pass.',
    recommendedLevel: 24,
    difficulty: 'Apprentice',
    type: 'bounty',
    location: {
      name: 'Amber Pass Ravine',
      region: 'Wyrmtooth Crags',
      biome: 'Mountains / Pass',
    },
    giver: {
      name: 'Captain Kaelen',
      title: 'Vanguard Watchmaster',
      faction: 'Ironshield Guard',
      dialogueHook: 'Three supply wagons smashed to kindling this week. Put an end to Grimtooth once and for all.',
    },
    objectives: [
      { id: 'b-obj-1', text: 'Locate troll tracks near the shattered merchant wagon', completed: true },
      { id: 'b-obj-2', text: 'Infiltrate Grimtooth\'s cave lair at dusk', completed: true },
      { id: 'b-obj-3', text: 'Defeat Grimtooth and recover merchant manifests', completed: true },
    ],
    rewards: {
      gold: 850,
      exp: 1150,
      items: [
        {
          id: 'item-comp-2',
          name: 'Troll-hide Pauldrons',
          type: 'armor',
          rarity: 'epic',
          effect: '+28 Armor, regenerates 4 HP every 5 seconds out of combat',
          description: 'Thick shoulder guards reinforced with troll sinew and iron plates.',
        },
        {
          id: 'item-comp-3',
          name: 'Caravan Master Draught',
          type: 'potion',
          rarity: 'uncommon',
          effect: 'Grants +25 stamina and immunity to bleed effects for 15 minutes',
          description: 'A pungent brew brewed with bitter mountain root and honey.',
        },
      ],
      reputation: {
        faction: 'Ironshield Guard',
        amount: 400,
      },
      bonusRewardText: 'Bounty hunter stipend granted (+100 extra GP on delivery)',
    },
    flavorText: 'With a thunderous crash, the hulking brute collapsed across his treasure hoard.',
    notes: 'Fire arrows prevented his natural troll regeneration. Delivered the shipment manifest to Captain Kaelen.',
    tags: ['Troll', 'Bounty', 'Mountains', 'Apprentice'],
    status: 'completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 16, // 16 hours ago
    completedAt: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
  },
  {
    id: 'completed-quest-3',
    title: 'The Sunken Star of Lake Vesper',
    summary: 'Dived into the misty waters of Lake Vesper to retrieve an extraterrestrial skystone before the cultists could desecrate it.',
    recommendedLevel: 32,
    difficulty: 'Adept',
    type: 'retrieval',
    location: {
      name: 'Lake Vesper Caverns',
      region: 'Mistvale Marshes',
      biome: 'Wetlands / Submerged Ruins',
    },
    giver: {
      name: 'Archivist Selene',
      title: 'Stargazer Keeper',
      faction: 'Observatory of the Moon',
      dialogueHook: 'The falling star emitted a frequency known only to the celestial ancients. We must secure it.',
    },
    objectives: [
      { id: 's-obj-1', text: 'Navigate the submerged cavern under Lake Vesper', completed: true },
      { id: 's-obj-2', text: 'Repel the Starlight Cultist ambush', completed: true },
      { id: 's-obj-3', text: 'Extract the pulsing Astral Core from the crater', completed: true },
    ],
    rewards: {
      gold: 1200,
      exp: 1750,
      items: [
        {
          id: 'item-comp-4',
          name: 'Astral Meteor Ring',
          type: 'accessory',
          rarity: 'epic',
          effect: '+12% Arcane Spell Critical Chance, +15% Mana Regeneration',
          description: 'A dark meteoric band embedded with an ethereal sapphire speck.',
        },
      ],
      reputation: {
        faction: 'Observatory of the Moon',
        amount: 500,
      },
      bonusRewardText: 'Attuned with cosmic energy (Spell cooldowns reduced by 8%)',
    },
    flavorText: 'The core hummed in resonance with the night sky, illuminating the sunken grotto.',
    notes: 'Water breathing potions were indispensable. The cult leader escaped towards the northern marshlands.',
    tags: ['Cosmic', 'Retrieval', 'Lake', 'Adept'],
    status: 'completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    completedAt: Date.now() - 1000 * 60 * 45, // 45 minutes ago
  },
];

/**
 * Calculates cumulative milestone metrics for a chronologically sorted array of completed quests
 */
export interface QuestTimelineMilestone {
  quest: Quest;
  chronologicalIndex: number; // 1-based order in timeline
  completedDateFormatted: string;
  completedTimeAgo: string;
  durationFormatted: string;
  cumulativeGold: number;
  cumulativeExp: number;
  cumulativeItemsCount: number;
}

export function computeQuestTimeline(
  completedQuests: Quest[],
  sortOrder: 'asc' | 'desc' = 'desc'
): {
  milestones: QuestTimelineMilestone[];
  totalGold: number;
  totalExp: number;
  totalItems: number;
} {
  // Sort chronologically ascending first to compute cumulative career totals
  const sortedAscending = [...completedQuests].sort((a, b) => {
    const timeA = a.completedAt || a.createdAt;
    const timeB = b.completedAt || b.createdAt;
    return timeA - timeB;
  });

  let runningGold = 0;
  let runningExp = 0;
  let runningItems = 0;

  const milestonesAsc: QuestTimelineMilestone[] = sortedAscending.map((q, idx) => {
    runningGold += q.rewards?.gold || 0;
    runningExp += q.rewards?.exp || 0;
    runningItems += q.rewards?.items?.length || 0;

    const completedTime = q.completedAt || q.createdAt;
    const createdTime = q.createdAt || completedTime;
    const durationMs = Math.max(0, completedTime - createdTime);

    return {
      quest: q,
      chronologicalIndex: idx + 1,
      completedDateFormatted: formatTimelineDate(completedTime),
      completedTimeAgo: getRelativeTime(completedTime),
      durationFormatted: formatDuration(durationMs),
      cumulativeGold: runningGold,
      cumulativeExp: runningExp,
      cumulativeItemsCount: runningItems,
    };
  });

  const totalGold = runningGold;
  const totalExp = runningExp;
  const totalItems = runningItems;

  const milestones = sortOrder === 'desc' ? [...milestonesAsc].reverse() : milestonesAsc;

  return {
    milestones,
    totalGold,
    totalExp,
    totalItems,
  };
}

export function formatTimelineDate(timestamp?: number): string {
  if (!timestamp) return 'Ancient Era';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getRelativeTime(timestamp?: number): string {
  if (!timestamp) return '';
  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return 'Just now';
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) return `${Math.floor(diffDay / 30)}mo ago`;
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}

export function formatDuration(ms: number): string {
  if (!ms || ms < 60000) return 'Completed rapidly (<1h)';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) {
    const remHours = hours % 24;
    return `${days}d ${remHours}h campaign`;
  }
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m in field`;
}
