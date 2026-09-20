import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  CheckCircle,
  Clock,
  Zap,
  ArrowRight,
  TrendingUp,
  FilePlus,
  Upload,
  BookOpen,
  Award,
  Train,
  Landmark,
  ChevronRight,
  Target,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { ExamCategory, MockTest, TestResult, ExamPreset, ExamStageConfig } from '../../types/exam';
import { EXAM_CONFIGS, PRELOADED_TESTS } from '../../data/mockExams';
import { EXAM_PRESETS } from '../../data/examPresets';
import {
  getLocalResults,
  calculateAggregatedStats,
  AggregatedStats,
} from '../../services/storage/historyStore';

interface DashboardProps {
  onStartPreloadedExam: (examCategory: ExamCategory) => void;
  onOpenGeneratorWithExam: (examCategory: ExamCategory) => void;
  onOpenGenerator: () => void;
  onViewResult: (result: TestResult) => void;
  onSelectStageForTest?: (exam: ExamPreset, stage: ExamStageConfig) => void;
  onNavigate?: (view: 'dashboard' | 'history' | 'syllabus' | 'questionBank') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartPreloadedExam,
  onOpenGeneratorWithExam,
  onOpenGenerator,
  onViewResult,
  onSelectStageForTest,
  onNavigate,
}) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [inspectExam, setInspectExam] = useState<ExamPreset | null>(null);
  const [stats, setStats] = useState<AggregatedStats>({
    totalTests: 0,
    avgScorePercent: 0,
    avgAccuracy: 0,
    bestScore: 0,
    totalTimeMinutes: 0,
    subjectBreakdown: [],
    avgTimePerQuestion: 0,
  });

  const categories = ['ALL', 'RAILWAY', 'BANKING', 'SSC', 'STATE_PSC'];

  const filteredExams =
    selectedCategory === 'ALL'
      ? EXAM_PRESETS
      : EXAM_PRESETS.filter((e) => e.category === selectedCategory);

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return EXAM_PRESETS.length;
    return EXAM_PRESETS.filter((e) => e.category === cat).length;
  };

  useEffect(() => {
    const loaded = getLocalResults();
    setResults(loaded);
    setStats(calculateAggregatedStats(loaded));
  }, []);

  // Format progression chart data
  const progressionData = [...results]
    .reverse()
    .slice(-6)
    .map((r, idx) => ({
      name: `Test ${idx + 1}`,
      score: r.percentage,
      accuracy: r.accuracy,
      title: r.testTitle,
    }));

  const getExamIcon = (category: string, slug?: string) => {
    if (category === 'RAILWAY' || slug?.includes('rrb')) {
      return <Train className="w-5 h-5 text-emerald-500" />;
    }
    if (category === 'SSC' || slug?.includes('ssc')) {
      return <Award className="w-5 h-5 text-blue-500" />;
    }
    if (category === 'BANKING' || slug?.includes('ibps')) {
      return <Landmark className="w-5 h-5 text-amber-500" />;
    }
    if (category === 'STATE_PSC' || slug?.includes('wbpsc') || slug?.includes('wbcs')) {
      return <BookOpen className="w-5 h-5 text-purple-500" />;
    }
    return <Sparkles className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI-Driven Indian Competitive Exam Simulator
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Master RRB, SSC, Banking & WBPSC with Real Exam Patterns
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-2xl">
            Simulate real CBT examination portals with authentic Previous Year Questions, full LaTeX
            mathematical expressions, instant AI performance diagnostics, and custom document OCR.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onStartPreloadedExam('rrb_ntpc')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <span>Take Live RRB NTPC Mock</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Question Paper / Notes</span>
            </button>
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none hidden md:block"></div>
      </section>

      {/* 2. Key Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Tests Attempted
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalTests}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Overall Accuracy
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.avgAccuracy}%
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Average Speed
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.avgTimePerQuestion}s <span className="text-xs font-normal text-slate-400">/Q</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Practice Time
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalTimeMinutes} <span className="text-xs font-normal text-slate-400">min</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Target Exam Portals (14 Official Indian Exams across Railway, Banking, SSC, State PSC) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Target Exam Portals</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                {EXAM_PRESETS.length} Official Presets
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an exam to take full authentic mocks, inspect official syllabus, or generate custom papers
            </p>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('syllabus')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Syllabi &amp; Rules</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-1 pb-1">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.replace('_', ' ')}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredExams.map((exam) => {
            const firstStage = exam.stages[0];
            const examIcon = getExamIcon(exam.category, exam.slug);

            return (
              <div
                key={exam.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750">
                      {examIcon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                        {exam.category.replace('_', ' ')}
                      </span>
                      {firstStage && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {firstStage.stageSlug.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {exam.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {exam.description}
                    </p>
                  </div>

                  {firstStage && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between">
                        <span>Pattern:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          +{firstStage.marksPerCorrect} | -{firstStage.negativeMarkPerWrong.toFixed(2)} Neg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {firstStage.totalQuestions} Qs • {firstStage.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onStartPreloadedExam(exam.slug as ExamCategory)}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <span>Start Live Mock</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onOpenGeneratorWithExam(exam.slug as ExamCategory)}
                      className="py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>AI Paper</span>
                    </button>

                    <button
                      onClick={() => setInspectExam(exam)}
                      className="py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3 h-3 text-purple-500" />
                      <span>Syllabus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Syllabus Modal on Dashboard */}
      {inspectExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {inspectExam.name} Official Syllabus &amp; Rules
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{inspectExam.description}</p>
              </div>
              <button
                onClick={() => setInspectExam(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inspectExam.stages.map((stage) => (
              <div key={stage.id} className="space-y-4">
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-extrabold text-indigo-900 dark:text-indigo-200 text-sm">
                      {stage.stageName}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{stage.sourceTitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                      Verified: {stage.verificationDate}
                    </span>
                    <span className="text-slate-400 text-[10px]">{stage.notificationVersion}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Subject Distribution &amp; Topics
                  </h4>
                  {stage.subjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{sub.name}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          {sub.questionCount} Qs ({sub.questionCount * sub.marksPerQuestion} Marks)
                          {sub.durationMinutes ? ` • ${sub.durationMinutes} min limit` : ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sub.topics.map((top, idx) => (
                          <span
                            key={idx}
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                          >
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      const ex = inspectExam;
                      setInspectExam(null);
                      if (onSelectStageForTest) {
                        onSelectStageForTest(ex, stage);
                      } else {
                        onStartPreloadedExam(ex.slug as ExamCategory);
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Mock Test for {stage.stageName}</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setInspectExam(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Performance Progression & Analytics Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Progression */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Score & Accuracy Progression
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Recent Attempts</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score %"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy %"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-Wise Accuracy Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Subject Accuracy
              </h3>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  stats.subjectBreakdown.length > 0
                    ? stats.subjectBreakdown
                    : [
                        { name: 'Quant', accuracy: 75 },
                        { name: 'Reasoning', accuracy: 90 },
                        { name: 'Awareness', accuracy: 80 },
                        { name: 'English', accuracy: 70 },
                      ]
                }
                layout="vertical"
                margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={75} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="accuracy" name="Accuracy %" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 5. Recent Test History Table */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Recent Mock Test Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Test Title</th>
                <th className="pb-3 text-center">Score</th>
                <th className="pb-3 text-center">Accuracy</th>
                <th className="pb-3 text-center">Cut-off Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                  <td className="py-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">{r.testTitle}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(r.completedAt).toLocaleDateString()} • {Math.round(r.timeTakenSeconds / 60)} mins
                    </div>
                  </td>
                  <td className="py-3.5 text-center font-black text-slate-900 dark:text-white">
                    {r.totalScore} / {r.maxScore}
                  </td>
                  <td className="py-3.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                    {r.accuracy}%
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.clearedCutoff
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {r.clearedCutoff ? 'Qualified' : 'Target Gap'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => onViewResult(r)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 transition"
                    >
                      Review Paper
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
