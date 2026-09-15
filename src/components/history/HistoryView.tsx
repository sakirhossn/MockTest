import React, { useState, useEffect } from 'react';
import { History, Trash2, ArrowLeft, RotateCcw, Target, Clock, Trophy } from 'lucide-react';
import { TestResult, ExamCategory } from '../../types/exam';
import { getLocalResults, clearTestHistory } from '../../services/storage/historyStore';
import { EXAM_CONFIGS } from '../../data/mockExams';

interface HistoryViewProps {
  onSelectResult: (result: TestResult) => void;
  onBackToDashboard: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onSelectResult,
  onBackToDashboard,
}) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [filterExam, setFilterExam] = useState<string>('all');

  useEffect(() => {
    setResults(getLocalResults());
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your test attempt history?')) {
      clearTestHistory();
      setResults([]);
    }
  };

  const filteredResults = results.filter((r) => {
    if (filterExam === 'all') return true;
    return r.examType === filterExam;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Test Attempt Archive
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed records of all completed mock tests, cut-off benchmarks, and solutions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Exam Filter Dropdown */}
          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Examinations</option>
            {EXAM_CONFIGS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.shortName}
              </option>
            ))}
          </select>

          <button
            onClick={handleClear}
            disabled={results.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold transition disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Table of Past Attempts */}
      {filteredResults.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">
            No Test Attempts Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Take a mock test or generate a custom AI exam to start recording your score analytics!
          </p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Exam Paper</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Accuracy</th>
                  <th className="py-3 px-4 text-center">Time</th>
                  <th className="py-3 px-4 text-center">Cut-off Benchmark</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {r.testTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(r.completedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {r.totalScore}
                      </span>
                      <span className="text-slate-400 text-xs"> / {r.maxScore}</span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      {r.accuracy}%
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-300">
                      {Math.round(r.timeTakenSeconds / 60)} min
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.clearedCutoff
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {r.clearedCutoff ? 'Qualified' : 'Below Cut-off'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onSelectResult(r)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold transition"
                      >
                        View Solutions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
