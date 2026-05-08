import * as React from 'react';
import { Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { ThemeConfig, Settings as SettingsType } from '@/src/types';

interface SettingsModalProps {
  settings: SettingsType;
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (settings: SettingsType) => void;
}

export default function SettingsModal({
  settings,
  theme,
  isOpen,
  onClose,
  onUpdate,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[70]",
              "p-8 rounded-[2rem] border shadow-2xl",
              theme.colors.cardBg,
              theme.colors.cardBorder,
              theme.font
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Settings className={cn("w-6 h-6", theme.colors.text)} />
                <h2 className={cn("text-xl font-bold tracking-tight", theme.colors.text)}>Configuration</h2>
              </div>
              <button onClick={onClose} className={cn("p-2 rounded-full hover:bg-black/5", theme.colors.text)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className={cn("text-[10px] uppercase font-bold tracking-widest opacity-40", theme.colors.text)}>Session Durations (Min)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-2">
                    <span className={cn("text-xs opacity-60", theme.colors.text)}>Work</span>
                    <input 
                      type="number" 
                      value={settings.workDuration}
                      onChange={(e) => onUpdate({ ...settings, workDuration: Number(e.target.value) })}
                      className={cn("p-4 rounded-2xl bg-black/5 border outline-none focus:ring-2", theme.colors.cardBorder, theme.colors.text)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className={cn("text-xs opacity-60", theme.colors.text)}>Short</span>
                    <input 
                      type="number" 
                      value={settings.shortBreakDuration}
                      onChange={(e) => onUpdate({ ...settings, shortBreakDuration: Number(e.target.value) })}
                      className={cn("p-4 rounded-2xl bg-black/5 border outline-none focus:ring-2", theme.colors.cardBorder, theme.colors.text)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className={cn("text-xs opacity-60", theme.colors.text)}>Long</span>
                    <input 
                      type="number" 
                      value={settings.longBreakDuration}
                      onChange={(e) => onUpdate({ ...settings, longBreakDuration: Number(e.target.value) })}
                      className={cn("p-4 rounded-2xl bg-black/5 border outline-none focus:ring-2", theme.colors.cardBorder, theme.colors.text)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-3xl bg-black/5">
                <div className="flex flex-col">
                  <span className={cn("text-sm font-semibold", theme.colors.text)}>Auto-start Sessions</span>
                  <span className={cn("text-[10px] opacity-40 uppercase font-bold", theme.colors.text)}>Skip manual transition</span>
                </div>
                <button 
                  onClick={() => onUpdate({ ...settings, autoStartWork: !settings.autoStartWork })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.autoStartWork ? `bg-${theme.colors.accent}` : "bg-black/20"
                  )}
                >
                  <motion.div 
                    animate={{ x: settings.autoStartWork ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" 
                  />
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className={cn(
                "w-full mt-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all",
                `bg-${theme.colors.accent} text-white hover:scale-[1.02] active:scale-95 shadow-xl`
              )}
            >
              Apply Transformations
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
