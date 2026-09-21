import {
  Alignment,
  BackgroundType,
  BuildType,
  ClassData,
  HairStyle,
  RaceData,
  RaceType,
} from '../types/character';

export const RACES: Record<RaceType, RaceData> = {
  Human: {
    id: 'Human',
    name: 'Human',
    tagline: 'Versatile, ambitious, and endlessly driven',
    description:
      'The most adaptable and resilient of the common races. Humans build lasting empires through sheer willpower, ingenuity, and diverse pursuits.',
    statBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    speed: 30,
    size: 'Medium',
    traits: [
      'Versatile Talent: +1 to all six ability scores',
      'Extra Language: Fluent in Common and one regional dialect',
      'Adaptable Resolve: Advantage on saves against being charmed or broken',
    ],
    suggestedClasses: ['Warrior', 'Paladin', 'Mage', 'Rogue'],
    typicalHeight: '5\'4" - 6\'2"',
    typicalLifespan: '80 - 100 years',
  },
  Elf: {
    id: 'Elf',
    name: 'Elf',
    tagline: 'Graceful, long-lived masters of arcana and nature',
    description:
      'A magical people of otherworldly grace, living in the world but not entirely part of it. Elves love nature and magic, art and artistry, music and poetry.',
    statBonuses: { dex: 2, int: 1 },
    speed: 30,
    size: 'Medium',
    traits: [
      'Darkvision: See in darkness up to 60 feet',
      'Keen Senses: Proficiency in the Perception skill',
      'Fey Ancestry: Advantage on saves against being charmed, immune to magical sleep',
      'Trance: Meditate deeply for 4 hours instead of 8 hours of sleep',
    ],
    suggestedClasses: ['Mage', 'Rogue', 'Ranger', 'Bard'],
    typicalHeight: '5\'6" - 6\'4"',
    typicalLifespan: '750 years',
  },
  Dwarf: {
    id: 'Dwarf',
    name: 'Dwarf',
    tagline: 'Stout, honorable artisans of stone and steel',
    description:
      'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal. They hold grudges fiercely and treasure clan honor above all.',
    statBonuses: { con: 2, str: 1 },
    speed: 25,
    size: 'Medium',
    traits: [
      'Darkvision: See in the dark up to 60 feet',
      'Dwarven Resilience: Advantage on saving throws against poison & poison damage resistance',
      'Dwarven Combat Training: Proficiency with battleaxe, handaxe, and warhammer',
      'Stonecunning: Double proficiency on history checks related to stonework',
    ],
    suggestedClasses: ['Warrior', 'Barbarian', 'Cleric', 'Paladin'],
    typicalHeight: '4\'0" - 5\'0"',
    typicalLifespan: '350 years',
  },
  Halfling: {
    id: 'Halfling',
    name: 'Halfling',
    tagline: 'Quick, cheerful, and extraordinarily lucky',
    description:
      'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense. They are kind, brave, and remarkably fortunate.',
    statBonuses: { dex: 2, cha: 1 },
    speed: 25,
    size: 'Small',
    traits: [
      'Lucky: When you roll a 1 on an attack, ability check, or save, you can reroll',
      'Brave: Advantage on saving throws against being frightened',
      'Halfling Nimbleness: Can move through space of any creature larger than you',
      'Naturally Stealthy: Can attempt to hide even behind larger allies',
    ],
    suggestedClasses: ['Rogue', 'Bard', 'Ranger'],
    typicalHeight: '2\'10" - 3\'4"',
    typicalLifespan: '150 - 200 years',
  },
  Orc: {
    id: 'Orc',
    name: 'Orc',
    tagline: 'Fierce, unstoppable warriors of primal might',
    description:
      'Possessing immense physical power and untamed fighting spirits, orcs are revered as frontline champions whose ferocity turns the tide of epic battles.',
    statBonuses: { str: 2, con: 1 },
    speed: 30,
    size: 'Medium',
    traits: [
      'Darkvision: See in darkness up to 60 feet',
      'Menacing: Gain proficiency in the Intimidation skill',
      'Relentless Endurance: When reduced to 0 HP, drop to 1 HP instead once per long rest',
      'Savage Attacks: Extra damage die on melee critical hits',
    ],
    suggestedClasses: ['Barbarian', 'Warrior', 'Paladin'],
    typicalHeight: '6\'0" - 6\'8"',
    typicalLifespan: '75 years',
  },
  Dragonborn: {
    id: 'Dragonborn',
    name: 'Dragonborn',
    tagline: 'Proud draconic scions bearing elemental breath',
    description:
      'Born of dragons, dragonborn walk proudly through a world that greets them with fearful awe. They value self-sufficiency, honor, and loyalty to their oathbound comrades.',
    statBonuses: { str: 2, cha: 1 },
    speed: 30,
    size: 'Medium',
    traits: [
      'Draconic Breath Weapon: Exhale a 15-foot cone or 30-foot line of elemental energy',
      'Damage Resistance: Resistance to the damage type associated with your ancestry',
      'Draconic Presence: Advantage on Charisma checks when dealing with dragons and reptilians',
    ],
    suggestedClasses: ['Paladin', 'Warrior', 'Barbarian', 'Mage'],
    typicalHeight: '6\'2" - 6\'10"',
    typicalLifespan: '80 years',
  },
  Tiefling: {
    id: 'Tiefling',
    name: 'Tiefling',
    tagline: 'Cunning scions of the infernal planes',
    description:
      'Carrying the bloodline of ancient fiendish pacts, tieflings possess sharp intellects, innate magical prowess, and horns that curl like crowns upon their brows.',
    statBonuses: { cha: 2, int: 1 },
    speed: 30,
    size: 'Medium',
    traits: [
      'Darkvision: See in dim light and darkness up to 60 feet',
      'Hellish Resistance: Resistance to fire damage',
      'Infernal Legacy: Know the Thaumaturgy cantrip; cast Hellish Rebuke at level 3',
    ],
    suggestedClasses: ['Mage', 'Rogue', 'Bard', 'Paladin'],
    typicalHeight: '5\'6" - 6\'2"',
    typicalLifespan: '100 years',
  },
  Gnome: {
    id: 'Gnome',
    name: 'Gnome',
    tagline: 'Curious, inventive tinkerers and illusionists',
    description:
      'A constant hum of busy activity pervades the warrens where gnomes form their close-knit communities. Louder sounds punctuate the crunch of grinding gears and erupting experiments.',
    statBonuses: { int: 2, con: 1 },
    speed: 25,
    size: 'Small',
    traits: [
      'Darkvision: See in darkness up to 60 feet',
      'Gnome Cunning: Advantage on all Intelligence, Wisdom, and Charisma saves against magic',
      'Artificer\'s Lore: Double proficiency on history checks related to magic items or alchemical objects',
    ],
    suggestedClasses: ['Mage', 'Rogue', 'Ranger'],
    typicalHeight: '3\'0" - 3\'8"',
    typicalLifespan: '400 years',
  },
};

