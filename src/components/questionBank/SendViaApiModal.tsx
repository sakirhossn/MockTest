import React, { useState } from 'react';
import {
  X,
  Send,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { QuestionSet, BankQuestion } from '../../types/exam';
import {
  getLastWebhookConfig,
  saveLastWebhookConfig,
  sendQuestionSetToWebhook,
  WebhookSendResult,
  getApiSecretKey,
  generateExpressReceiverSnippet,
} from '../../services/api/apiExportService';

interface SendViaApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionSet: QuestionSet | null;
  questions: BankQuestion[];
}

export const SendViaApiModal: React.FC<SendViaApiModalProps> = ({
  isOpen,
  onClose,
  questionSet,
  questions,
}) => {
  const lastConfig = getLastWebhookConfig();
  const defaultSecret = lastConfig.key || getApiSecretKey();

  const [targetUrl, setTargetUrl] = useState(lastConfig.url || '');
  const [secretKey, setSecretKey] = useState(defaultSecret);
  const [headerType, setHeaderType] = useState<'Bearer' | 'X-API-Key' | 'Custom'>(
    lastConfig.headerType || 'Bearer'
  );
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<WebhookSendResult | null>(null);
  const [showPayloadPreview, setShowPayloadPreview] = useState(false);
  const [showReceiverGuide, setShowReceiverGuide] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen || !questionSet) return null;

  const filteredQuestions = questions.filter(
    (q) => q.questionSetId === questionSet.id
  );
  const effectiveQuestions =
    filteredQuestions.length > 0 ? filteredQuestions : questions.slice(0, questionSet.questionCount);

  const samplePayload = {
    event: 'mocktest.question_set.export',
    timestamp: new Date().toISOString(),
    setId: questionSet.id,
    name: questionSet.name,
    examSlug: questionSet.examSlug,
    subjectSlug: questionSet.subjectSlug,
    questionCount: effectiveQuestions.length,
    sampleQuestion: effectiveQuestions[0]
      ? {
          questionText: effectiveQuestions[0].questionText,
          options: effectiveQuestions[0].options,
          correctAnswer: effectiveQuestions[0].correctAnswer,
          explanation: effectiveQuestions[0].explanation,
        }
      : null,
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsSending(true);
    setSendResult(null);

    // Persist configuration for convenience
    saveLastWebhookConfig(targetUrl, secretKey, headerType);

    try {
      const res = await sendQuestionSetToWebhook(
        targetUrl,
        secretKey,
        headerType,
        questionSet,
        effectiveQuestions
      );
      setSendResult(res);
    } catch (err: any) {
      setSendResult({
        success: false,
        durationMs: 0,
        error: err.message || 'Unknown network error',
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyReceiverSnippet = () => {
    navigator.clipboard.writeText(generateExpressReceiverSnippet(secretKey));
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Send Question Set via API</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Webhook Push
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                Push &quot;{questionSet.name}&quot; ({effectiveQuestions.length} questions) to your other project
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

        {/* Body */}
        <form onSubmit={handleSend} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Target Set Info Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Question Set</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{questionSet.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-indigo-500 block">Questions Attached</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                {effectiveQuestions.length} Questions
              </span>
            </div>
          </div>

          {/* Target API URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Your Other Project API Endpoint URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://your-api-domain.com/api/receive-questions"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              The HTTP POST endpoint in your other project (e.g. Node.js, Next.js, Django, FastAPI, Flask, PHP).
            </p>
          </div>

          {/* Authentication Secret Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>API Secret Key / Authorization Token</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Header:</span>
                <select
                  value={headerType}
                  onChange={(e) => setHeaderType(e.target.value as any)}
                  className="text-[11px] font-semibold py-0.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <option value="Bearer">Authorization: Bearer &lt;key&gt;</option>
                  <option value="X-API-Key">X-API-Key: &lt;key&gt;</option>
                  <option value="Custom">Custom Key String</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="e.g. mk_sec_xyz..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
              <button
                type="button"
                onClick={() => setSecretKey(getApiSecretKey())}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                title="Use Default Site Secret Key"
              >
                Use My Key
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Your other project should verify this secret key so unauthorized third parties cannot post fake questions.
            </p>
          </div>

          {/* Collapsible: Payload Preview */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPayloadPreview(!showPayloadPreview)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                <span>Inspect JSON Payload Schema ({effectiveQuestions.length} Questions)</span>
              </span>
              {showPayloadPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showPayloadPreview && (
              <div className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(samplePayload, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Collapsible: Receiver Code Helper */}
          <div className="border border-indigo-100 dark:border-indigo-900/60 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowReceiverGuide(!showReceiverGuide)}
              className="w-full px-4 py-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Need receiver code for your other project? (Click to view Express/Node snippet)</span>
              </span>
              {showReceiverGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showReceiverGuide && (
              <div className="p-4 border-t border-indigo-100 dark:border-indigo-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-200">
                    Sample Express.js Route Handler:
                  </span>
                  <button
                    type="button"
                    onClick={copyReceiverSnippet}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-48">
                  {generateExpressReceiverSnippet(secretKey)}
                </pre>
              </div>
            )}
          </div>

          {/* Send Result Banner */}
          {sendResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                sendResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  {sendResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    {sendResult.success
                      ? `Successfully Sent! HTTP ${sendResult.statusCode || 200}`
                      : 'Delivery Failed'}
                  </span>
                </div>
                <span className="font-mono text-[11px] opacity-80">{sendResult.durationMs}ms</span>
              </div>

              {sendResult.error && (
                <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed font-sans">
                  {sendResult.error}
                </p>
              )}

              {sendResult.responseBody && (
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold opacity-75 block mb-1">
                    Response from Remote Server:
                  </span>
                  <pre className="p-2 rounded-lg bg-black/10 dark:bg-black/30 font-mono text-[10px] overflow-x-auto">
                    {JSON.stringify(sendResult.responseBody, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isSending || !targetUrl.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Questions...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Push to Other Project API</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
