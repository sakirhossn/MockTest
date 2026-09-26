import { QuestionSet, BankQuestion } from '../../types/exam';
import { getSupabaseCredentials } from '../supabase/supabaseClient';

const STORAGE_KEY_API_SECRET = 'mocktest_api_secret_key';
const STORAGE_KEY_LAST_WEBHOOK_URL = 'mocktest_last_webhook_url';
const STORAGE_KEY_LAST_WEBHOOK_KEY = 'mocktest_last_webhook_key';
const STORAGE_KEY_LAST_WEBHOOK_HEADER = 'mocktest_last_webhook_header_type';

/**
 * Generate a cryptographically random secret key for API authentication
 */
export function generateRandomSecretKey(prefix: string = 'mk_sec_'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(24);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 24; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  let randomPart = '';
  for (let i = 0; i < array.length; i++) {
    randomPart += chars[array[i] % chars.length];
  }
  return `${prefix}${randomPart}`;
}

/**
 * Get or initialize the user's API Secret Key
 */
export function getApiSecretKey(): string {
  try {
    let key = localStorage.getItem(STORAGE_KEY_API_SECRET);
    if (!key) {
      key = generateRandomSecretKey();
      localStorage.setItem(STORAGE_KEY_API_SECRET, key);
    }
    return key;
  } catch {
    return 'mk_sec_demo1234567890abcdef';
  }
}

/**
 * Save custom API Secret Key
 */
export function saveApiSecretKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_API_SECRET, key.trim());
  } catch (err) {
    console.warn('Failed to save API secret key', err);
  }
}

/**
 * Reset and generate a new API Secret Key
 */
export function regenerateApiSecretKey(): string {
  const newKey = generateRandomSecretKey();
  saveApiSecretKey(newKey);
  return newKey;
}

/**
 * Webhook persistence helpers
 */
export function getLastWebhookConfig(): { url: string; key: string; headerType: 'Bearer' | 'X-API-Key' | 'Custom' } {
  try {
    return {
      url: localStorage.getItem(STORAGE_KEY_LAST_WEBHOOK_URL) || '',
      key: localStorage.getItem(STORAGE_KEY_LAST_WEBHOOK_KEY) || '',
      headerType: (localStorage.getItem(STORAGE_KEY_LAST_WEBHOOK_HEADER) as any) || 'Bearer',
    };
  } catch {
    return { url: '', key: '', headerType: 'Bearer' };
  }
}

export function saveLastWebhookConfig(url: string, key: string, headerType: 'Bearer' | 'X-API-Key' | 'Custom'): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_WEBHOOK_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_LAST_WEBHOOK_KEY, key.trim());
    localStorage.setItem(STORAGE_KEY_LAST_WEBHOOK_HEADER, headerType);
  } catch (err) {
    console.warn('Failed to save last webhook config', err);
  }
}

export interface WebhookSendResult {
  success: boolean;
  statusCode?: number;
  statusText?: string;
  durationMs: number;
  responseBody?: any;
  error?: string;
}

/**
 * Send a complete Question Set with its questions to an external API endpoint via HTTP POST
 */
export async function sendQuestionSetToWebhook(
  targetUrl: string,
  secretKey: string,
  headerType: 'Bearer' | 'X-API-Key' | 'Custom',
  questionSet: QuestionSet,
  questions: BankQuestion[]
): Promise<WebhookSendResult> {
  const startTime = Date.now();

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return {
      success: false,
      durationMs: 0,
      error: 'Invalid target URL. Please provide a valid HTTP/HTTPS endpoint URL.',
    };
  }

  // Construct payload with standard schema
  const payload = {
    event: 'mocktest.question_set.export',
    timestamp: new Date().toISOString(),
    setId: questionSet.id,
    name: questionSet.name,
    examSlug: questionSet.examSlug,
    subjectSlug: questionSet.subjectSlug,
    questionCount: questions.length,
    questions: questions.map((q, idx) => ({
      id: q.id,
      index: idx + 1,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctAnswerLetter: String.fromCharCode(65 + q.correctAnswer),
      explanation: q.explanation,
      difficulty: q.difficulty,
      subject: q.subjectSlug,
      topic: q.topicSlug,
      sourceType: q.sourceType,
    })),
  };

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (secretKey.trim()) {
    if (headerType === 'Bearer') {
      headers['Authorization'] = `Bearer ${secretKey.trim()}`;
    } else if (headerType === 'X-API-Key') {
      headers['X-API-Key'] = secretKey.trim();
    } else {
      headers['Authorization'] = secretKey.trim();
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const durationMs = Date.now() - startTime;
    let responseBody: any = null;

    try {
      const text = await response.text();
      responseBody = text ? JSON.parse(text) : { message: 'Empty response' };
    } catch {
      responseBody = { rawText: 'Non-JSON response received' };
    }

    if (response.ok) {
      return {
        success: true,
        statusCode: response.status,
        statusText: response.statusText,
        durationMs,
        responseBody,
      };
    } else {
      return {
        success: false,
        statusCode: response.status,
        statusText: response.statusText,
        durationMs,
        responseBody,
        error: `Server responded with HTTP ${response.status} ${response.statusText}`,
      };
    }
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      durationMs,
      error:
        err.message ||
        'Failed to connect to the target API endpoint. Please check if CORS allows requests from this domain or if the URL is accessible.',
    };
  }
}

