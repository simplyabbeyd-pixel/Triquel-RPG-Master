import { ItemRarity, QuestDifficulty, QuestItem, QuestType } from '../types/quest';

export function getDifficultyForLevel(level: number): QuestDifficulty {
  if (level <= 10) return 'Novice';
  if (level <= 25) return 'Apprentice';
  if (level <= 45) return 'Adept';
  if (level <= 70) return 'Veteran';
  if (level <= 90) return 'Champion';
  return 'Mythic';
}

export const BIOMES = [
  'Dark Forest',
  'Sunken Crypts',
  'Forgotten Mountains',
  'Volcanic Caldera',
  'Haunted Marshlands',
  'Ancient Ruins',
  'Desert of Whispers',
  'Celestial Citadel',
  'Frostpeak Glaciers',
  'Subterranean Caverns',
] as const;

export const FACTIONS = [
  { name: 'Silver Hand Vanguard', type: 'Knightly Order' },
  { name: 'Arcane Conclave of Oros', type: 'Mages Guild' },
  { name: 'Shadowveil Syndicate', type: 'Thieves Guild' },
  { name: 'Ironfang Clan', type: 'Dwarven Miners & Smiths' },
  { name: 'Keepers of the Verdant Glade', type: 'Druidic Circle' },
  { name: 'High Crown Regency', type: 'Royal Authorities' },
  { name: 'Free Adventurers Guild', type: 'Mercenaries' },
  { name: 'Dawnbringer Clerisy', type: 'Holy Inquisition' },
];

export const GIVERS = [
  {
    name: 'Guildmaster Theresa',
    title: 'Grand Warden of the Guildhall',
    faction: 'Free Adventurers Guild',
    hook: '"A matter of urgency has crossed my dispatch desk. Only capable hands need apply."',
  },
  {
    name: 'Archmage Valerius',
    title: 'Keeper of the Shrouded Glyphs',
    faction: 'Arcane Conclave of Oros',
    hook: '"The ley lines tremble with erratic resonance. A delicate intervention is required."',
  },
  {
    name: 'Captain Roderick',
    title: 'Commander of the City Guard',
    faction: 'High Crown Regency',
    hook: '"The crown is issuing a substantial bounty. Don\'t return without proof of deed."',
  },
  {
    name: 'Elder Sylas',
    title: 'Circle Druid of the Wilds',
    faction: 'Keepers of the Verdant Glade',
    hook: '"The woodland spirits are weeping. Something foreign and vile poisons the root."',
  },
  {
    name: 'Grimm Fireforge',
    title: 'Master Prospector',
    faction: 'Ironfang Clan',
    hook: '"Our deep shaft drill broke through into something ancient. And angry."',
  },
  {
    name: 'Lyra the Quiet',
    title: 'Informant of the Back Alleys',
    faction: 'Shadowveil Syndicate',
    hook: '"A lucrative score awaits, provided you don\'t ask too many moral questions."',
  },
  {
    name: 'High Inquisitor Morwen',
    title: 'Purifier of Heresies',
    faction: 'Dawnbringer Clerisy',
    hook: '"Dark rites defile sanctified ground. Take up steel and cleanse the taint."',
  },
  {
    name: 'Baroness Vivienne',
    title: 'Regent of the East March',
    faction: 'High Crown Regency',
    hook: '"My couriers never arrived from the border crossing. Discover their fate."',
  },
];

