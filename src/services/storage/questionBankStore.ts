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
 * Retrieve all questions in the bank (seed + user created/imported)
 */
export function getBankQuestions(filter?: BankFilter): BankQuestion[] {
  let userQuestions: BankQuestion[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANK_QUESTIONS);
    if (raw) {
      userQuestions = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse bank questions from localStorage', err);
  }

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

    if (questions && questions.length > 0) {
      const raw = localStorage.getItem(STORAGE_KEY_BANK_QUESTIONS);
      const existing: BankQuestion[] = raw ? JSON.parse(raw) : [];
      // Remove previous questions belonging to this set to avoid duplicates
      const others = existing.filter((q) => q.questionSetId !== set.id);
      const taggedQuestions = questions.map((q) => ({
        ...q,
        questionSetId: set.id,
      }));
      localStorage.setItem(
        STORAGE_KEY_BANK_QUESTIONS,
        JSON.stringify([...taggedQuestions, ...others])
      );
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
  } catch (err) {
    console.error('Failed to delete question set', err);
  }
}

/**
 * Convert an array of BankQuestions into a MockTest ready for ExamPortal
 */
export function createMockTestFromBankQuestions(
  title: string,
  questions: BankQuestion[],
  examCategory?: ExamCategory,
  durationMinutes?: number
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

  return {
    id: `test-bank-${Date.now()}`,
    title: title || `Custom Mock Test (${totalQ} Questions)`,
    examType: examCategory || (questions[0]?.examSlug as ExamCategory) || 'rrb_ntpc',
    description: `Generated from verified Question Bank with ${totalQ} questions across ${sections.join(', ')}.`,
    durationMinutes: autoDuration,
    totalMarks: totalQ,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    sections: sections.length > 0 ? sections : ['General'],
    questions: convertedQuestions,
    createdAt: new Date().toISOString(),
    isAiGenerated: false,
  };
}
