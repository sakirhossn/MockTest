import { QuestionGenerationParams, OCRGenerationParams } from '../../types/ai';

/**
 * System Role & Instructions: Expert Indian Competitive Exam Setter
 * Adheres strictly to the guidelines for RRB, SSC, IBPS, and WBPSC.
 */
export const EXAM_SETTER_SYSTEM_PROMPT = `You are an expert exam setter and subject specialist for Indian competitive examinations, including RRB (NTPC/Group D), SSC (CGL/CHSL), Banking (IBPS PO/Clerk), and WBPSC (WBCS/Clerkship/Misc).

Task:
Generate a structured set of multiple-choice questions (MCQs) based on the user's explicit parameters or extracted text from an uploaded document/image.

Instructions & Rules:
1. Schema Adherence: Return ONLY a valid JSON object matching the requested schema. Do NOT include introductory prose, explanations outside the JSON, or markdown code block wrappers (unless strictly requested as raw JSON).
2. Question Quality & Style:
   - For RRB NTPC: Focus on General Awareness (General Science - Physics/Chemistry/Biology, Indian History, Geography, Indian Railways facts, Constitution, Current Affairs), Mathematics (Arithmetic, Number System, Percentages, Ratio, Mensuration), and General Intelligence & Reasoning.
   - For SSC (CGL/CHSL): Include Quantitative Aptitude (Arithmetic & Advanced Math like Algebra, Trigonometry, Geometry, Mensuration), General Intelligence & Reasoning (Analogies, Coding-Decoding, Series), English Comprehension (Grammar, Vocabulary, Idioms, Cloze test), and General Awareness.
   - For IBPS (PO/Clerk): Focus on Data Interpretation (Tables, Pie charts, Bar graphs), Complex Reasoning Puzzles (Circular/Linear seating arrangements, Floor/Box puzzles), Syllogisms, and English Language with high analytical standard.
   - For WBPSC (WBCS/Clerkship/Misc): Include History of Bengal, Indian National Movement, Geography of West Bengal & India, Arithmetic (word problems), and English Grammar/Vocabulary. You may include bilingual Bengali/English context where relevant.
3. Option Integrity: Provide exactly 4 distinct options per question. Ensure only ONE option is correct. No duplicate or overlapping options.
4. Explanations: Write detailed step-by-step solutions for every question (especially for Math and Reasoning). For math problems, show formulas, substitutions, and intermediate calculation steps.
5. LaTeX Math Standard: Render all mathematical variables, equations, and expressions using standard LaTeX notation enclosed in standard single dollar delimiters for inline ($x^2 + y^2 = r^2$, $\\frac{a}{b}$, $\\sqrt{n}$) or double dollars for equations ($$\\int f(x)dx$$).`;

export const JSON_SCHEMA_SPEC = `{
  "title": "Mock Test Title",
  "examType": "rrb_ntpc | ssc_cgl | ssc_chsl | ibps_po | ibps_clerk | wbpsc_clerkship | wbpsc_wbcs",
  "description": "Short description of the test set",
  "durationMinutes": 60,
  "marksPerQuestion": 1,
  "negativeMark": 0.33,
  "sections": ["Section 1", "Section 2"],
  "questions": [
    {
      "id": "q1",
      "section": "Section Name",
      "questionText": "Question text with LaTeX like $x + y = 10$",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Step-by-step solution with LaTeX formulas",
      "difficulty": "easy | medium | hard",
      "topic": "Mathematics",
      "subtopic": "Simple Interest"
    }
  ]
}`;

/**
 * Builds the generation prompt for Mode 1: Auto AI Exam Generator
 */
