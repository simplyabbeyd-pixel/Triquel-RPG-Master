export type QuestDifficulty =
  | 'Novice'      // Lv 1-10
  | 'Apprentice'  // Lv 11-25
  | 'Adept'       // Lv 26-45
  | 'Veteran'     // Lv 46-70
  | 'Champion'    // Lv 71-90
  | 'Mythic';     // Lv 91-100

export type QuestType =
  | 'hunt'
  | 'retrieval'
  | 'dungeon'
  | 'bounty'
  | 'escort'
  | 'investigation'
  | 'defense';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface QuestItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'potion' | 'relic' | 'scroll';
  rarity: ItemRarity;
  effect?: string;
  description?: string;
}

export interface QuestReward {
  gold: number;
  exp: number;
  items: QuestItem[];
  reputation?: {
    faction: string;
    amount: number;
  };
  bonusRewardText?: string;
}

export interface QuestObjective {
  id: string;
  text: string;
  targetCount?: number;
  currentCount?: number;
  isOptional?: boolean;
  completed?: boolean;
}

export interface QuestLocation {
  name: string;
  region: string;
  biome: string;
}

export interface QuestGiver {
  name: string;
  title: string;
  faction: string;
  dialogueHook: string;
}

export interface Quest {
  id: string;
  title: string;
  summary: string;              // Brief description of the objective
  recommendedLevel: number;    // Recommended level (1-100)
  difficulty: QuestDifficulty;
  type: QuestType;
  location: QuestLocation;
  giver: QuestGiver;
  objectives: QuestObjective[];
  rewards: QuestReward;
  flavorText?: string;
  timeEstimate?: string;
  notes?: string;               // Optional player-added notes/field notes
  tags: string[];
  status: 'available' | 'active' | 'completed' | 'abandoned';
  createdAt: number;
  completedAt?: number;         // Timestamp when the quest was completed
}

export interface GenerationOptions {
  minLevel?: number;
  maxLevel?: number;
  exactLevel?: number;
  type?: QuestType | 'all';
  biome?: string | 'all';
  rewardFocus?: 'balanced' | 'gold' | 'items' | 'exp';
  difficulty?: QuestDifficulty | 'all';
}