export const REGIONS_BY_BIOME: Record<string, { regions: string[]; landmarks: string[] }> = {
  'Dark Forest': {
    regions: ['Blackwood Expanse', 'Shadowpine Hollow', 'The Gloomwood', 'Weeping Thicket'],
    landmarks: ['Blighted Bramble Hollow', 'Gnarled Witch Tree', 'Old Sawmill Ruins', 'Lurker\'s Den'],
  },
  'Sunken Crypts': {
    regions: ['Drowned Tombs of Val-Gara', 'Catacombs of the Weeping Queen', 'The Bone Cistern', 'Forgotten Ossuary'],
    landmarks: ['Tomb of the First Knight', 'Chamber of Embalmed Souls', 'Sunken Antechamber', 'The Crypt Well'],
  },
  'Forgotten Mountains': {
    regions: ['Cragtop Ridge', 'Razorwind Pass', 'Skyreach Escarpment', 'The Thunder Peaks'],
    landmarks: ['abandoned Watchtower of Aethel', 'Gryphon Eyrie', 'Shattered Spire', 'Echoing Chasm'],
  },
  'Volcanic Caldera': {
    regions: ['The Ashlands of Zhur', 'Molten Fissures', 'Obsidian Trench', 'Cinder Crags'],
    landmarks: ['Heart of the Magma Chamber', 'Smoldering Forge of Morok', 'Brimstone Vents', 'Basalt Fortress'],
  },
  'Haunted Marshlands': {
    regions: ['Mire of Lost Sighs', 'Fogbound Bog', 'The Brackish Reach', 'Rotwood Slough'],
    landmarks: ['Sunken Manor of Alden', 'The Witch Doctor\'s Hut', 'Gallows Isle', 'Will-o\'-the-Wisp Glade'],
  },
  'Ancient Ruins': {
    regions: ['Fallen Empire of Mythros', 'Sunken Columns of Ilos', 'Rune-Carved Terraces', 'The Shattered Forum'],
    landmarks: ['Hall of Broken Scepters', 'The Astrolabe Dais', 'Subterranean Vault 9', 'The Sun Temple Sanctum'],
  },
  'Desert of Whispers': {
    regions: ['Dune Sea of Karak', 'The Bleached Basin', 'Scorched Barrens', 'Sands of the Nomad King'],
    landmarks: ['Oasis of Mirages', 'Pyramid of the Sleeper', 'Canyon of the Jackal', 'Buried Bazaar'],
  },
  'Celestial Citadel': {
    regions: ['Astral Spires', 'Floating Aethel Gardens', 'Pillars of the Sun King', 'Cloudbreak Sanctum'],
    landmarks: ['Prism Chamber', 'Gate of Seraphs', 'The Sky Observatorium', 'Hall of Resplendent Blades'],
  },
  'Frostpeak Glaciers': {
    regions: ['Howling Bluffs', 'The Glacial Rift', 'Frostfang Tundra', 'Shivering Wastes'],
    landmarks: ['Yeti\'s Cavern', 'Frozen Galleon of the North', 'Shrine of the White Wyrm', 'Icebound Citadel'],
  },
  'Subterranean Caverns': {
    regions: ['Deep Hollows of Nar', 'Glowstone Depths', 'Abyssal Chasm', 'The Silent Under-Realm'],
    landmarks: ['Mushroom Forest of Zith', 'Chasm of the Blind Horrors', 'Crystal Heart Basin', 'Forgotten Mine Shaft 4'],
  },
};

export const MONSTERS_BY_TIER: Record<QuestDifficulty, string[]> = {
  Novice: [
    'River Goblins', 'Rabid Dire Wolves', 'Blight Spiders', 'Skeleton Scrappers',
    'Brigand Highwaymen', 'Cave Bats', 'Mud Trolls', 'Corrupted Dryads',
  ],
  Apprentice: [
    'Hobgoblin Raiders', 'Venomous Wyrmlings', 'Ghoul Pack', 'Ironfang Bandits',
    'Grave Horrors', 'Shadow Stalkers', 'Ash Crawlers', 'Restless Tomb Guardians',
  ],
  Adept: [
    'Bloodfang Chimeras', 'Crypt Revenants', 'Gargoyle Sentinels', 'Chaos Cultists',
    'Minotaur Juggernauts', 'Frost Wyrms', 'Rogue Blood Mages', 'Manticore Broodmothers',
  ],
  Veteran: [
    'Void Drakes', 'Lich Apprentices', 'Ancient Golems of War', 'Dread Death Knights',
    'Abyssal Stalkers', 'Hydra of the Rotting Fen', 'Shadowflame Elementals', 'Storm Giants',
  ],
  Champion: [
    'Arch-Necromancers', 'Ancient Red Wyrms', 'Demon Lords of the Pit', 'Eldritch Behemoths',
    'Titan Automaton Wardens', 'Vampire Elders', 'Primordial Phoenixes', 'Doom Harbingers',
  ],
  Mythic: [
    'Cataclysmic World Eaters', 'The Fallen Demi-God', 'Void Sovereign Malakor',
    'Ancient Primordial Dragon Ignis', 'The Star-Devourer', 'Harbinger of the Shattered Sky',
  ],
};

export const ARTIFACT_NAMES = [
  'Amulet of the Sunken King',
  'Tears of the Silver Seraph',
  'Grimoire of Stygian Rites',
  'The Obsidian Heart of Val-Draka',
  'Celestial Astrolabe Shard',
  'Signet Ring of the First Imperator',
  'Crown of Frostfire',
  'Censer of the Banished Hermit',
  'Codex of Primordial Flames',
  'Scepter of the Astral Weaver',
  'Vial of Concentrated Wyrm Venom',
  'The Gilded Phylactery',
];

export const BOUNTY_TARGETS = [
  { name: 'Kaelen "Blood-Eye"', epithet: 'The Red Highwayman', crime: 'ambushing trade caravans and burning granaries' },
  { name: 'Morvath the Pale', epithet: 'Necromancer of the Weeping Fen', crime: 'desecrating family crypts to raise an unholy militia' },
  { name: 'Vashira the Black Blade', epithet: 'Exiled Blade-Dancer', crime: 'assassinating the Chancellor\'s royal envoys' },
  { name: 'Iron-Jawed Gorrok', epithet: 'Chieftain of the Crag Raiders', crime: 'pillaging border settlements and seizing siege engines' },
  { name: 'Lady Eleanor Crane', epithet: 'The False Countess', crime: 'forging sovereign bonds and poisoning guild dignitaries' },
  { name: 'Xylar the Void-Touched', epithet: 'Apostate of the Broken Star', crime: 'sacrificing innocents to open an extraplanar rift' },
];

