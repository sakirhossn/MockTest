import React, { useState, useEffect } from 'react';
import {
  Search,
  Database,
  ChevronDown,
  ChevronUp,
  Layers,
  Play,
  Trash2,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Plus,
  X,
  Filter,
} from 'lucide-react';
import { EXAM_PRESETS } from '../../data/examPresets';
import {
  getBankQuestions,
  getQuestionSets,
  deleteBankQuestion,
  deleteQuestionSet,
  saveBankQuestion,
  createMockTestFromBankQuestions,
} from '../../services/storage/questionBankStore';
import { BankQuestion, QuestionSet, MockTest, ExamCategory } from '../../types/exam';
import { MathRenderer } from '../common/MathRenderer';

interface QuestionBankViewProps {
  onStartTest: (test: MockTest) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onStartTest }) => {
  const [activeTab, setActiveTab] = useState<'EXPLORER' | 'QUESTION_SETS'>('EXPLORER');

  // Question Explorer State
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedSetFilter, setSelectedSetFilter] = useState<string>('ALL');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Question Sets State
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [loadingSets, setLoadingSets] = useState(true);

  // Modals State
  const [mockModalSet, setMockModalSet] = useState<QuestionSet | null>(null);
  const [mockQuestionCount, setMockQuestionCount] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Question Form State
  const [newQExam, setNewQExam] = useState('rrb_ntpc');
  const [newQSubject, setNewQSubject] = useState('General Awareness');
  const [newQTopic, setNewQTopic] = useState('Current Affairs');
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState<[string, string, string, string]>([
    'Option A',
    'Option B',
    'Option C',
    'Option D',
  ]);
  const [newQCorrect, setNewQCorrect] = useState<0 | 1 | 2 | 3>(0);
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQDifficulty, setNewQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const loadData = () => {
    setLoadingQuestions(true);
    setLoadingSets(true);
    const qData = getBankQuestions();
    const sData = getQuestionSets();
    setQuestions(qData);
    setQuestionSets(sData);
    setLoadingQuestions(false);
    setLoadingSets(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteQuestion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this question from your Question Bank?')) {
      deleteBankQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleDeleteSet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this Question Set and its questions?')) {
      deleteQuestionSet(id);
      setQuestionSets((prev) => prev.filter((s) => s.id !== id));
      setQuestions((prev) => prev.filter((q) => q.questionSetId !== id));
    }
  };

  const handleCreateCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    const newQuestion: BankQuestion = {
      id: `custom-bank-q-${Date.now()}`,
      examSlug: newQExam,
      subjectSlug: newQSubject,
      topicSlug: newQTopic,
      questionText: newQText.trim(),
      options: newQOptions,
      correctAnswer: newQCorrect,
      explanation: newQExplanation.trim() || 'No explanation provided.',
      difficulty: newQDifficulty,
      sourceType: 'USER_UPLOADED',
      createdAt: new Date().toISOString(),
    };

    saveBankQuestion(newQuestion);
    setQuestions((prev) => [newQuestion, ...prev]);
    setIsAddModalOpen(false);
    // Reset fields
    setNewQText('');
    setNewQExplanation('');
  };

  // Start test from a question set
  const handleStartSetTest = (set: QuestionSet, count?: number) => {
    const setQuestions = questions.filter((q) => q.questionSetId === set.id);
    const pool = setQuestions.length > 0 ? setQuestions : questions;
    const selected = count && count < pool.length ? pool.slice(0, count) : pool;

    if (selected.length === 0) {
      alert('No questions available to start test.');
      return;
    }

    const test = createMockTestFromBankQuestions(
      `${set.name} (${selected.length} Qs)`,
      selected,
      set.examSlug as ExamCategory
    );
    onStartTest(test);
  };

  // Start test from current filtered pool
  const handleStartFilteredMock = () => {
    if (filteredQuestions.length === 0) return;
    const count = Math.min(mockQuestionCount, filteredQuestions.length);
    const selected = filteredQuestions.slice(0, count);

    const test = createMockTestFromBankQuestions(
      `Question Bank Mock (${count} Qs)`,
      selected,
      (selectedExam !== 'ALL' ? selectedExam : 'rrb_ntpc') as ExamCategory
    );
    onStartTest(test);
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedExam !== 'ALL' && q.examSlug !== selectedExam) return false;
    if (selectedSource !== 'ALL' && q.sourceType !== selectedSource) return false;
    if (selectedDifficulty !== 'ALL') {
      const qd = q.difficulty?.toLowerCase();
      if (qd !== selectedDifficulty.toLowerCase()) return false;
    }
    if (selectedSetFilter !== 'ALL' && q.questionSetId !== selectedSetFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchText = q.questionText.toLowerCase().includes(term);
      const matchTopic = (q.topicSlug || '').toLowerCase().includes(term);
      const matchSubject = (q.subjectSlug || '').toLowerCase().includes(term);
      if (!matchText && !matchTopic && !matchSubject) return false;
    }
    return true;
  });

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'VERIFIED_PREVIOUS_YEAR':
        return (
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
            Verified PYQ
          </span>
        );
      case 'AI_GENERATED':
        return (
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">
            AI Generated
          </span>
        );
      case 'USER_UPLOADED':
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
            User Uploaded
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">
            Standard Practice
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Question Bank
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Repository of verified questions, past year papers, and custom uploaded question sets.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>

          {/* Tab Pill */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('EXPLORER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'EXPLORER'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Questions ({questions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('QUESTION_SETS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'QUESTION_SETS'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Question Sets ({questionSets.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: QUESTION EXPLORER */}
      {activeTab === 'EXPLORER' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search question text, formulas, or topics..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Examination
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Examinations</option>
                  {EXAM_PRESETS.map((e) => (
                    <option key={e.slug} value={e.slug}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Question Set
                </label>
                <select
                  value={selectedSetFilter}
                  onChange={(e) => setSelectedSetFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Question Sets</option>
                  {questionSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Source
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Sources</option>
                  <option value="VERIFIED_PREVIOUS_YEAR">Verified Previous Year</option>
                  <option value="USER_UPLOADED">User Uploaded (Sets)</option>
                  <option value="AI_GENERATED">AI Generated</option>
                  <option value="DEMO">Standard Practice</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Found {filteredQuestions.length} questions matching filters</span>
            {filteredQuestions.length > 0 && (
              <button
                onClick={handleStartFilteredMock}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Current Filter ({Math.min(filteredQuestions.length, 10)} Qs)</span>
              </button>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {loadingQuestions ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400">Loading questions from bank...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  No questions match your filter criteria.
                </p>
                <p className="text-slate-400 text-xs">
                  Try adjusting filters or upload new papers via the AI Mock Generator.
                </p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 dark:text-white">#{idx + 1}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {q.examSlug.replace(/_/g, ' ').toUpperCase()} • {q.subjectSlug?.replace(/_/g, ' ')}
                        </span>
                        {q.topicSlug && (
                          <span className="text-slate-400 text-[11px]">({q.topicSlug})</span>
                        )}
                        {q.sourcePage && (
                          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-500">
                            Page {q.sourcePage}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {getSourceBadge(q.sourceType)}
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {q.difficulty}
                        </span>
                        <button
                          onClick={(e) => handleDeleteQuestion(q.id, e)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                          title="Delete from Bank"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed font-medium">
                      <MathRenderer text={q.questionText} />
                    </div>

                    {/* Collapsible Options & Explanation */}
                    <div className="pt-2">
                      <button
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Solution' : 'View Options & Solution'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, oIdx) => {
                              const isCorrect = oIdx === q.correctAnswer;
                              const optChar = String.fromCharCode(65 + oIdx);

                              return (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                                    isCorrect
                                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-bold'
                                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <span className="font-bold text-slate-400">{optChar}.</span>
                                  <div className="flex-1">
                                    <MathRenderer text={opt} />
                                  </div>
                                  {isCorrect && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                      ✓ Correct
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">
                              Solution Explanation:
                            </span>
                            <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                              <MathRenderer text={q.explanation} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY QUESTION SETS */}
      {activeTab === 'QUESTION_SETS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Showing {questionSets.length} Master Question Set(s)</span>
          </div>

          {loadingSets ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Loading your question sets...</p>
            </div>
          ) : questionSets.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Question Sets Saved Yet
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                When you extract exams via PDF or OCR in the Exam Generator, you can save them directly into your Question Bank as reusable Question Sets.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionSets.map((set) => (
                <div
                  key={set.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        READY FOR PRACTICE
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(set.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                      {set.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {set.examSlug.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {set.subjectSlug && (
                        <>
                          <span>•</span>
                          <span>{set.subjectSlug}</span>
                        </>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{set.questionCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Status</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedSetFilter(set.id);
                          setActiveTab('EXPLORER');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteSet(set.id, e)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete Set"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setMockModalSet(set);
                          setMockQuestionCount(Math.min(10, set.questionCount));
                        }}
                        className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Mock</span>
                      </button>

                      <button
                        onClick={() => handleStartSetTest(set)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GENERATE MOCK MODAL */}
      {mockModalSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Generate Mock from Set
              </h3>
              <button
                onClick={() => setMockModalSet(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-medium">Selected Question Set:</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{mockModalSet.name}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, mockModalSet.questionCount].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setMockQuestionCount(cnt)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      mockQuestionCount === cnt
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cnt === mockModalSet.questionCount ? `All (${cnt})` : `${cnt} Qs`}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setMockModalSet(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const s = mockModalSet;
                  const c = mockQuestionCount;
                  setMockModalSet(null);
                  handleStartSetTest(s, c);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Mock Test</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Add Custom Question to Bank
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Category
                  </label>
                  <select
                    value={newQExam}
                    onChange={(e) => setNewQExam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {EXAM_PRESETS.map((e) => (
                      <option key={e.slug} value={e.slug}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newQDifficulty}
                    onChange={(e) => setNewQDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={newQSubject}
                    onChange={(e) => setNewQSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="e.g. Mathematics"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={newQTopic}
                    onChange={(e) => setNewQTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="e.g. Percentages"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Text (supports LaTeX $formula$)
                </label>
                <textarea
                  rows={3}
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Enter the question text..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Options & Correct Answer
                </label>
                {newQOptions.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newQCorrect === oIdx}
                      onChange={() => setNewQCorrect(oIdx as 0 | 1 | 2 | 3)}
                      className="cursor-pointer"
                      title="Mark as correct answer"
                    />
                    <span className="font-bold text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated: [string, string, string, string] = [...newQOptions];
                        updated[oIdx] = e.target.value;
                        setNewQOptions(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Explanation / Solution
                </label>
                <textarea
                  rows={2}
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="Explain why the correct answer is right..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
