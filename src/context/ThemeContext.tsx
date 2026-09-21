import React, { createContext, useContext, useEffect, useState } from 'react';
import { playParchmentRustleSound, playDarkFantasySound } from '../utils/audio';

export type ThemeMode = 'dark' | 'parchment';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isParchment: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rpg_theme_mode');
        if (saved === 'parchment' || saved === 'dark') {
          return saved;
        }
      } catch {
        // Local storage might not be accessible
      }
    }
    return 'dark'; // 'Dark Fantasy' default
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'parchment') {
      root.classList.add('theme-parchment');
      root.classList.remove('theme-dark');
      body.classList.add('theme-parchment');
      body.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-parchment');
      body.classList.add('theme-dark');
      body.classList.remove('theme-parchment');
    }
    try {
      localStorage.setItem('rpg_theme_mode', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;
    setThemeState(newTheme);
    if (newTheme === 'parchment') {
      playParchmentRustleSound();
    } else {
      playDarkFantasySound();
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'parchment' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isParchment: theme === 'parchment',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
