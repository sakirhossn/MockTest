import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  Train,
  Award,
  Landmark,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Eye,
  X,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { PYQPaper, getAllPYQPapers, convertPYQToMockTest } from '../../data/pyqData';
import { EXAM_CONFIGS } from '../../data/mockExams';
import { EXAM_PRESETS } from '../../data/examPresets';
import { MockTest, ExamCategory } from '../../types/exam';
import { fetchPYQWithAI } from '../../services/ai/aiService';
import { MathRenderer } from '../common/MathRenderer';

interface PYQViewProps {
  onStartTest: (test: MockTest) => void;
  onSelectExam?: (exam: ExamCategory) => void;
  initialExamFilter?: string;
}

export const PYQView: React.FC<PYQViewProps> = ({
  onStartTest,
  onSelectExam,
  initialExamFilter,
}) => {
  const [papers, setPapers] = useState<PYQPaper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedExamSlug, setSelectedExamSlug] = useState<string>(initialExamFilter || 'ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);
  const [isFetchModalOpen, setIsFetchModalOpen] = useState<boolean>(false);

  // AI Fetch form state
  const [fetchExamSlug, setFetchExamSlug] = useState<string>('rrb_ntpc');
  const [fetchYear, setFetchYear] = useState<number>(2023);
  const [fetchShift, setFetchShift] = useState<string>('Shift 1 (Morning)');
  const [fetchCount, setFetchCount] = useState<number>(10);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchProgress, setFetchProgress] = useState<string>('');
  const [fetchError, setFetchError] = useState<string>('');

  useEffect(() => {
    setPapers(getAllPYQPapers());
  }, []);

  useEffect(() => {
    if (initialExamFilter) {
      setSelectedExamSlug(initialExamFilter);
    }
  }, [initialExamFilter]);

  // Filter papers
  const filteredPapers = papers.filter((paper) => {
    if (selectedCategory !== 'ALL' && paper.category !== selectedCategory) return false;
    if (selectedYear !== 'ALL' && paper.year.toString() !== selectedYear) return false;
    if (selectedExamSlug !== 'ALL' && paper.examSlug !== selectedExamSlug) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = paper.title.toLowerCase().includes(q);
      const matchExam = paper.examName.toLowerCase().includes(q);
      const matchYear = paper.year.toString().includes(q);
      const matchRef = paper.sourceReference.toLowerCase().includes(q);
      if (!matchTitle && !matchExam && !matchYear && !matchRef) return false;
    }
    return true;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return papers.length;
    return papers.filter((p) => p.category === cat).length;
  };

  const getExamIcon = (cat: string) => {
    switch (cat) {
      case 'RAILWAY':
        return <Train className="w-4 h-4 text-emerald-500" />;
      case 'SSC':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'BANKING':
        return <Landmark className="w-4 h-4 text-amber-500" />;
      case 'STATE_PSC':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleStartExam = (paper: PYQPaper) => {
    const test = convertPYQToMockTest(paper);
    if (onSelectExam) {
      onSelectExam(paper.examSlug as ExamCategory);
    }
    onStartTest(test);
  };

  const handleFetchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setFetchError('');
    setFetchProgress('Initiating PYQ Archival Agent...');

    try {
      const matchedPreset = EXAM_PRESETS.find((p) => p.slug === fetchExamSlug || p.id === fetchExamSlug);
      const matchedConfig = EXAM_CONFIGS.find((c) => c.id === fetchExamSlug);
      const examName = matchedPreset?.name || matchedConfig?.name || fetchExamSlug;
      const cat = (matchedPreset?.category as any) || 'RAILWAY';

      const newPaper = await fetchPYQWithAI(
        {
          examName,
          examSlug: fetchExamSlug,
          category: cat,
          year: fetchYear,
          shift: fetchShift,
          questionCount: fetchCount,
        },
        (msg) => setFetchProgress(msg)
      );

      setPapers(getAllPYQPapers());
      setIsFetchModalOpen(false);
      setPreviewPaper(newPaper);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch PYQ paper. Please check API Key in Settings.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 backdrop-blur border border-amber-500/30 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            100% Authentic Previous Year Questions (PYQs)
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Practice Official Previous Year Papers in Real CBT Mode
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Simulate real exam pressure with actual past shift papers from RRB NTPC, RRB Group D,
            SSC CGL, CHSL, MTS, IBPS/SBI PO &amp; Clerk, and WBPSC (WBCS, Clerkship, Food SI).
            Every question features official marking schemes and step-by-step explanations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsFetchModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Fetch More PYQs with AI</span>
            </button>

            <div className="text-xs text-slate-400 flex items-center gap-1.5 pl-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{papers.length} Authentic Shift Papers Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filters & Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Exams' },
            { id: 'RAILWAY', label: 'Railway' },
            { id: 'SSC', label: 'SSC' },
            { id: 'BANKING', label: 'Banking' },
            { id: 'STATE_PSC', label: 'State PSC' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedExamSlug('ALL');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {getCategoryCount(cat.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Search */}
          <div className="relative sm:col-span-1 lg:col-span-2">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exam name, paper title, or year (e.g. 2023, NTPC, CGL)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Exam Filter Dropdown */}
          <div>
            <select
              value={selectedExamSlug}
              onChange={(e) => setSelectedExamSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="ALL">All Examinations</option>
              {EXAM_PRESETS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter Dropdown */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="ALL">All Years</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. PYQ Papers Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>Available Authentic PYQ Shift Papers</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {filteredPapers.length} Papers
            </span>
          </h2>
        </div>

        {filteredPapers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
              No previous year papers found matching your filter criteria.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting your search query or use the AI PYQ Archivist to retrieve official papers for any year.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedYear('ALL');
                setSelectedExamSlug('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs hover:bg-indigo-100 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPapers.map((paper) => {
              const categoryColor =
                paper.category === 'RAILWAY'
                  ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : paper.category === 'SSC'
                  ? 'border-blue-200 dark:border-blue-900/50 bg-blue-500/10 text-blue-700 dark:text-blue-400'
                  : paper.category === 'BANKING'
                  ? 'border-amber-200 dark:border-amber-900/50 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'border-purple-200 dark:border-purple-900/50 bg-purple-500/10 text-purple-700 dark:text-purple-400';

              return (
                <div
                  key={paper.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${categoryColor} flex items-center gap-1`}>
                          {getExamIcon(paper.category)}
                          <span>{paper.category.replace('_', ' ')}</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {paper.year}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {paper.shift}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {paper.description}
                      </p>
                    </div>

                    {/* Exam Specs */}
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>Duration &amp; Qs:</span>
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {paper.durationMinutes} Mins • {paper.questions.length} Questions
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-500">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Marking Scheme:</span>
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          +{paper.marksPerQuestion} | -{paper.negativeMark} Neg
                        </span>
                      </div>
                    </div>

                    {/* Section Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {paper.sections.map((sec, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleStartExam(paper)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <span>Take Live PYQ Mock</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setPreviewPaper(paper)}
                      className="w-full py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Inspect Questions &amp; Key</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Inspection / Solutions Modal */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {previewPaper.year} • {previewPaper.shift}
                  </span>
                  <span className="text-xs text-slate-500">{previewPaper.sourceReference}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {previewPaper.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewPaper(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {previewPaper.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Q{idx + 1} • {q.section}
                    </span>
                    <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px]">
                      {q.topic || 'General'}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    <MathRenderer content={q.questionText} />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswer;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg text-xs flex items-center gap-2 border transition ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">
                            <MathRenderer content={opt} />
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                      Official Solution &amp; Step-by-Step Logic:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-5">
                      <MathRenderer content={q.explanation} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <span className="text-xs text-slate-500">
                Pattern: +{previewPaper.marksPerQuestion} | -{previewPaper.negativeMark} Neg • {previewPaper.durationMinutes} Mins
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPaper(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const p = previewPaper;
                    setPreviewPaper(null);
                    handleStartExam(p);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>Start Live Mock Test Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Fetch PYQ with AI Modal */}
      {isFetchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Fetch Official PYQ Paper with AI
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Retrieve authentic past exam questions using Gemini AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFetchModalOpen(false)}
                disabled={isFetching}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {fetchError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{fetchError}</span>
              </div>
            )}

            <form onSubmit={handleFetchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Examination
                </label>
                <select
                  value={fetchExamSlug}
                  onChange={(e) => setFetchExamSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {EXAM_PRESETS.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Exam Year
                  </label>
                  <select
                    value={fetchYear}
                    onChange={(e) => setFetchYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Shift / Tier
                  </label>
                  <select
                    value={fetchShift}
                    onChange={(e) => setFetchShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="Shift 1 (Morning)">Shift 1 (Morning)</option>
                    <option value="Shift 2 (Afternoon)">Shift 2 (Afternoon)</option>
                    <option value="Shift 3 (Evening)">Shift 3 (Evening)</option>
                    <option value="Prelims Paper">Prelims Paper</option>
                    <option value="CBT 1 Paper">CBT 1 Paper</option>
                    <option value="Tier 1 Paper">Tier 1 Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Question Count
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFetchCount(c)}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        fetchCount === c
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {c} Questions
                    </button>
                  ))}
                </div>
              </div>

              {isFetching && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>{fetchProgress || 'Retrieving official paper from knowledge base...'}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFetchModalOpen(false)}
                  disabled={isFetching}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFetching}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isFetching ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching Questions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fetch Authentic PYQ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
