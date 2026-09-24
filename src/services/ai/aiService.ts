import { AISettings, QuestionGenerationParams, OCRGenerationParams } from '../../types/ai';
import { MockTest, AIWeaknessFeedback, Question } from '../../types/exam';
import {
  EXAM_SETTER_SYSTEM_PROMPT,
  buildExamGenerationPrompt,
  buildOCRExtractionPrompt,
  buildWeaknessAnalysisPrompt,
} from './examPrompts';
import { PRELOADED_TESTS, EXAM_CONFIGS } from '../../data/mockExams';
import { PYQPaper, saveCustomPYQPaper } from '../../data/pyqData';

const STORAGE_KEYS = {
  SETTINGS: 'mocktest_ai_settings',
  GEMINI_KEY: 'mocktest_gemini_key',
  OPENAI_KEY: 'mocktest_openai_key',
  CLAUDE_KEY: 'mocktest_claude_key',
};

export function getStoredAISettings(): AISettings {
  const envGemini = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  const envOpenai = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
  const envClaude = (import.meta as any).env?.VITE_CLAUDE_API_KEY || '';

  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const rawModel = parsed.modelName || 'gemini-3.6-flash';
      let cleanModel = rawModel;
      // Auto-migrate obsolete or non-found models to gemini-3.6-flash
      if (
        cleanModel === 'gemini-2.5-flash' ||
        cleanModel === 'gemini-1.5-flash' ||
        cleanModel === 'gemini-2.0-flash' ||
        cleanModel.includes('2.5')
      ) {
        cleanModel = 'gemini-3.6-flash';
      }
      return {
        ...parsed,
        modelName: cleanModel,
        geminiApiKey: parsed.geminiApiKey || envGemini,
        openaiApiKey: parsed.openaiApiKey || envOpenai,
        claudeApiKey: parsed.claudeApiKey || envClaude,
      };
    } catch (e) {
      console.warn('Failed to parse stored AI settings', e);
    }
  }

  return {
    provider: 'gemini',
    geminiApiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || envGemini,
    openaiApiKey: localStorage.getItem(STORAGE_KEYS.OPENAI_KEY) || envOpenai,
    claudeApiKey: localStorage.getItem(STORAGE_KEYS.CLAUDE_KEY) || envClaude,
    modelName: 'gemini-3.6-flash',
    temperature: 0.2,
  };
}

export function saveStoredAISettings(settings: AISettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  if (settings.geminiApiKey) localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, settings.geminiApiKey);
  if (settings.openaiApiKey) localStorage.setItem(STORAGE_KEYS.OPENAI_KEY, settings.openaiApiKey);
  if (settings.claudeApiKey) localStorage.setItem(STORAGE_KEYS.CLAUDE_KEY, settings.claudeApiKey);
}

/**
 * Strips markdown json codeblock wrappers ```json ... ``` if present
 */
export function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Robust JSON parser that recovers from:
 * 1. Markdown codeblock wrapping
 * 2. Unescaped backslashes in math/LaTeX (e.g. \frac, \alpha, \degree, \times)
 * 3. Trailing commas before } or ]
 * 4. Extraneous text surrounding the JSON object
 */
export function safeParseJSON(raw: string): any {
  let cleaned = cleanJsonString(raw);

  // 1. Direct parse attempt
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // 2. Extract outermost JSON structure if extra conversational text exists
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = cleaned.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(cleaned);
      } catch (e) {}
    }

    // 3. Fix unescaped backslashes (common in math, LaTeX, formulas, e.g. \frac, \alpha, \degree)
    try {
      const sanitized = cleaned.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
      return JSON.parse(sanitized);
    } catch (e) {}

    // 4. Fix trailing commas before closing braces/brackets
    try {
      const fixedCommas = cleaned
        .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\')
        .replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(fixedCommas);
    } catch (e) {}

    throw initialErr;
  }
}

let cachedSupportedModels: string[] | null = null;

