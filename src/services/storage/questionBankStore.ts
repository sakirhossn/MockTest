import { BankQuestion, QuestionSet, MockTest, Question, ExamCategory } from '../../types/exam';
import { SEED_BANK_QUESTIONS } from '../../data/seedBankQuestions';
import { getSupabaseClient } from '../supabase/supabaseClient';

const STORAGE_KEY_BANK_QUESTIONS = 'mocktest_bank_questions';
const STORAGE_KEY_QUESTION_SETS = 'mocktest_question_sets';

export interface BankFilter {
  examSlug?: string;
  subjectSlug?: string;
  sourceType?: string;
  difficulty?: string;
  questionSetId?: string;
  searchTerm?: string;
}

/**
 * Retrieve user-saved bank questions from localStorage
 */
export function getUserBankQuestions(): BankQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANK_QUESTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to parse bank questions from localStorage', err);
    return [];
  }
}

/**
 * Retrieve all questions in the bank (seed + user created/imported)
 */
export function getBankQuestions(filter?: BankFilter): BankQuestion[] {
  const userQuestions = getUserBankQuestions();

  // Combine seed and user questions (user questions take precedence on duplicate id)
  const userIds = new Set(userQuestions.map((q) => q.id));
  const combined = [...userQuestions, ...SEED_BANK_QUESTIONS.filter((q) => !userIds.has(q.id))];

  if (!filter) return combined;

  return combined.filter((q) => {
    if (filter.examSlug && filter.examSlug !== 'ALL' && q.examSlug !== filter.examSlug) {
      return false;
    }
    if (filter.subjectSlug && filter.subjectSlug !== 'ALL' && q.subjectSlug !== filter.subjectSlug) {
      return false;
    }
    if (filter.sourceType && filter.sourceType !== 'ALL' && q.sourceType !== filter.sourceType) {
      return false;
    }
    if (filter.difficulty && filter.difficulty !== 'ALL') {
      const qDiff = q.difficulty?.toLowerCase();
      const fDiff = filter.difficulty.toLowerCase();
      if (qDiff !== fDiff) return false;
    }
    if (filter.questionSetId && filter.questionSetId !== 'ALL' && q.questionSetId !== filter.questionSetId) {
      return false;
    }
    if (filter.searchTerm && filter.searchTerm.trim()) {
      const term = filter.searchTerm.toLowerCase().trim();
      const matchText = q.questionText.toLowerCase().includes(term);
      const matchTopic = (q.topicSlug || '').toLowerCase().includes(term);
      const matchSubject = (q.subjectSlug || '').toLowerCase().includes(term);
      if (!matchText && !matchTopic && !matchSubject) return false;
    }
    return true;
  });
}

/**
 * Save or update a single bank question
 */
export function saveBankQuestion(question: BankQuestion): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANK_QUESTIONS);
    const existing: BankQuestion[] = raw ? JSON.parse(raw) : [];
    const idx = existing.findIndex((q) => q.id === question.id);
    if (idx >= 0) {
      existing[idx] = question;
    } else {
      existing.unshift(question);
    }
    localStorage.setItem(STORAGE_KEY_BANK_QUESTIONS, JSON.stringify(existing));

    // Try cloud sync if logged in
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          Promise.resolve(
            supabase.from('user_bank_questions').upsert({
              id: question.id,
              user_id: user.id,
              question_data: question,
              updated_at: new Date().toISOString(),
            })
          ).catch((err: any) => console.warn('Supabase user_bank_questions save error:', err));
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.error('Failed to save question to bank', err);
  }
}

/**
 * Delete a question from the bank
 */
export function deleteBankQuestion(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANK_QUESTIONS);
    if (!raw) return;
    const existing: BankQuestion[] = JSON.parse(raw);
    const filtered = existing.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEY_BANK_QUESTIONS, JSON.stringify(filtered));

    const supabase = getSupabaseClient();
    if (supabase) {
      Promise.resolve(supabase.from('user_bank_questions').delete().eq('id', id)).catch(() => {});
    }
  } catch (err) {
    console.error('Failed to delete question from bank', err);
  }
}

/**
 * Retrieve all Question Sets
 */
export function getQuestionSets(): QuestionSet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUESTION_SETS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to parse question sets from localStorage', err);
    return [];
  }
}

/**
 * Save or update a Question Set and its questions
 */
