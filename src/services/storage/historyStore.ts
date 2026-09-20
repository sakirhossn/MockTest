import { TestResult } from '../../types/exam';
import { getSupabaseClient } from '../supabase/supabaseClient';

const STORAGE_KEY_RESULTS = 'mocktest_user_results';
const STORAGE_KEY_BOOKMARKS = 'mocktest_bookmarks';

// Initial sample test result to showcase rich analytics if no test has been taken yet
const SEED_RESULTS: TestResult[] = [
  {
    id: 'seed-result-1',
    testId: 'rrb-ntpc-test-1',
    testTitle: 'RRB NTPC CBT-1 All-India Live Mock Test',
    examType: 'rrb_ntpc',
    completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    timeTakenSeconds: 740,
    totalQuestions: 10,
    attemptedCount: 9,
    correctCount: 8,
    incorrectCount: 1,
    unattemptedCount: 1,
    markedCount: 2,
    totalScore: 7.67,
    maxScore: 10,
    percentage: 76.7,
    accuracy: 88.9,
    cutoffs: { general: 7.35, obc: 6.82, sc: 6.14, st: 5.48 },
    clearedCutoff: true,
    sectionBreakdown: [
      {
        sectionName: 'General Awareness',
        totalQuestions: 3,
        attempted: 3,
        correct: 3,
        incorrect: 0,
        unattempted: 0,
        score: 3,
        accuracy: 100,
        timeSpentSeconds: 120,
      },
      {
        sectionName: 'Mathematics',
        totalQuestions: 3,
        attempted: 3,
        correct: 2,
        incorrect: 1,
        unattempted: 0,
        score: 1.67,
        accuracy: 66.7,
        timeSpentSeconds: 340,
      },
      {
        sectionName: 'General Intelligence & Reasoning',
        totalQuestions: 4,
        attempted: 3,
        correct: 3,
        incorrect: 0,
        unattempted: 1,
        score: 3,
        accuracy: 100,
        timeSpentSeconds: 280,
      },
    ],
    userAnswers: {},
    weaknessReport: [
      {
        topic: 'Mathematics - Ratio and Proportion',
        issueDescription: 'Calculation delay in multi-variable simplification.',
        actionAdvice: 'Practice fractional shortcut techniques for $a:b:c$ combining.',
        severity: 'medium',
      },
    ],
    speedPerQuestion: [
      { questionId: 'rrb-q1', seconds: 35, isCorrect: true },
      { questionId: 'rrb-q2', seconds: 45, isCorrect: true },
      { questionId: 'rrb-q3', seconds: 40, isCorrect: true },
      { questionId: 'rrb-q4', seconds: 95, isCorrect: true },
      { questionId: 'rrb-q5', seconds: 135, isCorrect: false },
      { questionId: 'rrb-q6', seconds: 110, isCorrect: true },
      { questionId: 'rrb-q7', seconds: 45, isCorrect: true },
      { questionId: 'rrb-q8', seconds: 75, isCorrect: true },
      { questionId: 'rrb-q9', seconds: 160, isCorrect: true },
    ],
  },
];

export async function saveTestResult(result: TestResult): Promise<void> {
  // 1. Save to local storage
  const current = getLocalResults();
  const updated = [result, ...current.filter((r) => r.id !== result.id)];
  localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(updated));

  // 2. Try saving to Supabase if connected and user is logged in
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('test_results').upsert({
          id: result.id,
          user_id: user.id,
          test_title: result.testTitle,
          exam_type: result.examType,
          total_score: result.totalScore,
          max_score: result.maxScore,
          accuracy: result.accuracy,
          time_taken_seconds: result.timeTakenSeconds,
          cleared_cutoff: result.clearedCutoff,
          result_data: result,
          completed_at: result.completedAt,
        });
      }
    }
  } catch (err) {
    console.warn('Could not sync test result to Supabase:', err);
  }
}

