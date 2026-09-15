import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { Navbar } from './components/common/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ExamPortal } from './components/exam/ExamPortal';
import { ResultsView } from './components/results/ResultsView';
import { HistoryView } from './components/history/HistoryView';
import { ExamGeneratorModal } from './components/generator/ExamGeneratorModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { ExamCategory, MockTest, TestResult } from './types/exam';
import { PRELOADED_TESTS, EXAM_CONFIGS } from './data/mockExams';

export const App: React.FC = () => {
  // Navigation & Active Test State
  const [currentView, setCurrentView] = useState<'dashboard' | 'exam' | 'results' | 'history'>('dashboard');
  const [selectedExam, setSelectedExam] = useState<ExamCategory>('rrb_ntpc');
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [activeResult, setActiveResult] = useState<TestResult | null>(null);

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [generatorInitialExam, setGeneratorInitialExam] = useState<ExamCategory>('rrb_ntpc');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [confirmExam, setConfirmExam] = useState<ExamCategory | null>(null);

  // User / Auth State (Login enforced)
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('mocktest_user_email');
  });

  // Dark Mode Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mocktest_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mocktest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mocktest_theme', 'light');
    }
  }, [darkMode]);

  // Start preloaded authentic exam immediately
  const handleStartPreloadedExam = (category: ExamCategory) => {
    const test = PRELOADED_TESTS.find((t) => t.examType === category) || PRELOADED_TESTS[0];
    setActiveTest(test);
    setCurrentView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open generator modal with specific exam pre-selected
  const handleOpenGeneratorWithExam = (category: ExamCategory) => {
    setGeneratorInitialExam(category);
    setIsGeneratorOpen(true);
  };

  // Callback when a new test is generated via AI or OCR
  const handleTestGenerated = (test: MockTest) => {
    setActiveTest(test);
    setCurrentView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback when test is submitted
  const handleFinishTest = (result: TestResult) => {
    setActiveResult(result);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Review a past result from history or dashboard
  const handleViewResult = (result: TestResult) => {
    setActiveResult(result);
    // Find matching test structure or recreate minimal question set for solution review
    const found = PRELOADED_TESTS.find((t) => t.id === result.testId);
    if (found) {
      setActiveTest(found);
    } else if (activeTest && activeTest.id === result.testId) {
      // Keep existing active test
    } else {
      // Create fallback container
      setActiveTest({
        id: result.testId,
        title: result.testTitle,
        examType: result.examType,
        description: 'Completed Test Review',
        durationMinutes: Math.round(result.timeTakenSeconds / 60),
        totalMarks: result.maxScore,
        marksPerQuestion: 1,
        negativeMark: 0.25,
        sections: result.sectionBreakdown.map((s) => s.sectionName),
        questions: (PRELOADED_TESTS.find((t) => t.examType === result.examType) || PRELOADED_TESTS[0]).questions,
        createdAt: result.completedAt,
      });
    }
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Universal Navbar (Hidden inside active ExamPortal for distraction-free exam simulation) */}
      {currentView !== 'exam' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenGenerator={() => {
            setGeneratorInitialExam(selectedExam);
            setIsGeneratorOpen(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            localStorage.removeItem('mocktest_user_email');
            setUserEmail(null);
          }}
          selectedExam={selectedExam}
          onSelectExam={(exam) => setSelectedExam(exam)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          userEmail={userEmail || undefined}
          isGuest={!userEmail}
        />
      )}

      {/* Main View Container */}
      <main className={`flex-1 ${currentView === 'exam' ? 'p-0' : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {currentView === 'dashboard' && (
          <Dashboard
            onStartPreloadedExam={(cat) => setConfirmExam(cat)}
            onOpenGeneratorWithExam={handleOpenGeneratorWithExam}
            onOpenGenerator={() => {
              setGeneratorInitialExam(selectedExam);
              setIsGeneratorOpen(true);
            }}
            onViewResult={handleViewResult}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onSelectResult={handleViewResult}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'exam' && activeTest && (
          <ExamPortal
            test={activeTest}
            candidateName={(userEmail || 'Candidate').split('@')[0]}
            onFinishTest={handleFinishTest}
            onExitWithoutSubmit={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'results' && activeResult && activeTest && (
          <ResultsView
            result={activeResult}
            test={activeTest}
            onRetake={() => {
              setConfirmExam(activeTest.examType);
            }}
            onGoHome={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Footer (Hidden in exam mode) */}
      {currentView !== 'exam' && (
        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 transition-colors text-center text-xs text-slate-500 dark:text-slate-400 no-print">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">MockMaster AI</span>
              <span>•</span>
              <span>RRB NTPC, SSC CGL/CHSL, IBPS PO, WBPSC Exam Simulator</span>
            </div>
            <div className="text-slate-400">
              Zero-Server Client-Side Architecture • Free Hosting Ready (GitHub Pages / Vercel)
            </div>
          </div>
        </footer>
      )}

      {/* Confirmation Modal before starting test */}
      {confirmExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Start {EXAM_CONFIGS.find((c) => c.id === confirmExam)?.shortName} Mock Test?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please confirm to begin the timed test session.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {PRELOADED_TESTS.find((t) => t.examType === confirmExam)?.durationMinutes || 20} Minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {PRELOADED_TESTS.find((t) => t.examType === confirmExam)?.questions.length || 10} MCQs
                </span>
              </div>
              <div className="flex justify-between">
                <span>Marking Scheme:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  +{EXAM_CONFIGS.find((c) => c.id === confirmExam)?.marksPerQuestion || 1} | -{( (EXAM_CONFIGS.find((c) => c.id === confirmExam)?.marksPerQuestion || 1) * (EXAM_CONFIGS.find((c) => c.id === confirmExam)?.negativeMarkRatio || 0.25) ).toFixed(2)} Neg
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmExam(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const cat = confirmExam;
                  setConfirmExam(null);
                  handleStartPreloadedExam(cat);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition"
              >
                Yes, Start Mock Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generator Modal */}
      <ExamGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onTestGenerated={handleTestGenerated}
        initialExam={generatorInitialExam}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataReset={() => {
          if (currentView === 'results' || currentView === 'history') {
            setCurrentView('dashboard');
          }
        }}
      />

      {/* Auth Modal (Enforced if not logged in) */}
      <AuthModal
        isOpen={isAuthOpen || !userEmail}
        canClose={!!userEmail}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(email) => {
          setUserEmail(email);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
};

export default App;
