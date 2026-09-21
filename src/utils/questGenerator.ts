import {
  GenerationOptions,
  ItemRarity,
  Quest,
  QuestDifficulty,
  QuestItem,
  QuestLocation,
  QuestObjective,
  QuestReward,
  QuestType,
} from '../types/quest';
import {
  ARTIFACT_NAMES,
  BIOMES,
  BOUNTY_TARGETS,
  getDifficultyForLevel,
  GIVERS,
  MONSTERS_BY_TIER,
  REGIONS_BY_BIOME,
  REWARD_ITEMS,
} from './questData';

function sample<T>(array: readonly T[] | T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uid(): string {
  return 'qst_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).slice(-4);
}

// Calibrate rewards realistically based on recommended level & difficulty
function calculateRewards(
  level: number,
  difficulty: QuestDifficulty,
  focus: 'balanced' | 'gold' | 'items' | 'exp' = 'balanced'
): QuestReward {
  // Exponential / quadratic gold scaling typical of modern and classic RPGs
  // Level 1: ~30-60g, Level 10: ~150-250g, Level 25: ~900-1400g, Level 50: ~4500-6500g, Level 100: ~35000-55000g
  let baseGold = Math.round(15 + Math.pow(level, 1.72) * 12 + randomInt(10, 25));
  let baseExp = Math.round(50 + Math.pow(level, 1.85) * 18 + randomInt(20, 50));

  if (focus === 'gold') baseGold = Math.round(baseGold * 1.6);
  if (focus === 'exp') baseExp = Math.round(baseExp * 1.5);

  // Determine item drops & rarities based on level
  const items: QuestItem[] = [];
  const itemCount = focus === 'items' ? randomInt(1, 3) : randomInt(1, 2);

  for (let i = 0; i < itemCount; i++) {
    const rarityRoll = Math.random() * 100;
    let chosenRarity: ItemRarity = 'common';

    if (level >= 80) {
      if (rarityRoll < 25) chosenRarity = 'legendary';
      else if (rarityRoll < 60) chosenRarity = 'epic';
      else chosenRarity = 'rare';
    } else if (level >= 50) {
      if (rarityRoll < 12) chosenRarity = 'legendary';
      else if (rarityRoll < 45) chosenRarity = 'epic';
      else if (rarityRoll < 85) chosenRarity = 'rare';
      else chosenRarity = 'uncommon';
    } else if (level >= 25) {
      if (rarityRoll < 20) chosenRarity = 'epic';
      else if (rarityRoll < 55) chosenRarity = 'rare';
      else chosenRarity = 'uncommon';
    } else if (level >= 10) {
      if (rarityRoll < 25) chosenRarity = 'rare';
      else if (rarityRoll < 70) chosenRarity = 'uncommon';
      else chosenRarity = 'common';
    } else {
      if (rarityRoll < 15) chosenRarity = 'uncommon';
      else chosenRarity = 'common';
    }

    const itemPool = REWARD_ITEMS[chosenRarity];
    const itemTemplate = sample(itemPool);
    items.push({
      ...itemTemplate,
      id: uid(),
      rarity: chosenRarity,
    });
  }

  const bonusPool = [
    'Bonus: Retain all intact spoils found in the dungeon.',
    'Bonus: Guaranteed Guild Recognition Commendation (+15% future job pay).',
    'Bonus: Free rest and provisions in local faction taverns for 1 month.',
    'Bonus: Sealed letter of introduction to the Royal Arcane Court.',
    'Bonus: Safe passage token through all regional tollways and watchpoints.',
  ];

  return {
    gold: baseGold,
    exp: baseExp,
    items,
    reputation: {
      faction: sample(['Silver Hand Vanguard', 'Free Adventurers Guild', 'Arcane Conclave of Oros', 'High Crown Regency']),
      amount: randomInt(100, 350) + level * 5,
    },
    bonusRewardText: Math.random() > 0.35 ? sample(bonusPool) : undefined,
  };
}

export function generateRandomQuest(options?: GenerationOptions): Quest {
  // Determine level
  let level = 1;
  if (options?.exactLevel) {
    level = Math.max(1, Math.min(100, options.exactLevel));
  } else {
    const minLvl = options?.minLevel || 1;
    const maxLvl = options?.maxLevel || 100;
    level = randomInt(minLvl, maxLvl);
  }

  const difficulty = getDifficultyForLevel(level);

  // Determine type
  const allTypes: QuestType[] = ['hunt', 'retrieval', 'dungeon', 'bounty', 'escort', 'investigation', 'defense'];
  const questType = options?.type && options.type !== 'all' ? options.type : sample(allTypes);

  // Determine biome & location
  const chosenBiome = options?.biome && options.biome !== 'all' ? options.biome : sample(BIOMES);
  const biomeData = REGIONS_BY_BIOME[chosenBiome] || REGIONS_BY_BIOME['Dark Forest'];
  const region = sample(biomeData.regions);
  const landmark = sample(biomeData.landmarks);

  const location: QuestLocation = {
    name: landmark,
    region: region,
    biome: chosenBiome,
  };

  const giverTemplate = sample(GIVERS);
  const giver = {
    name: giverTemplate.name,
    title: giverTemplate.title,
    faction: giverTemplate.faction,
    dialogueHook: giverTemplate.hook,
  };

  const monsterPool = MONSTERS_BY_TIER[difficulty];
  const monster = sample(monsterPool);
  const artifact = sample(ARTIFACT_NAMES);
  const bountyTarget = sample(BOUNTY_TARGETS);

  let title = '';
  let summary = '';
  const objectives: QuestObjective[] = [];
  let flavorText = '';

  switch (questType) {
    case 'hunt': {
      const huntCount = randomInt(4, 12);
      const adjectives = ['Terror', 'Shadow', 'Savage', 'Bloodfang', 'Corrupted', 'Dread', 'Wrath'];
      title = sample([
        `Culling the ${sample(adjectives)} ${monster}`,
        `The Scourge of ${region}: ${monster}`,
        `Hunt for the Alpha: ${monster}`,
        `Predators in the ${chosenBiome}`,
      ]);
      summary = `Eliminate ${huntCount} dangerous ${monster} roaming the vicinity of ${landmark} to prevent further casualties among travelers and local patrols.`;
      objectives.push({
        id: uid(),
        text: `Track down and slay ${huntCount} ${monster} near ${landmark}`,
        targetCount: huntCount,
        currentCount: 0,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Collect 3 pristine trophy pelts or trophies for Guild proof`,
        targetCount: 3,
        currentCount: 0,
        isOptional: true,
        completed: false,
      });
      flavorText = `The local guard reports that the pack has grown bolder with each passing night, prowling right up to the palisade boundaries.`;
      break;
    }

    case 'retrieval': {
      title = sample([
        `Recovery of the ${artifact}`,
        `The Lost Relic of ${region}`,
        `Heist in the ${chosenBiome}`,
        `Echoes of the Past: ${artifact}`,
      ]);
      summary = `Venture into the heart of ${landmark} to recover the legendary ${artifact} before tomb raiders or enemy factions plunder its dormant enchantments.`;
      objectives.push({
        id: uid(),
        text: `Infiltrate ${landmark} within ${region}`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Locate and secure the ${artifact}`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Return the relic undamaged to ${giver.name}`,
        completed: false,
      });
      flavorText = `Whispers speak of dark runes inscribed upon the vault chamber doors—tread with utmost caution.`;
      break;
    }

    case 'bounty': {
      title = sample([
        `Wanted Dead or Alive: ${bountyTarget.name}`,
        `The High Price on ${bountyTarget.name}`,
        `Judgement Day for ${bountyTarget.epithet}`,
        `Bounty Dispatch: ${bountyTarget.name}`,
      ]);
      summary = `Track down and neutralize ${bountyTarget.name} (${bountyTarget.epithet}), wanted for ${bountyTarget.crime}. Last sighted regrouping at ${landmark}.`;
      objectives.push({
        id: uid(),
        text: `Track the whereabouts of ${bountyTarget.name} in ${region}`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Defeat ${bountyTarget.name} and secure their sovereign bounty seal`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Liberate the seized stolen ledger or captives from their camp`,
        isOptional: true,
        completed: false,
      });
      flavorText = `The magistrate has posted warrants across every tavern in the realm. The target is heavily guarded by loyal sellswords.`;
      break;
    }

    case 'dungeon': {
      title = sample([
        `Purging the Depths of ${landmark}`,
        `The Sealed Horrors of ${region}`,
        `Descent into the ${chosenBiome}`,
        `Catacombs of the Fallen: ${landmark}`,
      ]);
      summary = `Explore the forbidden labyrinth beneath ${landmark}, bypass ancient warding mechanisms, and vanquish the prime entity anchoring the corruption.`;
      objectives.push({
        id: uid(),
        text: `Breach the sealed antechamber of ${landmark}`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Disarm or bypass 3 arcane trap sigils throughout the halls`,
        targetCount: 3,
        currentCount: 0,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Slay the Dungeon Harbinger dwelling in the lower sanctum`,
        completed: false,
      });
      flavorText = `No exploration party has emerged from these subterranean depths in over four decades. Ensure your lamps are fueled.`;
      break;
    }

    case 'investigation': {
      title = sample([
        `The Enigma of ${landmark}`,
        `Whispers in the Shrouded Valley`,
        `The Missing Envoys of ${region}`,
        `The Veil Unraveled: ${chosenBiome}`,
      ]);
      summary = `Investigate mysterious occurrences and inexplicable disappearances near ${landmark}, gathering physical clues to decipher the true conspiracy at play.`;
      objectives.push({
        id: uid(),
        text: `Examine 3 anomalous crime scenes around ${landmark}`,
        targetCount: 3,
        currentCount: 0,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Interrogate the secluded hermit living at the edge of ${region}`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Confront the saboteur before they complete the clandestine ritual`,
        completed: false,
      });
      flavorText = `Strange arcane residues have scorched the cobblestones, defying standard elemental identification.`;
      break;
    }

    case 'escort': {
      title = sample([
        `Safe Passage Through the ${region}`,
        `Guarding the Royal Caravaneer`,
        `The Pilgrim\'s Trek to ${landmark}`,
        `Iron Escort Across the ${chosenBiome}`,
      ]);
      summary = `Provide armed escort for a high-priority wagon carrying vital remedies and envoys across ${region}, shielding them from rogue ambushes.`;
      objectives.push({
        id: uid(),
        text: `Meet the expedition convoy at the frontier outpost`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Repel 2 violent bandit ambushes along the transit road`,
        targetCount: 2,
        currentCount: 0,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Deliver the VIP and cargo intact to ${landmark}`,
        completed: false,
      });
      flavorText = `The payload contains rare antidotes destined for the quarantined settlement downriver. Time is of the essence.`;
      break;
    }

    case 'defense': {
      title = sample([
        `The Stand at ${landmark}`,
        `Shielding the Walls of ${region}`,
        `Siege of the Blood Moon`,
        `Last Bastion in the ${chosenBiome}`,
      ]);
      summary = `Rally to the defense of ${landmark} as incoming assault waves of ${monster} threaten to breach the outer fortifications and slaughter the garrison.`;
      objectives.push({
        id: uid(),
        text: `Fortify the barricades and supply weapon racks`,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Survive and repel 3 intense siege waves`,
        targetCount: 3,
        currentCount: 0,
        completed: false,
      });
      objectives.push({
        id: uid(),
        text: `Prevent the central command beacon from falling`,
        isOptional: true,
        completed: false,
      });
      flavorText = `Scouts spotted war horns echoing from the ridgeline. The night assault will test every adventurer's resolve.`;
      break;
    }
  }

  const rewards = calculateRewards(level, difficulty, options?.rewardFocus);

  const tags = [
    `Lv. ${level}`,
    difficulty,
    questType.toUpperCase(),
    chosenBiome,
  ];

  return {
    id: uid(),
    title,
    summary,
    recommendedLevel: level,
    difficulty,
    type: questType,
    location,
    giver,
    objectives,
    rewards,
    flavorText,
    timeEstimate: `${randomInt(20, 90)} mins`,
    tags,
    status: 'available',
    createdAt: Date.now(),
  };
}

export function generateQuestBoard(count = 4, options?: GenerationOptions): Quest[] {
  const quests: Quest[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let quest: Quest;
    do {
      quest = generateRandomQuest(options);
      attempts++;
    } while (usedTitles.has(quest.title) && attempts < 10);

    usedTitles.add(quest.title);
    quests.push(quest);
  }

  return quests;
}

export function exportQuestAsMarkdown(quest: Quest): string {
  const itemRewards = quest.rewards.items
    .map((item) => `- **${item.name}** (${item.rarity.toUpperCase()} ${item.type}): ${item.effect || item.description}`)
    .join('\n');

  const objList = quest.objectives
    .map((obj) => `- [ ] ${obj.text}${obj.isOptional ? ' *(Optional)*' : ''}`)
    .join('\n');

  return `### 📜 ${quest.title}
**Recommended Level:** Level ${quest.recommendedLevel} (${quest.difficulty})  
**Quest Type:** ${quest.type.toUpperCase()} | **Location:** ${quest.location.name} (${quest.location.region}, ${quest.location.biome})  
**Quest Giver:** ${quest.giver.name}, ${quest.giver.title} (${quest.giver.faction})  

> ${quest.giver.dialogueHook}

#### 🎯 Objective Briefing:
${quest.summary}

#### 📌 Objectives Checklist:
${objList}

#### 💎 Potential Rewards:
- **Gold:** ${quest.rewards.gold.toLocaleString()} GP
- **Experience:** ${quest.rewards.exp.toLocaleString()} EXP
${itemRewards ? `${itemRewards}\n` : ''}${quest.rewards.reputation ? `- **Reputation:** +${quest.rewards.reputation.amount} with ${quest.rewards.reputation.faction}\n` : ''}${quest.rewards.bonusRewardText ? `- **Bonus:** ${quest.rewards.bonusRewardText}\n` : ''}
*Estimated duration: ${quest.timeEstimate || '45 mins'}*
`;
}

export function exportQuestAsJSON(quest: Quest): string {
  return JSON.stringify(quest, null, 2);
}
