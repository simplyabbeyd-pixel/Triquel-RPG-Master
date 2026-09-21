import React from 'react';
import { ItemRarity, QuestItem } from '../types/quest';
import { Shield, Sparkles, Sword, Wand2, Beaker, Scroll } from 'lucide-react';

interface ItemBadgeProps {
  item: QuestItem;
  onClick?: () => void;
}

export const rarityColors: Record<ItemRarity, {
  border: string;
  bg: string;
  text: string;
  badge: string;
  shadow: string;
}> = {
  common: {
    border: 'border-slate-600',
    bg: 'bg-slate-900/80',
    text: 'text-slate-200',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    shadow: 'hover:shadow-slate-500/20',
  },
  uncommon: {
    border: 'border-emerald-500/60',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-700/50',
    shadow: 'hover:shadow-emerald-500/20',
  },
  rare: {
    border: 'border-blue-500/60',
    bg: 'bg-blue-950/40',
    text: 'text-blue-300',
    badge: 'bg-blue-950 text-blue-300 border-blue-700/50',
    shadow: 'hover:shadow-blue-500/20',
  },
  epic: {
    border: 'border-purple-500/70',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    badge: 'bg-purple-950 text-purple-300 border-purple-700/50',
    shadow: 'hover:shadow-purple-500/25',
  },
  legendary: {
    border: 'border-amber-400/80',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    badge: 'bg-amber-950 text-amber-200 border-amber-600/60',
    shadow: 'hover:shadow-amber-500/30',
  },
};

export const getItemIcon = (type: QuestItem['type']) => {
  switch (type) {
    case 'weapon':
      return <Sword className="w-3.5 h-3.5" />;
    case 'armor':
      return <Shield className="w-3.5 h-3.5" />;
    case 'accessory':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'potion':
      return <Beaker className="w-3.5 h-3.5" />;
    case 'scroll':
      return <Scroll className="w-3.5 h-3.5" />;
    case 'relic':
    default:
      return <Wand2 className="w-3.5 h-3.5" />;
  }
};

export const ItemCard: React.FC<ItemBadgeProps> = ({ item, onClick }) => {
  const styles = rarityColors[item.rarity];

  return (
    <div
      id={`item-card-${item.id}`}
      onClick={onClick}
      className={`group relative flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg border ${styles.border} ${styles.bg} ${styles.shadow} transition-all duration-200 cursor-default hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className={`p-1.5 rounded-md border ${styles.badge} shrink-0`}>
          {getItemIcon(item.type)}
        </div>
        <div className="min-w-0">
          <div className={`text-xs font-semibold truncate ${styles.text}`}>
            {item.name}
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {item.effect || item.description || item.type}
          </div>
        </div>
      </div>
      <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${styles.badge}`}>
        {item.rarity}
      </span>
    </div>
  );
};
