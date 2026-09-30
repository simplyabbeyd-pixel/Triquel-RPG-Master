import React from 'react';
import { Quest } from '../types/quest';
import { QuestCard } from './QuestCard';
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
} from 'lucide-react';

interface ActiveJournalProps {
  activeQuests: Quest[];
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
  onToggleObjective,
  onCompleteQuest,
  onAbandonQuest,
  playerStats,
  onSwitchToBoard,
  onOpenDriveExport,
  onOpenSheetsExport,
  onUpdateNotes,
}) => {
  // Calculate aggregated journal metrics
  const totalObjectives = activeQuests.reduce((sum, q) => sum + q.objectives.length, 0);
  const completedObjectives = activeQuests.reduce(
    (sum, q) => sum + q.objectives.filter((o) => o.completed).length,
    0
  );
  const overallPercent = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
  const overallTheme = getQuestProgressTheme(overallPercent);

  return (
    <div id="active-quest-journal-container" className="space-y-6">
      {/* Player Career Stats & Journal Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2
              style={{ fontFamily: 'var(--font-cinzel)' }}
              className="text-base font-bold text-slate-100 flex items-center gap-2"
            >
              <span>Adventurer's Active Quest Log</span>
            </h2>
            <div className="text-xs text-slate-400">
              {activeQuests.length} {activeQuests.length === 1 ? 'contract tracked' : 'contracts tracked'} •{' '}
              {completedObjectives}/{totalObjectives} total objectives resolved
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-amber-300 border border-amber-600/40 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
              title="Export saved hero profile & quest log summary to Google Drive as PDF or JSON"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Export to Drive</span>
            </button>
          )}

          {onOpenSheetsExport && (
            <button
              id="btn-journal-export-sheets"
              type="button"
              onClick={onOpenSheetsExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-emerald-300 border border-emerald-600/40 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
              title="Export active quests and player statistics directly into Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export to Sheets</span>
            </button>
          )}
        </div>

        {/* Career stats pills */}
        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <Coins className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400 mr-1">Earned Gold:</span>
              <span className="font-bold text-amber-300 font-mono">
                {playerStats.totalGold.toLocaleString()} GP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <div className="text-xs">
              <span className="text-slate-400 mr-1">Earned EXP:</span>
              <span className="font-bold text-indigo-300 font-mono">
                {playerStats.totalExp.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400 mr-1">Completed:</span>
              <span className="font-bold text-emerald-300 font-mono">
                {playerStats.completedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Journal Progress Bar (When there are active quests) */}
      {activeQuests.length > 0 && (
        <div
          id="journal-overall-progress-card"
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Total Journal Completion
              </span>
              <span className="text-slate-400 text-[11px]">
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
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${overallTheme.barGradient}`}
              style={{ width: `${Math.max(overallPercent, 2)}%` }}
            />
          </div>
        </div>
      )}

      {/* Quest List with Individual Visual Progress Bars */}
      {activeQuests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3
              style={{ fontFamily: 'var(--font-cinzel)' }}
              className="text-lg font-bold text-slate-200"
            >
              No Active Quests Tracked
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
              Visit the Guild Notice Board to accept new contracts, hunt dangerous beasts, or retrieve lost ancient relics.
            </p>
          </div>
          <button
            id="btn-journal-browse-board"
            onClick={onSwitchToBoard}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Browse Notice Board
          </button>
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
                className="relative group/journal flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl transition hover:border-slate-700"
              >
                {/* Visual Progress Bar Header for this quest */}
                <div
                  id={`quest-progress-bar-container-${quest.id}`}
                  className="px-4 py-3 bg-slate-950/90 border-b border-slate-800/90 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${theme.textColor}`} />
                      <span className="text-[11px] uppercase tracking-wider font-mono">
                        Quest Progress:
                      </span>
                      <span className="font-bold text-slate-100 font-mono">
                        {completed}/{total}
                      </span>
                      <span className="text-slate-500 text-[10px]">
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
                    className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/80 shadow-inner"
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
    </div>
  );
};