export function saveQuestionSet(set: QuestionSet, questions?: BankQuestion[]): void {
  try {
    const sets = getQuestionSets();
    const idx = sets.findIndex((s) => s.id === set.id);
    if (idx >= 0) {
      sets[idx] = set;
    } else {
      sets.unshift(set);
    }
    localStorage.setItem(STORAGE_KEY_QUESTION_SETS, JSON.stringify(sets));

    let taggedQuestions: BankQuestion[] = [];
    if (questions && questions.length > 0) {
      const raw = localStorage.getItem(STORAGE_KEY_BANK_QUESTIONS);
      const existing: BankQuestion[] = raw ? JSON.parse(raw) : [];
      // Remove previous questions belonging to this set to avoid duplicates
      const others = existing.filter((q) => q.questionSetId !== set.id);
      taggedQuestions = questions.map((q) => ({
        ...q,
        questionSetId: set.id,
      }));
      localStorage.setItem(
        STORAGE_KEY_BANK_QUESTIONS,
        JSON.stringify([...taggedQuestions, ...others])
      );
    } else {
      taggedQuestions = getUserBankQuestions().filter((q) => q.questionSetId === set.id);
    }

    // Try cloud sync if Supabase is connected
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          Promise.resolve(
            supabase.from('question_sets').upsert({
              id: set.id,
              user_id: user.id,
              title: set.name,
              exam_slug: set.examSlug,
              question_count: set.questionCount || taggedQuestions.length,
              set_data: set,
              questions: taggedQuestions,
              updated_at: new Date().toISOString(),
            })
          ).catch((err: any) => console.warn('Supabase question_sets upsert error:', err));
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.error('Failed to save question set', err);
  }
}

/**
 * Delete a Question Set and all its associated questions
 */
export function deleteQuestionSet(setId: string): void {
  try {
    const sets = getQuestionSets().filter((s) => s.id !== setId);
    localStorage.setItem(STORAGE_KEY_QUESTION_SETS, JSON.stringify(sets));

    const raw = localStorage.getItem(STORAGE_KEY_BANK_QUESTIONS);
    if (raw) {
      const existing: BankQuestion[] = JSON.parse(raw);
      const filtered = existing.filter((q) => q.questionSetId !== setId);
      localStorage.setItem(STORAGE_KEY_BANK_QUESTIONS, JSON.stringify(filtered));
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      Promise.resolve(supabase.from('question_sets').delete().eq('id', setId)).catch(() => {});
    }
  } catch (err) {
    console.error('Failed to delete question set', err);
  }
}

export interface SyncResult {
  success: boolean;
  message: string;
  error?: string;
  uploadedSets: number;
  downloadedSets: number;
  totalSets: number;
  status: 'SUCCESS' | 'NO_SUPABASE' | 'NOT_LOGGED_IN' | 'TABLE_MISSING' | 'ERROR';
}

/**
 * Synchronize Question Sets and Bank Questions bidirectionally with Supabase Cloud
 * 1. Downloads all cloud question sets and bank questions belonging to current user
 * 2. Merges with local storage
 * 3. Uploads any existing local sets/questions that are not yet in Supabase
 */
