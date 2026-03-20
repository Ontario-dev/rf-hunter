import { Radio, Moon, Sun } from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10 shadow-sm dark:shadow-md transition-colors duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-xl shadow-lg shadow-green-500/20">
            <Radio className="text-slate-950 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent tracking-tight">
            rf-hunter
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle themes"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