export function buildExamGenerationPrompt(params: QuestionGenerationParams): string {
  const { examCategory, examName, subject, difficulty, questionCount, durationMinutes, customTopic } = params;

  let examSpecificFocus = '';
  switch (examCategory) {
    case 'rrb_ntpc':
      examSpecificFocus = 'Target RRB NTPC Pattern: Focus on General Awareness (General Science, History, Geography, Indian Railways), Arithmetic, and Reasoning. Previous Year Question (PYQ) standard.';
      break;
    case 'ssc_cgl':
    case 'ssc_chsl':
      examSpecificFocus = 'Target SSC CGL/CHSL Pattern: Quantitative Aptitude (must include Advanced Math like Algebra, Trigonometry, Geometry alongside Arithmetic), General Intelligence, English Comprehension, and General Awareness.';
      break;
    case 'ibps_po':
    case 'ibps_clerk':
      examSpecificFocus = 'Target IBPS Banking Pattern: High-quality Data Interpretation, Reasoning Puzzles (Seating Arrangement, Syllogisms), and English Language.';
      break;
    case 'wbpsc_clerkship':
    case 'wbpsc_wbcs':
      examSpecificFocus = 'Target WBPSC Pattern: General Studies (emphasis on History of Bengal, Indian National Movement, Geography of West Bengal), Arithmetic, and English. Accurate to WBPSC standard.';
      break;
    default:
      examSpecificFocus = `Focus on authentic Indian competitive exam standard for ${examName}.`;
  }

  return `Generate an authentic mock examination test set with EXACTLY ${questionCount} multiple-choice questions.

EXAM: ${examName} (${examCategory})
SUBJECT/SECTION: ${subject || 'Full Mock Test covering all pattern sections'}
${customTopic ? `SPECIFIC TOPIC: ${customTopic}` : ''}
DIFFICULTY: ${difficulty}
TOTAL DURATION: ${durationMinutes} minutes

${examSpecificFocus}

CRITICAL RULES:
1. Provide exactly ${questionCount} questions.
2. Every question MUST have exactly 4 distinct options (no duplicates, no "None of the above" unless authentic).
3. "correctAnswer" MUST be an integer 0, 1, 2, or 3 representing the index in the "options" array.
4. Render all math formulas and variables in LaTeX enclosed in single dollar signs like $x^2 + 5x + 6 = 0$ or $\\frac{1}{2}$.
5. Provide a comprehensive, step-by-step solution in the "explanation" field.
6. Return ONLY the raw JSON object conforming strictly to this format:
${JSON_SCHEMA_SPEC}`;
}

/**
 * Builds the prompt for Mode 2: Custom Document OCR / Image to Test
 */
export function buildOCRExtractionPrompt(params: OCRGenerationParams): string {
  const { documentText, targetExam, questionCount } = params;
  const countInstruction = questionCount ? `Generate up to ${questionCount} questions.` : 'Extract all valid questions found.';

  return `You are analyzing study material / question paper ${documentText ? 'text extracted from an uploaded document' : 'from an uploaded document image'}.

Your task is to extract, clean, structure, and convert this content into a standardized interactive Multiple Choice Mock Test.

Target Exam: ${targetExam || 'Indian Competitive Exam (RRB/SSC/IBPS/WBPSC)'}
${countInstruction}

${documentText ? `Document Content:\n---\n${documentText.slice(0, 12000)}\n---` : 'Please inspect the provided image carefully and extract all questions.'}

INSTRUCTIONS:
1. Parse every question into clear, readable question text.
2. If mathematical symbols, fractions, powers, or geometric figures are described in text, convert them into standard KaTeX LaTeX formulas ($...$).
3. Ensure each question has exactly 4 clean options. If the original text only has 2 or 3 options, generate authentic distractors so there are exactly 4 distinct choices.
4. Identify the correct answer (0, 1, 2, or 3).
5. Write a clear, step-by-step explanatory solution for each question.
6. Return ONLY valid JSON matching this schema:
${JSON_SCHEMA_SPEC}`;
}

/**
 * Builds AI prompt for post-test weakness diagnosis
 */
export function buildWeaknessAnalysisPrompt(
  examName: string,
  incorrectTopics: string[],
  timeSpentSummary: string
): string {
  return `As an expert exam mentor for ${examName}, analyze this candidate's test performance:
- Areas with incorrect answers / struggles: ${incorrectTopics.join(', ') || 'None specifically'}
- Speed & time distribution: ${timeSpentSummary}

Provide a JSON array of 2 to 4 targeted diagnosis items. Schema:
[
  {
    "topic": "Topic Name",
    "issueDescription": "Precise reason for marks loss or time waste",
    "actionAdvice": "Concrete 2-step study or practice technique to fix this",
    "severity": "high | medium | low"
  }
]
Return ONLY raw JSON array.`;
}
