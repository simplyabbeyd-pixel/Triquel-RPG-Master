import React from 'react';
import { Character } from '../types/character';
import { CharacterAvatar } from './CharacterAvatar';
import { RACES, CLASSES, ALIGNMENTS, BACKGROUNDS } from '../utils/characterData';
import { formatModifier, getModifier } from '../utils/characterGenerator';
import {
  Shield,
  Heart,
  Zap,
  Footprints,
  Sparkles,
  Printer,
  Download,
  X,
  Scroll,
  User,
  Swords,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CharacterSheetModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({
  character,
  isOpen,
  onClose,
}) => {
  const { isParchment } = useTheme();

  if (!isOpen || !character) return null;

  const raceInfo = RACES[character.race];
  const classInfo = CLASSES[character.class];

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${character.name.toLowerCase().replace(/\s+/g, '_')}_sheet.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const stats = [
    { key: 'str', label: 'STR', name: 'Strength', score: character.stats.str, bonus: raceInfo.statBonuses.str || 0 },
    { key: 'dex', label: 'DEX', name: 'Dexterity', score: character.stats.dex, bonus: raceInfo.statBonuses.dex || 0 },
    { key: 'con', label: 'CON', name: 'Constitution', score: character.stats.con, bonus: raceInfo.statBonuses.con || 0 },
    { key: 'int', label: 'INT', name: 'Intelligence', score: character.stats.int, bonus: raceInfo.statBonuses.int || 0 },
    { key: 'wis', label: 'WIS', name: 'Wisdom', score: character.stats.wis, bonus: raceInfo.statBonuses.wis || 0 },
    { key: 'cha', label: 'CHA', name: 'Charisma', score: character.stats.cha, bonus: raceInfo.statBonuses.cha || 0 },
  ];

  return (
    <div
      id="character-sheet-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="character-sheet-modal"
        className={`relative w-full max-w-4xl rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all my-8 ${
          isParchment
            ? 'bg-[#fffdf9] border-[#d5c7a9] text-[#292524]'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Top Close & Action Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-inherit gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-cinzel)' }} className="text-xl font-bold">
                Tabletop Character Dossier
              </h2>
              <p className="text-xs opacity-75">
                Standard 5e-Compatible Adventurer Sheet • Level {character.level}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Print Character Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleExportJSON}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Download JSON Export"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sheet Content */}
        <div className="mt-6 space-y-6">
          {/* Header Banner: Name & Basic Attributes */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl border border-inherit bg-slate-950/40">
            <div className="shrink-0">
              <CharacterAvatar
                race={character.race}
                classNameType={character.class}
                appearance={character.appearance}
                size={110}
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h3 style={{ fontFamily: 'var(--font-cinzel)' }} className="text-2xl font-black">
                  {character.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Level {character.level} {character.race}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div>
                  <span className="opacity-60 block text-[10px] uppercase font-mono">Class & Archetype</span>
                  <span className="font-semibold">{character.class} ({character.subclass})</span>
                </div>
                <div>
                  <span className="opacity-60 block text-[10px] uppercase font-mono">Background</span>
                  <span className="font-semibold">{character.background}</span>
                </div>
                <div>
                  <span className="opacity-60 block text-[10px] uppercase font-mono">Moral Alignment</span>
                  <span className="font-semibold">{character.alignment}</span>
                </div>
                <div>
                  <span className="opacity-60 block text-[10px] uppercase font-mono">Physique</span>
                  <span className="font-semibold">{character.appearance.build} ({character.appearance.height})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combat vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl border border-inherit bg-slate-950/30">
              <div className="flex items-center justify-center gap-1.5 text-blue-500 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Armor Class</span>
              </div>
              <div className="text-2xl font-black">{character.armorClass}</div>
            </div>

            <div className="p-3 rounded-xl border border-inherit bg-slate-950/30">
              <div className="flex items-center justify-center gap-1.5 text-rose-500 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Max Hit Points</span>
              </div>
              <div className="text-2xl font-black">{character.maxHP}</div>
            </div>

            <div className="p-3 rounded-xl border border-inherit bg-slate-950/30">
              <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Initiative</span>
              </div>
              <div className="text-2xl font-black">
                {formatModifier(getModifier(character.stats.dex + (raceInfo.statBonuses.dex || 0)))}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-inherit bg-slate-950/30">
              <div className="flex items-center justify-center gap-1.5 text-emerald-500 mb-1">
                <Footprints className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Speed</span>
              </div>
              <div className="text-2xl font-black">{character.speed} ft</div>
            </div>
          </div>

          {/* Ability Scores Grid */}
          <div>
            <h4 className="text-xs uppercase font-mono opacity-60 tracking-wider mb-2.5 font-bold">
              Core Ability Scores & Modifiers
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {stats.map((s) => {
                const totalScore = s.score + s.bonus;
                const mod = getModifier(totalScore);
                return (
                  <div
                    key={s.key}
                    className="p-3 rounded-xl border border-inherit bg-slate-950/30 text-center flex flex-col items-center justify-between"
                  >
                    <span className="text-[10px] font-mono font-bold opacity-75">{s.label}</span>
                    <div className="text-xl font-black text-amber-500 my-0.5">
                      {formatModifier(mod)}
                    </div>
                    <span className="text-xs font-mono opacity-80">
                      {totalScore}
                      {s.bonus > 0 && <span className="text-[10px] text-emerald-500 ml-0.5">(+{s.bonus})</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features, Equipment & Narrative */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Features & Traits */}
            <div className="p-4 rounded-xl border border-inherit bg-slate-950/20 space-y-3">
              <h4 className="text-xs uppercase font-mono font-bold text-amber-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Features & Proficiencies
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold">{raceInfo.name} Racial Trait:</span>{' '}
                  <span className="opacity-80">{raceInfo.trait}</span>
                </div>
                <div>
                  <span className="font-semibold">{classInfo.name} Core Feature:</span>{' '}
                  <span className="opacity-80">{classInfo.feature}</span>
                </div>
                <div>
                  <span className="font-semibold">Starting Gear:</span>{' '}
                  <span className="opacity-80">{classInfo.defaultEquipment.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Backstory & Roleplay Notes */}
            <div className="p-4 rounded-xl border border-inherit bg-slate-950/20 space-y-3">
              <h4 className="text-xs uppercase font-mono font-bold text-amber-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Backstory & Persona
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold">Personality Trait:</span>{' '}
                  <span className="opacity-80 italic">"{character.personalityTrait}"</span>
                </div>
                <div>
                  <span className="font-semibold">Ideals:</span>{' '}
                  <span className="opacity-80 italic">"{character.ideal}"</span>
                </div>
                <div className="line-clamp-2">
                  <span className="font-semibold">Narrative:</span>{' '}
                  <span className="opacity-80">{character.backstory}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
