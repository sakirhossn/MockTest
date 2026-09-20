import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Shield, Clock, BookOpen, ChevronRight, X, Sparkles, Layers } from 'lucide-react';
import { EXAM_PRESETS } from '../../data/examPresets';
import { ExamPreset, ExamStageConfig } from '../../types/exam';

interface ExamPatternViewProps {
  onSelectStageForTest: (exam: ExamPreset, stage: ExamStageConfig) => void;
}

export const ExamPatternView: React.FC<ExamPatternViewProps> = ({ onSelectStageForTest }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedExam, setSelectedExam] = useState<ExamPreset | null>(null);

  const categories = ['ALL', 'RAILWAY', 'BANKING', 'SSC', 'STATE_PSC'];

  const filteredExams =
    selectedCategory === 'ALL'
      ? EXAM_PRESETS
      : EXAM_PRESETS.filter((e) => e.category === selectedCategory);

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return EXAM_PRESETS.length;
    return EXAM_PRESETS.filter((e) => e.category === cat).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Exam Patterns & Syllabi
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Officially verified marking schemes, negative penalties, and syllabus configurations for Indian competitive exams.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto">
          <Shield className="w-4 h-4" />
          <span>Verified Government Notices</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const count = getCategoryCount(cat);
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
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

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                  {exam.category.replace('_', ' ')}
                </span>
                <a
                  href={exam.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
                  title="Official Commission Portal"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {exam.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                {exam.description}
              </p>

              {/* Stages List */}
              <div className="mt-5 space-y-3">
                <p className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  Available Stages & Patterns
                </p>
                {exam.stages.map((stg) => (
                  <div
                    key={stg.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{stg.stageName}</span>
                      <span className="text-[10px] bg-slate-200/70 dark:bg-slate-750 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                        {stg.notificationVersion}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-slate-500 dark:text-slate-400 text-[11px] pt-1">
                      <div>
                        <span className="block text-slate-400 text-[10px]">Questions</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {stg.totalQuestions} Qs
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[10px]">Duration</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {stg.durationMinutes}m
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[10px]">Neg. Mark</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          -{stg.negativeMarkPerWrong.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => setSelectedExam(exam)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Inspect Syllabus
                      </button>
                      <button
                        onClick={() => onSelectStageForTest(exam, stg)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Start Test</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Syllabus Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedExam.name} Official Syllabus & Rules
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedExam.description}</p>
              </div>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedExam.stages.map((stage) => (
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
                    Subject Distribution & Topics
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
                      const ex = selectedExam;
                      setSelectedExam(null);
                      onSelectStageForTest(ex, stage);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Mock Test for {stage.stageName}</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
