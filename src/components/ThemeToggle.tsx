import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Scroll, Sparkles, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme, toggleTheme, isParchment } = useTheme();

  return (
    <div
      id="tabletop-theme-toggle-container"
      className={`inline-flex items-center rounded-xl p-1 transition-all duration-300 ${
        isParchment
          ? 'bg-[#ede3ce] border border-[#d5c7a9] shadow-sm'
          : 'bg-slate-900 border border-slate-800 shadow-md'
      } ${className}`}
      role="group"
      aria-label="Tabletop display theme mode selector"
    >
      {/* Dark Fantasy Mode Button */}
      <button
        id="btn-theme-dark-fantasy"
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={!isParchment}
        title="Dark Fantasy: Obsidian dungeon atmosphere with illuminated amber runes"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
          !isParchment
            ? 'bg-slate-950 text-amber-300 shadow-sm border border-amber-500/40 ring-1 ring-amber-500/20'
            : 'text-[#6b5f4f] hover:text-[#2c2419] hover:bg-[#e4d8bf]'
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${!isParchment ? 'text-amber-400 fill-amber-400/20' : 'text-[#6b5f4f]'}`} />
        <span className="hidden sm:inline">Dark Fantasy</span>
        <span className="sm:hidden">Dark</span>
      </button>

      {/* Parchment / Light Mode Button */}
      <button
        id="btn-theme-parchment-light"
        type="button"
        onClick={() => setTheme('parchment')}
        aria-pressed={isParchment}
        title="Parchment / Light Mode: Authentic aged paper styling with high contrast iron-gall ink for tabletop sessions and lighted play"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isParchment
            ? 'bg-[#fffdf9] text-[#78350f] shadow-sm border border-[#c4b391] ring-1 ring-[#b45309]/20 font-bold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Scroll className={`w-3.5 h-3.5 ${isParchment ? 'text-[#b45309]' : 'text-slate-400'}`} />
        <span className="hidden sm:inline">Parchment / Light</span>
        <span className="sm:hidden">Parchment</span>
        {isParchment && (
          <span className="hidden md:inline-flex items-center text-[10px] px-1.5 py-0.2 rounded-full bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
            Tabletop
          </span>
        )}
      </button>
    </div>
  );
};