export async function syncCloudQuestionBank(): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  const totalLocal = getQuestionSets().length;

  if (!supabase) {
    return {
      success: false,
      status: 'NO_SUPABASE',
      message:
        'Cloud Sync is not configured. Go to Settings (⚙️) -> Supabase to enter your Project URL & Key, or use "Export JSON" on the set card to transfer directly.',
      uploadedSets: 0,
      downloadedSets: 0,
      totalSets: totalLocal,
    };
  }

  try {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (!user || userErr) {
      return {
        success: false,
        status: 'NOT_LOGGED_IN',
        message: 'You are not logged into your Supabase account. Please click the Profile icon in the top navigation to sign in.',
        uploadedSets: 0,
        downloadedSets: 0,
        totalSets: totalLocal,
      };
    }

    // 1. Fetch Question Sets from Supabase
    const { data: cloudSetsData, error: setsErr } = await supabase
      .from('question_sets')
      .select('*')
      .eq('user_id', user.id);

    if (setsErr) {
      const isMissingTable =
        setsErr.code === '42P01' ||
        setsErr.message?.toLowerCase().includes('relation') ||
        setsErr.message?.toLowerCase().includes('does not exist');

      return {
        success: false,
        status: isMissingTable ? 'TABLE_MISSING' : 'ERROR',
        message: isMissingTable
          ? 'Table "question_sets" was not found in your Supabase project. Run the SQL schema from supabase/schema.sql in your Supabase SQL Editor.'
          : `Supabase Error: ${setsErr.message}`,
        error: setsErr.message,
        uploadedSets: 0,
        downloadedSets: 0,
        totalSets: totalLocal,
      };
    }

    // 2. Fetch Standalone Bank Questions from Supabase
    const { data: cloudQuestionsData, error: qErr } = await supabase
      .from('user_bank_questions')
      .select('*')
      .eq('user_id', user.id);

    const localSets = getQuestionSets();
    const localUserQuestions = getUserBankQuestions();

    const cloudSetsMap = new Map<string, QuestionSet>();
    const cloudExtractedQuestions: BankQuestion[] = [];
    let downloadedSetsCount = 0;

    if (cloudSetsData && Array.isArray(cloudSetsData)) {
      cloudSetsData.forEach((row: any) => {
        const setObj: QuestionSet = row.set_data || {
          id: row.id,
          name: row.title,
          examSlug: row.exam_slug,
          questionCount: row.question_count,
          createdAt: row.updated_at,
        };
        cloudSetsMap.set(setObj.id, setObj);

        if (!localSets.some((ls) => ls.id === setObj.id)) {
          downloadedSetsCount++;
        }

        if (Array.isArray(row.questions)) {
          row.questions.forEach((q: BankQuestion) => {
            cloudExtractedQuestions.push(q);
          });
        }
      });
    }

    if (cloudQuestionsData && Array.isArray(cloudQuestionsData)) {
      cloudQuestionsData.forEach((row: any) => {
        if (row.question_data) {
          cloudExtractedQuestions.push(row.question_data);
        }
      });
    }

    // Merge Question Sets
    const mergedSetsMap = new Map<string, QuestionSet>();
    localSets.forEach((s) => mergedSetsMap.set(s.id, s));
    cloudSetsMap.forEach((s, id) => mergedSetsMap.set(id, s));
    const mergedSets = Array.from(mergedSetsMap.values());
    localStorage.setItem(STORAGE_KEY_QUESTION_SETS, JSON.stringify(mergedSets));

    // Merge User Questions
    const mergedQuestionsMap = new Map<string, BankQuestion>();
    localUserQuestions.forEach((q) => mergedQuestionsMap.set(q.id, q));
    cloudExtractedQuestions.forEach((q) => mergedQuestionsMap.set(q.id, q));
    const mergedUserQuestions = Array.from(mergedQuestionsMap.values());
    localStorage.setItem(STORAGE_KEY_BANK_QUESTIONS, JSON.stringify(mergedUserQuestions));

    // Push local sets missing in cloud up to Supabase
    let uploadedSetsCount = 0;
    const setsToUpload = localSets.filter((ls) => !cloudSetsMap.has(ls.id));
    for (const set of setsToUpload) {
      const setQuestions = mergedUserQuestions.filter((q) => q.questionSetId === set.id);
      try {
        const { error: upErr } = await supabase.from('question_sets').upsert({
          id: set.id,
          user_id: user.id,
          title: set.name,
          exam_slug: set.examSlug,
          question_count: set.questionCount || setQuestions.length,
          set_data: set,
          questions: setQuestions,
          updated_at: set.createdAt || new Date().toISOString(),
        });
        if (!upErr) {
          uploadedSetsCount++;
        } else {
          console.warn('Failed to upload set:', upErr);
        }
      } catch (err) {
        console.warn('Failed to push set to cloud:', err);
      }
    }

    // Push standalone questions missing in cloud up to Supabase
    if (!qErr) {
      const cloudQIds = new Set(cloudExtractedQuestions.map((q) => q.id));
      const standaloneQuestionsToUpload = mergedUserQuestions.filter(
        (q) => !q.questionSetId && !cloudQIds.has(q.id)
      );
      for (const q of standaloneQuestionsToUpload) {
        try {
          await supabase.from('user_bank_questions').upsert({
            id: q.id,
            user_id: user.id,
            question_data: q,
            updated_at: q.createdAt || new Date().toISOString(),
          });
        } catch (err) {
          console.warn('Failed to push standalone question to cloud:', err);
        }
      }
    }

    return {
      success: true,
      status: 'SUCCESS',
      message: `Cloud sync completed! ${
        uploadedSetsCount > 0
          ? `Uploaded ${uploadedSetsCount} set(s) to cloud. `
          : downloadedSetsCount > 0
          ? `Downloaded ${downloadedSetsCount} set(s) from cloud. `
          : 'All question sets are already synchronized.'
      }`,
      uploadedSets: uploadedSetsCount,
      downloadedSets: downloadedSetsCount,
      totalSets: mergedSets.length,
    };
  } catch (err: any) {
    console.warn('Error during syncCloudQuestionBank:', err);
    return {
      success: false,
      status: 'ERROR',
      message: `Cloud sync error: ${err.message || 'Unknown network error'}`,
      error: err.message,
      uploadedSets: 0,
      downloadedSets: 0,
      totalSets: totalLocal,
    };
  }
}