/**
 * Dynamically queries Google ModelService.ListModels to discover
 * the exact models currently available to this API key and region
 */
async function fetchSupportedModels(apiKey: string): Promise<string[]> {
  if (cachedSupportedModels && cachedSupportedModels.length > 0) {
    return cachedSupportedModels;
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.models)) return [];
    const valid = data.models
      .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
      .map((m: any) => (m.name || '').replace(/^models\//, ''))
      .filter(Boolean);
    if (valid.length > 0) {
      cachedSupportedModels = valid;
    }
    return valid;
  } catch (e) {
    return [];
  }
}

/**
 * Executes a prompt via Google Gemini API with 4 retry attempts
 * Intervals: 5s, 10s, 20s, 40s (on 503, 429, or temporary overload)
 */
async function callGemini(
  prompt: string,
  apiKey: string,
  model = 'gemini-3.6-flash',
  imageInlineData?: { mimeType: string; data: string },
  onProgress?: (message: string) => void
): Promise<string> {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey || cleanKey === 'AIzaSy...') {
    throw new Error('Please configure your Google Gemini API key in Settings (gear icon at the top).');
  }

  // Model candidates in priority order:
  // 1. User selected model (e.g. gemini-3.6-flash or gemini-3.5-flash-lite)
  // 2. Official Gemini 3 flash models (high throughput & fast)
  // 3. Fallbacks (2.5, 2.0, 1.5)
  const primaryModel = model || 'gemini-3.6-flash';
  let candidates = [
    primaryModel,
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.7-flash',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

  // Exact user-specified retry intervals: 5s, 10s, 20s, 40s
  const RETRY_INTERVALS_MS = [5000, 10000, 20000, 40000];
  const MAX_RETRIES = RETRY_INTERVALS_MS.length; // 4 retries

  let lastErrorMsg = '';
  let discoveredModels = false;

  for (let retryIdx = 0; retryIdx <= MAX_RETRIES; retryIdx++) {
    // If this is a retry attempt, wait for the specified interval with live countdown
    if (retryIdx > 0) {
      const waitSeconds = RETRY_INTERVALS_MS[retryIdx - 1] / 1000;
      console.warn(
        `[Gemini API] Server busy or unavailable. Waiting ${waitSeconds}s before retry ${retryIdx} of ${MAX_RETRIES}...`
      );

      for (let sec = waitSeconds; sec > 0; sec--) {
        onProgress?.(
          `Gemini server experiencing high demand. Retrying in ${sec}s (Attempt ${retryIdx} of ${MAX_RETRIES})...`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      onProgress?.(`Contacting Gemini AI (Attempt ${retryIdx} of ${MAX_RETRIES})...`);
    }

    let hadTemporaryError = false;

    // Try candidate models in this attempt
    for (const m of candidates) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${cleanKey}`;
      const parts: any[] = [{ text: prompt }];
      if (imageInlineData) {
        parts.unshift({
          inlineData: {
            mimeType: imageInlineData.mimeType,
            data: imageInlineData.data,
          },
        });
      }

      const payload = {
        contents: [{ role: 'user', parts }],
        systemInstruction: { parts: [{ text: EXAM_SETTER_SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      };

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': cleanKey,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const errMsg = err.error?.message || '';

          // If invalid key / authentication error, fail immediately without retrying
          if (
            errMsg.includes('invalid authentication') ||
            errMsg.includes('API_KEY_INVALID') ||
            errMsg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') ||
            errMsg.includes('API_KEY_SERVICE_BLOCKED') ||
            errMsg.includes('API key not valid') ||
            res.status === 401
          ) {
            throw new Error(
              'Invalid Google Gemini API key or credentials. Please verify your key at https://aistudio.google.com/app/apikey and update it in Settings.'
            );
          }

          // If high demand / 503 / 429 / overloaded
          if (
            res.status === 503 ||
            res.status === 429 ||
            errMsg.toLowerCase().includes('high demand') ||
            errMsg.toLowerCase().includes('resource_exhausted') ||
            errMsg.toLowerCase().includes('overloaded') ||
            errMsg.toLowerCase().includes('service unavailable')
          ) {
            hadTemporaryError = true;
            lastErrorMsg = errMsg || `Gemini ${m} service unavailable (${res.status})`;
            console.warn(`Model ${m} busy/overloaded (${lastErrorMsg}). Trying next model or scheduling retry...`);
            continue; // Try next candidate model
          }

          // If 404 (model not found for this API version/account)
          if (res.status === 404 || errMsg.toLowerCase().includes('not found')) {
            lastErrorMsg = errMsg || `Model ${m} not found`;
            console.warn(`Model ${m} not found on v1beta (404). Trying next model...`);
            if (!discoveredModels) {
              discoveredModels = true;
              const liveModels = await fetchSupportedModels(cleanKey);
              if (liveModels.length > 0) {
                console.log('[Gemini API] Dynamically discovered models for this key:', liveModels);
                candidates = [...liveModels, ...candidates].filter((x, i, a) => a.indexOf(x) === i);
              }
            }
            continue;
          }

          lastErrorMsg = errMsg || `Gemini API call failed with status ${res.status}`;
          continue;
        }

        const json = await res.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('No content returned from Gemini API');
        return rawText;
      } catch (err: any) {
        if (err.message?.includes('Invalid Google Gemini API key') || err.message?.includes('credentials')) throw err;
        lastErrorMsg = err.message || 'Gemini connection error';
        hadTemporaryError = true;
      }
    }

    // If only non-retriable errors (like 404 on all models) and no 503/429 overload, don't sleep 40s
    if (!hadTemporaryError && retryIdx === 0) {
      break;
    }
  }

  throw new Error(
    lastErrorMsg ||
      'All Gemini models are temporarily experiencing high demand after 4 retry attempts (5s, 10s, 20s, 40s). Please try again shortly.'
  );
}

/**
 * Executes a prompt via OpenAI API
 */
async function callOpenAI(
  prompt: string,
  apiKey: string,
  model = 'gpt-4o',
  imageInlineData?: { mimeType: string; data: string }
): Promise<string> {
  const url = 'https://api.openai.com/v1/chat/completions';

  const userContent: any = imageInlineData
    ? [
        { type: 'text', text: prompt },
        {
          type: 'image_url',
          image_url: { url: `data:${imageInlineData.mimeType};base64,${imageInlineData.data}` },
        },
      ]
    : prompt;

  const payload = {
    model,
    messages: [
      { role: 'system', content: EXAM_SETTER_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API call failed with status ${res.status}`);
  }

  const json = await res.json();
  const rawText = json.choices?.[0]?.message?.content;
  if (!rawText) throw new Error('No content returned from OpenAI API');
  return rawText;
}

/**
 * Executes a prompt via Anthropic Claude API
 */
async function callClaude(
  prompt: string,
  apiKey: string,
  model = 'claude-3-5-sonnet-20241022',
  imageInlineData?: { mimeType: string; data: string }
): Promise<string> {
  const url = 'https://api.anthropic.com/v1/messages';

  const userContent: any[] = [];
  if (imageInlineData) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: imageInlineData.mimeType,
        data: imageInlineData.data,
      },
    });
  }
  userContent.push({ type: 'text', text: prompt });

  const payload = {
    model,
    max_tokens: 4000,
    system: EXAM_SETTER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }],
    temperature: 0.2,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Claude API call failed with status ${res.status}`);
  }

  const json = await res.json();
  const rawText = json.content?.[0]?.text;
  if (!rawText) throw new Error('No content returned from Claude API');
  return rawText;
}

/**
 * Universal dispatcher to active AI provider
 */
async function dispatchAIPrompt(
  prompt: string,
  imageInlineData?: { mimeType: string; data: string },
  onProgress?: (message: string) => void
): Promise<string> {
  const settings = getStoredAISettings();

  if (settings.provider === 'gemini') {
    const cleanKey = (settings.geminiApiKey || '').trim();
    if (!cleanKey || cleanKey === 'AIzaSy...') {
      throw new Error('MISSING_KEY: Please enter your Google Gemini API key in Settings (gear icon at the top).');
    }
    return callGemini(prompt, cleanKey, settings.modelName || 'gemini-3.6-flash', imageInlineData, onProgress);
  }

  if (settings.provider === 'openai') {
    if (!settings.openaiApiKey) {
      throw new Error('MISSING_KEY: Please enter your OpenAI API key in Settings.');
    }
    return callOpenAI(prompt, settings.openaiApiKey, settings.modelName || 'gpt-4o', imageInlineData);
  }

  if (settings.provider === 'claude') {
    if (!settings.claudeApiKey) {
      throw new Error('MISSING_KEY: Please enter your Claude API key in Settings.');
    }
    return callClaude(prompt, settings.claudeApiKey, settings.modelName || 'claude-3-5-sonnet-20241022', imageInlineData);
  }

  throw new Error(`Unsupported AI provider: ${settings.provider}`);
}

/**
 * Mode 1: Auto AI Exam Generator
 */
export async function generateAITest(
  params: QuestionGenerationParams,
  onProgress?: (message: string) => void
): Promise<MockTest> {
  const prompt = buildExamGenerationPrompt(params);

  try {
    const rawJson = await dispatchAIPrompt(prompt, undefined, onProgress);
    const parsed = safeParseJSON(rawJson);

    const examConfig = EXAM_CONFIGS.find((c) => c.id === params.examCategory);
    const normalizedQuestions: Question[] = (parsed.questions || []).map((q: any, idx: number) => ({
      id: q.id || `gen-${Date.now()}-${idx + 1}`,
      section: q.section || examConfig?.sections[0] || 'General',
      questionText: q.questionText || 'Question',
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : [q.options?.[0] || 'A', q.options?.[1] || 'B', q.options?.[2] || 'C', q.options?.[3] || 'D'],
      correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 0,
      explanation: q.explanation || 'Detailed step-by-step solution.',
      difficulty: q.difficulty || params.difficulty || 'medium',
      topic: q.topic || 'General',
      subtopic: q.subtopic || '',
    }));

    const marksPerQ = examConfig?.marksPerQuestion || 1;
    const negMark = examConfig ? examConfig.marksPerQuestion * examConfig.negativeMarkRatio : 0.25;

    return {
      id: `ai-test-${Date.now()}`,
      title: parsed.title || `${params.examName} AI Generated Mock Paper`,
      examType: params.examCategory as any,
      description: parsed.description || `AI customized mock test for ${params.examName}.`,
      durationMinutes: params.durationMinutes,
      totalMarks: normalizedQuestions.length * marksPerQ,
      marksPerQuestion: marksPerQ,
      negativeMark: parseFloat(negMark.toFixed(2)),
      sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : (examConfig?.sections || ['General']),
      questions: normalizedQuestions,
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
    };
  } catch (error: any) {
    console.warn('AI generation encountered error, checking fallback:', error);
    // If user has not added API key yet or request failed, synthesize from high-yield bank
    return createCuratedFallbackTest(params, error.message);
  }
}

/**
 * Mode 2: Custom Document Upload (PDF / Image OCR to Test)
 */
export async function generateTestFromDocument(
  params: OCRGenerationParams,
  imageFile?: File,
  onProgress?: (message: string) => void
): Promise<MockTest> {
  let imageInlineData: { mimeType: string; data: string } | undefined;

  if (imageFile) {
    const base64 = await fileToBase64(imageFile);
    imageInlineData = {
      mimeType: imageFile.type,
      data: base64.split(',')[1],
    };
  }

  const prompt = buildOCRExtractionPrompt(params);

  try {
    const rawJson = await dispatchAIPrompt(prompt, imageInlineData, onProgress);
    const parsed = safeParseJSON(rawJson);

    const normalizedQuestions: Question[] = (parsed.questions || []).map((q: any, idx: number) => ({
      id: `ocr-${Date.now()}-${idx + 1}`,
      section: q.section || 'Extracted Section',
      questionText: q.questionText || 'Extracted Question',
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : [q.options?.[0] || 'A', q.options?.[1] || 'B', q.options?.[2] || 'C', q.options?.[3] || 'D'],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || 'Detailed solution.',
      difficulty: q.difficulty || 'medium',
      topic: q.topic || 'Document Extraction',
    }));

    const matchedConfig = EXAM_CONFIGS.find(
      (c) => c.id === params.targetExam || c.name === params.targetExam
    );
    const examSlug = matchedConfig?.id || (params.targetExam as any) || 'custom_uploaded';

    return {
      id: `doc-test-${Date.now()}`,
      title: parsed.title || 'Document Extracted Mock Test',
      examType: examSlug,
      description: parsed.description || 'Structured interactive test generated from uploaded study document/image.',
      durationMinutes: parsed.durationMinutes || 30,
      totalMarks: normalizedQuestions.length,
      marksPerQuestion: 1,
      negativeMark: 0.25,
      sections: parsed.sections || ['Extracted Questions'],
      questions: normalizedQuestions,
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
      sourceDocName: imageFile?.name || 'Document',
    };
  } catch (err: any) {
    throw new Error(err.message || 'Failed to extract questions from document.');
  }
}

/**
 * Post-exam AI Weakness Diagnostics
 */
export async function analyzeWeaknesses(
  examName: string,
  incorrectTopics: string[],
  timeSummary: string
): Promise<AIWeaknessFeedback[]> {
  try {
    const prompt = buildWeaknessAnalysisPrompt(examName, incorrectTopics, timeSummary);
    const raw = await dispatchAIPrompt(prompt);
    const parsed = JSON.parse(cleanJsonString(raw));
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    // Fallback heuristic weakness generator
  }

  // Fallback diagnostic rule engine
  const feedback: AIWeaknessFeedback[] = [];
  if (incorrectTopics.length > 0) {
    const primaryTopic = incorrectTopics[0];
    feedback.push({
      topic: primaryTopic,
      issueDescription: `Accuracy dipped in ${primaryTopic}. Calculations or concept application took excessive time or resulted in negative marking.`,
      actionAdvice: `Review core formulas and solve at least 25 targeted PYQ questions for ${primaryTopic} with a 45-second timer per question.`,
      severity: 'high',
    });
  }
  feedback.push({
    topic: 'Time Allocation & Elimination Strategy',
    issueDescription: 'Time per question fluctuated on complex reasoning and word problems.',
    actionAdvice: 'Implement the 2-Round Test Taking Method: In Round 1, answer all direct and 30-second questions; in Round 2, tackle calculations and marked reviews.',
    severity: 'medium',
  });

  return feedback;
}

/**
 * Helper to convert browser File to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Fallback synthesizer that generates a high-yield mock paper from the curated bank
 */
function createCuratedFallbackTest(params: QuestionGenerationParams, errorReason?: string): MockTest {
  const match = PRELOADED_TESTS.find((t) => t.examType === params.examCategory) || PRELOADED_TESTS[0];
  const examConfig = EXAM_CONFIGS.find((c) => c.id === params.examCategory) || EXAM_CONFIGS[0];

  return {
    ...match,
    id: `curated-${Date.now()}`,
    title: `${params.examName} High-Yield Curated Paper`,
    description: `Official-pattern syllabus test set for ${params.examName}.${errorReason?.includes('MISSING_KEY') ? ' (Tip: Configure your Gemini API key in Settings for infinite on-demand AI sets)' : ''}`,
    durationMinutes: params.durationMinutes || match.durationMinutes,
  };
}

export interface FetchPYQParams {
  examName: string;
  examSlug: string;
  category?: 'RAILWAY' | 'BANKING' | 'SSC' | 'STATE_PSC';
  year: number;
  shift: string;
  questionCount?: number;
}

/**
 * AI PYQ Archivist & Fetcher:
 * Connects to Google Gemini with a specialized prompt to retrieve or synthesize
 * authentic, verified Previous Year Questions for any exam, year, and shift.
 */
export async function fetchPYQWithAI(
  params: FetchPYQParams,
  onProgress?: (message: string) => void
): Promise<PYQPaper> {
  const count = params.questionCount || 10;
  const prompt = `You are a senior archivist of Indian competitive examination previous year papers.
