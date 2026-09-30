import React, { useState, useMemo } from 'react';
import { Quest, QuestType } from '../types/quest';
import { QuestCard, difficultyBadgeColor, getQuestTypeIcon } from './QuestCard';
import { ItemCard } from './ItemTooltip';
import {
  computeQuestTimeline,
  DEFAULT_COMPLETED_TIMELINE,
} from '../utils/timelineData';
import {
  BookOpen,
  CheckCircle,
  Coins,
  ShieldAlert,
  Sparkles,
  Trash2,
  HardDrive,
  FileSpreadsheet,
  CheckCircle2,
  Award,
  Clock,
  Calendar,
  ArrowUpDown,
  History,
  Trophy,
  RotateCcw,
  Search,
  Filter,
  MapPin,
  User,
  StickyNote,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Swords,
  Scroll,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { playClickSound, playCoinSound } from '../utils/audio';

export interface ActiveJournalProps {
  activeQuests: Quest[];
  completedQuests?: Quest[];
  onToggleObjective: (questId: string, objectiveId: string) => void;
  onCompleteQuest: (questId: string) => void;
  onAbandonQuest: (questId: string) => void;
  playerStats: {
    totalGold: number;
    totalExp: number;
    completedCount: number;
  };
  onSwitchToBoard: () => void;
  onOpenDriveExport?: () => void;
  onOpenSheetsExport?: () => void;
  onUpdateNotes?: (questId: string, notes: string) => void;
  onReopenQuest?: (questId: string) => void;
  onUpdateCompletedNotes?: (questId: string, notes: string) => void;
  onLoadSampleCompleted?: () => void;
  onClearCompletedHistory?: () => void;
}

/**
 * Returns color-coding configuration based on percentage completion
 */
export const getQuestProgressTheme = (percent: number) => {
  if (percent === 100) {
    return {
      barGradient: 'from-emerald-400 via-teal-400 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.5)]',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-sm shadow-emerald-900/50',
      tagText: '100% • All Objectives Met!',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-600/50',
      pulse: true,
    };
  }
  if (percent >= 67) {
    return {
      barGradient: 'from-teal-500 to-emerald-500 shadow-[0_0_8px_rgba(20,184,166,0.3)]',
      badgeBg: 'bg-teal-950/80 text-teal-300 border-teal-500/40',
      tagText: `${percent}% • Near Completion`,
      textColor: 'text-teal-400',
      borderColor: 'border-teal-600/40',
      pulse: false,
    };
  }
  if (percent >= 34) {
    return {
      barGradient: 'from-sky-500 to-indigo-500 shadow-[0_0_8px_rgba(56,189,248,0.3)]',
      badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
      tagText: `${percent}% • In Progress`,
      textColor: 'text-sky-400',
      borderColor: 'border-sky-600/30',
      pulse: false,
    };
  }
  if (percent > 0) {
    return {
      barGradient: 'from-amber-600 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      tagText: `${percent}% • Early Progress`,
      textColor: 'text-amber-400',
      borderColor: 'border-amber-600/30',
      pulse: false,
    };
  }
  return {
    barGradient: 'from-slate-700 to-slate-600',
    badgeBg: 'bg-slate-800/80 text-slate-400 border-slate-700/50',
    tagText: '0% • Not Started',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-800',
    pulse: false,
  };
};

export const ActiveJournal: React.FC<ActiveJournalProps> = ({
  activeQuests,
  completedQuests = [],
  onToggleObjective,
  onCompleteQuest,
  onAbandonQuest,
  playerStats,
  onSwitchToBoard,
  onOpenDriveExport,
  onOpenSheetsExport,
  onUpdateNotes,
  onReopenQuest,
  onUpdateCompletedNotes,
  onLoadSampleCompleted,
  onClearCompletedHistory,
}) => {
  const { isParchment } = useTheme();

  // Sub-view mode: 'active' contracts or 'timeline' of completed quests
  const [viewMode, setViewMode] = useState<'active' | 'timeline'>('active');

  // Timeline filtering and sorting state
  const [timelineSort, setTimelineSort] = useState<'desc' | 'asc'>('desc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expanded details tracking for timeline cards
  const [expandedQuests, setExpandedQuests] = useState<Record<string, boolean>>({});

  // Active notes editing state for timeline cards
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');

  // Calculate aggregated active metrics
  const totalObjectives = activeQuests.reduce((sum, q) => sum + q.objectives.length, 0);
  const completedObjectives = activeQuests.reduce(
    (sum, q) => sum + q.objectives.filter((o) => o.completed).length,
    0
  );
  const overallPercent = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
  const overallTheme = getQuestProgressTheme(overallPercent);

  // Compute rich chronological milestones and cumulative progress over time
  const timelineData = useMemo(() => {
    return computeQuestTimeline(completedQuests, timelineSort);
  }, [completedQuests, timelineSort]);

  // Filtered timeline milestones based on search and type filter
  const filteredMilestones = useMemo(() => {
    return timelineData.milestones.filter((milestone) => {
      const q = milestone.quest;
      const matchesType = typeFilter === 'all' || q.type === typeFilter;
      const qTitle = q.title.toLowerCase();
      const qLoc = `${q.location?.name} ${q.location?.region} ${q.location?.biome}`.toLowerCase();
      const qSummary = (q.summary || '').toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        qTitle.includes(searchQuery.toLowerCase()) ||
        qLoc.includes(searchQuery.toLowerCase()) ||
        qSummary.includes(searchQuery.toLowerCase()) ||
        q.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesSearch;
    });
  }, [timelineData.milestones, typeFilter, searchQuery]);

  const toggleExpand = (questId: string) => {
    playClickSound();
    setExpandedQuests((prev) => ({
      ...prev,
      [questId]: !prev[questId],
    }));
  };

  const handleCopyChronicle = (quest: Quest) => {
    const text = `📜 QUEST CHRONICLE ENTRY: ${quest.title}
Difficulty: ${quest.difficulty} | Level ${quest.recommendedLevel} | Type: ${quest.type.toUpperCase()}
Location: ${quest.location.name} (${quest.location.region})
Giver: ${quest.giver.name}, ${quest.giver.title} (${quest.giver.faction})
Summary: ${quest.summary}
Rewards Claimed: ${quest.rewards.gold} GP, ${quest.rewards.exp} EXP
Loot: ${quest.rewards.items.map((i) => `${i.name} [${i.rarity}]`).join(', ') || 'None'}
Completed Date: ${quest.completedAt ? new Date(quest.completedAt).toLocaleString() : 'N/A'}
${quest.notes ? `Field Notes: ${quest.notes}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopiedId(quest.id);
    playClickSound();
    setTimeout(() => {
      setCopiedId((curr) => (curr === quest.id ? null : curr));
    }, 2000);
  };

  const handleStartEditNotes = (quest: Quest) => {
    setEditingNotesId(quest.id);
    setNotesDraft(quest.notes || '');
  };

  const handleSaveNotes = (questId: string) => {
    if (onUpdateCompletedNotes) {
      onUpdateCompletedNotes(questId, notesDraft);
    }
    setEditingNotesId(null);
    playClickSound();
  };

  return (
    <div id="active-quest-journal-container" className="space-y-6">
      {/* Journal Header Bar with View Switching Tabs */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-xl flex items-center justify-between flex-wrap gap-4 backdrop-blur-md transition-colors ${
          isParchment
            ? 'bg-[#fffdf9]/95 border-[#d6c7ab]'
            : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isParchment
                ? 'bg-[#ede0ca] border-[#d5c7a9] text-[#78350f]'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {viewMode === 'active' ? (
              <BookOpen className="w-5 h-5" />
            ) : (
              <History className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <h2
              style={{ fontFamily: 'var(--font-cinzel)' }}
              className={`text-base font-bold flex items-center gap-2 ${
                isParchment ? 'text-[#231f1d]' : 'text-slate-100'
              }`}
            >
              <span>
                {viewMode === 'active'
                  ? "Adventurer's Active Quest Log"
                  : "Hero's Quest Chronicle & Timeline"}
              </span>
            </h2>
            <div className={`text-xs ${isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'}`}>
              {viewMode === 'active' ? (
                <>
                  {activeQuests.length}{' '}
                  {activeQuests.length === 1 ? 'contract tracked' : 'contracts tracked'} •{' '}
                  {completedObjectives}/{totalObjectives} total objectives resolved
                </>
              ) : (
                <>
                  {completedQuests.length}{' '}
                  {completedQuests.length === 1 ? 'quest completed' : 'quests completed'} recorded
                  chronologically
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Export to Drive & Sheets */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenDriveExport && (
            <button
              id="btn-journal-export-drive"
              type="button"
              onClick={onOpenDriveExport}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer border ${
                isParchment
                  ? 'bg-[#f4ebe1] hover:bg-[#ebdcc8] text-[#78350f] border-[#d5c7a9]'
                  : 'bg-slate-950 hover:bg-slate-850 text-amber-300 border-amber-600/40'
              }`}
              title="Export saved hero profile & quest log summary to Google Drive as PDF or JSON"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-500" />
              <span>Export to Drive</span>
            </button>
          )}

          {onOpenSheetsExport && (
            <button
              id="btn-journal-export-sheets"
              type="button"
              onClick={onOpenSheetsExport}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer border ${
                isParchment
                  ? 'bg-[#f4ebe1] hover:bg-[#ebdcc8] text-[#065f46] border-[#059669]/30'
                  : 'bg-slate-950 hover:bg-slate-850 text-emerald-300 border-emerald-600/40'
              }`}
              title="Export quests and player statistics directly into Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export to Sheets</span>
            </button>
          )}
        </div>

        {/* Career stats pills */}
        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              isParchment ? 'bg-[#f7efe3] border-[#d6c7ab]' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <div className="text-xs">
              <span className={isParchment ? 'text-[#6b5f4f] mr-1' : 'text-slate-400 mr-1'}>
                Earned Gold:
              </span>
              <span className="font-bold text-amber-500 font-mono">
                {playerStats.totalGold.toLocaleString()} GP
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              isParchment ? 'bg-[#f7efe3] border-[#d6c7ab]' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <div className="text-xs">
              <span className={isParchment ? 'text-[#6b5f4f] mr-1' : 'text-slate-400 mr-1'}>
                Earned EXP:
              </span>
              <span className="font-bold text-indigo-400 font-mono">
                {playerStats.totalExp.toLocaleString()}
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              isParchment ? 'bg-[#f7efe3] border-[#d6c7ab]' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <div className="text-xs">
              <span className={isParchment ? 'text-[#6b5f4f] mr-1' : 'text-slate-400 mr-1'}>
                Completed:
              </span>
              <span className="font-bold text-emerald-500 font-mono">
                {completedQuests.length > 0 ? completedQuests.length : playerStats.completedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented View Mode Switcher (Active Contracts vs Chronological Timeline) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div
          role="tablist"
          aria-label="Journal View Modes"
          className={`inline-flex p-1 rounded-xl border backdrop-blur-md ${
            isParchment ? 'bg-[#ebe0cb] border-[#d5c7a9]' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          {/* Active Contracts Tab */}
          <button
            id="tab-btn-active-contracts"
            role="tab"
            aria-selected={viewMode === 'active'}
            type="button"
            onClick={() => {
              playClickSound();
              setViewMode('active');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'active'
                ? isParchment
                  ? 'bg-[#fffdf9] text-[#78350f] shadow-sm border border-[#d5c7a9]'
                  : 'bg-slate-850 text-amber-400 shadow-md border border-amber-600/40'
                : isParchment
                ? 'text-[#6b5f4f] hover:text-[#231f1d]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Active Contracts</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeQuests.length > 0
                  ? isParchment
                    ? 'bg-[#ebdcc2] text-[#78350f]'
                    : 'bg-amber-500/20 text-amber-300'
                  : isParchment
                  ? 'bg-stone-300 text-stone-600'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {activeQuests.length}
            </span>
          </button>

          {/* Chronological Timeline Tab */}
          <button
            id="tab-btn-completed-timeline"
            role="tab"
            aria-selected={viewMode === 'timeline'}
            type="button"
            onClick={() => {
              playClickSound();
              setViewMode('timeline');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? isParchment
                  ? 'bg-[#fffdf9] text-[#065f46] shadow-sm border border-[#059669]/40'
                  : 'bg-slate-850 text-emerald-400 shadow-md border border-emerald-500/40'
                : isParchment
                ? 'text-[#6b5f4f] hover:text-[#231f1d]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Chronological Timeline</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                completedQuests.length > 0
                  ? isParchment
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-emerald-500/20 text-emerald-300'
                  : isParchment
                  ? 'bg-stone-300 text-stone-600'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {completedQuests.length}
            </span>
          </button>
        </div>

        {/* Right side helper info */}
        <div className="text-xs text-slate-400 flex items-center gap-2">
          {viewMode === 'active' ? (
            <span>Contracts in progress with milestone check-offs</span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400/90">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Cumulative rewards tracked chronologically</span>
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: ACTIVE CONTRACTS */}
      {/* ========================================================================= */}
      {viewMode === 'active' && (
        <>
          {/* Aggregate Journal Progress Bar (When there are active quests) */}
          {activeQuests.length > 0 && (
            <div
              id="journal-overall-progress-card"
              className={`p-4 rounded-xl border shadow-lg space-y-2 backdrop-blur-sm transition-colors ${
                isParchment
                  ? 'bg-[#fffdf9]/90 border-[#d6c7ab]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span
                    className={`font-bold uppercase tracking-wider text-[11px] ${
                      isParchment ? 'text-[#231f1d]' : 'text-slate-200'
                    }`}
                  >
                    Total Journal Completion
                  </span>
                  <span
                    className={`text-[11px] ${isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'}`}
                  >
                    ({completedObjectives} of {totalObjectives} objectives complete)
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold border font-mono ${overallTheme.badgeBg}`}
                >
                  {overallTheme.tagText}
                </span>
              </div>

              {/* Progress bar container */}
              <div
                className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${
                  isParchment
                    ? 'bg-[#ede0ca] border-[#d5c7a9]'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${overallTheme.barGradient}`}
                  style={{ width: `${Math.max(overallPercent, 2)}%` }}
                />
              </div>
            </div>
          )}

          {/* Active Quests List */}
          {activeQuests.length === 0 ? (
            <div
              className={`p-12 text-center rounded-2xl border space-y-4 ${
                isParchment
                  ? 'bg-[#fffdf9]/90 border-[#d6c7ab]'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  isParchment
                    ? 'bg-[#ede0ca] text-[#78350f]'
                    : 'bg-slate-850 text-slate-400'
                }`}
              >
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                  className={`text-lg font-bold ${
                    isParchment ? 'text-[#231f1d]' : 'text-slate-200'
                  }`}
                >
                  No Active Quests Tracked
                </h3>
                <p
                  className={`text-sm max-w-md mx-auto mt-1 ${
                    isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'
                  }`}
                >
                  Visit the Guild Notice Board to accept new contracts, or view your completed
                  chronological timeline of past victories.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  id="btn-journal-browse-board"
                  onClick={onSwitchToBoard}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Browse Notice Board
                </button>
                {completedQuests.length > 0 && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setViewMode('timeline');
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition active:scale-95 cursor-pointer ${
                      isParchment
                        ? 'bg-[#ede0ca] border-[#d5c7a9] text-[#78350f] hover:bg-[#e4d4ba]'
                        : 'bg-slate-800 border-slate-700 text-emerald-300 hover:bg-slate-750'
                    }`}
                  >
                    View Completed Timeline ({completedQuests.length})
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeQuests.map((quest) => {
                const total = quest.objectives.length;
                const completed = quest.objectives.filter((o) => o.completed).length;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                const theme = getQuestProgressTheme(percent);

                return (
                  <div
                    key={quest.id}
                    id={`active-quest-item-${quest.id}`}
                    className={`relative group/journal flex flex-col rounded-2xl overflow-hidden border shadow-xl transition hover:border-slate-700 ${
                      isParchment
                        ? 'bg-[#fffdf9] border-[#d6c7ab]'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {/* Visual Progress Bar Header for this quest */}
                    <div
                      id={`quest-progress-bar-container-${quest.id}`}
                      className={`px-4 py-3 border-b space-y-2 ${
                        isParchment
                          ? 'bg-[#faf4e8] border-[#ebdcc2]'
                          : 'bg-slate-950/90 border-slate-800/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${theme.textColor}`} />
                          <span
                            className={`text-[11px] uppercase tracking-wider font-mono ${
                              isParchment ? 'text-[#6b5f4f]' : 'text-slate-300'
                            }`}
                          >
                            Quest Progress:
                          </span>
                          <span
                            className={`font-bold font-mono ${
                              isParchment ? 'text-[#231f1d]' : 'text-slate-100'
                            }`}
                          >
                            {completed}/{total}
                          </span>
                          <span
                            className={`text-[10px] ${
                              isParchment ? 'text-[#8c7e6c]' : 'text-slate-500'
                            }`}
                          >
                            ({total - completed === 0 ? 'All done' : `${total - completed} left`})
                          </span>
                        </div>

                        <span
                          id={`quest-progress-badge-${quest.id}`}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono transition-colors ${
                            theme.badgeBg
                          } ${theme.pulse ? 'animate-pulse' : ''}`}
                        >
                          {theme.tagText}
                        </span>
                      </div>

                      {/* Visual Progress Bar Track & Fill */}
                      <div
                        className={`relative w-full h-2.5 rounded-full overflow-hidden p-0.5 border shadow-inner ${
                          isParchment
                            ? 'bg-[#ede0ca] border-[#d5c7a9]'
                            : 'bg-slate-900 border-slate-800/80'
                        }`}
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progress for ${quest.title}: ${percent}%`}
                      >
                        <div
                          id={`quest-progress-fill-${quest.id}`}
                          className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${theme.barGradient}`}
                          style={{ width: `${Math.max(percent, percent > 0 ? 3 : 0)}%` }}
                        />
                      </div>

                      {/* Ready to claim banner if 100% */}
                      {percent === 100 && (
                        <div className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 rounded-lg px-2.5 py-1 flex items-center justify-between animate-fadeIn">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>All milestones accomplished! Ready to claim reward.</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quest Card Body */}
                    <div className="flex-1 relative">
                      <QuestCard
                        quest={quest}
                        isJournalView={true}
                        onToggleObjective={onToggleObjective}
                        onCompleteQuest={onCompleteQuest}
                        onUpdateNotes={onUpdateNotes}
                      />

                      {/* Abandon Quest button in top corner */}
                      <button
                        id={`btn-abandon-quest-${quest.id}`}
                        type="button"
                        onClick={() => onAbandonQuest(quest.id)}
                        title="Abandon Quest"
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900 transition-colors text-xs flex items-center gap-1 z-10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">Abandon</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: CHRONOLOGICAL TIMELINE OF COMPLETED QUESTS */}
      {/* ========================================================================= */}
      {viewMode === 'timeline' && (
        <div id="completed-quest-timeline-container" className="space-y-6">
          {/* Timeline Summary & Cumulative Rewards Dashboard */}
          <div
            className={`p-5 rounded-2xl border shadow-xl backdrop-blur-md space-y-4 ${
              isParchment
                ? 'bg-[#fffdf9]/95 border-[#d6c7ab]'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                  className={`text-lg font-bold flex items-center gap-2 ${
                    isParchment ? 'text-[#231f1d]' : 'text-slate-100'
                  }`}
                >
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Chronicle of Completed Quests</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'}`}>
                  Trace your character's heroic journey from early humble contracts to legendary
                  triumphs, showing exact completion dates and rewards accumulated over time.
                </p>
              </div>

              {/* Reset or demo history button */}
              <div className="flex items-center gap-2">
                {onLoadSampleCompleted && (
                  <button
                    type="button"
                    onClick={() => {
                      playCoinSound();
                      onLoadSampleCompleted();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      isParchment
                        ? 'bg-[#ede0ca] hover:bg-[#e4d4ba] text-[#78350f] border-[#d5c7a9]'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                    }`}
                    title="Load sample completed quests into chronicle"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Load Demo Quests</span>
                  </button>
                )}

                {completedQuests.length > 0 && onClearCompletedHistory && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Clear all completed quest history?')) {
                        onClearCompletedHistory();
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
                    title="Clear history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Metric highlights over time */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div
                className={`p-3 rounded-xl border ${
                  isParchment ? 'bg-[#f8f1e5] border-[#ebdcc2]' : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resolved Quests</span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {completedQuests.length}
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isParchment ? 'bg-[#f8f1e5] border-[#ebdcc2]' : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gold Earned</span>
                </div>
                <div className="text-xl font-bold font-mono text-amber-500 mt-1">
                  {timelineData.totalGold.toLocaleString()} GP
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isParchment ? 'bg-[#f8f1e5] border-[#ebdcc2]' : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>EXP Gained</span>
                </div>
                <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
                  {timelineData.totalExp.toLocaleString()}
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isParchment ? 'bg-[#f8f1e5] border-[#ebdcc2]' : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Items & Relics</span>
                </div>
                <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                  {timelineData.totalItems} recovered
                </div>
              </div>
            </div>

            {/* Filter and Chronological Sorting Bar */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
                isParchment ? 'bg-[#f4ebe1] border-[#ebdcc2]' : 'bg-slate-950 border-slate-800'
              }`}
            >
              {/* Chronological order toggle */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium flex items-center gap-1 ${
                    isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'
                  }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort Timeline:</span>
                </span>
                <div className="inline-flex rounded-lg border border-slate-700/60 p-0.5 bg-slate-900/60">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setTimelineSort('desc');
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition cursor-pointer ${
                      timelineSort === 'desc'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Newest First
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setTimelineSort('asc');
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition cursor-pointer ${
                      timelineSort === 'asc'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Earliest First (Chronological)
                  </button>
                </div>
              </div>

              {/* Type filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                      isParchment
                        ? 'bg-[#fffdf9] border-[#d5c7a9] text-[#231f1d]'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <option value="all">All Contract Types</option>
                    <option value="hunt">Hunt</option>
                    <option value="bounty">Bounty</option>
                    <option value="dungeon">Dungeon</option>
                    <option value="retrieval">Retrieval</option>
                    <option value="escort">Escort</option>
                    <option value="investigation">Investigation</option>
                    <option value="defense">Defense</option>
                  </select>
                </div>

                {/* Search query input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chronicle..."
                    className={`text-xs pl-8 pr-3 py-1.5 rounded-lg border focus:outline-none w-36 sm:w-44 ${
                      isParchment
                        ? 'bg-[#fffdf9] border-[#d5c7a9] text-[#231f1d] placeholder-[#8c7e6c]'
                        : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THE TIMELINE VERTICAL SPINE & MILESTONE CARDS */}
          {/* ========================================================================= */}
          {completedQuests.length === 0 ? (
            <div
              className={`p-12 text-center rounded-2xl border space-y-4 ${
                isParchment
                  ? 'bg-[#fffdf9]/90 border-[#d6c7ab]'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  isParchment ? 'bg-[#ede0ca] text-[#78350f]' : 'bg-slate-850 text-slate-400'
                }`}
              >
                <History className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                  className={`text-lg font-bold ${
                    isParchment ? 'text-[#231f1d]' : 'text-slate-200'
                  }`}
                >
                  No Completed Quests in Chronicle
                </h3>
                <p
                  className={`text-sm max-w-md mx-auto mt-1 ${
                    isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'
                  }`}
                >
                  Complete contracts from your active journal to record your adventures, or load
                  sample quest history to preview your timeline.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                {onLoadSampleCompleted && (
                  <button
                    type="button"
                    onClick={() => {
                      playCoinSound();
                      onLoadSampleCompleted();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Load Sample Chronicle History
                  </button>
                )}
                {activeQuests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setViewMode('active')}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition active:scale-95 cursor-pointer ${
                      isParchment
                        ? 'bg-[#ede0ca] border-[#d5c7a9] text-[#78350f]'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    View {activeQuests.length} Active Contracts
                  </button>
                )}
              </div>
            </div>
          ) : filteredMilestones.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-sm">
              No completed contracts match your filters. Try clearing the search or type filter.
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-emerald-500 before:to-indigo-500/40">
              {filteredMilestones.map((milestone) => {
                const quest = milestone.quest;
                const isExpanded = !!expandedQuests[quest.id];
                const isEditingNotes = editingNotesId === quest.id;
                const diffStyle =
                  difficultyBadgeColor[quest.difficulty] || difficultyBadgeColor.Novice;

                return (
                  <div
                    key={quest.id}
                    id={`timeline-quest-${quest.id}`}
                    className="relative group/timeline-item transition-all"
                  >
                    {/* Glowing Milestone Marker Node on Spine */}
                    <div
                      className={`absolute -left-6 sm:-left-10 top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-lg transition-transform group-hover/timeline-item:scale-110 z-10 ${
                        isParchment
                          ? 'bg-[#fffdf9] border-amber-600 text-amber-700 shadow-amber-900/20'
                          : 'bg-slate-950 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
                      }`}
                      title={`Milestone #${milestone.chronologicalIndex}`}
                    >
                      <span className="text-[10px] sm:text-[11px]">
                        #{milestone.chronologicalIndex}
                      </span>
                    </div>

                    {/* Timeline Card */}
                    <div
                      className={`rounded-2xl border shadow-xl overflow-hidden backdrop-blur-md transition-all ${
                        isParchment
                          ? 'bg-[#fffdf9] border-[#d6c7ab] hover:border-amber-700/50'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Timeline Bar: Finished Date & Relative Time Ribbon */}
                      <div
                        className={`px-4 sm:px-5 py-3 border-b flex items-center justify-between flex-wrap gap-2 ${
                          isParchment
                            ? 'bg-[#faf4e8] border-[#ebdcc2]'
                            : 'bg-slate-950/90 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          {/* Finished Date */}
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span
                              className={`font-mono ${
                                isParchment ? 'text-[#231f1d]' : 'text-slate-100'
                              }`}
                            >
                              Finished on {milestone.completedDateFormatted}
                            </span>
                          </div>

                          {/* Relative time pill */}
                          {milestone.completedTimeAgo && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                                isParchment
                                  ? 'bg-[#ebdcc2] text-[#78350f] border-[#d5c7a9]'
                                  : 'bg-slate-800/80 text-slate-300 border-slate-700'
                              }`}
                            >
                              <Clock className="w-2.5 h-2.5 inline mr-1 text-slate-400" />
                              {milestone.completedTimeAgo}
                            </span>
                          )}

                          {/* Duration badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                              isParchment
                                ? 'bg-[#ede0ca] text-[#6b5f4f] border-[#d5c7a9]'
                                : 'bg-slate-850 text-slate-400 border-slate-800'
                            }`}
                          >
                            {milestone.durationFormatted}
                          </span>
                        </div>

                        {/* Milestone indicator badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono border uppercase tracking-wider ${
                              isParchment
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            Milestone #{milestone.chronologicalIndex} of {completedQuests.length}
                          </span>
                        </div>
                      </div>

                      {/* Cumulative Milestone Rewards Over Time Showcase */}
                      <div
                        className={`px-4 sm:px-5 py-3 border-b space-y-2.5 ${
                          isParchment
                            ? 'bg-[#f7efe3]/70 border-[#ebdcc2]'
                            : 'bg-slate-950/40 border-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Rewards Claimed for this Contract:</span>
                          </span>

                          {/* Running career total at this chronological milestone */}
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2.5 py-0.5 rounded-md border border-slate-800">
                            Cumulative Career at this point:{' '}
                            <strong className="text-amber-400">
                              {milestone.cumulativeGold.toLocaleString()} GP
                            </strong>{' '}
                            •{' '}
                            <strong className="text-indigo-400">
                              {milestone.cumulativeExp.toLocaleString()} EXP
                            </strong>
                          </span>
                        </div>

                        {/* Individual Quest Rewards Breakdown */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Gold Claimed */}
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
                            <Coins className="w-3.5 h-3.5" />
                            <span>+{quest.rewards.gold.toLocaleString()} GP</span>
                          </div>

                          {/* EXP Claimed */}
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>+{quest.rewards.exp.toLocaleString()} EXP</span>
                          </div>

                          {/* Reputation */}
                          {quest.rewards.reputation && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                              <span>
                                +{quest.rewards.reputation.amount} {quest.rewards.reputation.faction} Rep
                              </span>
                            </div>
                          )}

                          {/* Bonus text */}
                          {quest.rewards.bonusRewardText && (
                            <div className="text-xs text-amber-300/90 italic bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-800/30">
                              ✨ {quest.rewards.bonusRewardText}
                            </div>
                          )}
                        </div>

                        {/* Loot items won */}
                        {quest.rewards.items.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              Equipment & Relics Won ({quest.rewards.items.length}):
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {quest.rewards.items.map((item) => (
                                <ItemCard key={item.id} item={item} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quest Narrative, Lore, & Objective Details */}
                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Title & Metadata Header */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${diffStyle.badge}`}
                              >
                                {quest.difficulty}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 flex items-center gap-1">
                                {getQuestTypeIcon(quest.type)}
                                <span className="capitalize">{quest.type}</span>
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Lv.{quest.recommendedLevel}
                              </span>
                            </div>

                            <h4
                              style={{ fontFamily: 'var(--font-cinzel)' }}
                              className={`text-base sm:text-lg font-bold ${
                                isParchment ? 'text-[#231f1d]' : 'text-slate-100'
                              }`}
                            >
                              {quest.title}
                            </h4>

                            <p
                              className={`text-xs leading-relaxed ${
                                isParchment ? 'text-[#574c3e]' : 'text-slate-300'
                              }`}
                            >
                              {quest.summary}
                            </p>
                          </div>

                          {/* Quick action buttons on timeline card */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCopyChronicle(quest)}
                              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition cursor-pointer ${
                                copiedId === quest.id
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                  : isParchment
                                  ? 'bg-[#ede0ca] border-[#d5c7a9] text-[#78350f] hover:bg-[#e4d4ba]'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-slate-100'
                              }`}
                              title="Copy chronicle entry to clipboard"
                            >
                              {copiedId === quest.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[10px]">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[10px] hidden sm:inline">Copy Log</span>
                                </>
                              )}
                            </button>

                            {onReopenQuest && (
                              <button
                                type="button"
                                onClick={() => {
                                  playClickSound();
                                  onReopenQuest(quest.id);
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                title="Restore this quest to active tracking"
                              >
                                <RotateCcw className="w-3 h-3 text-amber-400" />
                                <span className="text-[10px] hidden sm:inline">Reopen</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleExpand(quest.id)}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                              title={isExpanded ? 'Collapse' : 'Expand full details'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Location and Giver Badges */}
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <div
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                              isParchment
                                ? 'bg-[#f4ebe1] border-[#ebdcc2] text-[#6b5f4f]'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5 text-sky-400" />
                            <span>
                              {quest.location.name} • {quest.location.region} ({quest.location.biome})
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                              isParchment
                                ? 'bg-[#f4ebe1] border-[#ebdcc2] text-[#6b5f4f]'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <User className="w-3.5 h-3.5 text-amber-400" />
                            <span>
                              {quest.giver.name} ({quest.giver.faction})
                            </span>
                          </div>
                        </div>

                        {/* Completed Objectives Checklist (All Struck-through with Green Checkmarks) */}
                        <div className="space-y-1.5">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Completed Objectives ({quest.objectives.length}/{quest.objectives.length}):
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {quest.objectives.map((obj) => (
                              <div
                                key={obj.id}
                                className={`flex items-start gap-2 p-2 rounded-lg border text-xs ${
                                  isParchment
                                    ? 'bg-[#f7efe3] border-[#ebdcc2] text-[#3f3529]'
                                    : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                                }`}
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="line-through opacity-80">{obj.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Player-added Field Notes Section for Completed Quest */}
                        <div
                          className={`p-3.5 rounded-xl border space-y-2 ${
                            isParchment
                              ? 'bg-[#fcf8f0] border-[#d5c7a9]'
                              : 'bg-slate-950/90 border-slate-800/90'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                              <StickyNote className="w-3.5 h-3.5" />
                              <span>Player Field Notes & Chronicle Annotations</span>
                            </span>

                            {!isEditingNotes && (
                              <button
                                type="button"
                                onClick={() => handleStartEditNotes(quest)}
                                className="text-[11px] text-slate-400 hover:text-amber-300 transition cursor-pointer"
                              >
                                {quest.notes ? 'Edit Notes' : '+ Add Notes'}
                              </button>
                            )}
                          </div>

                          {isEditingNotes ? (
                            <div className="space-y-2">
                              <textarea
                                value={notesDraft}
                                onChange={(e) => setNotesDraft(e.target.value)}
                                placeholder="Add notes, GM observations, or lore comments for this completed contract..."
                                rows={3}
                                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y ${
                                  isParchment
                                    ? 'bg-[#fffdf9] border-[#d5c7a9] text-[#231f1d]'
                                    : 'bg-slate-900 border-slate-700 text-slate-200'
                                }`}
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingNotesId(null)}
                                  className="px-2.5 py-1 text-xs rounded-md text-slate-400 hover:text-slate-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveNotes(quest.id)}
                                  className="px-3 py-1 text-xs rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                                >
                                  Save Chronicle Note
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`text-xs font-mono italic p-2.5 rounded-lg border ${
                                quest.notes
                                  ? isParchment
                                    ? 'bg-[#faf3e3] border-[#ebdcc2] text-[#4a3f31]'
                                    : 'bg-slate-900/60 border-slate-800 text-amber-200/90'
                                  : 'text-slate-500 border-dashed border-slate-800'
                              }`}
                            >
                              {quest.notes ? (
                                <span>"{quest.notes}"</span>
                              ) : (
                                <span className="text-slate-500">
                                  No field notes recorded during this quest. Click "+ Add Notes" to
                                  record campaign memories.
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expanded details (Flavor text, Giver dialogue hook, tags) */}
                        {isExpanded && (
                          <div className="pt-2 border-t border-slate-800 space-y-3 text-xs animate-fadeIn">
                            {quest.flavorText && (
                              <div className="italic text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                                "{quest.flavorText}"
                              </div>
                            )}

                            {quest.giver.dialogueHook && (
                              <div className="text-slate-400 text-[11px]">
                                <span className="text-slate-500 uppercase font-semibold">
                                  Giver Dialogue Hook:
                                </span>{' '}
                                <span className="italic text-slate-300">
                                  "{quest.giver.dialogueHook}"
                                </span>
                              </div>
                            )}

                            {quest.tags && quest.tags.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                {quest.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[10px] font-mono"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
