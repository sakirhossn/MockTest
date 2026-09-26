import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Globe,
  Code,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Play,
  Terminal,
  Database,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
} from 'lucide-react';
import { QuestionSet } from '../../types/exam';
import {
  getApiSecretKey,
  regenerateApiSecretKey,
  saveApiSecretKey,
  getSupabaseRestEndpoint,
  generateFetchSnippet,
  generatePythonSnippet,
  generateCurlSnippet,
  generatePhpSnippet,
  generateExpressReceiverSnippet,
} from '../../services/api/apiExportService';

interface ApiIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionSets: QuestionSet[];
}

export const ApiIntegrationModal: React.FC<ApiIntegrationModalProps> = ({
  isOpen,
  onClose,
  questionSets,
}) => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'snippets' | 'sql' | 'webhook'>('credentials');
  const [secretKey, setSecretKey] = useState(getApiSecretKey());
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'js' | 'python' | 'curl' | 'php'>('js');
  const [selectedSetId, setSelectedSetId] = useState<string>('ALL');

  // Live Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status: number;
    durationMs: number;
    data?: any;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSecretKey(getApiSecretKey());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const endpointInfo = getSupabaseRestEndpoint(selectedSetId);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    if (window.confirm('Generate a new API secret key? External applications using your old key will need to be updated.')) {
      const newKey = regenerateApiSecretKey();
      setSecretKey(newKey);
    }
  };

  const handleSaveCustomKey = (newKey: string) => {
    setSecretKey(newKey);
    saveApiSecretKey(newKey);
  };

  // Run live test request to verify API
  const handleRunLiveTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const start = Date.now();

    try {
      const targetUrl = endpointInfo.url;
      const headers: Record<string, string> = {
        apikey: endpointInfo.anonKey,
        Authorization: `Bearer ${endpointInfo.anonKey}`,
      };

      const res = await fetch(targetUrl, {
        method: 'GET',
        headers,
      });

      const durationMs = Date.now() - start;
      const json = await res.json();

      if (res.ok) {
        setTestResult({
          success: true,
          status: res.status,
          durationMs,
          data: json,
        });
      } else {
        setTestResult({
          success: false,
          status: res.status,
          durationMs,
          error: json.message || `HTTP ${res.status} ${res.statusText}`,
          data: json,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        status: 0,
        durationMs: Date.now() - start,
        error:
          err.message ||
          'Failed to reach cloud endpoint. If you have not connected Supabase yet, configure it in Settings (⚙️).',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Get active snippet code
  const getActiveSnippet = () => {
    const url = endpointInfo.url;
    const key = endpointInfo.anonKey;

    switch (selectedLanguage) {
      case 'js':
        return generateFetchSnippet(url, key);
      case 'python':
        return generatePythonSnippet(url, key);
      case 'curl':
        return generateCurlSnippet(url, key);
      case 'php':
        return generatePhpSnippet(url, key);
      default:
        return '';
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getActiveSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const sqlSetupScript = `-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- 1. Ensure question_sets table allows SELECT queries for API clients using the public Anon Key
CREATE POLICY "Allow external API read access to question sets"
  ON public.question_sets
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. Ensure CORS is enabled for all domains or your custom project domain
-- (Supabase enables CORS for GET requests by default on PostgREST endpoints)`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSetupScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>API Integration &amp; Cross-Project Hub</span>
                <span className="text-[10px] uppercase font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                  REST API &amp; Webhooks
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guidelines, API keys, and code snippets to fetch or receive questions in your other projects
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/30 dark:bg-slate-850/30 overflow-x-auto">
          {[
            { id: 'credentials', label: '1. API Keys & Endpoints', icon: Key },
            { id: 'snippets', label: '2. Code Snippets (JS/Python/cURL)', icon: Code },
            { id: 'sql', label: '3. Cloud RLS Permissions', icon: Database },
            { id: 'webhook', label: '4. Webhook Push Guide', icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CREDENTIALS & ENDPOINT */}
          {activeTab === 'credentials' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">How Cross-Project API Fetching Works</p>
                  <p className="leading-relaxed opacity-90">
                    When you save question sets on this website, they are synced into your Supabase Cloud database. Supabase automatically hosts an instant, high-speed REST API that any of your other websites, mobile apps, or Python scripts can query anytime!
                  </p>
                </div>
              </div>

              {/* Endpoint Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Cloud REST API Endpoint URL</span>
                  </label>
                  {questionSets.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>Query Set:</span>
                      <select
                        value={selectedSetId}
                        onChange={(e) => setSelectedSetId(e.target.value)}
                        className="text-[11px] font-semibold py-0.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 max-w-[160px] truncate"
                      >
                        <option value="ALL">All Question Sets</option>
                        {questionSets.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.questionCount} Qs)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={endpointInfo.url}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(endpointInfo.url);
                      alert('Endpoint URL copied to clipboard!');
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Secret API Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    <span>Your Secret API Key / Token</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateKey}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate Key</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={secretKey}
                      onChange={(e) => handleSaveCustomKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    onClick={handleCopyKey}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                  >
                    {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Send this key in HTTP headers: <code className="font-mono text-indigo-500">apikey</code> and <code className="font-mono text-indigo-500">Authorization: Bearer &lt;key&gt;</code>.
                </p>
              </div>

              {/* Live Test Runner */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Live In-Browser API Test Runner</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Execute a real GET request right now to verify that your cloud endpoint returns JSON questions.
                    </p>
                  </div>
                  <button
                    onClick={handleRunLiveTest}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition active:scale-95"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isTesting ? 'Fetching...' : 'Test API Call'}</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-2 animate-in fade-in duration-150 ${
                      testResult.success
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5">
                        {testResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>
                          {testResult.success
                            ? `Status ${testResult.status} OK (Questions Returned)`
                            : `Connection Error (HTTP ${testResult.status})`}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] opacity-80">{testResult.durationMs}ms</span>
                    </div>

                    {testResult.error && (
                      <p className="text-[11px] leading-relaxed font-sans">{testResult.error}</p>
                    )}

                    {testResult.data && (
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-[10px] uppercase font-bold opacity-75 block mb-1">
                          Response Payload (First {Array.isArray(testResult.data) ? testResult.data.length : 1} Record):
                        </span>
                        <pre className="p-2 rounded-lg bg-black/10 dark:bg-black/30 font-mono text-[10px] max-h-36 overflow-y-auto">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CODE SNIPPETS */}
          {activeTab === 'snippets' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {[
                    { id: 'js', label: 'JavaScript / Node' },
                    { id: 'python', label: 'Python (requests)' },
                    { id: 'curl', label: 'cURL / CLI' },
                    { id: 'php', label: 'PHP' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedLanguage === lang.id
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopySnippet}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy-paste ready for your other project</span>
                  </span>
                  <span>UTF-8</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
                  {getActiveSnippet()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD RLS PERMISSIONS */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <p className="font-bold text-sm">Supabase Row-Level Security (RLS) Notice</p>
                <p className="leading-relaxed opacity-90">
                  By default in Supabase, each user can only read their own questions when logged in. If you want your external project or backend script to read question sets using the API Key, run this quick SQL command in your Supabase SQL Editor:
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    SQL Script to Enable External API Access:
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-950 text-indigo-300 border border-slate-800 font-mono text-xs overflow-x-auto">
                  {sqlSetupScript}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Where do I run this?</p>
                <p>
                  Go to <a href="https://supabase.com/dashboard/project/_/sql" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1">Supabase Dashboard → SQL Editor <ExternalLink className="w-3 h-3" /></a>, paste the SQL above, and click <strong>Run</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: WEBHOOK PUSH GUIDE */}
          {activeTab === 'webhook' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-1.5">
                <p className="font-bold text-sm">How the &quot;Send via API&quot; Button Works</p>
                <p className="leading-relaxed opacity-90">
                  Instead of writing code in your other project to pull questions, you can push any question set from this browser directly to your other project in 1 click!
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">How to use:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li>Go to <strong>Question Sets</strong> tab in the Question Bank.</li>
                  <li>Find any question set and click the <strong>&quot;Send API&quot;</strong> button.</li>
                  <li>Enter your other project&apos;s webhook/API URL (e.g. <code className="font-mono text-indigo-500">https://your-api.com/api/receive-questions</code>).</li>
                  <li>Enter your Secret Key for security.</li>
                  <li>Click <strong>&quot;Push to Other Project API&quot;</strong>. MockMaster transmits all questions, options, answers, and solutions via HTTP POST instantly!</li>
                </ol>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Receiver Code in your other project (Express.js example):
                </span>
                <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 border border-slate-800 font-mono text-[11px] overflow-x-auto max-h-56">
                  {generateExpressReceiverSnippet(secretKey)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Cross-project question data format is standard JSON with full mathematical KaTeX support.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
