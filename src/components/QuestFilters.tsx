import React from 'react';
import { BIOMES, getDifficultyForLevel } from '../utils/questData';
import { GenerationOptions, QuestDifficulty, QuestType } from '../types/quest';
import { difficultyBadgeColor, getQuestTypeIcon } from './QuestCard';
import { Dices, Filter, SlidersHorizontal, Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '../utils/audio';

interface QuestFiltersProps {
  options: GenerationOptions;
  onChangeOptions: (opts: GenerationOptions) => void;
  onRollOne: () => void;
  onRollBoard: (count: number) => void;
  boardCount: number;
}

const TIER_PRESETS: Array<{ label: string; min: number; max: number; tier: QuestDifficulty }> = [
  { label: 'Novice (1-10)', min: 1, max: 10, tier: 'Novice' },
  { label: 'Apprentice (11-25)', min: 11, max: 25, tier: 'Apprentice' },
  { label: 'Adept (26-45)', min: 26, max: 45, tier: 'Adept' },
  { label: 'Veteran (46-70)', min: 46, max: 70, tier: 'Veteran' },
  { label: 'Champion (71-90)', min: 71, max: 90, tier: 'Champion' },
  { label: 'Mythic (91-100)', min: 91, max: 100, tier: 'Mythic' },
];

const QUEST_TYPES: Array<{ id: QuestType | 'all'; label: string }> = [
  { id: 'all', label: 'All Quest Types' },
  { id: 'hunt', label: 'Beast Hunt' },
  { id: 'retrieval', label: 'Relic Retrieval' },
  { id: 'bounty', label: 'Bounty Warrant' },
  { id: 'dungeon', label: 'Dungeon Delve' },
  { id: 'investigation', label: 'Investigation' },
  { id: 'escort', label: 'Caravan Escort' },
  { id: 'defense', label: 'Fort Defense' },
];

export const QuestFilters: React.FC<QuestFiltersProps> = ({
  options,
  onChangeOptions,
  onRollOne,
  onRollBoard,
  boardCount,
}) => {
  const [muted, setMuted] = React.useState(!isSoundEnabled());
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const currentLevel = options.exactLevel || 25;
  const currentDiff = getDifficultyForLevel(currentLevel);
  const diffStyle = difficultyBadgeColor[currentDiff];

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundEnabled(!next);
  };

  return (
    <div
      id="quest-generator-controls"
      className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5 backdrop-blur-md"
    >
      {/* Primary Action Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            id="btn-roll-single-quest"
            onClick={onRollOne}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>Roll 1 Quest</span>
          </button>

          <button
            id="btn-roll-board-quests"
            onClick={() => onRollBoard(boardCount)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 font-semibold text-sm tracking-wide shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Generate Notice Board ({boardCount})</span>
          </button>
        </div>

        {/* Right Auxiliaries */}
        <div className="flex items-center gap-2">
          {/* Board size selector */}
          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-xs font-medium text-slate-400">
            <span className="px-2 py-1 text-[11px] text-slate-500 hidden sm:inline">Notices:</span>
            {[3, 4, 6].map((num) => (
              <button
                key={num}
                id={`btn-board-size-${num}`}
                onClick={() => onRollBoard(num)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  boardCount === num
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'hover:text-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            id="btn-toggle-advanced-filters"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              showAdvanced
                ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle advanced parameters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            id="btn-toggle-sound"
            onClick={toggleMute}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Recommended Level Slider Bar */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Recommended Level Scale
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${diffStyle.badge}`}>
              Level {currentLevel} • {currentDiff}
            </span>
          </div>

          {/* Quick Tier Shortcuts */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {TIER_PRESETS.map((p) => (
              <button
                key={p.tier}
                id={`btn-preset-tier-${p.tier.toLowerCase()}`}
                onClick={() => {
                  onChangeOptions({
                    ...options,
                    exactLevel: p.min + Math.floor((p.max - p.min) / 2),
                    difficulty: p.tier,
                  });
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  currentDiff === p.tier
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {p.tier}
              </button>
            ))}
          </div>
        </div>

        {/* Range slider */}
        <div className="space-y-1">
          <input
            id="slider-recommended-level"
            type="range"
            min={1}
            max={100}
            value={currentLevel}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChangeOptions({
                ...options,
                exactLevel: val,
                difficulty: getDifficultyForLevel(val),
              });
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Lv. 1 (Novice)</span>
            <span>Lv. 25 (Apprentice)</span>
            <span>Lv. 50 (Veteran)</span>
            <span>Lv. 75 (Champion)</span>
            <span>Lv. 100 (Mythic)</span>
          </div>
        </div>
      </div>

      {/* Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          {/* Quest Type Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Quest Archetype
            </label>
            <select
              id="select-quest-type-filter"
              value={options.type || 'all'}
              onChange={(e) => {
                onChangeOptions({
                  ...options,
                  type: e.target.value as QuestType | 'all',
                });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {QUEST_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Biome Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
              Region & Biome
            </label>
            <select
              id="select-biome-filter"
              value={options.biome || 'all'}
              onChange={(e) => {
                onChangeOptions({
                  ...options,
                  biome: e.target.value,
                });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Any Realm / Biome</option>
              {BIOMES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Reward Focus */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
              Reward Bias
            </label>
            <select
              id="select-reward-focus"
              value={options.rewardFocus || 'balanced'}
              onChange={(e) => {
                onChangeOptions({
                  ...options,
                  rewardFocus: e.target.value as GenerationOptions['rewardFocus'],
                });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="balanced">Balanced (Standard Tables)</option>
              <option value="gold">Gold Heavy (+60% GP)</option>
              <option value="items">Loot Hoarder (Extra Items)</option>
              <option value="exp">Scholar / EXP Boost (+50% EXP)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
