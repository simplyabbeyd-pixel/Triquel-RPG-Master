import React, { useState } from 'react';
import { Quest, QuestType } from '../types/quest';
import { getDifficultyForLevel } from '../utils/questData';
import { Plus, Trash2, X } from 'lucide-react';

interface QuestEditModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Quest) => void;
}

export const QuestEditModal: React.FC<QuestEditModalProps> = ({
  quest,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !quest) return null;

  const [title, setTitle] = useState(quest.title);
  const [summary, setSummary] = useState(quest.summary);
  const [level, setLevel] = useState(quest.recommendedLevel);
  const [type, setType] = useState<QuestType>(quest.type);
  const [gold, setGold] = useState(quest.rewards.gold);
  const [exp, setExp] = useState(quest.rewards.exp);
  const [objectives, setObjectives] = useState(quest.objectives);
  const [newObjText, setNewObjText] = useState('');

  const handleAddObjective = () => {
    if (!newObjText.trim()) return;
    setObjectives([
      ...objectives,
      {
        id: 'obj_' + Math.random().toString(36).substring(2, 7),
        text: newObjText.trim(),
        completed: false,
      },
    ]);
    setNewObjText('');
  };

  const handleRemoveObjective = (id: string) => {
    setObjectives(objectives.filter((o) => o.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Quest = {
      ...quest,
      title: title.trim() || quest.title,
      summary: summary.trim() || quest.summary,
      recommendedLevel: level,
      difficulty: getDifficultyForLevel(level),
      type,
      objectives,
      rewards: {
        ...quest.rewards,
        gold,
        exp,
      },
    };
    onSave(updated);
    onClose();
  };

  return (
    <div
      id="modal-edit-quest-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="modal-edit-quest-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2
            style={{ fontFamily: 'var(--font-cinzel)' }}
            className="text-lg font-bold text-amber-400"
          >
            Customize Quest Dispatch
          </h2>
          <button
            id="btn-close-edit-modal"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Quest Title
            </label>
            <input
              id="input-edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Level & Type Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Recommended Level (1-100)
              </label>
              <input
                id="input-edit-level"
                type="number"
                min={1}
                max={100}
                value={level}
                onChange={(e) => setLevel(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Quest Category
              </label>
              <select
                id="select-edit-type"
                value={type}
                onChange={(e) => setType(e.target.value as QuestType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="hunt">Hunt / Slayer</option>
                <option value="retrieval">Retrieval</option>
                <option value="bounty">Bounty</option>
                <option value="dungeon">Dungeon Delve</option>
                <option value="investigation">Investigation</option>
                <option value="escort">Caravan Escort</option>
                <option value="defense">Fort Defense</option>
              </select>
            </div>
          </div>

          {/* Objective Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Objective Briefing (Description)
            </label>
            <textarea
              id="textarea-edit-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Objectives List */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Mission Checklist Milestones
            </label>
            <div className="space-y-2 mb-2">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-950 rounded-md border border-slate-800"
                >
                  <span className="text-xs text-slate-200">{obj.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(obj.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                id="input-new-objective-text"
                type="text"
                placeholder="Add milestone objective..."
                value={newObjText}
                onChange={(e) => setNewObjText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                id="btn-add-objective"
                onClick={handleAddObjective}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Gold Reward (GP)
              </label>
              <input
                id="input-edit-gold"
                type="number"
                min={0}
                value={gold}
                onChange={(e) => setGold(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Experience Reward (EXP)
              </label>
              <input
                id="input-edit-exp"
                type="number"
                min={0}
                value={exp}
                onChange={(e) => setExp(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              id="btn-cancel-edit-quest"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-edited-quest"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs tracking-wide"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
