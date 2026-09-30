import React, { useState } from 'react';
import { Quest } from '../types/quest';
import { Character } from '../types/character';
import { exportToGoogleSheets, PlayerStats, SheetsExportResult } from '../services/googleSheetsExport';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  Table,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface SheetsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeQuests: Quest[];
  playerStats: PlayerStats;
  savedCharacter: Character | null;
  user: FirebaseUser | null;
  accessToken: string | null;
  onSignIn: () => Promise<void>;
}

export const SheetsExportModal: React.FC<SheetsExportModalProps> = ({
  isOpen,
  onClose,
  activeQuests,
  playerStats,
  savedCharacter,
  user,
  accessToken,
  onSignIn,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [result, setResult] = useState<SheetsExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignInClick = async () => {
    setError(null);
    setIsSigningIn(true);
    try {
      await onSignIn();
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with Google.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleExport = async () => {
    if (!accessToken) {
      setError('Please connect your Google Account before exporting to Google Sheets.');
      return;
    }

    setError(null);
    setIsExporting(true);
    setResult(null);

    try {
      const res = await exportToGoogleSheets(
        accessToken,
        activeQuests,
        playerStats,
        savedCharacter,
        customTitle.trim() || undefined
      );
      setResult(res);
    } catch (err: any) {
      console.error('Sheets export error:', err);
      setError(err?.message || 'Failed to export to Google Sheets.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-stone-900 border border-emerald-600/40 shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-0.5 flex items-center justify-center text-stone-950 shadow-md">
              <FileSpreadsheet className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2
                style={{ fontFamily: 'var(--font-cinzel)' }}
                className="text-base font-bold text-emerald-300 flex items-center gap-2"
              >
                Export to Google Sheets
              </h2>
              <p className="text-xs text-stone-400">
                Populate a live spreadsheet with active quests & career stats
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Auth Banner */}
          <div className="p-3.5 rounded-xl border bg-stone-950/70 border-stone-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              {user ? (
                <>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google User'}
                      className="w-8 h-8 rounded-full border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                      {user.displayName?.charAt(0) || 'G'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                      <span>{user.displayName || user.email}</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <ShieldCheck className="w-2.5 h-2.5" /> Connected
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">{user.email}</div>
                  </div>
                </>
              ) : (
                <div className="text-xs text-stone-300">
                  <div className="font-semibold text-emerald-200">Google Account required</div>
                  <div className="text-stone-400 text-[11px]">
                    Sign in to create a spreadsheet in your Google Drive.
                  </div>
                </div>
              )}
            </div>

            {!user && (
              <GoogleSignInButton onClick={handleSignInClick} isLoading={isSigningIn} />
            )}
          </div>

          {/* Success Result */}
          {result && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-200 space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-emerald-300">Spreadsheet Created Successfully!</h4>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    <strong>{result.title}</strong> has been populated with Career Stats & Quests.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={result.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Google Sheets
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Export Failed</span>
                <span className="text-rose-300">{error}</span>
              </div>
            </div>
          )}

          {/* Export Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-300 mb-1">
                Spreadsheet Title (Optional)
              </label>
              <input
                type="text"
                placeholder={`RPG Quest Journal & Stats - ${new Date().toISOString().slice(0, 10)}`}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 font-mono placeholder:text-stone-600 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Content Preview */}
            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2 text-xs">
              <div className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-emerald-400" />
                <span>Spreadsheet Tabs Preview:</span>
              </div>
              <ul className="space-y-1 text-stone-400 text-[11px] list-disc list-inside">
                <li>
                  <strong className="text-stone-300">Tab 1: "Career Stats"</strong> — Gold ({playerStats.totalGold.toLocaleString()} GP), EXP ({playerStats.totalExp.toLocaleString()}), Completed Quests ({playerStats.completedCount})
                  {savedCharacter && `, Hero info (${savedCharacter.name})`}
                </li>
                <li>
                  <strong className="text-stone-300">Tab 2: "Active Quests"</strong> — {activeQuests.length} contract rows with titles, levels, difficulties, gold/exp rewards, and milestone checkboxes.
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Clicking confirm will create a fresh Google Sheet in your Google Drive and populate the cells.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                <span>Creating Sheet...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-stone-950" />
                <span>Confirm Export to Sheets</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
