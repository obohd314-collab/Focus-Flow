import * as React from 'react';
import { motion } from 'motion/react';
import { Palette, Sparkles, Leaf, Moon, Monitor } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { THEMES } from '@/src/constants';
import { ThemeType, ThemeConfig } from '@/src/types';

interface ThemeSwitcherProps {
  currentThemeId: ThemeType;
  theme: ThemeConfig;
  onThemeChange: (id: ThemeType) => void;
}

export default function ThemeSwitcher({
  currentThemeId,
  theme,
  onThemeChange,
}: ThemeSwitcherProps) {
  const themes = Object.values(THEMES);

  const getThemeIcon = (id: ThemeType) => {
    switch (id) {
      case 'minimal': return <Monitor className="w-4 h-4" />;
      case 'nature': return <Leaf className="w-4 h-4" />;
      case 'cosmic': return <Moon className="w-4 h-4" />;
      case 'lofi': return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2 px-2">
        <Palette className={cn("w-4 h-4", theme.colors.text)} />
        <span className={cn("text-[10px] uppercase tracking-widest font-bold opacity-40", theme.colors.text)}>
          Vibe Selector
        </span>
      </div>
      
      <div className="flex items-center space-x-2 p-1 rounded-2xl bg-black/5 backdrop-blur-md border border-white/10">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            className={cn(
              "relative px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2",
              currentThemeId === t.id 
                ? "text-white shadow-lg" 
                : cn("opacity-60 hover:opacity-100", theme.colors.text)
            )}
          >
            {currentThemeId === t.id && (
              <motion.div
                layoutId="theme-pill"
                className={cn("absolute inset-0 rounded-xl z-[-1]", `bg-${theme.colors.accent}`)}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {getThemeIcon(t.id)}
            <span className="hidden md:inline">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
