import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  Sparkles,
  Printer,
  FileDown,
  RotateCcw,
  LayoutDashboard,
  Filter,
  Check,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { TestResult, MockTest, AIWeaknessFeedback } from '../../types/exam';
import { MathRenderer } from '../common/MathRenderer';
import { analyzeWeaknesses } from '../../services/ai/aiService';
import { saveTestResult } from '../../services/storage/historyStore';
import { downloadMockPaperPDF } from '../../utils/pdfExport';

interface ResultsViewProps {
  result: TestResult;
  test: MockTest;
  onRetake: () => void;
  onGoHome: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  test,
  onRetake,
  onGoHome,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [weaknesses, setWeaknesses] = useState<AIWeaknessFeedback[]>(result.weaknessReport || []);
  const [isLoadingAiTips, setIsLoadingAiTips] = useState<boolean>(false);

  // Trigger celebration confetti if cut-off is cleared or score >= 65%
  useEffect(() => {
    saveTestResult(result);

    if (result.clearedCutoff || result.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }

    // Trigger AI Weakness Analysis if empty
    if (!result.weaknessReport || result.weaknessReport.length === 0) {
      fetchAiWeaknesses();
    }
  }, [result]);

  const fetchAiWeaknesses = async () => {
    setIsLoadingAiTips(true);
    const incorrectTopics = test.questions
      .filter((q) => {
        const ans = result.userAnswers[q.id];
        return ans && ans.selectedOption !== null && ans.selectedOption !== q.correctAnswer;
      })
      .map((q) => `${q.section}: ${q.topic || 'Core'}`);

    const avgSpeed = Math.round(result.timeTakenSeconds / (result.attemptedCount || 1));
    const timeSummary = `Average ${avgSpeed}s/question across ${result.attemptedCount} attempted.`;

    try {
      const tips = await analyzeWeaknesses(test.title, [...new Set(incorrectTopics)], timeSummary);
      setWeaknesses(tips);
    } catch (e) {
      console.warn('Weakness generation error', e);
    } finally {
      setIsLoadingAiTips(false);
    }
  };

  // Filtered Questions for Question Review
  const filteredQuestions = test.questions.filter((q) => {
    const ans = result.userAnswers[q.id];
    const attempted = ans && ans.selectedOption !== null;
    const isCorrect = attempted && ans.selectedOption === q.correctAnswer;

    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return attempted && !isCorrect;
    if (filterMode === 'unattempted') return !attempted;
    return true;
  });

