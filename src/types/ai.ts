export type AIProvider = 'gemini' | 'openai' | 'claude';

export interface AISettings {
  provider: AIProvider;
  geminiApiKey: string;
  openaiApiKey: string;
  claudeApiKey: string;
  modelName: string;
  temperature: number;
}

export interface QuestionGenerationParams {
  examCategory: string;
  examName: string;
  subject?: string;
  difficulty: string;
  questionCount: number;
  durationMinutes: number;
  customTopic?: string;
}

export interface OCRGenerationParams {
  documentText?: string;
  imageDataBase64?: string;
  imageMimeType?: string;
  targetExam?: string;
  questionCount?: number;
}