export function getLocalResults(): TestResult[] {
  const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
  if (raw === null) {
    localStorage.setItem(STORAGE_KEY_RESULTS, '[]');
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function clearTestHistory(): void {
  localStorage.setItem(STORAGE_KEY_RESULTS, '[]');
}

export function deleteTestResult(id: string): void {
  const current = getLocalResults();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(updated));

  const supabase = getSupabaseClient();
  if (supabase) {
    Promise.resolve(supabase.from('test_results').delete().eq('id', id)).catch(() => {});
  }
}

/**
 * Synchronize test results bidirectionally with Supabase Cloud
 * 1. Pulls all cloud tests belonging to current user and merges into local storage
 * 2. Pushes any local test results that are missing in the cloud up to Supabase
 */
export async function syncCloudTestResults(): Promise<TestResult[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return getLocalResults();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return getLocalResults();

    // Fetch tests from Supabase
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      console.warn('Supabase test_results fetch error:', error);
      return getLocalResults();
    }

    if (data && Array.isArray(data)) {
      const cloudResults: TestResult[] = data.map((row: any) => {
        if (row.result_data && typeof row.result_data === 'object') {
          return {
            ...row.result_data,
            id: row.id || row.result_data.id,
            completedAt: row.completed_at || row.result_data.completedAt,
          };
        }
        return {
          id: row.id,
          testId: row.id,
          testTitle: row.test_title || 'Mock Test',
          examType: row.exam_type || 'rrb_ntpc',
          completedAt: row.completed_at || new Date().toISOString(),
          timeTakenSeconds: row.time_taken_seconds || 0,
          totalQuestions: row.total_questions || 10,
          attemptedCount: row.attempted_count || 0,
          correctCount: row.correct_count || 0,
          incorrectCount: row.incorrect_count || 0,
          unattemptedCount: 0,
          markedCount: 0,
          totalScore: row.total_score || 0,
          maxScore: row.max_score || 10,
          percentage: row.percentage || 0,
          accuracy: row.accuracy || 0,
          cutoffs: { general: 0, obc: 0, sc: 0, st: 0 },
          clearedCutoff: !!row.cleared_cutoff,
          sectionBreakdown: [],
          userAnswers: {},
          weaknessReport: [],
          speedPerQuestion: [],
        };
      });

      // Merge cloud and local results
      const local = getLocalResults();
      const map = new Map<string, TestResult>();

      local.forEach((r) => map.set(r.id, r));
      cloudResults.forEach((r) => map.set(r.id, r));

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(merged));

      // Push any local tests missing in cloud
      const cloudIds = new Set(data.map((row: any) => row.id));
      for (const r of local) {
        if (!cloudIds.has(r.id)) {
          await supabase.from('test_results').upsert({
            id: r.id,
            user_id: user.id,
            test_title: r.testTitle,
            exam_type: r.examType,
            total_score: r.totalScore,
            max_score: r.maxScore,
            accuracy: r.accuracy,
            time_taken_seconds: r.timeTakenSeconds,
            cleared_cutoff: r.clearedCutoff,
            result_data: r,
            completed_at: r.completedAt,
          });
        }
      }

      return merged;
    }
  } catch (err) {
    console.warn('Error during syncCloudTestResults:', err);
  }

  return getLocalResults();
}

export interface AggregatedStats {
  totalTests: number;
  avgScorePercent: number;
  avgAccuracy: number;
  bestScore: number;
  totalTimeMinutes: number;
  subjectBreakdown: {
    name: string;
    accuracy: number;
    attempted: number;
  }[];
  avgTimePerQuestion: number;
}

export function calculateAggregatedStats(results: TestResult[]): AggregatedStats {
  if (results.length === 0) {
    return {
      totalTests: 0,
      avgScorePercent: 0,
      avgAccuracy: 0,
      bestScore: 0,
      totalTimeMinutes: 0,
      subjectBreakdown: [],
      avgTimePerQuestion: 0,
    };
  }

  const totalTests = results.length;
  const avgScorePercent =
    results.reduce((acc, r) => acc + (r.totalScore / (r.maxScore || 1)) * 100, 0) / totalTests;
  const avgAccuracy = results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests;
  const bestScore = Math.max(...results.map((r) => (r.totalScore / (r.maxScore || 1)) * 100));
  const totalTimeMinutes = Math.round(
    results.reduce((acc, r) => acc + r.timeTakenSeconds, 0) / 60
  );

  // Subject-wise grouping
  const subjectMap: Record<string, { correct: number; total: number }> = {};
  let totalSpeedSeconds = 0;
  let totalSpeedCount = 0;

  results.forEach((r) => {
    r.sectionBreakdown?.forEach((sec) => {
      let norm = sec.sectionName.toLowerCase();
      let label = 'General';
      if (norm.includes('quant') || norm.includes('math') || norm.includes('arithmetic')) label = 'Quantitative Aptitude';
      else if (norm.includes('reasoning') || norm.includes('intelligence')) label = 'Reasoning Ability';
      else if (norm.includes('english')) label = 'English Language';
      else if (norm.includes('awareness') || norm.includes('general studies') || norm.includes('bengal')) label = 'General Awareness';

      if (!subjectMap[label]) subjectMap[label] = { correct: 0, total: 0 };
      subjectMap[label].correct += sec.correct;
      subjectMap[label].total += sec.attempted;
    });

    r.speedPerQuestion?.forEach((s) => {
      totalSpeedSeconds += s.seconds;
      totalSpeedCount++;
    });
  });

  const subjectBreakdown = Object.keys(subjectMap).map((name) => ({
    name,
    accuracy: subjectMap[name].total > 0 ? Math.round((subjectMap[name].correct / subjectMap[name].total) * 100) : 0,
    attempted: subjectMap[name].total,
  }));

  const avgTimePerQuestion = totalSpeedCount > 0 ? Math.round(totalSpeedSeconds / totalSpeedCount) : 48;

  return {
    totalTests,
    avgScorePercent: Math.round(avgScorePercent * 10) / 10,
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    bestScore: Math.round(bestScore * 10) / 10,
    totalTimeMinutes,
    subjectBreakdown,
    avgTimePerQuestion,
  };
}
