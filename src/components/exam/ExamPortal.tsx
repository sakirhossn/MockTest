import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Send,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Menu,
  X,
  User,
  FileDown,
} from 'lucide-react';
import { MockTest, UserAnswerState, QuestionStatus, TestResult, SectionBreakdown } from '../../types/exam';
import { MathRenderer } from '../common/MathRenderer';
import { EXAM_CONFIGS } from '../../data/mockExams';
import { downloadMockPaperPDF } from '../../utils/pdfExport';

interface ExamPortalProps {
  test: MockTest;
  candidateName?: string;
  onFinishTest: (result: TestResult) => void;
  onExitWithoutSubmit: () => void;
}

export const ExamPortal: React.FC<ExamPortalProps> = ({
  test,
  candidateName = 'Aspirant (General Category)',
  onFinishTest,
  onExitWithoutSubmit,
}) => {
  // Navigation & Question State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>(test.sections[0] || 'Section 1');
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswerState>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Timer State (in seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(test.durationMinutes * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // UI preferences
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Time tracking per question
  const questionStartTimeRef = useRef<number>(Date.now());
  const questionTimesRef = useRef<Record<string, number>>({});

  const currentQuestion = test.questions[currentIndex];
  const examConfig = EXAM_CONFIGS.find((c) => c.id === test.examType) || EXAM_CONFIGS[0];

  // Initialize answer states on mount
  useEffect(() => {
    const initial: Record<string, UserAnswerState> = {};
    test.questions.forEach((q, idx) => {
      initial[q.id] = {
        questionId: q.id,
        selectedOption: null,
        status: idx === 0 ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0,
      };
    });
    setUserAnswers(initial);
  }, [test]);

  // Main countdown clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto-submit when time expires!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sync selectedOption when moving between questions
  useEffect(() => {
    if (!currentQuestion) return;

    // Track time spent on previous question before switching
    const elapsedNow = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    if (elapsedNow > 0 && currentQuestion) {
      questionTimesRef.current[currentQuestion.id] =
        (questionTimesRef.current[currentQuestion.id] || 0) + elapsedNow;
    }
    questionStartTimeRef.current = Date.now();

    const currentAnswer = userAnswers[currentQuestion.id];
    setSelectedOption(currentAnswer?.selectedOption ?? null);

    // If previously not_visited, transition to not_answered
    if (currentAnswer && currentAnswer.status === 'not_visited') {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          status: 'not_answered',
        },
      }));
    }

    // Auto switch section tab if question belongs to different section
    if (currentQuestion.section && currentQuestion.section !== activeSection) {
      setActiveSection(currentQuestion.section);
    }
  }, [currentIndex]);

  // Format time as HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Status counters for the Question Palette
  const paletteCounts = {
    answered: Object.values(userAnswers).filter((a) => a.status === 'answered').length,
    notAnswered: Object.values(userAnswers).filter((a) => a.status === 'not_answered').length,
    notVisited: Object.values(userAnswers).filter((a) => a.status === 'not_visited').length,
    marked: Object.values(userAnswers).filter((a) => a.status === 'marked').length,
    answeredMarked: Object.values(userAnswers).filter((a) => a.status === 'answered_and_marked').length,
  };

  // Action: Save & Next
  const handleSaveAndNext = () => {
    if (!currentQuestion) return;

    const newStatus: QuestionStatus = selectedOption !== null ? 'answered' : 'not_answered';

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOption,
        status: newStatus,
        timeSpentSeconds: questionTimesRef.current[currentQuestion.id] || 0,
      },
    }));

    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  // Action: Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;

    const newStatus: QuestionStatus =
      selectedOption !== null ? 'answered_and_marked' : 'marked';

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOption,
        status: newStatus,
        timeSpentSeconds: questionTimesRef.current[currentQuestion.id] || 0,
      },
    }));

    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  // Action: Clear Response
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setSelectedOption(null);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: null,
        status: 'not_answered',
      },
    }));
  };

  // Action: Jump to Question from Palette
  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setIsMobileDrawerOpen(false);
  };

  // Action: Filter Questions by Section
  const handleSelectSection = (sectionName: string) => {
    setActiveSection(sectionName);
    const targetIdx = test.questions.findIndex((q) => q.section === sectionName);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    }
  };

  // Action: Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Action: Final Evaluation and Submission
  const handleFinalSubmit = () => {
    // Record final time spent
    const totalElapsedSeconds = test.durationMinutes * 60 - secondsRemaining;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let markedCount = 0;

    const sectionStatsMap: Record<string, SectionBreakdown> = {};

    test.sections.forEach((sec) => {
      sectionStatsMap[sec] = {
        sectionName: sec,
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        score: 0,
        accuracy: 0,
        timeSpentSeconds: 0,
      };
    });

    const speedPerQuestion: { questionId: string; seconds: number; isCorrect: boolean }[] = [];

    test.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      const secName = q.section || test.sections[0] || 'General';
      if (!sectionStatsMap[secName]) {
        sectionStatsMap[secName] = {
          sectionName: secName,
          totalQuestions: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          unattempted: 0,
          score: 0,
          accuracy: 0,
          timeSpentSeconds: 0,
        };
      }

      sectionStatsMap[secName].totalQuestions++;
      const timeSpent = questionTimesRef.current[q.id] || 30;
      sectionStatsMap[secName].timeSpentSeconds += timeSpent;

      if (ans && ans.selectedOption !== null) {
        // Attempted
        sectionStatsMap[secName].attempted++;
        const isCorrect = ans.selectedOption === q.correctAnswer;
        if (isCorrect) {
          correctCount++;
          sectionStatsMap[secName].correct++;
          sectionStatsMap[secName].score += test.marksPerQuestion;
        } else {
          incorrectCount++;
          sectionStatsMap[secName].incorrect++;
          sectionStatsMap[secName].score -= test.negativeMark;
        }
        speedPerQuestion.push({ questionId: q.id, seconds: timeSpent, isCorrect });
      } else {
        // Unattempted
        unattemptedCount++;
        sectionStatsMap[secName].unattempted++;
      }

      if (ans && (ans.status === 'marked' || ans.status === 'answered_and_marked')) {
        markedCount++;
      }
    });

    // Compute Section Accuracy
    const sectionBreakdown = Object.values(sectionStatsMap).map((sec) => ({
      ...sec,
      score: parseFloat(sec.score.toFixed(2)),
      accuracy: sec.attempted > 0 ? Math.round((sec.correct / sec.attempted) * 100) : 0,
    }));

    // Calculate Total Score with exact negative marking
    const rawTotalScore =
      correctCount * test.marksPerQuestion - incorrectCount * test.negativeMark;
    const finalScore = parseFloat(Math.max(0, rawTotalScore).toFixed(2));
    const maxScore = test.questions.length * test.marksPerQuestion;
    const percentage = parseFloat(((finalScore / (maxScore || 1)) * 100).toFixed(1));
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    const clearedCutoff = finalScore >= (examConfig?.expectedCutoffs?.general || 0);

    const result: TestResult = {
      id: `result-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      examType: test.examType,
      completedAt: new Date().toISOString(),
      timeTakenSeconds: totalElapsedSeconds,
      totalQuestions: test.questions.length,
      attemptedCount,
      correctCount,
      incorrectCount,
      unattemptedCount,
      markedCount,
      totalScore: finalScore,
      maxScore,
      percentage,
      accuracy,
      cutoffs: examConfig.expectedCutoffs,
      clearedCutoff,
      sectionBreakdown,
      userAnswers,
      weaknessReport: [],
      speedPerQuestion,
    };

    onFinishTest(result);
  };

  // Dynamic font sizing
  const fontSizeClasses = {
    normal: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg',
    xlarge: 'text-lg sm:text-xl',
  }[fontSizeLevel];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col select-none">
      {/* 1. TCS iON / NTA Style Real Exam Header */}
      <header className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            {test.examType.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base leading-tight tracking-tight">
              {test.title}
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Marking: +{test.marksPerQuestion} | -{test.negativeMark} Negative • Pattern:{' '}
              {examConfig.shortName}
            </p>
          </div>
        </div>

        {/* Right Info: Timer & Candidate */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Zoom / Font Size controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-lg p-1 text-slate-300">
            <button
              onClick={() => setFontSizeLevel('normal')}
              className={`px-2 py-0.5 text-xs rounded ${fontSizeLevel === 'normal' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
              title="Default Font"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('large')}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${fontSizeLevel === 'large' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
              title="Large Font"
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              className={`px-2 py-0.5 text-xs font-bold rounded ${fontSizeLevel === 'xlarge' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
              title="Extra Large Font"
            >
              A++
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden sm:flex p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Countdown Clock with Warning State */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-sm sm:text-base border transition ${
              secondsRemaining < 300
                ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse'
                : 'bg-slate-800 text-emerald-400 border-slate-700'
            }`}
          >
            <Clock className={`w-4 h-4 ${secondsRemaining < 300 ? 'text-rose-400' : 'text-emerald-400'}`} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Candidate Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold leading-none">{candidateName}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">● Connected Live</div>
            </div>
          </div>

          {/* Mobile Palette Drawer Toggle */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open Question Palette"
            className="lg:hidden p-2 rounded-lg bg-indigo-600 text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Section Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            Sections:
          </span>
          {test.sections.map((sec) => {
            const secQuestions = test.questions.filter((q) => q.section === sec);
            const answeredInSec = secQuestions.filter(
              (q) => userAnswers[q.id]?.status === 'answered'
            ).length;

            return (
              <button
                key={sec}
                onClick={() => handleSelectSection(sec)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeSection === sec
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                <span>{sec}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeSection === sec
                      ? 'bg-indigo-800 text-white'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {answeredInSec}/{secQuestions.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Question Counter Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 ml-4">
          <button
            type="button"
            onClick={() => downloadMockPaperPDF(test)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition whitespace-nowrap shadow-xs"
            title="Download full question paper with answer key & solutions on the last page"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Download Paper (PDF)</span>
          </button>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
            Question {currentIndex + 1} of {test.questions.length}
          </div>
        </div>
      </div>

      {/* 3. Main Split View (Question Body + Question Palette) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Question Pane */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
          {/* Question Metadata Header */}
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-slate-900 dark:text-white font-bold text-sm">
                Question No. {currentIndex + 1}
              </span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {currentQuestion?.topic || currentQuestion?.section}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Marks: +{test.marksPerQuestion}
              </span>
              <span className="text-rose-500 font-semibold">
                Neg: -{test.negativeMark}
              </span>
            </div>
          </div>

          {/* Question Text & Math Display */}
          <div className="p-6 sm:p-8 flex-1 space-y-6">
            <div className={`font-medium text-slate-900 dark:text-slate-100 leading-relaxed ${fontSizeClasses}`}>
              {currentQuestion ? (
                <MathRenderer content={currentQuestion.questionText} />
              ) : (
                'Loading question...'
              )}
            </div>

            {/* 4 Distinct Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion?.options.map((optionText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const optionLabel = ['A', 'B', 'C', 'D'][optIdx];

                return (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:border-indigo-500 dark:bg-indigo-950/40 text-slate-900 dark:text-white ring-1 ring-indigo-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {/* Option Radio Button Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 text-slate-500 group-hover:border-slate-400'
                      }`}
                    >
                      {optionLabel}
                    </div>

                    {/* Option Text with Math Rendering */}
                    <div className={`flex-1 ${fontSizeClasses}`}>
                      <MathRenderer content={optionText} inline />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer (Save & Next, Review, Clear) */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
            {/* Left Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleMarkForReviewAndNext}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold transition active:scale-95"
              >
                <Bookmark className="w-4 h-4" />
                Mark for Review & Next
              </button>

              <button
                onClick={handleClearResponse}
                disabled={selectedOption === null}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Response
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                title="Previous Question"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleSaveAndNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition ml-2"
              >
                <Send className="w-4 h-4" />
                Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: TCS iON Question Palette (Desktop View) */}
        <aside className="hidden lg:flex w-80 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex-col">
          <PaletteContent
            test={test}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            paletteCounts={paletteCounts}
            onJumpToQuestion={handleJumpToQuestion}
            onSubmitExam={() => setIsSubmitModalOpen(true)}
          />
        </aside>
      </div>

      {/* Mobile Drawer Question Palette */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          ></div>
          <div className="relative w-80 max-w-[85vw] ml-auto h-full bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Question Palette
              </span>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <PaletteContent
                test={test}
                currentIndex={currentIndex}
                userAnswers={userAnswers}
                paletteCounts={paletteCounts}
                onJumpToQuestion={handleJumpToQuestion}
                onSubmitExam={() => {
                  setIsMobileDrawerOpen(false);
                  setIsSubmitModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Pre-Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Exam Submission Summary
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to submit your test? Here is your current attempt status:
              </p>

              {/* Status Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {paletteCounts.answered}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    Answered
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-center">
                  <div className="text-lg font-black text-rose-600 dark:text-rose-400">
                    {paletteCounts.notAnswered}
                  </div>
                  <div className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">
                    Unanswered
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-center">
                  <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                    {paletteCounts.marked + paletteCounts.answeredMarked}
                  </div>
                  <div className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase">
                    Marked
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-lg font-black text-slate-600 dark:text-slate-300">
                    {paletteCounts.notVisited}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Not Visited
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-750">
                Time Remaining: <span className="font-mono font-bold text-slate-900 dark:text-white">{formatTime(secondsRemaining)}</span>. Once submitted, your answers will be automatically evaluated against the official answer keys.
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Resume Exam
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition"
                >
                  Yes, Submit Final Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Question Palette Component used in both Desktop Sidebar and Mobile Drawer
 */
const PaletteContent: React.FC<{
  test: MockTest;
  currentIndex: number;
  userAnswers: Record<string, UserAnswerState>;
  paletteCounts: {
    answered: number;
    notAnswered: number;
    notVisited: number;
    marked: number;
    answeredMarked: number;
  };
  onJumpToQuestion: (index: number) => void;
  onSubmitExam: () => void;
}> = ({
  test,
  currentIndex,
  userAnswers,
  paletteCounts,
  onJumpToQuestion,
  onSubmitExam,
}) => {
  return (
    <div className="p-4 flex flex-col h-full space-y-4">
      {/* Palette Legend */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">
            {paletteCounts.answered}
          </span>
          <span>Answered</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-rose-500 text-white font-bold flex items-center justify-center text-[10px]">
            {paletteCounts.notAnswered}
          </span>
          <span>Not Answered</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
            {paletteCounts.marked}
          </span>
          <span>Marked</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-[10px]">
            {paletteCounts.notVisited}
          </span>
          <span>Not Visited</span>
        </div>

        <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] relative">
            {paletteCounts.answeredMarked}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white dark:border-slate-900"></span>
          </span>
          <span>Answered & Marked for Review</span>
        </div>
      </div>

      {/* Question Number Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
          Choose a Question:
        </div>
        <div className="grid grid-cols-5 gap-2">
          {test.questions.map((q, idx) => {
            const ans = userAnswers[q.id];
            const status = ans?.status || 'not_visited';
            const isCurrent = idx === currentIndex;

            let badgeClass =
              'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300';
            let hasMarkedDot = false;

            if (status === 'answered') {
              badgeClass = 'bg-emerald-500 text-white hover:bg-emerald-600';
            } else if (status === 'not_answered') {
              badgeClass = 'bg-rose-500 text-white hover:bg-rose-600';
            } else if (status === 'marked') {
              badgeClass = 'bg-purple-600 text-white hover:bg-purple-700';
            } else if (status === 'answered_and_marked') {
              badgeClass = 'bg-purple-600 text-white hover:bg-purple-700';
              hasMarkedDot = true;
            }

            return (
              <button
                key={q.id}
                onClick={() => onJumpToQuestion(idx)}
                className={`palette-btn h-9 w-full relative ${badgeClass} ${
                  isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 font-black' : ''
                }`}
              >
                {idx + 1}
                {hasMarkedDot && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onSubmitExam}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Full Test
        </button>
      </div>
    </div>
  );
};
