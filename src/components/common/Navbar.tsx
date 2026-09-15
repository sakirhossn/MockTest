import React from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Settings,
  User,
  History,
  LayoutDashboard,
  FilePlus,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { ExamCategory } from '../../types/exam';
import { EXAM_CONFIGS } from '../../data/mockExams';

interface NavbarProps {
  currentView: 'dashboard' | 'exam' | 'results' | 'history';
  onNavigate: (view: 'dashboard' | 'history') => void;
  onOpenGenerator: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onLogout?: () => void;
  selectedExam: ExamCategory;
  onSelectExam: (exam: ExamCategory) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  userEmail?: string;
  isGuest?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenGenerator,
  onOpenSettings,
  onOpenAuth,
  onLogout,
  selectedExam,
  onSelectExam,
  darkMode,
  onToggleDarkMode,
  userEmail,
  isGuest = true,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Mock<span className="text-indigo-600 dark:text-indigo-400">Master</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                RRB • SSC • IBPS • WBPSC
              </p>
            </div>
          </button>

          {/* Quick Target Exam Selector */}
          <div className="hidden md:flex items-center">
            <select
              value={selectedExam}
              onChange={(e) => onSelectExam(e.target.value as ExamCategory)}
              aria-label="Select Target Exam"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition cursor-pointer"
            >
              {EXAM_CONFIGS.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  Target: {exam.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Navigation Links (Hidden in exam mode) */}
        {currentView !== 'exam' && (
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
            >
              <FilePlus className="w-4 h-4 text-indigo-500" />
              Generate Exam
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'history'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              Past Attempts
            </button>
          </nav>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Create Test CTA Button */}
          {currentView !== 'exam' && (
            <button
              onClick={onOpenGenerator}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Mock Generator
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle color theme"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Configure AI Keys & Supabase"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition relative"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Auth Profile Trigger */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:inline max-w-[90px] truncate">
                {userEmail || 'Profile'}
              </span>
            </button>
            {userEmail && onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
