import React, { useState, useEffect } from 'react';
import { X, Key, Database, Sparkles, Check, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import {
  getStoredAISettings,
  saveStoredAISettings,
} from '../../services/ai/aiService';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
} from '../../services/supabase/supabaseClient';
import { clearTestHistory } from '../../services/storage/historyStore';
import { AISettings, AIProvider } from '../../types/ai';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDataReset }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'supabase' | 'storage'>('ai');
  const [aiSettings, setAiSettings] = useState<AISettings>(getStoredAISettings());
  const [supabaseCreds, setSupabaseCreds] = useState(getSupabaseCredentials());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAiSettings(getStoredAISettings());
      setSupabaseCreds(getSupabaseCredentials());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredAISettings(aiSettings);
    saveSupabaseCredentials(supabaseCreds.url, supabaseCreds.anonKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleResetHistory = () => {
    if (window.confirm('Are you sure you want to clear your local test history and speed analytics?')) {
      clearTestHistory();
      if (onDataReset) onDataReset();
      alert('Local test history has been reset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Application Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure AI providers, cloud database, and local data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-850/50">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold transition ${
              activeTab === 'ai'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Providers (BYOK)
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold transition ${
              activeTab === 'supabase'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Database className="w-4 h-4" />
            Supabase Auth & DB
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold transition ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Data Management
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAll} className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold">Bring Your Own Key (BYOK):</span> Keys are stored strictly in your browser’s localStorage. They are never sent to any intermediary server.
                </div>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Default Active AI Provider
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'gemini', name: 'Google Gemini', tag: 'Recommended (Free)' },
                    { id: 'openai', name: 'OpenAI', tag: 'GPT-4o' },
                    { id: 'claude', name: 'Claude', tag: 'Sonnet 3.5' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAiSettings({ ...aiSettings, provider: p.id as AIProvider })}
                      className={`p-3 rounded-xl border text-left transition ${
                        aiSettings.provider === p.id
                          ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-400 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {p.tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemini Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Get Free Gemini Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={aiSettings.geminiApiKey}
                  onChange={(e) => setAiSettings({ ...aiSettings, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Gemini Model:</span>
                  <select
                    value={aiSettings.modelName || 'gemini-3.6-flash'}
                    onChange={(e) => setAiSettings({ ...aiSettings, modelName: e.target.value })}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended)</option>
                    <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Ultra Fast / Resilient)</option>
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Advanced Reasoning)</option>
                    <option value="gemini-3.5-flash">gemini-3.5-flash (Standard)</option>
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Legacy)</option>
                  </select>
                </div>
              </div>

              {/* OpenAI Section */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  OpenAI API Key (Optional)
                </label>
                <input
                  type="password"
                  value={aiSettings.openaiApiKey}
                  onChange={(e) => setAiSettings({ ...aiSettings, openaiApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Claude Section */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Anthropic Claude API Key (Optional)
                </label>
                <input
                  type="password"
                  value={aiSettings.claudeApiKey}
                  onChange={(e) => setAiSettings({ ...aiSettings, claudeApiKey: e.target.value })}
                  placeholder="sk-ant-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-white mb-1">
                  Cloud History & Auth Setup
                </p>
                Optionally connect your free Supabase project to enable cross-device test syncing and full user profiles. If omitted, all tests and analytics are stored locally in your browser!
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={supabaseCreds.url}
                  onChange={(e) => setSupabaseCreds({ ...supabaseCreds, url: e.target.value })}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  value={supabaseCreds.anonKey}
                  onChange={(e) => setSupabaseCreds({ ...supabaseCreds, anonKey: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>Cross-Device Cloud Sync Schema</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">test_results table</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  To sync test attempts across PC and mobile, ensure the <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono">test_results</code> table exists in your Supabase project. See the full script in <code className="font-mono text-slate-700 dark:text-slate-300">supabase/schema.sql</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20">
                <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 mb-1">
                  Reset Mock Test History
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-400 mb-3">
                  This will clear all saved test attempts, accuracy metrics, and speed records stored on this device.
                </p>
                <button
                  type="button"
                  onClick={handleResetHistory}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition"
                >
                  Clear All Past Results
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
