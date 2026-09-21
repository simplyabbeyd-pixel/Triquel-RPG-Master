import React, { useState } from 'react';
import { Quest } from '../types/quest';
import { Code, Download, FileText, X, Check, Copy } from 'lucide-react';

interface DeveloperGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
}

export const DeveloperGuideModal: React.FC<DeveloperGuideModalProps> = ({
  isOpen,
  onClose,
  quests,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'architecture' | 'typescript' | 'csharp' | 'json'>('architecture');
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(quests, null, 2);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rpg-quests-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tsCode = `// RPG Procedural Quest Generator Engine
export function generateQuest(level = 10): Quest {
  const difficulty = level <= 10 ? 'Novice' : level <= 45 ? 'Adept' : 'Veteran';
  const baseGold = Math.round(15 + Math.pow(level, 1.72) * 12);
  const baseExp = Math.round(50 + Math.pow(level, 1.85) * 18);
  
  return {
    id: 'qst_' + Math.random().toString(36).substr(2, 9),
    title: \`Culling the Corrupted Beasts of Shadowvale\`,
    summary: \`Slay dangerous predators near the outpost to keep travel roads safe.\`,
    recommendedLevel: level,
    rewards: {
      gold: baseGold,
      exp: baseExp,
      items: [{ name: 'Silvered Shortsword', rarity: 'uncommon', type: 'weapon' }]
    }
  };
}`;

  const csharpCode = `// Unity / C# RPG Quest Generation System
using System;
using System.Collections.Generic;

[System.Serializable]
public class RPGQuest {
    public string title;
    public string summary;
    public int recommendedLevel;
    public int rewardGold;
    public int rewardExp;
    public List<string> rewardItems;
}

public static class QuestGenerator {
    public static RPGQuest RollQuest(int level) {
        int gold = (int)(15 + Math.Pow(level, 1.72) * 12);
        int exp = (int)(50 + Math.Pow(level, 1.85) * 18);
        return new RPGQuest {
            title = $"The Sealed Crypts of Val-Gara",
            summary = $"Explore the sunken sanctum and purge the slumbering entity.",
            recommendedLevel = level,
            rewardGold = gold,
            rewardExp = exp,
            rewardItems = new List<string> { "Amulet of Ward +10" }
        };
    }
}`;

  return (
    <div
      id="modal-developer-guide-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="modal-developer-guide-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" />
            <h2
              style={{ fontFamily: 'var(--font-cinzel)' }}
              className="text-lg font-bold text-slate-100"
            >
              RPG Quest Generation Engine Documentation & Export
            </h2>
          </div>
          <button
            id="btn-close-dev-modal"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center border-b border-slate-800 px-6 gap-2 bg-slate-950/30 text-xs font-semibold">
          <button
            id="tab-dev-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            System Architecture
          </button>
          <button
            id="tab-dev-typescript"
            onClick={() => setActiveTab('typescript')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'typescript'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            TypeScript / Node
          </button>
          <button
            id="tab-dev-csharp"
            onClick={() => setActiveTab('csharp')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'csharp'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Unity C#
          </button>
          <button
            id="tab-dev-json"
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Quests JSON ({quests.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-300">
          {activeTab === 'architecture' && (
            <div className="space-y-4 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-amber-300 font-bold text-xs uppercase tracking-wider">
                  The Four Procedural Pillars
                </h4>
                <p className="text-xs text-slate-300">
                  Every quest is generated with four interconnected data structures adhering strictly to RPG mechanics:
                </p>
                <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-300">
                  <li>
                    <strong className="text-slate-100">1. Title:</strong> Evocative context-aware narrative generated through combinatoric grammatical templates.
                  </li>
                  <li>
                    <strong className="text-slate-100">2. Objective Briefing:</strong> Clear, concise mission scope identifying who, what, and where to resolve.
                  </li>
                  <li>
                    <strong className="text-slate-100">3. Recommended Level (1-100):</strong> Continuous level scaling mapped to distinct difficulty tiers (Novice, Apprentice, Adept, Veteran, Champion, Mythic).
                  </li>
                  <li>
                    <strong className="text-slate-100">4. Potential Rewards:</strong> Mathematically balanced gold and EXP curves with weighted probability item drop tables scaling from Common to Legendary.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-amber-300 font-bold text-xs uppercase tracking-wider">
                  Reward Scaling Curves
                </h4>
                <div className="font-mono text-xs bg-slate-900 p-3 rounded border border-slate-800 space-y-1 text-slate-300">
                  <div>Gold: <code>15 + Math.pow(level, 1.72) * 12 + variance</code></div>
                  <div>Experience: <code>50 + Math.pow(level, 1.85) * 18 + variance</code></div>
                  <div>Loot Rarities: Weighted rolls unlocked as level increases (Lv 80+ unlocks Legendary pool)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'typescript' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">questGenerator.ts</span>
                <button
                  id="btn-copy-ts-code"
                  onClick={() => handleCopyCode(tsCode)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                {tsCode}
              </pre>
            </div>
          )}

          {activeTab === 'csharp' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">QuestGenerator.cs</span>
                <button
                  id="btn-copy-csharp-code"
                  onClick={() => handleCopyCode(csharpCode)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
                {csharpCode}
              </pre>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">
                  {quests.length} Generated Quest Record(s)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-copy-json"
                    onClick={() => handleCopyCode(jsonString)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy JSON'}
                  </button>
                  <button
                    id="btn-download-json"
                    onClick={handleDownloadJSON}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300/90 max-h-80 overflow-y-auto">
                {jsonString}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            id="btn-dismiss-dev-modal"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