export const CLASSES: Record<ClassType, ClassData> = {
  Warrior: {
    id: 'Warrior',
    name: 'Warrior (Fighter)',
    subtitle: 'Master of martial combat, armor, and weapons',
    description:
      'Warriors learn the basics of all combat styles. Every fighter can swing an axe, fence with a rapier, wield a katana or greatsword, use a bow, and even trap enemies in nets.',
    hitDie: 10,
    primaryStat: ['str', 'con'],
    savingThrows: ['str', 'con'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    startingEquipment: ['Chain mail armor', 'Martial weapon of choice', 'Shield', 'Light crossbow & 20 bolts', 'Dungeoneer’s pack'],
    features: ['Second Wind (Heal 1d10 + Lv once per rest)', 'Fighting Style (Archery, Defense, Dueling, or Great Weapon)', 'Action Surge'],
    subclasses: ['Battle Master', 'Champion', 'Eldritch Knight'],
  },
  Mage: {
    id: 'Mage',
    name: 'Mage (Wizard)',
    subtitle: 'Scholarly wielder of arcane incantations',
    description:
      'Drawing on the subtle weave of magic that permeates the cosmos, mages cast spells of explosive fire, arcing lightning, subtle deception, and brute-force telekinesis.',
    hitDie: 6,
    primaryStat: ['int', 'wis'],
    savingThrows: ['int', 'wis'],
    armorProficiencies: ['None'],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    startingEquipment: ['Quarterstaff or Dagger', 'Arcane Focus crystal', 'Spellbook with 6 starting spells', 'Scholar’s pack'],
    features: ['Spellcasting (Cantrips + Level 1 Spell Slots)', 'Arcane Recovery (Regain spell slots on short rest)', 'Ritual Casting'],
    subclasses: ['School of Evocation', 'School of Abjuration', 'School of Divination'],
  },
  Rogue: {
    id: 'Rogue',
    name: 'Rogue',
    subtitle: 'Scoundrel who uses stealth, precision, and trickery',
    description:
      'Rogues rely on skill, stealth, and their foes’ vulnerabilities to get the upper hand in any situation. They have a knack for finding the solution to just about any problem.',
    hitDie: 8,
    primaryStat: ['dex', 'int'],
    savingThrows: ['dex', 'int'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords', 'Thieves’ tools'],
    startingEquipment: ['Rapier or Shortsword', 'Shortbow and quiver of 20 arrows', 'Leather armor', 'Two daggers', 'Thieves’ tools'],
    features: ['Expertise (Double proficiency on 2 skills)', 'Sneak Attack (+1d6 damage with advantage or flank)', 'Thieves’ Cant'],
    subclasses: ['Thief', 'Assassin', 'Arcane Trickster'],
  },
  Cleric: {
    id: 'Cleric',
    name: 'Cleric',
    subtitle: 'Priestly champion wielding divine magic in service of a power',
    description:
      'Clerics are intermediaries between the mortal world and the distant planes of the gods. As varied as the deities they serve, clerics strive to embody the handiwork of their god.',
    hitDie: 8,
    primaryStat: ['wis', 'cha'],
    savingThrows: ['wis', 'cha'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    startingEquipment: ['Mace or Warhammer', 'Scale mail or Leather armor', 'Light crossbow', 'Holy symbol amulet', 'Priest’s pack'],
    features: ['Divine Domain (Life, War, Light, Tempest)', 'Domain Spells', 'Channel Divinity: Turn Undead'],
    subclasses: ['Life Domain', 'War Domain', 'Light Domain'],
  },
  Ranger: {
    id: 'Ranger',
    name: 'Ranger',
    subtitle: 'Warrior who combats threats on the edges of civilization',
    description:
      'Far from the bustle of cities and towns, past the hedges that shelter the most distant farms from the terrors of the wild, rangers keep their unending watch.',
    hitDie: 10,
    primaryStat: ['dex', 'wis'],
    savingThrows: ['str', 'dex'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    startingEquipment: ['Scale mail or Leather armor', 'Two shortswords', 'Longbow & quiver of 20 arrows', 'Explorer’s pack'],
    features: ['Favored Enemy (Advantage tracking & lore)', 'Natural Explorer (Mastery over chosen biome)', 'Primeval Awareness'],
    subclasses: ['Hunter', 'Beast Master', 'Gloom Stalker'],
  },
  Paladin: {
    id: 'Paladin',
    name: 'Paladin',
    subtitle: 'Holy warrior bound to a sacred oath',
    description:
      'Whether sworn before a god’s altar or in a sacred glade before nature spirits, a paladin’s oath is a powerful bond, turning divine devotion into radiant martial power.',
    hitDie: 10,
    primaryStat: ['str', 'cha'],
    savingThrows: ['wis', 'cha'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    startingEquipment: ['Martial weapon & shield', 'Chain mail armor', 'Five javelins', 'Holy symbol', 'Priest’s pack'],
    features: ['Divine Sense (Detect fiends, celestials, undead)', 'Lay on Hands (Healing pool = Lv x 5 HP)', 'Divine Smite'],
    subclasses: ['Oath of Devotion', 'Oath of Vengeance', 'Oath of the Ancients'],
  },
  Bard: {
    id: 'Bard',
    name: 'Bard',
    subtitle: 'Inspiring magician whose power echoes the music of creation',
    description:
      'An inspiring magician whose music weaves words and melody to bolster allies, manipulate foes, heal wounds, and unleash evocative illusions.',
    hitDie: 8,
    primaryStat: ['cha', 'dex'],
    savingThrows: ['dex', 'cha'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    startingEquipment: ['Rapier or Longsword', 'Lute or Flute', 'Leather armor', 'Dagger', 'Entertainer’s pack'],
    features: ['Bardic Inspiration (Grant 1d6 bonus die to ally)', 'Spellcasting', 'Jack of All Trades (+Half proficiency to all checks)'],
    subclasses: ['College of Lore', 'College of Valor', 'College of Glamour'],
  },
  Barbarian: {
    id: 'Barbarian',
    name: 'Barbarian',
    subtitle: 'Fierce warrior driven by primal rage and instinct',
    description:
      'For some, rage is not merely an emotion, but a transcendent spiritual conduit that fuels supernatural strength, damage resistance, and unstoppable fury in battle.',
    hitDie: 12,
    primaryStat: ['str', 'con'],
    savingThrows: ['str', 'con'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    startingEquipment: ['Greataxe or Martial melee weapon', 'Two handaxes', 'Explorer’s pack', 'Four javelins'],
    features: ['Rage (Bonus damage, advantage on Str checks, resistance to bludgeoning/piercing/slashing)', 'Unarmored Defense (AC = 10 + Dex + Con)'],
    subclasses: ['Path of the Berserker', 'Path of the Totem Warrior', 'Path of the Zealot'],
  },
};

export const HAIR_COLORS = [
  { name: 'Raven Black', hex: '#171717' },
  { name: 'Ash Brown', hex: '#4a3728' },
  { name: 'Chestnut Brown', hex: '#634433' },
  { name: 'Golden Blonde', hex: '#d4af37' },
  { name: 'Platinum Blonde', hex: '#f0e6d2' },
  { name: 'Fiery Copper', hex: '#a63d1e' },
  { name: 'Auburn', hex: '#7a2919' },
  { name: 'Silver White', hex: '#d1d5db' },
  { name: 'Midnight Blue', hex: '#1e293b' },
  { name: 'Amethyst Violet', hex: '#581c87' },
  { name: 'Emerald Pine', hex: '#064e3b' },
  { name: 'Blood Crimson', hex: '#881337' },
];

export const HAIR_STYLES: HairStyle[] = [
  'Short Crop',
  'Long Braids',
  'Wild Mane',
  'Topknot',
  'Shaved',
  'Dreadlocks',
  'Flowing Waves',
  'Spiky',
];

export const EYE_COLORS = [
  { name: 'Hazel Brown', hex: '#784e2a' },
  { name: 'Obsidian Black', hex: '#1e2022' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Sapphire Blue', hex: '#2563eb' },
  { name: 'Steel Gray', hex: '#64748b' },
  { name: 'Golden Amber', hex: '#d97706' },
  { name: 'Amethyst Violet', hex: '#9333ea' },
  { name: 'Crimson Fiend', hex: '#e11d48' },
];

export const SKIN_TONES = [
  { name: 'Pale Porcelain', hex: '#fae7db' },
  { name: 'Fair Peach', hex: '#f6d5be' },
  { name: 'Sun-Kissed Bronze', hex: '#d4a373' },
  { name: 'Warm Olive', hex: '#b58a63' },
  { name: 'Deep Caramel', hex: '#8d5b4c' },
  { name: 'Rich Mahogany', hex: '#53372c' },
  { name: 'Ebony', hex: '#31221c' },
  { name: 'Ashen Slate (Orc/Elf)', hex: '#71717a' },
  { name: 'Verdant Green (Orc)', hex: '#4d7c0f' },
  { name: 'Infernal Crimson (Tiefling)', hex: '#991b1b' },
  { name: 'Cobalt Azure (Dragonborn)', hex: '#1e3a8a' },
  { name: 'Brass Golden (Dragonborn)', hex: '#b45309' },
];

export const BUILDS: Array<{ id: BuildType; label: string; description: string }> = [
  { id: 'Slender', label: 'Slender / Agile', description: 'Nimble, lithe, and graceful with high kinetic speed.' },
  { id: 'Athletic', label: 'Athletic / Toned', description: 'Well-balanced martial conditioning with defined sinew.' },
  { id: 'Muscular', label: 'Muscular / Brawny', description: 'Powerfully built with broad shoulders and dense muscle mass.' },
  { id: 'Stocky', label: 'Stocky / Broad', description: 'Low center of gravity, heavy-boned, and extraordinarily resilient.' },
  { id: 'Towering', label: 'Towering / Heavy', description: 'Imposing vertical presence with intimidating reach.' },
  { id: 'Compact', label: 'Compact / Wiry', description: 'Small frame packing surprising leverage and deceptive power.' },
];

export const DISTINGUISHING_FEATURES = [
  'Clean & Unblemished',
  'Jagged duel scar across left eyebrow',
  'Arcane runic brand glowing faintly on forearm',
  'Intricate dragon-scale tattoo coiled over shoulder',
  'Piercing stare with mismatched heterochromia eyes',
  'Braided warrior beard with dwarven silver clasps',
  'Pointed elven ears tipped with golden hoops',
  'Battle notch carved into chin',
  'Curling polished ram horns with etched glyphs',
  'Trophy wolf fang pendant hanging at throat',
];

export const BACKGROUNDS: Record<BackgroundType, {
  name: string;
  skillProficiencies: string[];
  toolProficiencies: string[];
  feature: string;
  description: string;
}> = {
  'Folk Hero': {
    name: 'Folk Hero',
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ['One artisan’s tool set', 'Land vehicles'],
    feature: 'Rustic Hospitality: Common folk will shelter you and conceal your trail from authorities.',
    description: 'You come from humble social ranks, but you are destined for so much more. The common people embrace you as their champion.',
  },
  'Soldier': {
    name: 'Soldier',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiencies: ['Gaming set', 'Land vehicles'],
    feature: 'Military Rank: Former comrades and enlisted soldiers recognize your authority and lend aid in garrison towns.',
    description: 'War has been your life for as long as you can remember. You trained as a youth and studied military maneuvers in royal battalions.',
  },
  'Scholar': {
    name: 'Scholar / Sage',
    skillProficiencies: ['Arcana', 'History'],
    toolProficiencies: ['Calligrapher’s supplies'],
    feature: 'Researcher: When you attempt to recall a piece of lore, you know where and from whom you can obtain it.',
    description: 'You spent years learning the lore of the multiverse, poring over ancient tomes, scrolls, and forbidden scriptures.',
  },
  'Scoundrel': {
    name: 'Scoundrel / Criminal',
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiencies: ['Thieves’ tools', 'Gaming set'],
    feature: 'Criminal Contact: You have a reliable and trustworthy liaison who acts as your connection to underground informants.',
    description: 'You are an experienced rogue who knows how to survive outside the law, navigating alleys, backroom bets, and fences.',
  },
  'Noble': {
    name: 'Noble / Aristocrat',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiencies: ['One musical instrument', 'Gaming set'],
    feature: 'Position of Privilege: Welcome in high society; secure an audience with noble lords and local court magistrates.',
    description: 'You understand wealth, power, and privilege. You carry a noble title, and your family owns land and collects tithes.',
  },
  'Outlander': {
    name: 'Outlander / Nomad',
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['One musical instrument'],
    feature: 'Wanderer: You have an excellent memory for maps and geography; you can always forage fresh food and water for 5 people.',
    description: 'You grew up in the wilds, far from civilization and the comforts of town and technology. You know nature’s unforgiving law.',
  },
  'Acolyte': {
    name: 'Acolyte / Sanctified',
    skillProficiencies: ['Insight', 'Religion'],
    toolProficiencies: ['Two extra languages'],
    feature: 'Shelter of the Faithful: Priests of your faith will provide free healing and care for you and your traveling companions.',
    description: 'You have spent your life in the service of a temple to a specific god or pantheon of deities, chanting liturgies.',
  },
  'Guild Artisan': {
    name: 'Guild Artisan',
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ['One artisan’s tool set'],
    feature: 'Guild Membership: Established guilds provide free lodging, emergency coin advances, and legal protection.',
    description: 'You are a member of an artisan’s guild, practiced in a particular field and closely associated with other trade masters.',
  },
};

export const ALIGNMENTS: Array<{ id: Alignment; name: string; description: string }> = [
  { id: 'Lawful Good', name: 'Lawful Good (Crusader)', description: 'Acts as a good person is expected or required to act. Tells the truth, keeps their word, helps those in need, and opposes evil honorably.' },
  { id: 'Neutral Good', name: 'Neutral Good (Benefactor)', description: 'Does the best that a good person can do. Devoted to helping others without bias toward order or law.' },
  { id: 'Chaotic Good', name: 'Chaotic Good (Rebel)', description: 'Acts as their conscience directs, with little regard for what others expect. Makes their own moral path.' },
  { id: 'Lawful Neutral', name: 'Lawful Neutral (Judge)', description: 'Acts as law, tradition, or a personal code directs them. Order and discipline are the true foundations.' },
  { id: 'True Neutral', name: 'True Neutral (Undecided)', description: 'Prefers good over evil, but does not take dogmatic stands. Seeks ecological balance and pragmatism.' },
  { id: 'Chaotic Neutral', name: 'Chaotic Neutral (Free Spirit)', description: 'Follows their whims, holding personal freedom above all else. Avoids authority and values individuality.' },
  { id: 'Lawful Evil', name: 'Lawful Evil (Dominator)', description: 'Methodically takes what they want within the limits of a code of tradition, loyalty, or order.' },
  { id: 'Neutral Evil', name: 'Neutral Evil (Malefactor)', description: 'Does whatever they can get away with. Out for themselves, pure and simple, shedding tears for no one.' },
  { id: 'Chaotic Evil', name: 'Chaotic Evil (Destroyer)', description: 'Acts with arbitrary violence, spurred by their greed, hatred, or a bloodthirsty lust for destruction.' },
];

export const NAMES_BY_RACE: Record<RaceType, { first: string[]; last: string[] }> = {
  Human: {
    first: ['Alistair', 'Brennan', 'Cedric', 'Damian', 'Evelyn', 'Gareth', 'Helena', 'Kaelen', 'Mira', 'Rowan', 'Theron', 'Vivienne'],
    last: ['Blackwood', 'Crownguard', 'Falconer', 'Hawthorne', 'Ironhart', 'Ravencrest', 'Silverthorn', 'Valerius', 'Windrunner'],
  },
  Elf: {
    first: ['Aerith', 'Caelum', 'Elora', 'Faelar', 'Illyria', 'Larethian', 'Myrddin', 'Sylas', 'Thalor', 'Valen', 'Xanthe', 'Zephyr'],
    last: ['Amastacia', 'Galanodel', 'Liadon', 'Meliamne', 'Nailo', 'Siannodel', 'Starwhisper', 'Moonshadow', 'Silverleaf'],
  },
  Dwarf: {
    first: ['Balin', 'Borr', 'Dain', 'Dorgar', 'Eldeth', 'Gimrik', 'Helga', 'Kragthor', 'Morgran', 'Rorik', 'Thorin', 'Vondal'],
    last: ['Battlehammer', 'Bronzebeard', 'Deepdelver', 'Fireforge', 'Ironbreaker', 'Stonehelm', 'Thunderpeak', 'Goldhand'],
  },
  Halfling: {
    first: ['Alton', 'Bree', 'Cora', 'Drogo', 'Finnan', 'Lidda', 'Merric', 'Perrin', 'Pip', 'Rosie', 'Samwise', 'Tilly'],
    last: ['Goodbarrel', 'Greenbottle', 'High-hill', 'Littlefoot', 'Tealeaf', 'Thorngage', 'Underbough', 'Warmhearth'],
  },
  Orc: {
    first: ['Brakkor', 'Drog', 'Gashna', 'Gorrok', 'Krag', 'Morgok', 'Rakka', 'Shagrat', 'Thokk', 'Urzog', 'Varg', 'Yashna'],
    last: ['Bonecrusher', 'Bloodfury', 'Doomhammer', 'Ironfang', 'Skullsplitter', 'Thunderjaw', 'Warhowl', 'Wolfpelt'],
  },
  Dragonborn: {
    first: ['Arjhan', 'Balasar', 'Donaar', 'Ghesh', 'Heskan', 'Kriv', 'Medrash', 'Nadarr', 'Rhogar', 'Shamash', 'Torinn', 'Zorvath'],
    last: ['Clethtinthiallor', 'Daardendrian', 'Delmirev', 'Dracheon', 'Kepeshkmolik', 'Myastan', 'Nemmonis', 'Verthisathurgiesh'],
  },
  Tiefling: {
    first: ['Akmenos', 'Barakas', 'Damakos', 'Ekemon', 'Iados', 'Kairon', 'Leucis', 'Mephist', 'Mordai', 'Pelaios', 'Skamos', 'Therai'],
    last: ['Art', 'Carrion', 'Despair', 'Fear', 'Gladness', 'Hope', 'Ideal', 'Music', 'Nowhere', 'Poetry', 'Sorrow', 'Torment'],
  },
  Gnome: {
    first: ['Boddynock', 'Dimble', 'Fonkin', 'Gimble', 'Glin', 'Jebeddo', 'Namfoodle', 'Roondar', 'Seebo', 'Warryn', 'Zook', 'Zanna'],
    last: ['Beren', 'Daergel', 'Folkor', 'Garrick', 'Nackle', 'Murnig', 'Ningel', 'Sparklegem', 'Tinkertop', 'Scheppen'],
  },
};