  // Calculate estimated percentile
  const estimatedPercentile = Math.min(
    99.8,
    Math.max(25, Math.round(result.percentage * 1.15 + (result.accuracy > 80 ? 8 : 0)))
  );

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 1. Header Bar with Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Performance Scorecard
              </span>
              <span className="text-xs text-slate-500">
                {new Date(result.completedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {result.testTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => downloadMockPaperPDF(test)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 transition shadow-sm"
              title="Download question paper with full answers and step-by-step solutions on the last page"
            >
              <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Download Paper &amp; Solutions (PDF)
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Scorecard PDF
            </button>
            <button
              onClick={onRetake}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </button>
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </div>
        </div>

        {/* 2. Hero Score Card & Cut-Off Verdict */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score Box */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                  Official Calculated Score
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {result.totalScore}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-indigo-300">
                    / {result.maxScore} marks
                  </span>
                </div>
              </div>

              {/* Percentile Pill */}
              <div className="bg-white/10 backdrop-blur border border-white/20 px-4 py-2.5 rounded-2xl text-right">
                <div className="text-[10px] uppercase font-bold text-indigo-200">
                  Estimated Percentile
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300">
                  {estimatedPercentile}%ile
                </div>
              </div>
            </div>

            {/* Cut-off Verdict Indicator */}
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 relative z-10">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Cut-off Benchmark Analysis</span>
              </div>
              <div className="text-xs text-indigo-100 mt-1 leading-relaxed">
                Expected General (UR) Cut-off for this exam is{' '}
                <span className="font-bold text-white">~{result.cutoffs.general} marks</span>.
                {result.clearedCutoff ? (
                  <span className="ml-1 text-emerald-300 font-bold">
                    🎉 Excellent! You have cleared the qualifying cut-off benchmark.
                  </span>
                ) : (
                  <span className="ml-1 text-amber-300 font-medium">
                    Gap of {(result.cutoffs.general - result.totalScore).toFixed(2)} marks to reach the safe zone.
                  </span>
                )}
              </div>
            </div>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 relative z-10 text-center">
              <div>
                <div className="text-xs text-indigo-200">Accuracy</div>
                <div className="text-lg font-bold text-white mt-0.5">{result.accuracy}%</div>
              </div>
              <div>
                <div className="text-xs text-indigo-200">Attempted</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {result.attemptedCount}/{result.totalQuestions}
                </div>
              </div>
              <div>
                <div className="text-xs text-indigo-200">Time Taken</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {formatSecs(result.timeTakenSeconds)}
                </div>
              </div>
              <div>
                <div className="text-xs text-indigo-200">Avg Speed</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  {result.attemptedCount > 0
                    ? `${Math.round(result.timeTakenSeconds / result.attemptedCount)}s/Q`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Attempt Breakdown Dial / Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Attempt Distribution
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Correct Answers
                </div>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {result.correctCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Incorrect Answers
                </div>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  {result.incorrectCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  Unattempted
                </div>
                <span className="font-extrabold text-slate-600 dark:text-slate-300">
                  {result.unattemptedCount}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                Negative Marking Penalty:{' '}
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  -{(result.incorrectCount * test.negativeMark).toFixed(2)} marks
                </span>{' '}
                lost due to wrong guesses.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sectional Performance Analysis (Table + Visual Chart) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Section-wise Performance Breakdown
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analyze strengths and areas that hindered overall accuracy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2.5">Section</th>
                    <th className="pb-2.5 text-center">Attempted</th>
                    <th className="pb-2.5 text-center">Correct</th>
                    <th className="pb-2.5 text-center">Score</th>
                    <th className="pb-2.5 text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {result.sectionBreakdown.map((sec) => (
                    <tr key={sec.sectionName} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {sec.sectionName}
                      </td>
                      <td className="py-3 text-center text-slate-600 dark:text-slate-300">
                        {sec.attempted}/{sec.totalQuestions}
                      </td>
                      <td className="py-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                        {sec.correct}
                      </td>
                      <td className="py-3 text-center text-slate-900 dark:text-white font-bold">
                        {sec.score}
                      </td>
                      <td className="py-3 text-right font-extrabold text-indigo-600 dark:text-indigo-400">
                        {sec.accuracy}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.sectionBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="sectionName" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="accuracy" name="Accuracy %" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. AI Weakness Identifier & Diagnostic Recommendations */}
        <div className="p-6 sm:p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  AI Mentor Diagnosis & Weakness Identifier
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted analysis generated to accelerate your score in the next mock
                </p>
              </div>
            </div>
            <button
              onClick={fetchAiWeaknesses}
              disabled={isLoadingAiTips}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoadingAiTips ? 'animate-spin' : ''}`} />
              Refresh Diagnosis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {weaknesses.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {item.topic}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.severity === 'high'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.severity} priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.issueDescription}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-start gap-1.5">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{item.actionAdvice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Question-by-Question Solution Review with LaTeX */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Detailed Solutions & Answer Keys
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step-by-step mathematical reasoning and explanations
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl">
              {[
                { id: 'all', label: `All (${test.questions.length})` },
                { id: 'correct', label: `Correct (${result.correctCount})` },
                { id: 'incorrect', label: `Incorrect (${result.incorrectCount})` },
                { id: 'unattempted', label: `Unattempted (${result.unattemptedCount})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterMode === f.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {filteredQuestions.map((q, qIndex) => {
              const ans = result.userAnswers[q.id];
              const userChoice = ans?.selectedOption;
              const isCorrect = userChoice === q.correctAnswer;
              const isAttempted = userChoice !== null && userChoice !== undefined;

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        Question {test.questions.findIndex((orig) => orig.id === q.id) + 1}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">{q.section}</span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                          <Check className="w-3.5 h-3.5" /> Correct (+{test.marksPerQuestion})
                        </span>
                      ) : isAttempted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs">
                          <X className="w-3.5 h-3.5" /> Incorrect (-{test.negativeMark})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs">
                          Not Attempted (0)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed text-sm">
                    <MathRenderer content={q.questionText} />
                  </div>

                  {/* 4 Options Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctAnswer;
                      const isOptionSelected = userChoice === optIdx;
                      const label = ['A', 'B', 'C', 'D'][optIdx];

                      let borderStyle = 'border-slate-200 dark:border-slate-800';
                      let bgStyle = 'bg-slate-50/50 dark:bg-slate-850/50';

                      if (isOptionCorrect) {
                        borderStyle = 'border-emerald-500';
                        bgStyle = 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        borderStyle = 'border-rose-500';
                        bgStyle = 'bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border ${borderStyle} ${bgStyle} flex items-start gap-2.5 text-xs transition`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                              isOptionCorrect
                                ? 'bg-emerald-600 text-white'
                                : isOptionSelected
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {label}
                          </span>
                          <div className="flex-1">
                            <MathRenderer content={opt} inline />
                          </div>
                          {isOptionCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase shrink-0">
                              Correct Ans
                            </span>
                          )}
                          {isOptionSelected && !isOptionCorrect && (
                            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase shrink-0">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step LaTeX Solution Box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 space-y-1.5">
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Step-by-Step Solution:
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      <MathRenderer content={q.explanation} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
