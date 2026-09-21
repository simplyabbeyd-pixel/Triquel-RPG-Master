import {
  AbilityScores,
  Alignment,
  Appearance,
  BackgroundType,
  BuildType,
  Character,
  ClassType,
  HairStyle,
  RaceType,
  StatName,
} from '../types/character';
import {
  ALIGNMENTS,
  BACKGROUNDS,
  BUILDS,
  CLASSES,
  DISTINGUISHING_FEATURES,
  EYE_COLORS,
  HAIR_COLORS,
  HAIR_STYLES,
  NAMES_BY_RACE,
  RACES,
  SKIN_TONES,
} from './characterData';

export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function roll4d6DropLowest(): { rolls: number[]; dropped: number; total: number } {
  const rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  const sorted = [...rolls].sort((a, b) => a - b);
  const dropped = sorted[0];
  const total = sorted.slice(1).reduce((a, b) => a + b, 0);
  return { rolls, dropped, total };
}

export function calculateArmorClass(
  cls: ClassType,
  stats: AbilityScores,
  race: RaceType
): number {
  const dexMod = getModifier(stats.dex + (RACES[race].statBonuses.dex || 0));
  const conMod = getModifier(stats.con + (RACES[race].statBonuses.con || 0));

  switch (cls) {
    case 'Barbarian':
      // Unarmored defense: 10 + Dex + Con
      return 10 + dexMod + conMod;
    case 'Warrior':
    case 'Paladin':
      // Chain mail (16) + shield (2) = 18
      return 18;
    case 'Rogue':
    case 'Bard':
      // Leather armor (11) + Dex mod
      return 11 + dexMod;
    case 'Cleric':
    case 'Ranger':
      // Scale mail (14) + capped Dex (max 2) + shield (+2 for Cleric)
      return cls === 'Cleric' ? 14 + Math.min(dexMod, 2) + 2 : 14 + Math.min(dexMod, 2);
    case 'Mage':
    default:
      // Unarmored: 10 + Dex
      return 10 + dexMod;
  }
}

export function calculateMaxHP(
  cls: ClassType,
  stats: AbilityScores,
  race: RaceType,
  level: number = 1
): number {
  const conMod = getModifier(stats.con + (RACES[race].statBonuses.con || 0));
  const hitDie = CLASSES[cls].hitDie;
  // Level 1: Max hit die + Con mod. For each extra level: (hitDie/2 + 1) + Con mod
  const baseHp = hitDie + conMod;
  if (level <= 1) return Math.max(1, baseHp);
  const perLevel = Math.floor(hitDie / 2) + 1 + conMod;
  return Math.max(1, baseHp + (level - 1) * perLevel);
}

export function getRandomName(race: RaceType): string {
  const list = NAMES_BY_RACE[race] || NAMES_BY_RACE.Human;
  const first = list.first[Math.floor(Math.random() * list.first.length)];
  const last = list.last[Math.floor(Math.random() * list.last.length)];
  return `${first} ${last}`;
}

