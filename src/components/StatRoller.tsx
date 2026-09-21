import React, { useState } from 'react';
import { AbilityScores, RaceType, StatName } from '../types/character';
import { RACES } from '../utils/characterData';
import { formatModifier, getModifier, roll4d6DropLowest } from '../utils/characterGenerator';
import { playDiceRollSound, playSuccessChime } from '../utils/audio';
import { Dices, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

interface StatRollerProps {
  stats: AbilityScores;
  race: RaceType;
  onChange: (stats: AbilityScores) => void;
}

type GenerationMethod = 'standard' | 'roll4d6' | 'pointbuy';

const STAT_DESCRIPTIONS: Record<StatName, { label: string; desc: string; icon: string }> = {
  str: { label: 'Strength', desc: 'Melee attack power, carrying capacity, athletic feats', icon: '⚔️' },
  dex: { label: 'Dexterity', desc: 'Agility, armor class, initiative, stealth, ranged attacks', icon: '🏹' },
  con: { label: 'Constitution', desc: 'Health points, stamina, concentration, poison resistance', icon: '🛡️' },
  int: { label: 'Intelligence', desc: 'Arcane wizardry, historical lore, investigation, deduction', icon: '📜' },
  wis: { label: 'Wisdom', desc: 'Perception, medicine, divine insight, spiritual connection', icon: '👁️' },
  cha: { label: 'Charisma', desc: 'Persuasion, force of personality, bardic and paladin spellcasting', icon: '👑' },
};

// Point Buy costs (standard 5e: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9)
const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const StatRoller: React.FC<StatRollerProps> = ({ stats, race, onChange }) => {
  const [method, setMethod] = useState<GenerationMethod>('roll4d6');
  const [rollHistory, setRollHistory] = useState<
    Partial<Record<StatName, { rolls: number[]; dropped: number; total: number }>>
  >({});
  const [isRolling, setIsRolling] = useState(false);

  const raceData = RACES[race];
  const statKeys: StatName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  // Calculate remaining points for point buy
  const calculatePointsSpent = (currentStats: AbilityScores) => {
    return statKeys.reduce((acc, k) => acc + (POINT_BUY_COSTS[currentStats[k]] || 0), 0);
  };

  const pointsRemaining = 27 - calculatePointsSpent(stats);

  const handleRollSingle = (stat: StatName) => {
    playDiceRollSound();
    const result = roll4d6DropLowest();
    setRollHistory((prev) => ({ ...prev, [stat]: result }));
    onChange({
      ...stats,
      [stat]: result.total,
    });
  };

  const handleRollAll = () => {
    setIsRolling(true);
    playDiceRollSound();
    setTimeout(() => {
      const newHistory: Partial<
        Record<StatName, { rolls: number[]; dropped: number; total: number }>
      > = {};
      const newStats = { ...stats };

      statKeys.forEach((key) => {
        const res = roll4d6DropLowest();
        newHistory[key] = res;
        newStats[key] = res.total;
      });

      setRollHistory(newHistory);
      onChange(newStats);
      setIsRolling(false);
      playSuccessChime();
    }, 350);
  };

  const applyStandardArray = () => {
    playDiceRollSound();
    const standardScores = [15, 14, 13, 12, 10, 8];
    const newStats: AbilityScores = {
      str: standardScores[0],
      dex: standardScores[1],
      con: standardScores[2],
      int: standardScores[3],
      wis: standardScores[4],
      cha: standardScores[5],
    };
    onChange(newStats);
  };

  const resetPointBuy = () => {
    onChange({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
  };

  const adjustPointBuy = (stat: StatName, delta: number) => {
    const currentVal = stats[stat];
    const targetVal = currentVal + delta;
    if (targetVal < 8 || targetVal > 15) return;

    const currentCost = POINT_BUY_COSTS[currentVal] || 0;
    const targetCost = POINT_BUY_COSTS[targetVal] || 0;
    const costDiff = targetCost - currentCost;

    if (pointsRemaining - costDiff < 0) return;

    playDiceRollSound();
    onChange({
      ...stats,
      [stat]: targetVal,
    });
  };

  return (
    <div className="space-y-6">
      {/* METHOD SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-900/70 border border-stone-700/60 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
            Method:
          </span>
          <div className="flex rounded-lg bg-stone-950 p-1 border border-stone-800">
            <button
              id="stat-method-roll"
              type="button"
              onClick={() => setMethod('roll4d6')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                method === 'roll4d6'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Roll (4d6 Drop Lowest)
            </button>
            <button
              id="stat-method-standard"
              type="button"
              onClick={() => {
                setMethod('standard');
                applyStandardArray();
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                method === 'standard'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Standard Array
            </button>
            <button
              id="stat-method-pointbuy"
              type="button"
              onClick={() => {
                setMethod('pointbuy');
                if (stats.str > 15 || stats.dex > 15 || stats.con > 15) resetPointBuy();
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                method === 'pointbuy'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Point Buy (27 pts)
            </button>
          </div>
        </div>

        {method === 'roll4d6' && (
          <button
            id="roll-all-stats-btn"
            type="button"
            onClick={handleRollAll}
            disabled={isRolling}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            Roll All 6 Abilities
          </button>
        )}

        {method === 'pointbuy' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-300">
              Budget Remaining:{' '}
              <strong className={`font-bold ${pointsRemaining < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                {pointsRemaining} / 27
              </strong>
            </span>
            <button
              type="button"
              onClick={resetPointBuy}
              className="text-[11px] text-stone-400 hover:text-stone-200 underline cursor-pointer"
            >
              Reset to 8s
            </button>
          </div>
        )}
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statKeys.map((key) => {
          const info = STAT_DESCRIPTIONS[key];
          const baseVal = stats[key] || 10;
          const racialBonus = raceData.statBonuses[key] || 0;
          const finalVal = baseVal + racialBonus;
          const mod = getModifier(finalVal);
          const history = rollHistory[key];

          return (
            <div
              key={key}
              className="p-4 rounded-xl bg-stone-900/80 border border-stone-700/60 hover:border-amber-600/40 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-sm font-serif font-bold text-stone-200 uppercase tracking-wide">
                      {info.label} ({key.toUpperCase()})
                    </span>
                  </div>
                  {racialBonus > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      +{racialBonus} {race}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-400 mb-4 leading-relaxed line-clamp-2">
                  {info.desc}
                </p>
              </div>

              {/* STAT VALUE & CONTROLS */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-black text-amber-400">
                    {finalVal}
                  </span>
                  <span
                    className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                      mod >= 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                    }`}
                  >
                    {formatModifier(mod)}
                  </span>
                </div>

                {/* Specific controls per method */}
                {method === 'roll4d6' && (
                  <div className="flex items-center gap-2">
                    {history && (
                      <div className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                        [{history.rolls.map((r, i) => (
                          <span
                            key={i}
                            className={r === history.dropped ? 'line-through text-stone-600 mr-1' : 'text-stone-300 mr-1'}
                          >
                            {r}
                          </span>
                        ))}]
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRollSingle(key)}
                      title="Roll this stat"
                      className="p-2 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-300 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {method === 'pointbuy' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={baseVal <= 8}
                      onClick={() => adjustPointBuy(key, -1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 font-bold font-mono transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs text-stone-300 px-1">
                      {baseVal}
                    </span>
                    <button
                      type="button"
                      disabled={baseVal >= 15 || pointsRemaining <= 0}
                      onClick={() => adjustPointBuy(key, 1)}
                      className="w-7 h-7 rounded bg-amber-600/80 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-bold font-mono transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}

                {method === 'standard' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={baseVal}
                      onChange={(e) => {
                        onChange({ ...stats, [key]: Number(e.target.value) });
                      }}
                      className="bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded px-2 py-1 font-mono focus:border-amber-500 focus:outline-hidden cursor-pointer"
                    >
                      {[15, 14, 13, 12, 10, 8].map((score) => (
                        <option key={score} value={score}>
                          {score}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
