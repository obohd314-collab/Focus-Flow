export type ThemeType = 'minimal' | 'nature' | 'cosmic' | 'lofi';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  colors: {
    bg: string;
    text: string;
    accent: string;
    secondary: string;
    cardBg: string;
    cardBorder: string;
  };
  font: string;
  gradient?: string;
}

export type SessionType = 'work' | 'shortBreak' | 'longBreak';

export interface FocusSession {
  id: string;
  type: SessionType;
  duration: number; // in minutes
  completedAt: number; // timestamp
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  theme: ThemeType;
  soundEnabled: boolean;
  selectedSound: string;
}