/**
 * Export a Question Set and all its questions as a downloadable JSON file
 */
export function downloadQuestionSetJSON(setId: string): boolean {
  const sets = getQuestionSets();
  const targetSet = sets.find((s) => s.id === setId);
  if (!targetSet) return false;

  const allQuestions = getBankQuestions();
  const setQuestions = allQuestions.filter((q) => q.questionSetId === setId);

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    set: targetSet,
    questions: setQuestions,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = targetSet.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  a.href = url;
  a.download = `${safeTitle || 'question-set'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Import a Question Set and its questions from a JSON string or object
 */
export function importQuestionSetFromJSON(rawJson: string): { set: QuestionSet; questionCount: number } {
  const parsed = JSON.parse(rawJson);
  const set: QuestionSet = parsed.set || (parsed.id && parsed.name ? parsed : null);
  if (!set || !set.id || !set.name) {
    throw new Error('Invalid Question Set format. Must contain valid set details.');
  }

  const questions: BankQuestion[] = Array.isArray(parsed.questions) ? parsed.questions : [];
  saveQuestionSet(set, questions);

  return { set, questionCount: questions.length };
}

/**
 * Convert an array of BankQuestions into a MockTest ready for ExamPortal
 */
export function createMockTestFromBankQuestions(
  title: string,
  questions: BankQuestion[],
  examCategory?: ExamCategory,
  durationMinutes?: number,
  marksPerQuestion?: number,
  negativeMark?: number
): MockTest {
  const sectionsSet = new Set<string>();
  const convertedQuestions: Question[] = questions.map((bq, idx) => {
    const sectionName = bq.subjectSlug ? bq.subjectSlug.replace(/_/g, ' ') : 'General';
    sectionsSet.add(sectionName);

    // Ensure exactly 4 options
    const safeOptions: [string, string, string, string] = [
      bq.options[0] || 'Option A',
      bq.options[1] || 'Option B',
      bq.options[2] || 'Option C',
      bq.options[3] || 'Option D',
    ];

    const safeCorrect: 0 | 1 | 2 | 3 =
      bq.correctAnswer === 0 || bq.correctAnswer === 1 || bq.correctAnswer === 2 || bq.correctAnswer === 3
        ? (bq.correctAnswer as 0 | 1 | 2 | 3)
        : 0;

    return {
      id: bq.id || `bank-q-${idx + 1}`,
      section: sectionName,
      questionText: bq.questionText,
      options: safeOptions,
      correctAnswer: safeCorrect,
      explanation: bq.explanation || 'Solution explanation from Question Bank.',
      difficulty: (bq.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard') || 'medium',
      topic: bq.topicSlug || 'General',
    };
  });

  const sections = Array.from(sectionsSet);
  const totalQ = convertedQuestions.length;
  const autoDuration = durationMinutes || Math.max(10, Math.round(totalQ * 1.5));
  const mpq = marksPerQuestion || 1;
  const neg = typeof negativeMark === 'number' ? negativeMark : 0.25;

  return {
    id: `test-bank-${Date.now()}`,
    title: title || `Custom Mock Test (${totalQ} Questions)`,
    examType: examCategory || (questions[0]?.examSlug as ExamCategory) || 'rrb_ntpc',
    description: `Generated from verified Question Bank with ${totalQ} questions across ${sections.join(', ')}.`,
    durationMinutes: autoDuration,
    totalMarks: totalQ * mpq,
    marksPerQuestion: mpq,
    negativeMark: neg,
    sections: sections.length > 0 ? sections : ['General'],
    questions: convertedQuestions,
    createdAt: new Date().toISOString(),
    isAiGenerated: false,
  };
}
