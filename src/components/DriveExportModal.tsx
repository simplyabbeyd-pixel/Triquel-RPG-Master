import React, { useState } from 'react';
import { Character } from '../types/character';
import { Quest } from '../types/quest';
import { PlayerStats, exportHeroToDrive, exportQuestLogToDrive, exportCampaignDossierToDrive, DriveUploadResult } from '../services/googleDriveExport';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  FileText,
  FileCode,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  User,
  BookOpen,
  FolderArchive,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface DriveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCharacter: Character | null;
  activeQuests: Quest[];
  playerStats: PlayerStats;
  user: FirebaseUser | null;
  accessToken: string | null;
  onSignIn: () => Promise<void>;
  defaultTarget?: 'hero' | 'journal' | 'campaign';
}

export const DriveExportModal: React.FC<DriveExportModalProps> = ({
  isOpen,
  onClose,
  savedCharacter,
  activeQuests,
  playerStats,
  user,
  accessToken,
  onSignIn,
  defaultTarget = 'journal',
}) => {
  const [target, setTarget] = useState<'hero' | 'journal' | 'campaign'>(defaultTarget);
  const [format, setFormat] = useState<'pdf' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [exportResult, setExportResult] = useState<DriveUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string>('');

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
      setError('Please connect your Google Account before exporting to Drive.');
      return;
    }

    setError(null);
    setIsExporting(true);
    setExportResult(null);

    try {
      let result: DriveUploadResult;
      const fileNameParam = customName.trim() || undefined;

      if (target === 'hero') {
        if (!savedCharacter) {
          throw new Error('No hero is currently saved. Please forge and save a character in Hero Studio first.');
        }
        result = await exportHeroToDrive(savedCharacter, format, accessToken, fileNameParam);
      } else if (target === 'journal') {
        result = await exportQuestLogToDrive(activeQuests, playerStats, format, accessToken, fileNameParam);
      } else {
        result = await exportCampaignDossierToDrive(savedCharacter, activeQuests, playerStats, format, accessToken, fileNameParam);
      }

      setExportResult(result);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err?.message || 'Failed to export document to Google Drive.');
    } finally {
      setIsExporting(false);
    }
  };

  const getTargetTitle = () => {
    if (target === 'hero') return savedCharacter ? `${savedCharacter.name}'s Tabletop Character Sheet` : 'Hero Profile';
    if (target === 'journal') return `Quest Log Summary (${activeQuests.length} active contracts)`;
    return 'Complete RPG Campaign Dossier (Hero + Quests + Stats)';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-stone-900 border border-amber-600/40 shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 p-0.5 flex items-center justify-center text-stone-950 shadow-md">
              <HardDrive className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2
                style={{ fontFamily: 'var(--font-cinzel)' }}
                className="text-base font-bold text-amber-200 flex items-center gap-2"
              >
                Export to Google Drive
              </h2>
              <p className="text-xs text-stone-400">
                Save your adventure records, tabletop character sheet, and active quests
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
          {/* Google Auth Status Banner */}
          <div className="p-3.5 rounded-xl border bg-stone-950/70 border-stone-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              {user ? (
                <>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google User'}
                      className="w-8 h-8 rounded-full border border-amber-500/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-300 flex items-center justify-center font-bold text-xs">
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
                  <div className="font-semibold text-amber-200">Google Drive not connected yet</div>
                  <div className="text-stone-400 text-[11px]">
                    Sign in with Google to allow exporting files directly to your Drive.
                  </div>
                </div>
              )}
            </div>

            {!user && (
              <GoogleSignInButton onClick={handleSignInClick} isLoading={isSigningIn} />
            )}
          </div>

          {/* Export Result Success Card */}
          {exportResult && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-200 space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-emerald-300">
                    File Successfully Uploaded to Google Drive!
                  </h4>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    <strong>{exportResult.name}</strong> is now stored safely in your Google Drive.
                  </p>
                </div>
              </div>

              {exportResult.webViewLink && (
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={exportResult.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition shadow-md cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in Google Drive
                  </a>
                  <span className="text-[11px] text-emerald-300/80 font-mono">
                    ID: {exportResult.id.slice(0, 16)}...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Export Failed</span>
                <span className="text-rose-300">{error}</span>
              </div>
            </div>
          )}

          {/* Export Options Form */}
          <div className="space-y-4">
            {/* Target Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                1. Select Adventure Data to Export
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTarget('journal')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    target === 'journal'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-200">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Active Quest Log</span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {activeQuests.length} quests & career stats
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTarget('hero')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    target === 'hero'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-200">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hero Profile</span>
                  </div>
                  <span className="text-[11px] text-stone-400 truncate">
                    {savedCharacter ? savedCharacter.name : 'No hero saved yet'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTarget('campaign')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    target === 'campaign'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-200">
                    <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                    <span>Full Campaign</span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Hero + all quests dossier
                  </span>
                </button>
              </div>
            </div>

            {/* Format Selector: PDF vs JSON */}
            <div>
              <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                2. Select Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    format === 'pdf'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-200">PDF Document (.pdf)</div>
                    <div className="text-[11px] text-stone-400">
                      Tabletop sheet with parchment layout & stats
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('json')}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    format === 'json'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-sky-950/80 border border-sky-800 text-sky-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-200">JSON Data (.json)</div>
                    <div className="text-[11px] text-stone-400">
                      Raw structured RPG data for tools & VTTs
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Filename (Optional) */}
            <div>
              <label className="block text-xs font-mono uppercase text-stone-300 mb-1">
                3. Custom File Name (Optional)
              </label>
              <input
                type="text"
                placeholder={
                  target === 'hero'
                    ? `${savedCharacter?.name || 'Hero'}_Sheet.${format}`
                    : `Quest_Log_${new Date().toISOString().slice(0, 10)}.${format}`
                }
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 font-mono placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Confirmation Box (Mandatory as per Workspace skill) */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-300 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Confirmation</span>
              </div>
              <p className="text-[11px] text-stone-400">
                You are about to export <strong>{getTargetTitle()}</strong> as a{' '}
                <strong className="text-amber-300 uppercase">{format}</strong> file to your connected Google Drive.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
            disabled={isExporting || (target === 'hero' && !savedCharacter)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                <span>Uploading to Drive...</span>
              </>
            ) : (
              <>
                <HardDrive className="w-4 h-4 text-stone-950" />
                <span>Confirm Export to Drive</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
