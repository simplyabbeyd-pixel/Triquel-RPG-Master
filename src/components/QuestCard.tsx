import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Coins,
  Compass,
  Copy,
  Edit3,
  Flame,
  HelpCircle,
  MapPin,
  RefreshCw,
  Scroll,
  Shield,
  ShieldAlert,
  Skull,
  Sparkles,
  Swords,
  User,
  Zap,
} from 'lucide-react';
import { Quest, QuestDifficulty, QuestType } from '../types/quest';
import { ItemCard } from './ItemTooltip';
import { exportQuestAsJSON, exportQuestAsMarkdown } from '../utils/questGenerator';
import { playAcceptSound, playCoinSound } from '../utils/audio';

interface QuestCardProps {
  quest: Quest;
  onAccept?: (quest: Quest) => void;
  onReroll?: (questId: string) => void;
  onRerollRewards?: (questId: string) => void;
  onEdit?: (quest: Quest) => void;
  onToggleObjective?: (questId: string, objectiveId: string) => void;
  onCompleteQuest?: (questId: string) => void;
  isJournalView?: boolean;
}

export const difficultyBadgeColor: Record<QuestDifficulty, { badge: string; text: string; ring: string }> = {
  Novice: {
    badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/30',
  },
  Apprentice: {
    badge: 'bg-teal-950/80 text-teal-300 border-teal-600/50',
    text: 'text-teal-400',
    ring: 'ring-teal-500/30',
  },
  Adept: {
    badge: 'bg-sky-950/80 text-sky-300 border-sky-600/50',
    text: 'text-sky-400',
    ring: 'ring-sky-500/30',
  },
  Veteran: {
    badge: 'bg-purple-950/80 text-purple-300 border-purple-600/50',
    text: 'text-purple-400',
    ring: 'ring-purple-500/30',
  },
  Champion: {
    badge: 'bg-amber-950/80 text-amber-300 border-amber-600/50',
    text: 'text-amber-400',
    ring: 'ring-amber-500/30',
  },
  Mythic: {
    badge: 'bg-rose-950/80 text-rose-300 border-rose-600/60 shadow-sm shadow-rose-900/40',
    text: 'text-rose-400',
    ring: 'ring-rose-500/40',
  },
};