export function generateRandomCharacter(): Character {
  const races = Object.keys(RACES) as RaceType[];
  const classes = Object.keys(CLASSES) as ClassType[];
  const selectedRace = races[Math.floor(Math.random() * races.length)];
  const raceData = RACES[selectedRace];

  // Pick suggested or random class
  const selectedClass =
    raceData.suggestedClasses[Math.floor(Math.random() * raceData.suggestedClasses.length)] ||
    classes[Math.floor(Math.random() * classes.length)];
  const classData = CLASSES[selectedClass];

  // Appearance
  const hair = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
  const hairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)];
  const eye = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)];
  const skin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)];
  const build = BUILDS[Math.floor(Math.random() * BUILDS.length)].id;
  const distFeature =
    DISTINGUISHING_FEATURES[Math.floor(Math.random() * DISTINGUISHING_FEATURES.length)];

  // Stats - Standard Array distributed logically by class primary stats
  const scores = [15, 14, 13, 12, 10, 8];
  const stats: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
  const statKeys: StatName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  // Put 15 and 14 in primary stats
  const primaries = classData.primaryStat;
  const assigned = new Set<StatName>();

  primaries.forEach((stat, idx) => {
    stats[stat] = scores[idx];
    assigned.add(stat);
  });

  const remainingStats = statKeys.filter((k) => !assigned.has(k));
  const remainingScores = scores.slice(primaries.length);

  remainingStats.forEach((stat, idx) => {
    stats[stat] = remainingScores[idx] || 10;
  });

  // Background
  const bgs = Object.keys(BACKGROUNDS) as BackgroundType[];
  const selectedBg = bgs[Math.floor(Math.random() * bgs.length)];

  // Alignment
  const selectedAlignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)].id;

  const appearance: Appearance = {
    hairColor: hair.hex,
    hairColorName: hair.name,
    hairStyle,
    eyeColor: eye.hex,
    eyeColorName: eye.name,
    skinTone: skin.hex,
    skinToneName: skin.name,
    build,
    height: selectedRace === 'Halfling' || selectedRace === 'Gnome' ? '3\' 2"' : selectedRace === 'Dwarf' ? '4\' 6"' : selectedRace === 'Orc' ? '6\' 5"' : '5\' 11"',
    weight: selectedRace === 'Halfling' || selectedRace === 'Gnome' ? '38 lbs' : selectedRace === 'Dwarf' ? '165 lbs' : selectedRace === 'Orc' ? '240 lbs' : '175 lbs',
    age: selectedRace === 'Elf' ? 120 : selectedRace === 'Dwarf' ? 75 : 24,
    gender: Math.random() > 0.5 ? 'Female' : 'Male',
    distinguishingFeature: distFeature,
  };

  const name = getRandomName(selectedRace);
  const hpMax = calculateMaxHP(selectedClass, stats, selectedRace, 1);
  const ac = calculateArmorClass(selectedClass, stats, selectedRace);

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    level: 1,
    race: selectedRace,
    class: selectedClass,
    subclass: classData.subclasses[0],
    appearance,
    stats,
    background: selectedBg,
    alignment: selectedAlignment,
    personalityTrait: 'Always keeps word once given, no matter the cost.',
    ideal: 'Respect. People deserve to be treated with dignity and honor.',
    bond: 'Carries a pocket locket with portrait of a lost companion.',
    flaw: 'Prone to reckless bravery when allies are threatened.',
    backstory: `Raised under the auspices of ${selectedRace} traditions, this brave adventurer took up the mantle of a ${selectedClass} after their home was touched by mystery and wonder.`,
    hpMax,
    hpCurrent: hpMax,
    armorClass: ac,
    gold: 50 + Math.floor(Math.random() * 40),
    equipment: [...classData.startingEquipment],
    createdAt: Date.now(),
  };
}

export function exportCharacterToMarkdown(char: Character): string {
  const raceData = RACES[char.race];
  const classData = CLASSES[char.class];

  const strFinal = char.stats.str + (raceData.statBonuses.str || 0);
  const dexFinal = char.stats.dex + (raceData.statBonuses.dex || 0);
  const conFinal = char.stats.con + (raceData.statBonuses.con || 0);
  const intFinal = char.stats.int + (raceData.statBonuses.int || 0);
  const wisFinal = char.stats.wis + (raceData.statBonuses.wis || 0);
  const chaFinal = char.stats.cha + (raceData.statBonuses.cha || 0);

  return `# ${char.name} — Tabletop RPG Character Sheet
**Level ${char.level} ${char.race} ${char.class}** (${char.alignment})
*Background:* ${char.background} | *Speed:* ${raceData.speed} ft | *Hit Die:* d${classData.hitDie}

---

## Combat & Vitals
- **Armor Class (AC):** ${char.armorClass}
- **Hit Points (HP):** ${char.hpCurrent} / ${char.hpMax}
- **Initiative:** ${formatModifier(getModifier(dexFinal))}
- **Proficiency Bonus:** +2

---

## Ability Scores
- **Strength (STR):** ${strFinal} (${formatModifier(getModifier(strFinal))})
- **Dexterity (DEX):** ${dexFinal} (${formatModifier(getModifier(dexFinal))})
- **Constitution (CON):** ${conFinal} (${formatModifier(getModifier(conFinal))})
- **Intelligence (INT):** ${intFinal} (${formatModifier(getModifier(intFinal))})
- **Wisdom (WIS):** ${wisFinal} (${formatModifier(getModifier(wisFinal))})
- **Charisma (CHA):** ${chaFinal} (${formatModifier(getModifier(chaFinal))})

---

## Appearance & Demographics
- **Build / Physique:** ${char.appearance.build}
- **Hair:** ${char.appearance.hairStyle}, ${char.appearance.hairColorName}
- **Eyes:** ${char.appearance.eyeColorName}
- **Skin:** ${char.appearance.skinToneName}
- **Height & Weight:** ${char.appearance.height} | ${char.appearance.weight}
- **Age & Gender:** ${char.appearance.age} years | ${char.appearance.gender}
- **Distinguishing Mark:** ${char.appearance.distinguishingFeature}

---

## Racial Traits
${raceData.traits.map((t) => `- ${t}`).join('\n')}

## Class Features
${classData.features.map((f) => `- ${f}`).join('\n')}

## Starting Equipment & Coin
- **Gold:** ${char.gold} GP
${char.equipment.map((e) => `- ${e}`).join('\n')}

---

## Persona & Lore
- **Personality Trait:** ${char.personalityTrait}
- **Ideal:** ${char.ideal}
- **Bond:** ${char.bond}
- **Flaw:** ${char.flaw}
- **Backstory:** ${char.backstory}
`;
}