export const REWARD_ITEMS: Record<ItemRarity, Array<Omit<QuestItem, 'id' | 'rarity'>>> = {
  common: [
    { name: 'Traveler\'s Iron Dagger', type: 'weapon', effect: '+3 Physical Attack', description: 'Standard forged steel, reliable in a pinch.' },
    { name: 'Sturdy Leather Jerkin', type: 'armor', effect: '+5 Armor Rating', description: 'Tough cured hides offering defense without impeding agility.' },
    { name: 'Minor Healing Draught (x3)', type: 'potion', effect: 'Restores 45 HP instantly', description: 'Brewed from wild mountain ginseng and spring water.' },
    { name: 'Adventurer\'s Rations & Torch Bundle', type: 'relic', effect: '+10% Wilderness Stamina', description: 'Essential survival kit for underground ventures.' },
    { name: 'Linen Bandages & Cleansing Salve', type: 'potion', effect: 'Cures Minor Bleed & Poison', description: 'Herbal antiseptic smelling of eucalyptus.' },
  ],
  uncommon: [
    { name: 'Runic Silver Shortsword', type: 'weapon', effect: '+12 Attack, +15% Undead Damage', description: 'Inscribed with luminous silver warding glyphs.' },
    { name: 'Reinforced Mail of the Vanguard', type: 'armor', effect: '+18 Armor, -5% Physical Damage Taken', description: 'Interlocking steel links bearing guild insignia.' },
    { name: 'Ring of Minor Swiftness', type: 'accessory', effect: '+7% Movement Speed, +5 Agility', description: 'Etched with feathers of a hawk in flight.' },
    { name: 'Major Elixir of Mana Flow', type: 'potion', effect: 'Restores 150 MP over 6s', description: 'Shimmers with swirling sapphire stardust.' },
    { name: 'Scroll of Chain Lightning', type: 'scroll', effect: 'Deals 240 Lightning damage jumping to 3 targets', description: 'Parchment crackles when unrolled.' },
  ],
  rare: [
    { name: 'Flametongue Bastard Sword', type: 'weapon', effect: '+35 Attack, Ignites targets for 45 Fire DMG/s', description: 'The forged edge glows like molten charcoal.' },
    { name: 'Cuirass of the Stone Guardian', type: 'armor', effect: '+48 Armor, +200 Max HP, Knockback Immunity', description: 'Hewn from dark granite and enchanted dwarf brass.' },
    { name: 'Pendant of the Astral Wanderer', type: 'accessory', effect: '+18 Magic Power, Teleport Blink (60s CD)', description: 'A miniature gyroscope containing void mist.' },
    { name: 'Tome of Arcane Warding', type: 'scroll', effect: 'Absorbs 400 Elemental Damage', description: 'Bound in treated basilisk leather.' },
    { name: 'Flask of Dragon\'s Blood Extract', type: 'potion', effect: '+25% All Attributes for 10 minutes', description: 'Warm to the touch, burns fiercely down the throat.' },
  ],
  epic: [
    { name: 'Frostfall, the Glacial Cleaver', type: 'weapon', effect: '+75 Attack, 25% chance to Freeze target solid for 3s', description: 'Forged within the heart of an eternal blizzard.' },
    { name: 'Dragonscale Hauberk of the Warlord', type: 'armor', effect: '+95 Armor, 30% Fire & Frost Resistance, +15% Crits', description: 'Crafted from the molted scales of an adult red wyrm.' },
    { name: 'Ring of Sovereign Command', type: 'accessory', effect: '+28 All Stats, Inspires party with +15% Damage aura', description: 'Set with a glowing sunstone bearing royal engravings.' },
    { name: 'Signet of the Void Walker', type: 'accessory', effect: 'Phase through physical attacks for 2.5s on taking lethal damage', description: 'Hums with dark matter frequency.' },
    { name: 'Scroll of Cataclysmic Rain', type: 'scroll', effect: 'Summons meteor storm dealing 1,200 Fire/Physical AoE', description: 'Ink written in dried titan ichor.' },
  ],
  legendary: [
    { name: 'Sol-Aethel, the Sunken Sun', type: 'weapon', effect: '+160 Holy Attack, Emits Radiance Blinding fiends, +50% Boss Damage', description: 'An ancient relic wielded during the First God War.' },
    { name: 'Aegis of the Eternal Bulwark', type: 'armor', effect: '+180 Armor, Blocks 50% all incoming damage, Grants 1 Revive', description: 'Indestructible shield blessed by the Dawn Goddess.' },
    { name: 'Crown of the Astral Demiurge', type: 'accessory', effect: '+60 Intellect, Infinite Mana for 8 seconds after casting Ultimate', description: 'Floating crown of starlight particles above the wearer\'s brow.' },
    { name: 'Phial of Primordial Amrita', type: 'potion', effect: 'Permanently increases all base attributes by +15', description: 'Golden nectar said to have dropped from the World Tree.' },
  ],
};
