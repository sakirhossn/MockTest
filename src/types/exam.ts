export type ExamCategory =
  | 'rrb_ntpc'
  | 'rrb_group_d'
  | 'ssc_cgl'
  | 'ssc_chsl'
  | 'ssc_mts'
  | 'ibps_po'
  | 'ibps_clerk'
  | 'ibps_rrb_oa'
  | 'ibps_rrb_os1'
  | 'wbpsc_wbcs'
  | 'wbpsc_clerkship'
  | 'wbpsc_misc'
  | 'wbpsc_food_si'
  | 'custom_uploaded'
  | (string & {});

export type ExamSubject =
  | 'quant'
  | 'reasoning'
  | 'general_awareness'
  | 'english'
  | 'bengali_regional'
  | 'all';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';

export type QuestionStatus =
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked'
  | 'answered_and_marked';

export interface Question {
  id: string;
  section: string;
  questionText: string;
  options: [string, string, string, string]; // Exactly 4 distinct options
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  subtopic?: string;
  marks?: number;
  negativeMarks?: number;
}

export interface ExamCutoff {
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews?: number;
}

export interface ExamPatternConfig {
  id: ExamCategory;
  name: string;
  shortName: string;
  description: string;
  tierOrStage: string;
  durationMinutes: number;
  totalQuestions: number;
  marksPerQuestion: number;
  negativeMarkRatio: number; // e.g. 0.333 for RRB, 0.25 for SSC/IBPS (or 0.50 if marks=2)
  sections: string[];
  expectedCutoffs: ExamCutoff;
  badgeColor: string;
  iconName: string;
}

export interface MockTest {
  id: string;
  title: string;
  examType: ExamCategory;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  marksPerQuestion: number;
  negativeMark: number;
  sections: string[];
  questions: Question[];
  createdAt: string;
  isAiGenerated?: boolean;
  sourceDocName?: string;
}

export interface UserAnswerState {
  questionId: string;
  selectedOption: number | null; // 0, 1, 2, 3 or null
  status: QuestionStatus;
  timeSpentSeconds: number;
}

export interface SectionBreakdown {
  sectionName: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  accuracy: number;
  timeSpentSeconds: number;
}

export interface AIWeaknessFeedback {
  topic: string;
  issueDescription: string;
  actionAdvice: string;
  severity: 'high' | 'medium' | 'low';
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  examType: ExamCategory;
  userId?: string;
  completedAt: string;
  timeTakenSeconds: number;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  markedCount: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  cutoffs: ExamCutoff;
  clearedCutoff: boolean;
  sectionBreakdown: SectionBreakdown[];
  userAnswers: Record<string, UserAnswerState>;
  weaknessReport: AIWeaknessFeedback[];
  speedPerQuestion: {
    questionId: string;
    seconds: number;
    isCorrect: boolean;
  }[];
}

// ==========================================
// EXAM PATTERNS & SYLLABI TYPES
// ==========================================
export interface SyllabusSubjectRule {
  id: string;
  name: string;
  slug: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMark: number;
  durationMinutes?: number;
  topics: string[];
}

export interface ExamStageConfig {
  id: string;
  stageSlug: string;
  stageName: string;
  notificationVersion: string;
  examYear: number;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  hasSectionalTiming: boolean;
  marksPerCorrect: number;
  negativeMarkPerWrong: number;
  sourceUrl: string;
  sourceTitle: string;
  verificationDate: string;
  languages: ('en' | 'hi' | 'bn')[];
  subjects: SyllabusSubjectRule[];
}

export interface ExamPreset {
  id: string;
  slug: string;
  name: string;
  category: 'RAILWAY' | 'BANKING' | 'SSC' | 'STATE_PSC';
  description: string;
  officialUrl: string;
  stages: ExamStageConfig[];
}

// ==========================================
// QUESTION BANK TYPES
// ==========================================
export type QuestionSourceType =
  | 'VERIFIED_PREVIOUS_YEAR'
  | 'USER_UPLOADED'
  | 'AI_GENERATED'
  | 'DEMO';

export interface BankQuestion {
  id: string;
  examSlug: string;
  stageSlug?: string;
  subjectSlug: string;
  topicSlug: string;
  questionText: string;
  options: [string, string, string, string] | string[];
  correctAnswer: 0 | 1 | 2 | 3 | number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'EASY' | 'MEDIUM' | 'HARD';
  sourceType: QuestionSourceType;
  sourceYear?: number;
  sourceReference?: string;
  language?: 'en' | 'hi' | 'bn';
  qualityScore?: number;
  validationStatus?: string;
  isVerified?: boolean;
  questionSetId?: string;
  sourcePage?: number;
  sourceQuestionNumber?: number;
  createdAt: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  fileName?: string;
  examSlug: string;
  stageSlug?: string;
  subjectSlug?: string;
  topicSlug?: string;
  pageCount?: number;
  questionCount: number;
  validQuestionCount?: number;
  status?: 'READY' | 'VERIFIED' | 'PROCESSING';
  createdAt: string;
}
