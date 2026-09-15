import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  FileText,
  Clock,
  Layers,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { EXAM_CONFIGS } from '../../data/mockExams';
import { ExamCategory, MockTest } from '../../types/exam';
import { generateAITest, generateTestFromDocument } from '../../services/ai/aiService';
import { extractTextFromPDF, readImageAsDataUrl } from '../../services/ocr/documentParser';

interface ExamGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestGenerated: (test: MockTest) => void;
  initialExam?: ExamCategory;
}

export const ExamGeneratorModal: React.FC<ExamGeneratorModalProps> = ({
  isOpen,
  onClose,
  onTestGenerated,
  initialExam = 'rrb_ntpc',
}) => {
  const [activeTab, setActiveTab] = useState<'auto' | 'document'>('auto');

  // Mode 1 Form State
  const [selectedExam, setSelectedExam] = useState<ExamCategory>(initialExam);
  const [selectedSubject, setSelectedSubject] = useState<string>('Full Pattern (All Sections)');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [customTopic, setCustomTopic] = useState<string>('');

  // Mode 2 Document Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [extractedPdfText, setExtractedPdfText] = useState<string>('');
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  // Status State
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentConfig = EXAM_CONFIGS.find((c) => c.id === selectedExam) || EXAM_CONFIGS[0];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setErrorMsg('');

    if (file.type.startsWith('image/')) {
      try {
        const previewUrl = await readImageAsDataUrl(file);
        setFilePreview(previewUrl);
        setExtractedPdfText('');
      } catch (err: any) {
        setErrorMsg('Failed to read image file.');
      }
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsProcessingDoc(true);
      setFilePreview(null);
      try {
        const text = await extractTextFromPDF(file);
        setExtractedPdfText(text);
      } catch (err: any) {
        setErrorMsg(err.message || 'Could not parse PDF text.');
      } finally {
        setIsProcessingDoc(false);
      }
    } else {
      setErrorMsg('Please upload a valid PDF or Image (JPG/PNG).');
    }
  };

  const handleGenerateMode1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsGenerating(true);
    setLoadingMessage('Consulting Indian Exam Pattern Specialist...');

    try {
      const test = await generateAITest({
        examCategory: selectedExam,
        examName: currentConfig.name,
        subject: selectedSubject === 'Full Pattern (All Sections)' ? undefined : selectedSubject,
        difficulty,
        questionCount,
        durationMinutes,
        customTopic: customTopic.trim() || undefined,
      });

      onTestGenerated(test);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Test generation failed. Please check your API key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMode2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      setErrorMsg('Please select a PDF or question paper image first.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);
    setLoadingMessage('Extracting study content and structuring interactive MCQs...');

    try {
      const test = await generateTestFromDocument(
        {
          documentText: extractedPdfText || undefined,
          targetExam: currentConfig.name,
          questionCount: 10,
        },
        uploadedFile.type.startsWith('image/') ? uploadedFile : undefined
      );

      onTestGenerated(test);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse document. Please check API Key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Exam Generation Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate syllabus-aligned mocks or convert documents to interactive tests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('auto')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === 'auto'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mode 1: Auto AI Exam Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('document')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === 'document'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileUp className="w-4 h-4" />
            Mode 2: PDF / Image OCR to Test
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>{errorMsg}</div>
            </div>
          )}

          {isGenerating ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {loadingMessage}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  Adhering strictly to Indian competitive exam syllabus, 4-option MCQs, and step-by-step LaTeX solutions.
                </p>
              </div>
            </div>
          ) : activeTab === 'auto' ? (
            /* Mode 1 Form */
            <form onSubmit={handleGenerateMode1} className="space-y-4">
              {/* Target Exam Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Target Examination
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EXAM_CONFIGS.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => {
                        setSelectedExam(exam.id);
                        setSelectedSubject('Full Pattern (All Sections)');
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        selectedExam === exam.id
                          ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-400 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {exam.shortName}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {exam.tierOrStage}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject / Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject / Section
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Full Pattern (All Sections)">Full Pattern (All Sections)</option>
                    {currentConfig.sections.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Difficulty Standard
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Standard Exam Tier)</option>
                    <option value="hard">Hard (Challenger / High Cut-off)</option>
                    <option value="mixed">Mixed (Real Exam Balance)</option>
                  </select>
                </div>
              </div>

              {/* Question Count & Time Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Number of Questions
                  </label>
                  <div className="flex items-center gap-2">
                    {[10, 20, 25, 50].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setQuestionCount(count);
                          setDurationMinutes(Math.round(count * 1.5));
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                          questionCount === count
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Time Limit (Minutes)
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Specific Focus Topic */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Specific Topic Focus (Optional)
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Mensuration 3D, Indian Railways History, Syllogisms, Bengal Geography"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Exam Marking Guidelines Note */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <div>
                  Marking Scheme: <span className="font-semibold text-slate-700 dark:text-slate-300">+{currentConfig.marksPerQuestion}</span> per correct answer,{' '}
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    -{(currentConfig.marksPerQuestion * currentConfig.negativeMarkRatio).toFixed(2)}
                  </span>{' '}
                  negative marking.
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Target Cut-off: ~{currentConfig.expectedCutoffs.general}
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Custom Mock Test
                </button>
              </div>
            </form>
          ) : (
            /* Mode 2 Form: Document Upload */
            <form onSubmit={handleGenerateMode2} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center transition bg-slate-50/50 dark:bg-slate-850/50 relative">
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Drag and drop your Question Paper or Notes
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Supports PDF documents or Images (JPG, PNG)
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    Multimodal Vision & PDF Parser
                  </span>
                </div>
              </div>

              {/* Uploaded File Feedback */}
              {uploadedFile && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    {uploadedFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-indigo-600 shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || 'Document'}
                      </p>
                    </div>
                  </div>
                  {isProcessingDoc && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting...
                    </div>
                  )}
                  {!isProcessingDoc && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
              )}

              {/* Image Preview if available */}
              {filePreview && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-2">
                  <img
                    src={filePreview}
                    alt="Uploaded preview"
                    className="max-h-44 object-contain rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* Extracted text snippet if PDF */}
              {extractedPdfText && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 max-h-28 overflow-y-auto font-mono">
                  <div className="font-bold mb-1 text-slate-800 dark:text-slate-200">
                    Extracted Text Preview:
                  </div>
                  {extractedPdfText.slice(0, 300)}...
                </div>
              )}

              {/* Target Exam Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Exam Pattern for Schema & Evaluation
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value as ExamCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {EXAM_CONFIGS.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadedFile || isProcessingDoc}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Convert Document to Interactive Test
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
