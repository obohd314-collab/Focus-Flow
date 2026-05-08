import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Maximize2, Minimize2, Trophy, Clock, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { INITIAL_SETTINGS, THEMES } from '@/src/constants';
import { Settings, Todo, FocusSession, SessionType, ThemeType } from '@/src/types';

// Components
import TimerDisplay from './components/TimerDisplay';
import TodoManager from './components/TodoManager';
import ThemeSwitcher from './components/ThemeSwitcher';
import AmbientSoundController from './components/AmbientSoundController';
import StatsPanel from './components/StatsPanel';
import SettingsModal from './components/SettingsModal';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  // State
  const [settings, setSettings] = React.useState<Settings>(INITIAL_SETTINGS);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [sessions, setSessions] = React.useState<FocusSession[]>([]);
  const [currentSessionType, setCurrentSessionType] = React.useState<SessionType>('work');
  const [secondsRemaining, setSecondsRemaining] = React.useState(INITIAL_SETTINGS.workDuration * 60);
  const [isActive, setIsActive] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showStats, setShowStats] = React.useState(false);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  const currentTheme = THEMES[settings.theme];

  // Persistence
  React.useEffect(() => {
    const savedTodos = localStorage.getItem('ff_todos');
    const savedSessions = localStorage.getItem('ff_sessions');
    const savedSettings = localStorage.getItem('ff_settings');

    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        // Important: Use settings.workDuration if the parsed duration isn't available or just use INITIAL
        setSecondsRemaining(parsedSettings.workDuration * 60);
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('ff_todos', JSON.stringify(todos));
  }, [todos]);

  React.useEffect(() => {
    localStorage.setItem('ff_sessions', JSON.stringify(sessions));
  }, [sessions]);

  React.useEffect(() => {
    localStorage.setItem('ff_settings', JSON.stringify(settings));
  }, [settings]);

  // Timer Logic
  React.useEffect(() => {
    let interval: any = null;

    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    if (currentSessionType === 'work') {
      const newSession: FocusSession = {
        id: crypto.randomUUID(),
        type: 'work',
        duration: settings.workDuration,
        completedAt: Date.now(),
      };
      setSessions((prev) => [...prev, newSession]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }

    // Switch session type
    if (currentSessionType === 'work') {
      const nextType = (sessions.length + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setCurrentSessionType(nextType);
      setSecondsRemaining((nextType === 'longBreak' ? settings.longBreakDuration : settings.shortBreakDuration) * 60);
    } else {
      setCurrentSessionType('work');
      setSecondsRemaining(settings.workDuration * 60);
    }
  };

  const handleToggleTimer = () => setIsActive(!isActive);

  const handleResetTimer = () => {
    setIsActive(false);
    const duration = currentSessionType === 'work' 
      ? settings.workDuration 
      : (currentSessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration);
    setSecondsRemaining(duration * 60);
  };

  const handleSkipSession = () => {
    setSecondsRemaining(0);
  };

  const currentTotalSeconds = (currentSessionType === 'work' 
    ? settings.workDuration 
    : (currentSessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration)) * 60;

  return (
    <div 
      className={cn(
        "min-h-screen transition-all duration-1000 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden",
        currentTheme.colors.bg,
        currentTheme.font
      )}
      style={{ 
        backgroundImage: currentTheme.gradient,
        // @ts-ignore
        '--accent-color': `var(--color-${currentTheme.colors.accent.split('-')[0]}-${currentTheme.colors.accent.split('-')[1]})`,
        '--accent-raw': currentTheme.colors.accent // Fallback for some components
      } as React.CSSProperties}
    >
      {/* Background Ambience Decorations */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-current opacity-[0.03] blur-3xl rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-current opacity-[0.03] blur-3xl rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 p-8 flex items-center justify-between z-50">
        <div className="flex items-center space-x-3">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-current/10", `bg-${currentTheme.colors.accent}`)}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className={cn("text-lg font-bold tracking-tight leading-none", currentTheme.colors.text)}>Focus Flow</h1>
            <p className={cn("text-[10px] uppercase tracking-widest font-bold opacity-30 mt-1", currentTheme.colors.text)}>Deep Work Operating System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCheckoutOpen(true)}
            className={cn(
              "hidden md:flex items-center space-x-2 px-6 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-current/20",
              `bg-${currentTheme.colors.accent}`
            )}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Go Pro</span>
          </motion.button>
          <button 
            onClick={() => setShowStats(!showStats)}
            className={cn("p-3 rounded-xl transition-all hover:bg-black/5 active:scale-95", currentTheme.colors.text)}
            title="Statistics"
          >
            <Trophy className={cn("w-5 h-5", showStats && "fill-current")} />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={cn("p-3 rounded-xl transition-all hover:bg-black/5 active:scale-95", currentTheme.colors.text)}
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={cn("p-3 rounded-xl transition-all hover:bg-black/5 active:scale-95", currentTheme.colors.text)}
            title="Focus Mode"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        theme={currentTheme}
        onUpdate={(s) => setSettings(s)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        theme={currentTheme}
      />

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 items-start">
        {/* Left Sidebar: Controls & Stats */}
        {!isFullscreen && (
          <div className="md:col-span-3 space-y-12 hidden md:block">
            <ThemeSwitcher 
              currentThemeId={settings.theme} 
              theme={currentTheme}
              onThemeChange={(id) => setSettings(s => ({ ...s, theme: id }))} 
            />
            <AmbientSoundController 
              theme={currentTheme}
              selectedSoundId={settings.selectedSound}
              onSelectSound={(id) => setSettings(s => ({ ...s, selectedSound: id }))}
            />
            {showStats && <StatsPanel sessions={sessions} theme={currentTheme} />}
          </div>
        )}

        {/* Center: Main Timer */}
        <div className={cn(
          "transition-all duration-700 flex items-center justify-center",
          isFullscreen ? "md:col-span-12 h-[80vh]" : "md:col-span-6"
        )}>
          <TimerDisplay
            secondsRemaining={secondsRemaining}
            totalSeconds={currentTotalSeconds}
            isActive={isActive}
            sessionType={currentSessionType}
            theme={currentTheme}
            onToggle={handleToggleTimer}
            onReset={handleResetTimer}
            onSkip={handleSkipSession}
          />
        </div>

        {/* Right Sidebar: Todos */}
        {!isFullscreen && (
          <div className="md:col-span-3 h-full">
            <TodoManager
              todos={todos}
              theme={currentTheme}
              onAddTodo={(text) => setTodos([...todos, { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() }])}
              onToggleTodo={(id) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
              onDeleteTodo={(id) => setTodos(todos.filter(t => t.id !== id))}
            />
          </div>
        )}
      </main>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={cn("w-64 h-64 border-4 border-dashed border-white rounded-full opacity-20")}
            />
            <div className="absolute flex flex-col items-center space-y-4">
              <Trophy className="w-20 h-20 text-white fill-current animate-bounce" />
              <h2 className="text-4xl font-bold text-white tracking-tight">Session Complete!</h2>
              <p className="text-white/60 uppercase tracking-widest font-bold text-sm">You earned 25 focus points</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Details */}
      {!isFullscreen && (
        <footer className="fixed bottom-8 left-0 right-0 px-12 flex items-center justify-between opacity-30">
          <div className={cn("text-[10px] uppercase font-bold tracking-widest", currentTheme.colors.text)}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500')} />
              <span className={cn("text-[10px] uppercase font-bold tracking-widest", currentTheme.colors.text)}>
                {isActive ? 'Session in Progress' : 'System Idle'}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