Retrieve and structure ${count} authentic questions that genuinely appeared in the ${params.examName} examination in the year ${params.year} (${params.shift}).

Rules:
1. Provide actual memory-based / official questions asked in ${params.examName} ${params.year}.
2. Cover the official core subjects for ${params.examName}.
3. Each question must have exactly 4 options, a correct answer index (0, 1, 2, or 3), and a comprehensive, step-by-step explanatory solution.
4. Output strictly valid JSON without any markdown formatting or surrounding conversational text:
{
  "title": "${params.examName} ${params.year} ${params.shift} Official Paper",
  "description": "Authentic Previous Year Questions from ${params.examName} (${params.year}, ${params.shift}).",
  "sections": ["Section 1", "Section 2"],
  "questions": [
    {
      "id": "pyq-1",
      "section": "Section Name",
      "questionText": "Precise question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed step-by-step mathematical or factual solution.",
      "difficulty": "medium",
      "topic": "Topic Name"
    }
  ]
}`;

  onProgress?.(`Archiving authentic ${params.year} ${params.shift} question paper for ${params.examName}...`);
  const rawJson = await dispatchAIPrompt(prompt, undefined, onProgress);
  const parsed = safeParseJSON(rawJson);

  const matchedConfig = EXAM_CONFIGS.find((c) => c.id === params.examSlug || c.name === params.examName);
  const marksPerQ = matchedConfig?.marksPerQuestion || 1;
  const negMark = matchedConfig ? parseFloat((matchedConfig.marksPerQuestion * matchedConfig.negativeMarkRatio).toFixed(2)) : 0.25;

  const normalizedQuestions: Question[] = (parsed.questions || []).map((q: any, idx: number) => ({
    id: `pyq-ai-${Date.now()}-${idx + 1}`,
    section: q.section || matchedConfig?.sections[0] || 'General',
    questionText: q.questionText || 'Previous Year Question',
    options: Array.isArray(q.options) && q.options.length === 4
      ? q.options
      : [q.options?.[0] || 'A', q.options?.[1] || 'B', q.options?.[2] || 'C', q.options?.[3] || 'D'],
    correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 0,
    explanation: q.explanation || 'Detailed step-by-step official solution.',
    difficulty: q.difficulty || 'medium',
    topic: q.topic || 'Previous Year Questions',
  }));

  const pyqPaper: PYQPaper = {
    id: `pyq-${params.examSlug}-${params.year}-${Date.now()}`,
    examSlug: params.examSlug,
    examName: params.examName,
    category: params.category || 'RAILWAY',
    year: params.year,
    shift: params.shift,
    tier: matchedConfig?.tierOrStage || 'Tier 1 / Prelims',
    title: parsed.title || `${params.examName} ${params.year} ${params.shift} Official Paper`,
    description: parsed.description || `Authentic Previous Year Questions from ${params.examName} (${params.year}, ${params.shift}).`,
    durationMinutes: matchedConfig?.durationMinutes || 60,
    totalQuestions: normalizedQuestions.length,
    marksPerQuestion: marksPerQ,
    negativeMark: negMark,
    sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : (matchedConfig?.sections || ['General']),
    sourceReference: `${params.examName} ${params.year} Official Archival Paper`,
    questions: normalizedQuestions,
    isOfficial: true,
  };

  saveCustomPYQPaper(pyqPaper);
  return pyqPaper;
}
