import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { cn, formatTime } from '@/src/lib/utils';
import { SessionType, ThemeConfig } from '@/src/types';

interface TimerDisplayProps {
  secondsRemaining: number;
  totalSeconds: number;
  isActive: boolean;
  sessionType: SessionType;
  theme: ThemeConfig;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export default function TimerDisplay({
  secondsRemaining,
  totalSeconds,
  isActive,
  sessionType,
  theme,
  onToggle,
  onReset,
  onSkip,
}: TimerDisplayProps) {
  const progress = (secondsRemaining / totalSeconds) * 100;
  
  const getStatusText = () => {
    switch (sessionType) {
      case 'work': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <div className="relative flex items-center justify-center">
        {/* Progress Circle Backdrop */}
        <svg className="w-80 h-80 -rotate-90 md:w-96 md:h-96">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            className={cn("fill-transparent stroke-current opacity-10", theme.colors.text)}
            strokeWidth="2"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="100 100"
            className={theme.colors.text}
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            layoutId="status-text"
            className={cn("text-xs uppercase tracking-[0.4em] mb-2 font-medium opacity-60", theme.font)}
          >
            {getStatusText()}
          </motion.span>
          <motion.h1 
            key={secondsRemaining}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("text-8xl md:text-9xl font-light tracking-tighter tabular-nums", theme.font, theme.colors.text)}
          >
            {formatTime(secondsRemaining)}
          </motion.h1>
        </div>

        {/* Ambient Glow */}
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute -inset-10 blur-3xl rounded-full z-[-1] opacity-20", `bg-${theme.colors.accent}`)}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-8">
        <button
          onClick={onReset}
          className={cn(
            "p-4 rounded-full transition-all hover:scale-110 active:scale-95 group",
            "bg-white/10 backdrop-blur-sm border border-current opacity-20 hover:opacity-100",
            theme.colors.text
          )}
          title="Reset Session"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <button
          onClick={onToggle}
          className={cn(
            "p-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl",
            "flex items-center justify-center",
            isActive ? `bg-white/20 ${theme.colors.text}` : `bg-${theme.colors.accent} text-white`
          )}
        >
          {isActive ? (
            <Pause className="w-10 h-10 fill-current" />
          ) : (
            <Play className="w-10 h-10 fill-current translate-x-1" />
          )}
        </button>

        <button
          onClick={onSkip}
          className={cn(
            "p-4 rounded-full transition-all hover:scale-110 active:scale-95 group",
            "bg-white/10 backdrop-blur-sm border border-current opacity-20 hover:opacity-100",
            theme.colors.text
          )}
          title="Skip Session"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
