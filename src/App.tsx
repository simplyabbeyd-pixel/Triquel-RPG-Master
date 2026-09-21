import React, { useEffect, useState } from 'react';
import { GenerationOptions, Quest } from './types/quest';
import { Character } from './types/character';
import {
  generateQuestBoard,
  generateRandomQuest,
} from './utils/questGenerator';
import { QuestCard } from './components/QuestCard';
import { QuestFilters } from './components/QuestFilters';
import { QuestEditModal } from './components/QuestEditModal';
import { DeveloperGuideModal } from './components/DeveloperGuideModal';
import { ActiveJournal } from './components/ActiveJournal';
import { CharacterCreator } from './components/CharacterCreator';
import { CharacterSheetModal } from './components/CharacterSheetModal';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';
import { playCoinSound, playRollSound } from './utils/audio';
import {
  BookOpen,
  Code,
  Compass,
  FileSpreadsheet,
  LayoutGrid,
  RotateCcw,
  Sparkles,
  Swords,
  Trophy,
  User,
  Shield,
  Scroll,
} from 'lucide-react';

interface PlayerStats {
  totalGold: number;
  totalExp: number;
  completedCount: number;
}

export default function App() {
  const { isParchment, theme, toggleTheme } = useTheme();

  const [boardCount, setBoardCount] = useState<number>(4);
  const [options, setOptions] = useState<GenerationOptions>({
    exactLevel: 25,
    type: 'all',
    biome: 'all',
    rewardFocus: 'balanced',
  });

  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalGold: 0,
    totalExp: 0,
    completedCount: 0,
  });

  const [activeTab, setActiveTab] = useState<'board' | 'journal' | 'hero'>('board');
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [savedCharacter, setSavedCharacter] = useState<Character | null>(null);
  const [inspectingCharacter, setInspectingCharacter] = useState<Character | null>(null);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize board on first mount and load local persistence
  useEffect(() => {
    const savedActive = localStorage.getItem('rpg_active_quests');
    const savedStats = localStorage.getItem('rpg_player_stats');
    const savedHero = localStorage.getItem('rpg_saved_hero');

    if (savedActive) {
      try {
        setActiveQuests(JSON.parse(savedActive));
      } catch {
        // ignore parse error
      }
    }

    if (savedStats) {
      try {
        setPlayerStats(JSON.parse(savedStats));
      } catch {
        // ignore parse error
      }
    }

    if (savedHero) {
      try {
        setSavedCharacter(JSON.parse(savedHero));
      } catch {
        // ignore parse error
      }
    }

    // Initial generated board
    const initialBoard = generateQuestBoard(4, { exactLevel: 25 });
    setQuests(initialBoard);
  }, []);

  // Save active quests & stats to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('rpg_active_quests', JSON.stringify(activeQuests));
    } catch {
      // ignore
    }
  }, [activeQuests]);

  useEffect(() => {
    try {
      localStorage.setItem('rpg_player_stats', JSON.stringify(playerStats));
    } catch {
      // ignore
    }
  }, [playerStats]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Roll 1 quest
  const handleRollOne = () => {
    playRollSound();
    const newQuest = generateRandomQuest(options);
    setQuests([newQuest, ...quests.slice(0, boardCount - 1)]);
    showToast(`Rolled new quest: "${newQuest.title}"`);
  };

  // Roll fresh notice board
  const handleRollBoard = (count = boardCount) => {
    playRollSound();
    setBoardCount(count);
    const newBoard = generateQuestBoard(count, options);
    setQuests(newBoard);
    showToast(`Posted ${count} fresh notices to the Guild Board`);
  };

  // Reroll single slot
  const handleRerollSingle = (questId: string) => {
    playRollSound();
    const freshQuest = generateRandomQuest(options);
    setQuests(quests.map((q) => (q.id === questId ? freshQuest : q)));
  };

  // Reroll rewards only for a quest
  const handleRerollRewards = (questId: string) => {
    playRollSound();
    setQuests(
      quests.map((q) => {
        if (q.id !== questId) return q;
        const fresh = generateRandomQuest({
          exactLevel: q.recommendedLevel,
          rewardFocus: options.rewardFocus,
        });
        return {
          ...q,
          rewards: fresh.rewards,
        };
      })
    );
    showToast('Loot and gold rewards recalculated');
  };

  // Accept quest -> move into Active Journal
  const handleAcceptQuest = (quest: Quest) => {
    if (activeQuests.some((q) => q.id === quest.id)) {
      showToast('This quest is already in your active journal!');
      return;
    }
    setActiveQuests([
      {
        ...quest,
        status: 'active',
      },
      ...activeQuests,
    ]);
    showToast(`Accepted "${quest.title}" into your Quest Log`);
  };

  // Toggle objective progress
  const handleToggleObjective = (questId: string, objectiveId: string) => {
    setActiveQuests(
      activeQuests.map((q) => {
        if (q.id !== questId) return q;
        return {
          ...q,
          objectives: q.objectives.map((obj) => {
            if (obj.id !== objectiveId) return obj;
            return {
              ...obj,
              completed: !obj.completed,
            };
          }),
        };
      })
    );
  };

  // Complete quest & claim reward
  const handleCompleteQuest = (questId: string) => {
    const quest = activeQuests.find((q) => q.id === questId);
    if (!quest) return;

    playCoinSound();

    setPlayerStats((prev) => ({
      totalGold: prev.totalGold + quest.rewards.gold,
      totalExp: prev.totalExp + quest.rewards.exp,
      completedCount: prev.completedCount + 1,
    }));

    setActiveQuests(activeQuests.filter((q) => q.id !== questId));
    showToast(
      `Quest Completed! Received ${quest.rewards.gold.toLocaleString()} GP & ${quest.rewards.exp.toLocaleString()} EXP!`
    );
  };

  // Abandon quest
  const handleAbandonQuest = (questId: string) => {
    setActiveQuests(activeQuests.filter((q) => q.id !== questId));
    showToast('Quest abandoned from your active journal');
  };

  // Save manual edits
  const handleSaveEditedQuest = (updated: Quest) => {
    setQuests(quests.map((q) => (q.id === updated.id ? updated : q)));
    setActiveQuests(activeQuests.map((q) => (q.id === updated.id ? updated : q)));
    showToast(`Updated "${updated.title}"`);
  };

  // Save character
  const handleSaveCharacter = (character: Character) => {
    setSavedCharacter(character);
    try {
      localStorage.setItem('rpg_saved_hero', JSON.stringify(character));
    } catch {
      // ignore
    }
    showToast(`Hero saved: ${character.name}, Level ${character.level} ${character.race} ${character.class}`);
  };

  // View character sheet modal
  const handleViewCharacterSheet = (character: Character) => {
    setInspectingCharacter(character);
    setIsSheetModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isParchment
          ? 'bg-[#f7f2e7] text-[#231f1d] selection:bg-[#fde68a] selection:text-[#78350f]'
          : 'bg-[#0d1117] text-slate-100 selection:bg-amber-500 selection:text-slate-950'
      }`}
    >
      {/* Toast Notification Banner */}
      {notification && (
        <div
          id="toast-notification-banner"
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md animate-bounce ${
            isParchment
              ? 'bg-[#fffdf9]/95 border-[#b45309] text-[#78350f]'
              : 'bg-slate-900/95 border-amber-500/60 text-amber-200'
          }`}
        >
          <Sparkles className={`w-4 h-4 shrink-0 ${isParchment ? 'text-[#b45309]' : 'text-amber-400'}`} />
          <span>{notification}</span>
        </div>
      )}

      {/* Primary Header */}
      <header
        id="app-header"
        className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
          isParchment
            ? 'bg-[#f4ebd9]/95 border-[#d6c7ab]'
            : 'bg-slate-950/90 border-slate-800/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-900/30 flex items-center justify-center shrink-0">
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  isParchment ? 'bg-[#fffdf9] text-[#b45309]' : 'bg-slate-950 text-amber-400'
                }`}
              >
                <Swords className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h1
                style={{ fontFamily: 'var(--font-cinzel)' }}
                className={`text-base sm:text-lg font-bold tracking-wide flex items-center gap-2 ${
                  isParchment ? 'text-[#241e19]' : 'text-slate-100'
                }`}
              >
                <span>RPG Quest Generator</span>
                {isParchment && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#eaddc4] text-[#78350f] border border-[#d5c7a9] uppercase font-bold tracking-wider hidden lg:inline-block">
                    Parchment Mode
                  </span>
                )}
              </h1>
              <p className={`text-[11px] font-medium hidden sm:block ${
                isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'
              }`}>
                Procedural quest engine & tabletop tools • Level scaling & custom rewards
              </p>
            </div>
          </div>

          {/* Navigation, Theme Toggle & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher: Board vs Active Journal vs Hero Creator */}
            <nav
              aria-label="Main Navigation"
              className={`flex items-center rounded-xl p-1 text-xs font-semibold border ${
                isParchment
                  ? 'bg-[#ede3ce] border-[#d5c7a9]'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <button
                id="tab-view-board"
                type="button"
                onClick={() => setActiveTab('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'board'
                    ? isParchment
                      ? 'bg-[#fffdf9] text-[#78350f] shadow-sm font-bold border border-[#c9b794]'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isParchment
                    ? 'text-[#665a4c] hover:text-[#241e19]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Notice Board</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isParchment ? 'bg-[#e2d5bd] text-[#554a3e]' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {quests.length}
                </span>
              </button>

              <button
                id="tab-view-journal"
                type="button"
                onClick={() => setActiveTab('journal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'journal'
                    ? isParchment
                      ? 'bg-[#fffdf9] text-[#78350f] shadow-sm font-bold border border-[#c9b794]'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isParchment
                    ? 'text-[#665a4c] hover:text-[#241e19]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Quest Log</span>
                {activeQuests.length > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
                      isParchment ? 'bg-[#b45309] text-white' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {activeQuests.length}
                  </span>
                )}
              </button>

              <button
                id="tab-view-hero"
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'hero'
                    ? isParchment
                      ? 'bg-[#fffdf9] text-[#78350f] shadow-sm font-bold border border-[#c9b794]'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isParchment
                    ? 'text-[#665a4c] hover:text-[#241e19]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Hero Studio</span>
                {savedCharacter && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title={`Hero: ${savedCharacter.name}`} />
                )}
              </button>
            </nav>

            {/* Dedicated Tabletop Theme Mode Toggle (Dark Fantasy vs Parchment/Light) */}
            <ThemeToggle />

            {/* Developer / Tabletop Engine Docs */}
            <button
              id="btn-open-dev-docs"
              type="button"
              onClick={() => setIsDevModalOpen(true)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isParchment
                  ? 'bg-[#ede3ce] border-[#d5c7a9] text-[#665a4c] hover:text-[#b45309] hover:border-[#b45309]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-700/60'
              }`}
              title="System Algorithm, Unity/TS Code & JSON Export"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'board' ? (
          <>
            {/* Generator Control Filters */}
            <QuestFilters
              options={options}
              onChangeOptions={(newOpts) => {
                setOptions(newOpts);
              }}
              onRollOne={handleRollOne}
              onRollBoard={handleRollBoard}
              boardCount={boardCount}
            />

            {/* Board Notice Grid */}
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                    className={`text-base font-bold ${
                      isParchment ? 'text-[#241e19]' : 'text-slate-200'
                    }`}
                  >
                    Guild Notice Board
                  </h2>
                  <span className={`text-xs ${isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'}`}>
                    ({quests.length} contracts available)
                  </span>
                  {isParchment && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#ebdcc2] text-[#665a4c] border border-[#d5c7a9] hidden sm:inline-block">
                      High-Contrast Parchment View
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-reroll-entire-board"
                    type="button"
                    onClick={() => handleRollBoard(boardCount)}
                    className={`text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isParchment
                        ? 'text-[#665a4c] hover:text-[#b45309] bg-[#ede3ce] border-[#d5c7a9] hover:bg-[#e4d6be]'
                        : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900 border-transparent hover:border-slate-800'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reroll All Notices</span>
                  </button>
                </div>
              </div>

              {quests.length === 0 ? (
                <div
                  className={`p-12 text-center rounded-2xl border space-y-3 ${
                    isParchment
                      ? 'bg-[#fffdf9] border-[#d5c7a9]'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <p className={`text-sm ${isParchment ? 'text-[#6b5f4f]' : 'text-slate-400'}`}>
                    The notice board has been cleared.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRollBoard(4)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-md ${
                      isParchment
                        ? 'bg-[#b45309] hover:bg-[#92400e] text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    Post New Contracts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onAccept={handleAcceptQuest}
                      onReroll={handleRerollSingle}
                      onRerollRewards={handleRerollRewards}
                      onEdit={(q) => setEditingQuest(q)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'journal' ? (
          /* Active Quest Journal */
          <ActiveJournal
            activeQuests={activeQuests}
            onToggleObjective={handleToggleObjective}
            onCompleteQuest={handleCompleteQuest}
            onAbandonQuest={handleAbandonQuest}
            playerStats={playerStats}
            onSwitchToBoard={() => setActiveTab('board')}
          />
        ) : (
          /* Character Creator Studio */
          <CharacterCreator
            onSaveCharacter={handleSaveCharacter}
            onViewSheet={handleViewCharacterSheet}
            initialCharacter={savedCharacter}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`mt-auto border-t py-6 text-center text-xs transition-colors duration-200 ${
          isParchment
            ? 'border-[#d6c7ab] text-[#7a6e60] bg-[#efe5d1]/60'
            : 'border-slate-900 text-slate-500 bg-slate-950/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span>RPG Tabletop Engine • Designed for Game Masters & Players</span>
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="font-medium hidden sm:inline">
              Mode:{' '}
              <strong className={isParchment ? 'text-[#78350f]' : 'text-amber-400'}>
                {isParchment ? 'Parchment / Light' : 'Dark Fantasy'}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className={`hover:underline cursor-pointer flex items-center gap-1 font-medium ${
                isParchment ? 'text-[#78350f]' : 'text-amber-400'
              }`}
            >
              <span>Switch to {isParchment ? 'Dark Fantasy' : 'Parchment Mode'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDevModalOpen(true)}
              className={`${
                isParchment ? 'text-[#5e5348] hover:text-[#231f1d]' : 'text-slate-400 hover:text-amber-300'
              } transition-colors cursor-pointer`}
            >
              Export System & JSON
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuestEditModal
        quest={editingQuest}
        isOpen={!!editingQuest}
        onClose={() => setEditingQuest(null)}
        onSave={handleSaveEditedQuest}
      />

      <DeveloperGuideModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
        quests={quests}
      />

      <CharacterSheetModal
        character={inspectingCharacter || savedCharacter}
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
      />
    </div>
  );
}
