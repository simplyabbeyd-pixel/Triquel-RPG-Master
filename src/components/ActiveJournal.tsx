import React from 'react';
import { Quest } from '../types/quest';
import { QuestCard } from './QuestCard';
import { BookOpen, CheckCircle, Coins, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';

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
}

export const ActiveJournal: React.FC<ActiveJournalProps> = ({
  activeQuests,
  onToggleObjective,
  onCompleteQuest,
  onAbandonQuest,
  playerStats,
  onSwitchToBoard,
}) => {
  return (
    <div id="active-quest-journal-container" className="space-y-6">
      {/* Player Career Stats Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2
              style={{ fontFamily: 'var(--font-cinzel)' }}
              className="text-base font-bold text-slate-100"
            >
              Adventurer\'s Active Quest Log
            </h2>
            <div className="text-xs text-slate-400">
              {activeQuests.length} {activeQuests.length === 1 ? 'quest in progress' : 'quests in progress'}
            </div>
          </div>
        </div>

        {/* Career stats pills */}
        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Quest List */}
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
          {activeQuests.map((quest) => (
            <div key={quest.id} className="relative group/journal">
              <QuestCard
                quest={quest}
                isJournalView={true}
                onToggleObjective={onToggleObjective}
                onCompleteQuest={onCompleteQuest}
              />
              {/* Abandon Quest button in top corner */}
              <button
                id={`btn-abandon-quest-${quest.id}`}
                onClick={() => onAbandonQuest(quest.id)}
                title="Abandon Quest"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900 transition-colors text-xs flex items-center gap-1 z-10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Abandon</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
