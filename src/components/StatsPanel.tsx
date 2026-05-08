import * as React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { FocusSession, ThemeConfig } from '@/src/types';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

interface StatsPanelProps {
  sessions: FocusSession[];
  theme: ThemeConfig;
}

export default function StatsPanel({ sessions, theme }: StatsPanelProps) {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  const weekSessions = sessions.filter(s => 
    isWithinInterval(new Date(s.completedAt), { start: weekStart, end: weekEnd })
  );

  const totalMinutes = weekSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const focusScore = Math.min(100, Math.round((totalMinutes / 600) * 100)); // Arbitrary target 10h/week

  return (
    <div className={cn("w-full space-y-8", theme.font)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("p-6 rounded-3xl border flex flex-col space-y-2", theme.colors.cardBg, theme.colors.cardBorder)}
        >
          <div className="flex items-center space-x-2 opacity-50">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-current">Focus Score</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={cn("text-4xl font-light", theme.colors.text)}>{focusScore}</span>
            <span className={cn("text-sm opacity-30 font-bold", theme.colors.text)}>%</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("p-6 rounded-3xl border flex flex-col space-y-2", theme.colors.cardBg, theme.colors.cardBorder)}
        >
          <div className="flex items-center space-x-2 opacity-50">
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-current">Work Time</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={cn("text-4xl font-light", theme.colors.text)}>{totalHours}</span>
            <span className={cn("text-sm opacity-30 font-bold", theme.colors.text)}>HRS</span>
          </div>
        </motion.div>
      </div>

      {/* Week Visualization */}
      <div className={cn("p-6 rounded-3xl border space-y-4", theme.colors.cardBg, theme.colors.cardBorder)}>
        <h3 className={cn("text-[10px] uppercase font-bold tracking-widest opacity-40", theme.colors.text)}>
          Intensity This Week
        </h3>
        <div className="flex items-end justify-between h-32 px-2">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const daySessions = weekSessions.filter(s => new Date(s.completedAt).getDay() === day);
            const dayMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);
            const height = Math.max(10, Math.min(100, (dayMinutes / 120) * 100)); // target 2h/day
            
            return (
              <div key={day} className="flex flex-col items-center space-y-2 group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  className={cn(
                    "w-4 rounded-full transition-all",
                    dayMinutes > 0 ? `bg-${theme.colors.accent}` : "bg-current opacity-10"
                  )}
                />
                <span className="text-[10px] font-bold opacity-30 uppercase">
                  {['S','M','T','W','T','F','S'][day]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