export function getQuestTypeIcon(type: QuestType) {
  switch (type) {
    case 'hunt':
      return <Swords className="w-4 h-4 text-rose-400" />;
    case 'retrieval':
      return <Compass className="w-4 h-4 text-sky-400" />;
    case 'dungeon':
      return <Flame className="w-4 h-4 text-amber-400" />;
    case 'bounty':
      return <Skull className="w-4 h-4 text-red-400" />;
    case 'escort':
      return <Shield className="w-4 h-4 text-emerald-400" />;
    case 'investigation':
      return <HelpCircle className="w-4 h-4 text-violet-400" />;
    case 'defense':
      return <ShieldAlert className="w-4 h-4 text-amber-400" />;
    default:
      return <Scroll className="w-4 h-4 text-slate-400" />;
  }
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onAccept,
  onReroll,
  onRerollRewards,
  onEdit,
  onToggleObjective,
  onCompleteQuest,
  isJournalView = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const diffStyle = difficultyBadgeColor[quest.difficulty] || difficultyBadgeColor.Novice;

  const handleCopy = (format: 'markdown' | 'json') => {
    const text = format === 'markdown' ? exportQuestAsMarkdown(quest) : exportQuestAsJSON(quest);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allCompleted = quest.objectives.filter(o => !o.isOptional).every(o => o.completed);

  return (
    <div
      id={`quest-card-${quest.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col justify-between rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-sm group"
    >
      {/* Decorative top parchment seal bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-700/40 via-amber-500/80 to-amber-700/40" />

      {/* Main card body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Type & Level Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700/70 text-xs font-medium text-slate-300">
              {getQuestTypeIcon(quest.type)}
              <span className="capitalize">{quest.type}</span>
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate max-w-[150px] sm:max-w-[200px]" title={quest.location.name}>
                {quest.location.biome}
              </span>
            </span>
          </div>

          {/* Recommended Level & Difficulty Tier */}
          <div className="flex items-center gap-2">
            <span
              id={`quest-level-badge-${quest.id}`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${diffStyle.badge}`}
              title={`Recommended Character Level: ${quest.recommendedLevel}`}
            >
              <span>Lv. {quest.recommendedLevel}</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-60" />
              <span>{quest.difficulty}</span>
            </span>
          </div>
        </div>

        {/* Quest Title */}
        <div>
          <h3
            id={`quest-title-${quest.id}`}
            style={{ fontFamily: 'var(--font-cinzel)' }}
            className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors leading-snug"
          >
            {quest.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-slate-500" />
              <span className="text-slate-300 font-medium">{quest.giver.name}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 truncate max-w-[220px]">{quest.giver.faction}</span>
          </div>
        </div>

        {/* Quest Objective Briefing (Required by prompt) */}
        <div className="rounded-lg bg-slate-950/60 p-3.5 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400/90 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Objective Briefing
            </span>
            {quest.timeEstimate && (
              <span className="text-[10px] text-slate-500 font-mono">Est. {quest.timeEstimate}</span>
            )}
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {quest.summary}
          </p>
        </div>

        {/* Detailed Objective Milestones (Interactive in journal view) */}
        <div className="space-y-1.5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
            <span>Mission Milestones</span>
            {quest.objectives.length > 1 && (
              <span className="text-[10px] text-slate-500">
                {quest.objectives.filter(o => o.completed).length}/{quest.objectives.length} complete
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {quest.objectives.map((obj) => (
              <div
                key={obj.id}
                onClick={() => {
                  if (onToggleObjective) onToggleObjective(quest.id, obj.id);
                }}
                className={`flex items-start gap-2.5 p-2 rounded-md text-xs transition-colors ${
                  onToggleObjective ? 'cursor-pointer hover:bg-slate-800/60' : ''
                } ${obj.completed ? 'bg-emerald-950/20 text-emerald-300 line-through opacity-70' : 'bg-slate-800/30 text-slate-300'}`}
              >
                <div className="shrink-0 mt-0.5">
                  {obj.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 leading-snug">
                  <span>{obj.text}</span>
                  {obj.isOptional && (
                    <span className="ml-1.5 text-[10px] text-amber-400 font-medium uppercase tracking-wide">
                      (Optional)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Rewards Section (Required by prompt: gold, items, etc.) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Potential Rewards
            </span>
            {onRerollRewards && !isJournalView && (
              <button
                id={`btn-reroll-rewards-${quest.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRerollRewards(quest.id);
                }}
                title="Reroll loot & gold rewards"
                className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-800"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Reroll Loot
              </button>
            )}
          </div>

          {/* Currency / EXP Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/30 border border-amber-800/40">
              <div className="p-1 rounded bg-amber-900/40 text-amber-300">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-amber-400/80 uppercase font-semibold">Bounty Gold</div>
                <div className="text-xs font-bold text-amber-200 font-mono">
                  {quest.rewards.gold.toLocaleString()} GP
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-950/30 border border-indigo-800/40">
              <div className="p-1 rounded bg-indigo-900/40 text-indigo-300">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-indigo-400/80 uppercase font-semibold">Experience</div>
                <div className="text-xs font-bold text-indigo-200 font-mono">
                  +{quest.rewards.exp.toLocaleString()} EXP
                </div>
              </div>
            </div>
          </div>

          {/* Item Drops */}
          {quest.rewards.items.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                Equipment & Relic Drops ({quest.rewards.items.length})
              </div>
              <div className="space-y-1.5">
                {quest.rewards.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Bonus Condition / Reputation */}
          {(quest.rewards.reputation || quest.rewards.bonusRewardText) && (
            <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/60 space-y-1">
              {quest.rewards.reputation && (
                <div className="flex items-center justify-between text-slate-300">
                  <span>Reputation:</span>
                  <span className="text-amber-300 font-medium">
                    +{quest.rewards.reputation.amount} ({quest.rewards.reputation.faction})
                  </span>
                </div>
              )}
              {quest.rewards.bonusRewardText && (
                <div className="text-slate-400 italic">
                  {quest.rewards.bonusRewardText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-3 sm:px-5 sm:py-3.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        {/* Left Utilities: Copy, Edit */}
        <div className="flex items-center gap-1">
          <button
            id={`btn-copy-markdown-${quest.id}`}
            onClick={() => handleCopy('markdown')}
            title="Copy quest summary formatted as Markdown (for notes, D&D, Discord)"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {onEdit && !isJournalView && (
            <button
              id={`btn-edit-quest-${quest.id}`}
              onClick={() => onEdit(quest)}
              title="Edit quest details or custom customize"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          {onReroll && !isJournalView && (
            <button
              id={`btn-reroll-quest-${quest.id}`}
              onClick={() => onReroll(quest.id)}
              title="Roll a completely fresh quest for this notice board slot"
              className="p-1.5 rounded-md text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reroll</span>
            </button>
          )}
        </div>

        {/* Right Main Call to Action */}
        <div>
          {!isJournalView && onAccept && (
            <button
              id={`btn-accept-quest-${quest.id}`}
              onClick={() => {
                playAcceptSound();
                onAccept(quest);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs tracking-wide shadow-md hover:shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>Accept Quest</span>
            </button>
          )}

          {isJournalView && onCompleteQuest && (
            <button
              id={`btn-complete-quest-${quest.id}`}
              onClick={() => {
                playCoinSound();
                onCompleteQuest(quest.id);
              }}
              disabled={!allCompleted}
              className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs tracking-wide shadow-md transition-all flex items-center gap-1.5 ${
                allCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95 animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{allCompleted ? 'Claim Reward' : 'Incomplete'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
