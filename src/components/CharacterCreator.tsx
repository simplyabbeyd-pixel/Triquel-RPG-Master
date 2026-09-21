import React, { useState } from 'react';
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
  RACES,
  SKIN_TONES,
} from '../utils/characterData';
import {
  calculateArmorClass,
  calculateMaxHP,
  formatModifier,
  generateRandomCharacter,
  getModifier,
  getRandomName,
} from '../utils/characterGenerator';
import { CharacterAvatar } from './CharacterAvatar';
import { StatRoller } from './StatRoller';
import { playCoinChime, playDiceRollSound, playSuccessChime } from '../utils/audio';
import {
  Shield,
  Heart,
  Zap,
  Footprints,
  Sparkles,
  Dices,
  Save,
  FileText,
  User,
  Swords,
  Palette,
  Scroll,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Wand2,
} from 'lucide-react';

interface CharacterCreatorProps {
  onSaveCharacter: (character: Character) => void;
  onViewSheet: (character: Character) => void;
  initialCharacter?: Character | null;
}

type TabKey = 'race' | 'class' | 'appearance' | 'stats' | 'background';

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  onSaveCharacter,
  onViewSheet,
  initialCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('race');

  // Working character state
  const [race, setRace] = useState<RaceType>(initialCharacter?.race || 'Human');
  const [classNameType, setClassNameType] = useState<ClassType>(
    initialCharacter?.class || 'Warrior'
  );
  const [subclass, setSubclass] = useState<string>(
    initialCharacter?.subclass || CLASSES['Warrior'].subclasses[0]
  );
  const [name, setName] = useState<string>(
    initialCharacter?.name || getRandomName('Human')
  );

  const [appearance, setAppearance] = useState<Appearance>(
    initialCharacter?.appearance || {
      hairColor: HAIR_COLORS[0].hex,
      hairColorName: HAIR_COLORS[0].name,
      hairStyle: 'Short Crop',
      eyeColor: EYE_COLORS[3].hex,
      eyeColorName: EYE_COLORS[3].name,
      skinTone: SKIN_TONES[1].hex,
      skinToneName: SKIN_TONES[1].name,
      build: 'Athletic',
      height: '5\' 11"',
      weight: '175 lbs',
      age: 24,
      gender: 'Male',
      distinguishingFeature: DISTINGUISHING_FEATURES[0],
    }
  );

  const [stats, setStats] = useState<AbilityScores>(
    initialCharacter?.stats || {
      str: 15,
      dex: 14,
      con: 13,
      int: 12,
      wis: 10,
      cha: 8,
    }
  );

  const [background, setBackground] = useState<BackgroundType>(
    initialCharacter?.background || 'Folk Hero'
  );
  const [alignment, setAlignment] = useState<Alignment>(
    initialCharacter?.alignment || 'Neutral Good'
  );
  const [personalityTrait, setPersonalityTrait] = useState<string>(
    initialCharacter?.personalityTrait ||
      'I face problems head-on and never back down from protecting the innocent.'
  );
  const [ideal, setIdeal] = useState<string>(
    initialCharacter?.ideal ||
      'Honor. If I fail to uphold my word, I lose the only thing that truly belongs to me.'
  );
  const [bond, setBond] = useState<string>(
    initialCharacter?.bond ||
      'I protect those who cannot protect themselves, remembering where I came from.'
  );
  const [flaw, setFlaw] = useState<string>(
    initialCharacter?.flaw ||
      'I harbor a secret grudge against tyrant barons and act rashly in their presence.'
  );
  const [backstory, setBackstory] = useState<string>(
    initialCharacter?.backstory ||
      'Forged through trials in the frontier lands, this hero embarks into perilous dungeons to carve their name into tavern songs.'
  );

  const [saveAlert, setSaveAlert] = useState(false);

  // Derived combat attributes
  const raceData = RACES[race];
  const classData = CLASSES[classNameType];
  const finalDex = stats.dex + (raceData.statBonuses.dex || 0);
  const initiative = getModifier(finalDex);
  const maxHP = calculateMaxHP(classNameType, stats, race, 1);
  const armorClass = calculateArmorClass(classNameType, stats, race);

  const handleRandomizeAll = () => {
    playDiceRollSound();
    const hero = generateRandomCharacter();
    setRace(hero.race);
    setClassNameType(hero.class);
    setSubclass(hero.subclass || CLASSES[hero.class].subclasses[0]);
    setName(hero.name);
    setAppearance(hero.appearance);
    setStats(hero.stats);
    setBackground(hero.background);
    setAlignment(hero.alignment);
    setPersonalityTrait(hero.personalityTrait);
    setIdeal(hero.ideal);
    setBond(hero.bond);
    setFlaw(hero.flaw);
    setBackstory(hero.backstory);
    playSuccessChime();
  };

  const handleRollRandomName = () => {
    playDiceRollSound();
    setName(getRandomName(race));
  };

  const buildCurrentCharacter = (): Character => {
    return {
      id: initialCharacter?.id || `char_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || 'Nameless Adventurer',
      level: 1,
      race,
      class: classNameType,
      subclass,
      appearance,
      stats,
      background,
      alignment,
      personalityTrait,
      ideal,
      bond,
      flaw,
      backstory,
      hpMax: maxHP,
      hpCurrent: maxHP,
      armorClass,
      gold: 60,
      equipment: [...classData.startingEquipment],
      createdAt: initialCharacter?.createdAt || Date.now(),
    };
  };

  const handleSave = () => {
    const char = buildCurrentCharacter();
    onSaveCharacter(char);
    playCoinChime();
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleInspectSheet = () => {
    const char = buildCurrentCharacter();
    onViewSheet(char);
  };

  const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
    { key: 'race', label: '1. Race & Heritage', icon: <User className="w-4 h-4" /> },
    { key: 'class', label: '2. Class & Vocation', icon: <Swords className="w-4 h-4" /> },
    { key: 'appearance', label: '3. Appearance', icon: <Palette className="w-4 h-4" /> },
    { key: 'stats', label: '4. Ability Scores', icon: <Dices className="w-4 h-4" /> },
    { key: 'background', label: '5. Lore & Backstory', icon: <Scroll className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-black text-amber-200">
                Hero Forge & Character Creation
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                Tabletop RPG (5e / d20)
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Customize lineage, vocation, physique, abilities, and lore to forge your tabletop hero.
            </p>
          </div>
        </div>

        {/* TOP BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="randomize-hero-btn"
            type="button"
            onClick={handleRandomizeAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-600/30 font-medium text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Randomize Hero
          </button>

          <button
            id="view-sheet-btn"
            type="button"
            onClick={handleInspectSheet}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Character Sheet
          </button>

          <button
            id="save-hero-btn"
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Hero to Roster
          </button>
        </div>
      </div>

      {saveAlert && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Hero <strong>{name}</strong> saved to your active party roster! You can inspect or export their sheet anytime.
            </span>
          </div>
          <button
            type="button"
            onClick={handleInspectSheet}
            className="text-xs font-bold underline text-emerald-300 hover:text-emerald-100 cursor-pointer"
          >
            Open Sheet →
          </button>
        </div>
      )}

      {/* TWO COLUMN WORKSPACE: LEFT LIVE HERO PREVIEW, RIGHT TAB CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: HERO OVERVIEW & AVATAR (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl flex flex-col items-center text-center">
            {/* NAME INPUT WITH DIE REROLL */}
            <div className="w-full mb-4">
              <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5 text-left">
                Hero Name & Identity
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hero-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter hero name..."
                  className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-hidden text-stone-100 font-serif font-bold text-base px-3 py-2 rounded-xl"
                />
                <button
                  id="reroll-name-btn"
                  type="button"
                  onClick={handleRollRandomName}
                  title="Generate fantasy name for race"
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-amber-400 transition cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DYNAMIC SVG PORTRAIT */}
            <CharacterAvatar
              race={race}
              classNameType={classNameType}
              appearance={appearance}
              size="lg"
              showDetails
            />

            {/* SUMMARY BADGE */}
            <div className="mt-4 w-full pt-4 border-t border-stone-800">
              <div className="text-sm font-serif font-bold text-amber-200">
                {race} • {classNameType}
              </div>
              <div className="text-xs text-stone-400 font-mono mt-0.5">
                {alignment} • {background}
              </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-4 gap-2 w-full mt-4">
              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex flex-col items-center">
                <Shield className="w-3.5 h-3.5 text-blue-400 mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">AC</span>
                <span className="text-base font-mono font-bold text-stone-200">
                  {armorClass}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex flex-col items-center">
                <Heart className="w-3.5 h-3.5 text-rose-400 mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">HP</span>
                <span className="text-base font-mono font-bold text-stone-200">
                  {maxHP}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex flex-col items-center">
                <Zap className="w-3.5 h-3.5 text-amber-400 mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">INIT</span>
                <span className="text-base font-mono font-bold text-stone-200">
                  {formatModifier(initiative)}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 flex flex-col items-center">
                <Footprints className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                <span className="text-[10px] text-stone-400 uppercase">SPD</span>
                <span className="text-base font-mono font-bold text-stone-200">
                  {raceData.speed}ft
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STEP-BY-STEP CUSTOMIZATION TABS (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* TAB BAR */}
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 rounded-2xl bg-stone-900 border border-stone-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={`tab-btn-${tab.key}`}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT PANELS */}
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl min-h-[480px]">
            {/* TAB 1: RACE & HERITAGE */}
            {activeTab === 'race' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-200">
                    Choose Heritage & Race
                  </h3>
                  <p className="text-xs text-stone-400">
                    Each race grants ability score bonuses, sensory gifts (like Darkvision), and unique ancestral traits.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.keys(RACES) as RaceType[]).map((rKey) => {
                    const r = RACES[rKey];
                    const isSelected = race === rKey;
                    return (
                      <button
                        key={rKey}
                        id={`race-btn-${rKey}`}
                        type="button"
                        onClick={() => {
                          setRace(rKey);
                          playDiceRollSound();
                        }}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-600/15 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                        }`}
                      >
                        <div className="font-serif font-bold text-sm mb-1">{r.name}</div>
                        <div className="text-[11px] text-stone-400 line-clamp-2 leading-tight">
                          {r.tagline}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* SELECTED RACE DETAILS */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-serif font-bold text-amber-300">
                      {raceData.name} Ancestry Lore
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        Size: {raceData.size}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        Speed: {raceData.speed} ft
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        Lifespan: {raceData.typicalLifespan}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {raceData.description}
                  </p>

                  <div>
                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold block mb-1">
                      Racial Traits & Feats:
                    </span>
                    <ul className="space-y-1">
                      {raceData.traits.map((t, idx) => (
                        <li key={idx} className="text-xs text-stone-300 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('class')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Next: Choose Class <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CLASS & VOCATION */}
            {activeTab === 'class' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-200">
                    Select Vocation & Class
                  </h3>
                  <p className="text-xs text-stone-400">
                    Your class is the primary definition of what your character can do in combat, dungeon delving, and spellcasting.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.keys(CLASSES) as ClassType[]).map((cKey) => {
                    const c = CLASSES[cKey];
                    const isSelected = classNameType === cKey;
                    return (
                      <button
                        key={cKey}
                        id={`class-btn-${cKey}`}
                        type="button"
                        onClick={() => {
                          setClassNameType(cKey);
                          setSubclass(c.subclasses[0]);
                          playDiceRollSound();
                        }}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-600/15 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                        }`}
                      >
                        <div className="font-serif font-bold text-sm mb-1">{c.name}</div>
                        <div className="text-[11px] text-stone-400 line-clamp-2 leading-tight">
                          {c.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* SELECTED CLASS DETAILS */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-amber-300">
                        {classData.name} Overview
                      </h4>
                      <p className="text-xs text-stone-400">{classData.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-rose-300 border border-rose-900/50">
                        Hit Die: d{classData.hitDie}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-blue-300 border border-blue-900/50">
                        Saves: {classData.savingThrows.join(', ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Subclass specialization */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                      Archetype / Subclass:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {classData.subclasses.map((sc) => (
                        <button
                          key={sc}
                          type="button"
                          onClick={() => setSubclass(sc)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            subclass === sc
                              ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                              : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-500'
                          }`}
                        >
                          {sc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-800 text-xs">
                    <div>
                      <span className="font-mono text-amber-400 font-bold block mb-1">
                        Class Features:
                      </span>
                      <ul className="space-y-0.5 text-stone-300">
                        {classData.features.map((f, i) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-mono text-amber-400 font-bold block mb-1">
                        Starting Loadout:
                      </span>
                      <ul className="space-y-0.5 text-stone-400">
                        {classData.startingEquipment.map((eq, i) => (
                          <li key={i}>• {eq}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('race')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Race
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('appearance')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Next: Appearance <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: BASIC APPEARANCE CUSTOMIZATION */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-200">
                    Basic Appearance Customization
                  </h3>
                  <p className="text-xs text-stone-400">
                    Sculpt your hero’s hair color, eye color, build, and distinctive facial traits. The portrait on the left updates in real time!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* HAIR COLOR */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                      Hair Color: <span className="text-amber-400 font-normal">{appearance.hairColorName}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map((hc) => (
                        <button
                          key={hc.name}
                          type="button"
                          onClick={() => {
                            setAppearance({
                              ...appearance,
                              hairColor: hc.hex,
                              hairColorName: hc.name,
                            });
                          }}
                          title={hc.name}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${
                            appearance.hairColorName === hc.name
                              ? 'border-amber-400 scale-110 ring-2 ring-amber-400/40'
                              : 'border-stone-600'
                          }`}
                          style={{ backgroundColor: hc.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* EYE COLOR */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                      Eye Color: <span className="text-amber-400 font-normal">{appearance.eyeColorName}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {EYE_COLORS.map((ec) => (
                        <button
                          key={ec.name}
                          type="button"
                          onClick={() => {
                            setAppearance({
                              ...appearance,
                              eyeColor: ec.hex,
                              eyeColorName: ec.name,
                            });
                          }}
                          title={ec.name}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${
                            appearance.eyeColorName === ec.name
                              ? 'border-amber-400 scale-110 ring-2 ring-amber-400/40'
                              : 'border-stone-600'
                          }`}
                          style={{ backgroundColor: ec.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* SKIN TONE */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                      Complexion & Skin Tone: <span className="text-amber-400 font-normal">{appearance.skinToneName}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SKIN_TONES.map((st) => (
                        <button
                          key={st.name}
                          type="button"
                          onClick={() => {
                            setAppearance({
                              ...appearance,
                              skinTone: st.hex,
                              skinToneName: st.name,
                            });
                          }}
                          title={st.name}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${
                            appearance.skinToneName === st.name
                              ? 'border-amber-400 scale-110 ring-2 ring-amber-400/40'
                              : 'border-stone-600'
                          }`}
                          style={{ backgroundColor: st.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* HAIR STYLE */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                      Hairstyle: <span className="text-amber-400 font-normal">{appearance.hairStyle}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {HAIR_STYLES.map((hs) => (
                        <button
                          key={hs}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, hairStyle: hs })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition cursor-pointer ${
                            appearance.hairStyle === hs
                              ? 'bg-amber-600/20 border-amber-500 text-amber-200 font-bold'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {hs}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BUILD & PHYSIQUE */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                    Build & Physique:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUILDS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setAppearance({ ...appearance, build: b.id })}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          appearance.build === b.id
                            ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-stone-200">{b.label}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{b.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* DISTINGUISHING MARKS */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                    Distinguishing Mark / Scar:
                  </label>
                  <select
                    value={appearance.distinguishingFeature}
                    onChange={(e) =>
                      setAppearance({ ...appearance, distinguishingFeature: e.target.value })
                    }
                    className="w-full bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded-xl px-3 py-2 font-mono focus:border-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    {DISTINGUISHING_FEATURES.map((df) => (
                      <option key={df} value={df}>
                        {df}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DEMOGRAPHICS: HEIGHT, WEIGHT, AGE, GENDER */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1">
                      Height
                    </label>
                    <input
                      type="text"
                      value={appearance.height}
                      onChange={(e) => setAppearance({ ...appearance, height: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs px-2.5 py-1.5 rounded-lg font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={appearance.weight}
                      onChange={(e) => setAppearance({ ...appearance, weight: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs px-2.5 py-1.5 rounded-lg font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={appearance.age}
                      onChange={(e) =>
                        setAppearance({ ...appearance, age: Number(e.target.value) || 20 })
                      }
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs px-2.5 py-1.5 rounded-lg font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1">
                      Gender / Identity
                    </label>
                    <input
                      type="text"
                      value={appearance.gender}
                      onChange={(e) => setAppearance({ ...appearance, gender: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs px-2.5 py-1.5 rounded-lg font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('class')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('stats')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Next: Ability Scores <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: ABILITY SCORES & DICE ROLLER */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-200">
                    Ability Scores & Stat Generation
                  </h3>
                  <p className="text-xs text-stone-400">
                    Roll using authentic tabletop 4d6 (drop lowest), assign standard array, or distribute 27 point-buy points.
                  </p>
                </div>

                <StatRoller stats={stats} race={race} onChange={(s) => setStats(s)} />

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('appearance')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Appearance
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('background')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Next: Lore & Alignment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: LORE, BACKGROUND & ALIGNMENT */}
            {activeTab === 'background' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-200">
                    Background, Alignment & Lore
                  </h3>
                  <p className="text-xs text-stone-400">
                    Define the origins, ethical compass, ideals, and narrative hook that drive your character into adventure.
                  </p>
                </div>

                {/* BACKGROUND SELECTOR */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                    Background Origin:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(BACKGROUNDS) as BackgroundType[]).map((bgKey) => {
                      const bg = BACKGROUNDS[bgKey];
                      const isSelected = background === bgKey;
                      return (
                        <button
                          key={bgKey}
                          type="button"
                          onClick={() => setBackground(bgKey)}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-600/20 border-amber-500 text-amber-200 font-bold'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-stone-200">{bg.name}</div>
                          <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                            {bg.feature.split(':')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-300">
                    <strong className="text-amber-400">
                      {BACKGROUNDS[background].feature.split(':')[0]}:
                    </strong>{' '}
                    {BACKGROUNDS[background].feature.split(':')[1]}
                  </div>
                </div>

                {/* ALIGNMENT MATRIX */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-2">
                    Moral Alignment (3x3):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ALIGNMENTS.map((al) => (
                      <button
                        key={al.id}
                        type="button"
                        onClick={() => setAlignment(al.id)}
                        className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                          alignment === al.id
                            ? 'bg-amber-600/25 border-amber-500 text-amber-200'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-stone-200">{al.name.split(' ')[0]} {al.name.split(' ')[1]}</div>
                        <div className="text-[10px] text-stone-400 line-clamp-1">{al.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PERSONALITY TRAIT & IDEAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                      Personality Trait
                    </label>
                    <textarea
                      rows={2}
                      value={personalityTrait}
                      onChange={(e) => setPersonalityTrait(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs p-2.5 rounded-xl font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                      Core Ideal
                    </label>
                    <textarea
                      rows={2}
                      value={ideal}
                      onChange={(e) => setIdeal(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs p-2.5 rounded-xl font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* BOND & FLAW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                      Bond
                    </label>
                    <textarea
                      rows={2}
                      value={bond}
                      onChange={(e) => setBond(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs p-2.5 rounded-xl font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                      Flaw
                    </label>
                    <textarea
                      rows={2}
                      value={flaw}
                      onChange={(e) => setFlaw(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs p-2.5 rounded-xl font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* BACKSTORY */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                    Backstory / Origin Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs p-2.5 rounded-xl font-serif focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('stats')}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Stats
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleInspectSheet}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-medium text-xs border border-amber-600/30 cursor-pointer"
                    >
                      View Tabletop Sheet
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-lg cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Save & Complete Hero
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