/**
 * Get the Supabase REST API endpoint URL for querying question sets
 */
export function getSupabaseRestEndpoint(setId?: string): {
  url: string;
  baseUrl: string;
  hasSupabase: boolean;
  anonKey: string;
} {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url) {
    return {
      baseUrl: 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co/rest/v1',
      url: setId
        ? `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/rest/v1/question_sets?id=eq.${setId}&select=*`
        : 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co/rest/v1/question_sets?select=*',
      hasSupabase: false,
      anonKey: anonKey || 'YOUR_SUPABASE_ANON_KEY',
    };
  }

  const cleanBase = url.replace(/\/$/, '');
  const restBase = `${cleanBase}/rest/v1`;
  const endpoint = setId
    ? `${restBase}/question_sets?id=eq.${setId}&select=*`
    : `${restBase}/question_sets?select=*`;

  return {
    baseUrl: restBase,
    url: endpoint,
    hasSupabase: true,
    anonKey: anonKey || 'YOUR_SUPABASE_ANON_KEY',
  };
}

/**
 * Generate code snippet in JavaScript / TypeScript (fetch)
 */
export function generateFetchSnippet(endpointUrl: string, apiKey: string): string {
  return `// 1. Fetch Question Set via JavaScript / TypeScript
async function getQuestionsFromMockTest() {
  const response = await fetch('${endpointUrl}', {
    method: 'GET',
    headers: {
      'apikey': '${apiKey}',
      'Authorization': 'Bearer ${apiKey}',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(\`API Error: \${response.status} \${response.statusText}\`);
  }

  const questionSets = await response.json();
  const currentSet = questionSets[0];

  console.log('Question Set:', currentSet.title);
  console.log('Questions:', currentSet.questions);
  return currentSet.questions;
}

getQuestionsFromMockTest().then(questions => {
  console.log(\`Successfully loaded \${questions.length} questions!\`);
});`;
}

/**
 * Generate code snippet in Python (requests)
 */
export function generatePythonSnippet(endpointUrl: string, apiKey: string): string {
  return `# 1. Fetch Question Set via Python (requests)
import requests

url = "${endpointUrl}"
headers = {
    "apikey": "${apiKey}",
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    question_sets = response.json()
    if question_sets:
        target_set = question_sets[0]
        print(f"Loaded: {target_set['title']}")
        print(f"Total Questions: {len(target_set.get('questions', []))}")
        
        # Example: iterate over questions
        for idx, q in enumerate(target_set.get('questions', []), 1):
            print(f"{idx}. {q['questionText']}")
            for opt_idx, opt in enumerate(q['options']):
                print(f"   [{chr(65+opt_idx)}] {opt}")
            print(f"   Correct Answer: {chr(65+q['correctAnswer'])}")
            print(f"   Explanation: {q.get('explanation', 'N/A')}\\n")
else:
    print(f"Failed to fetch questions: HTTP {response.status_code} - {response.text}")`;
}

/**
 * Generate code snippet in cURL
 */
export function generateCurlSnippet(endpointUrl: string, apiKey: string): string {
  return `# Fetch Question Set via cURL (Terminal / Postman)
curl -X GET "${endpointUrl}" \\
  -H "apikey: ${apiKey}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`;
}

/**
 * Generate code snippet in PHP
 */
export function generatePhpSnippet(endpointUrl: string, apiKey: string): string {
  return `<?php
// Fetch Question Set via PHP
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => '${endpointUrl}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'apikey: ${apiKey}',
    'Authorization: Bearer ${apiKey}',
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  $data = json_decode($response, true);
  echo "Loaded " . count($data[0]['questions']) . " questions successfully!\\n";
  print_r($data[0]['questions']);
}
?>`;
}

/**
 * Generate sample backend receiver snippet in Node.js / Express
 */
export function generateExpressReceiverSnippet(secretKey: string): string {
  return `// In your other project: Express.js Webhook Receiver (api/receive-questions.js)
const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/api/receive-questions', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const expectedKey = 'Bearer ${secretKey}';

  // Verify Secret Key
  if (authHeader !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Secret Key' });
  }

  const { setId, name, examSlug, questionCount, questions } = req.body;
  console.log(\`Received question set: \${name} (\${questionCount} questions)\`);

  // TODO: Save questions to your own database or use in your other project
  // await db.questions.insertMany(questions);

  return res.status(200).json({
    status: 'success',
    message: \`Successfully received \${questionCount} questions for \${name}\`,
    receivedAt: new Date().toISOString()
  });
});

app.listen(3000, () => console.log('Listening for questions on port 3000'));`;
}
