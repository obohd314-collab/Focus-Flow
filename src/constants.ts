import { ThemeConfig } from './types';

export const THEMES: Record<string, ThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      bg: 'bg-zinc-50',
      text: 'text-zinc-900',
      accent: 'zinc-900',
      secondary: 'text-zinc-500',
      cardBg: 'bg-white',
      cardBorder: 'border-zinc-200',
    },
    font: 'font-sans',
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    colors: {
      bg: 'bg-green-50',
      text: 'text-green-950',
      accent: 'green-600',
      secondary: 'text-green-800/60',
      cardBg: 'bg-white/60',
      cardBorder: 'border-green-100',
    },
    font: 'font-sans',
    gradient: 'radial-gradient(circle at 50% 50%, #f0fdf4 0%, #dcfce7 100%)',
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic',
    colors: {
      bg: 'bg-slate-950',
      text: 'text-slate-50',
      accent: 'indigo-500',
      secondary: 'text-slate-400',
      cardBg: 'bg-slate-900/40',
      cardBorder: 'border-slate-800',
    },
    font: 'font-sans',
    gradient: 'radial-gradient(circle at 20% 30%, #1e1b4b 0%, #020617 100%)',
  },
  lofi: {
    id: 'lofi',
    name: 'Lo-fi',
    colors: {
      bg: 'bg-amber-50',
      text: 'text-amber-950',
      accent: 'orange-500',
      secondary: 'text-amber-800/60',
      cardBg: 'bg-orange-100/30',
      cardBorder: 'border-orange-200/50',
    },
    font: 'font-mono',
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
  },
};

export const AMBIENT_SOUNDS = [
  { id: 'none', name: 'Silence', url: '' },
  { id: 'rain', name: 'Soft Rain', url: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3' },
  { id: 'cafe', name: 'Cozy Cafe', url: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3' },
  { id: 'forest', name: 'Forest Birds', url: 'https://assets.mixkit.co/active_storage/sfx/2359/2359-preview.mp3' },
  { id: 'noise', name: 'White Noise', url: 'https://assets.mixkit.co/active_storage/sfx/2360/2360-preview.mp3' },
];

export const INITIAL_SETTINGS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartWork: false,
  theme: 'minimal' as const,
  soundEnabled: true,
  selectedSound: 'none',
};
