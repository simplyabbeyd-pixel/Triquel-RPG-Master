export type RaceType =
  | 'Human'
  | 'Elf'
  | 'Dwarf'
  | 'Halfling'
  | 'Orc'
  | 'Dragonborn'
  | 'Tiefling'
  | 'Gnome';

export type ClassType =
  | 'Warrior'
  | 'Mage'
  | 'Rogue'
  | 'Cleric'
  | 'Ranger'
  | 'Paladin'
  | 'Bard'
  | 'Barbarian';

export type StatName = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type BuildType =
  | 'Slender'
  | 'Athletic'
  | 'Muscular'
  | 'Stocky'
  | 'Towering'
  | 'Compact';

export type HairStyle =
  | 'Short Crop'
  | 'Long Braids'
  | 'Wild Mane'
  | 'Topknot'
  | 'Shaved'
  | 'Dreadlocks'
  | 'Flowing Waves'
  | 'Spiky';

export interface Appearance {
  hairColor: string;
  hairColorName: string;
  hairStyle: HairStyle;
  eyeColor: string;
  eyeColorName: string;
  skinTone: string;
  skinToneName: string;
  build: BuildType;
  height: string; // e.g. "5' 11\""
  weight: string; // e.g. "175 lbs"
  age: number;
  gender: string;
  distinguishingFeature: string;
}

export interface RaceData {
  id: RaceType;
  name: string;
  tagline: string;
  description: string;
  statBonuses: Partial<AbilityScores>;
  speed: number;
  size: 'Small' | 'Medium';
  traits: string[];
  suggestedClasses: ClassType[];
  typicalHeight: string;
  typicalLifespan: string;
}

export interface ClassData {
  id: ClassType;
  name: string;
  subtitle: string;
  description: string;
  hitDie: number; // 6, 8, 10, 12
  primaryStat: StatName[];
  savingThrows: StatName[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  startingEquipment: string[];
  features: string[];
  subclasses: string[];
}

export type Alignment =
  | 'Lawful Good'
  | 'Neutral Good'
  | 'Chaotic Good'
  | 'Lawful Neutral'
  | 'True Neutral'
  | 'Chaotic Neutral'
  | 'Lawful Evil'
  | 'Neutral Evil'
  | 'Chaotic Evil';

export type BackgroundType =
  | 'Folk Hero'
  | 'Soldier'
  | 'Scholar'
  | 'Scoundrel'
  | 'Noble'
  | 'Outlander'
  | 'Acolyte'
  | 'Guild Artisan';

export interface Character {
  id: string;
  name: string;
  title?: string;
  level: number;
  race: RaceType;
  class: ClassType;
  subclass?: string;
  appearance: Appearance;
  stats: AbilityScores;
  background: BackgroundType;
  alignment: Alignment;
  personalityTrait: string;
  ideal: string;
  bond: string;
  flaw: string;
  backstory: string;
  hpMax: number;
  hpCurrent: number;
  armorClass: number;
  gold: number;
  equipment: string[];
  activeQuestId?: string;
  createdAt: number;
}
