import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Trash2, ListTodo } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Todo, ThemeConfig } from '@/src/types';

interface TodoManagerProps {
  todos: Todo[];
  theme: ThemeConfig;
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export default function TodoManager({
  todos,
  theme,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: TodoManagerProps) {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col space-y-6", theme.font)}>
      <div className="flex items-center space-x-2 px-2">
        <ListTodo className={cn("w-5 h-5", theme.colors.text)} />
        <h2 className={cn("text-xs uppercase tracking-widest font-semibold opacity-60", theme.colors.text)}>
          Focus Tasks
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What are you working on?"
          className={cn(
            "w-full px-6 py-4 rounded-2xl outline-none transition-all",
            "bg-white/10 backdrop-blur-md border",
            theme.colors.cardBorder,
            theme.colors.text,
            "placeholder:text-current/30 focus:bg-white/20"
          )}
        />
        <button
          type="submit"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
            "bg-current text-white scale-90 group-hover:scale-100",
            inputValue.trim() ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundColor: inputValue.trim() ? 'var(--accent-color)' : '' }}
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex flex-col space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              className={cn(
                "flex items-center space-x-4 p-4 rounded-2xl border transition-all",
                "bg-white/5 backdrop-blur-sm",
                theme.colors.cardBorder,
                todo.completed && "opacity-40 grayscale"
              )}
            >
              <button
                onClick={() => onToggleTodo(todo.id)}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  todo.completed 
                    ? `bg-${theme.colors.accent} border-transparent` 
                    : "border-current/20 hover:border-current/50"
                )}
              >
                {todo.completed && <Check className="w-4 h-4 text-white" />}
              </button>
              
              <span className={cn(
                "flex-1 text-sm transition-all",
                theme.colors.text,
                todo.completed && "line-through"
              )}>
                {todo.text}
              </span>

              <button
                onClick={() => onDeleteTodo(todo.id)}
                className={cn(
                  "p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all",
                  theme.colors.text
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
