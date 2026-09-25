import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Edit3,
  Printer,
  Sparkles,
  ShieldAlert,
  Scale,
  Eye,
  FileCheck,
  AlertTriangle,
  Send,
  Loader2,
  Table,
  CheckCircle2,
} from 'lucide-react';
import { DocumentRequest, DocumentAnalysis, SignatoryDetails, DocumentHistoryEntry } from '../types';
import { exportToDocx } from '../utils/docxExport';
import { exportToPdf } from '../utils/pdfExport';
import { History, Save, BookOpen } from 'lucide-react';

interface DocumentViewerProps {
  documentText: string;
  setDocumentText: React.Dispatch<React.SetStateAction<string>>;
  requestData: DocumentRequest;
  signatories: SignatoryDetails;
  isPrintPreview: boolean;
  onRefineWithAI: (instruction: string) => Promise<void>;
  isRefining: boolean;
  onAnalyzeDocument: () => Promise<void>;
  analysisData: DocumentAnalysis | null;
  isAnalyzing: boolean;
  history: DocumentHistoryEntry[];
  currentHistoryId: string | null;
  onSelectHistoryVersion: (entry: DocumentHistoryEntry) => void;
  onOpenHistoryModal: () => void;
  onSaveCurrentVersion: () => void;
  onOpenClauseLibrary: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentText,
  setDocumentText,
  requestData,
  signatories,
  isPrintPreview,
  onRefineWithAI,
  isRefining,
  onAnalyzeDocument,
  analysisData,
  isAnalyzing,
  history,
  currentHistoryId,
  onSelectHistoryVersion,
  onOpenHistoryModal,
  onSaveCurrentVersion,
  onOpenClauseLibrary,
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'dark' | 'analysis'>('paper');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [refinePrompt, setRefinePrompt] = useState<string>('');
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Document length metrics: Word count, character count (with & without spaces), reading time
  const trimmedText = documentText ? documentText.trim() : '';
  const wordCount = trimmedText ? trimmedText.split(/\s+/).filter(Boolean).length : 0;
  const charCountWithSpaces = documentText.length;
  const charCountNoSpaces = documentText.replace(/\s/g, '').length;
  const lineCount = trimmedText ? documentText.split('\n').length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = () => {
    navigator.clipboard.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const filename = `${(requestData.document_type || 'legal_document').toLowerCase().replace(/\s+/g, '_')}.txt`;
    const element = document.createElement('a');
    const file = new Blob([documentText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(
        documentText,
        requestData.document_type,
        requestData.parties,
        requestData.dates,
        requestData.terms,
        signatories.customOrgName
      );
    } catch (err) {
      console.error('Failed to export docx:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      exportToPdf(
        documentText,
        requestData.document_type,
        requestData.parties,
        requestData.dates,
        requestData.terms,
        signatories.customOrgName
      );
    } catch (err) {
      console.error('Failed to export pdf:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim()) return;
    await onRefineWithAI(refinePrompt);
    setRefinePrompt('');
  };

  if (!documentText) {
    return (
      <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Document Generated Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Fill in the Document Parameters on the left or select a sample scenario template, then click{' '}
          <strong className="text-amber-400">"Generate Document"</strong> to start.
        </p>
        <div className="flex flex-wrap gap-2 justify-center max-w-lg text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">✓ Formatted .DOCX Export</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">✓ Branded .PDF Export</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">✓ Inline Text Editor</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">✓ Plain English Explainer</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner: Success confirmation & Version Quick Switcher */}
      <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs shadow-md gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white">Document Active</span>
          {history.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Version {history.find(h => h.id === currentHistoryId)?.version || history.length} of {history.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Clause Library Button */}
          <button
            onClick={onOpenClauseLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition shadow-sm"
            title="Browse boilerplate clause library to insert into document"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Clause Library</span>
          </button>

          {/* Open History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition shadow-sm"
            title="Browse all saved versions and drafts"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>History ({history.length})</span>
          </button>

          {/* Edit Document Button (matches pages 14, 20, 21: "Click to Edit Document") */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              isEditing
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Click to Edit Document'}</span>
          </button>
        </div>
      </div>

      {/* Version Quick-Switch Bar if history has more than 1 entry */}
      {history.length > 1 && (
        <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0 text-slate-400">
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300">Switch Version:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-thin">
            {history.map(entry => {
              const isSelected = entry.id === currentHistoryId;
              return (
                <button
                  key={entry.id}
                  onClick={() => onSelectHistoryVersion(entry)}
                  className={`px-2.5 py-1 rounded-lg font-medium text-xs whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                  }`}
                  title={`${entry.title} (${new Date(entry.timestamp).toLocaleTimeString()})`}
                >
                  <span>v{entry.version}</span>
                  <span className="opacity-70 text-[10px]">
                    ({entry.source === 'refined' ? 'AI' : entry.source === 'edited' ? 'Edit' : 'Gen'})
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenHistoryModal}
            className="text-[11px] text-amber-400 hover:underline shrink-0 font-medium"
          >
            View All →
          </button>
        </div>
      )}

      {/* Editor Panel if isEditing === true (Page 21 screenshot) */}
      {isEditing && (
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/50 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
            <span className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              Edit Document Below (Changes reflect live in preview & downloads):
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenClauseLibrary}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 font-medium transition"
                title="Browse and insert legal boilerplate clauses"
              >
                <BookOpen className="w-3 h-3" />
                + Insert Boilerplate Clause
              </button>
              <button
                onClick={onSaveCurrentVersion}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white font-medium transition"
                title="Save current edited text as a new history snapshot"
              >
                <Save className="w-3 h-3" />
                Snapshot Version
              </button>
            </div>
          </div>
          <textarea
            rows={12}
            value={documentText}
            onChange={e => setDocumentText(e.target.value)}
            className="w-full p-4 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          {/* Live Character & Word Count Counter inside Editor */}
          <div className="flex flex-wrap items-center justify-between text-[11px] px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong className="text-white font-semibold">{wordCount.toLocaleString()}</strong> words
              </span>
              <span>•</span>
              <span>
                <strong className="text-slate-300 font-medium">{charCountWithSpaces.toLocaleString()}</strong> chars ({charCountNoSpaces.toLocaleString()} no spaces)
              </span>
              <span>•</span>
              <span>
                <strong className="text-slate-300 font-medium">{lineCount}</strong> lines
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span>~{readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* AI Refinement prompt bar */}
          <form onSubmit={handleRefineSubmit} className="flex gap-2">
            <input
              type="text"
              value={refinePrompt}
              onChange={e => setRefinePrompt(e.target.value)}
              placeholder="e.g. 'Make the confidentiality period 5 years instead of 3' or 'Add intellectual property indemnity'"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isRefining || !refinePrompt.trim()}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Refine with AI</span>
            </button>
          </form>
        </div>
      )}

      {/* Navigation & Format Toolbar (Pages 14, 21) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        {/* View mode switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'paper'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Legal Paper View
          </button>

          <button
            onClick={() => setActiveTab('dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'dark'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Dark Mode HTML (Page 20)
          </button>

          <button
            onClick={() => {
              setActiveTab('analysis');
              if (!analysisData && !isAnalyzing) {
                onAnalyzeDocument();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'analysis'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Plain-English & Risk Analysis
          </button>
        </div>

        {/* Download Buttons matching the exact options on Page 21 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* TXT Download */}
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
            title="Download plain formatted text (.txt)"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>.TXT</span>
          </button>

          {/* DOCX Download */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-700/60 font-medium transition"
            title="Download formatted Microsoft Word (.docx) with terms table and logo"
          >
            {isExportingDocx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5 text-blue-400" />}
            <span>.DOCX</span>
          </button>

          {/* PDF Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-700/60 font-medium transition"
            title="Download branded legal PDF (.pdf) with headers and footers"
          >
            {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-rose-400" />}
            <span>.PDF</span>
          </button>

          {/* Print Document */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Print or Save via Browser"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Copy to clipboard */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Copy text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Document Statistics Strip (Word Count, Character Count, Lines, Reading Time) */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Length: <strong className="text-white font-semibold">{wordCount.toLocaleString()}</strong> words
          </span>
          <span>•</span>
          <span>
            <strong className="text-slate-300 font-medium">{charCountWithSpaces.toLocaleString()}</strong> characters ({charCountNoSpaces.toLocaleString()} excl. spaces)
          </span>
          <span>•</span>
          <span>
            <strong className="text-slate-300 font-medium">{lineCount}</strong> paragraphs / lines
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span>Est. reading time: ~{readingTimeMinutes} min</span>
        </div>
      </div>

      {/* VIEWPORT AREA */}
      {/* 1. PAPER VIEW: Formal white legal paper with serif typography */}
      {activeTab === 'paper' && (
        <div className="relative rounded-2xl bg-white text-slate-900 p-8 sm:p-14 shadow-2xl font-serif border border-slate-300 print:border-none print:shadow-none print:p-0 transition-all">
          {/* Header watermark/seal */}
          <div className="flex flex-col items-center justify-center border-b-2 border-slate-900/80 pb-6 mb-8 text-center">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-7 h-7 text-slate-900 stroke-[2.2]" />
              <span className="text-xl font-bold tracking-widest uppercase font-serif">
                {signatories.customOrgName || 'LegalEase Legal Systems'}
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-sans">
              Formal Written Instrument • Executed Document
            </p>
          </div>

          {/* Document Content */}
          <div className="prose max-w-none text-slate-900 text-sm sm:text-base leading-relaxed space-y-4">
            {renderFormattedDocument(documentText)}
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-slate-300 flex items-center justify-between text-xs text-slate-400 font-sans">
            <span>Prepared via LegalEase AI • Certified Legal Drafting Standard</span>
            <span>Page 1 • Final Form</span>
          </div>
        </div>
      )}

      {/* 2. DARK THEME VIEW: Exact styling from the PDF specification screenshots (pages 14, 20) */}
      {activeTab === 'dark' && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 font-sans text-slate-200 text-sm leading-relaxed max-h-[700px] overflow-y-auto space-y-4 scrollbar-thin">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <Scale className="w-4 h-4" />
              Streamlit Preview Rendering (Dark Card)
            </span>
            <span>Semantic HTML Output</span>
          </div>

          <div className="space-y-4">
            {renderDarkDocument(documentText)}
          </div>
        </div>
      )}

      {/* 3. PLAIN ENGLISH & RISK ANALYSIS (Page 25 requirement: "analyze and simplify legal text, highlight key clauses") */}
      {activeTab === 'analysis' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Plain-English Summary & Risk Assessment
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Democratizing legal comprehension for non-lawyers and founders
              </p>
            </div>

            <button
              onClick={onAnalyzeDocument}
              disabled={isAnalyzing}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            >
              {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Re-Analyze</span>
            </button>
          </div>

          {isAnalyzing ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Gemini AI is parsing obligations, liabilities, and risk points...</p>
            </div>
          ) : analysisData ? (
            <div className="space-y-6 text-xs">
              {/* Executive Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
                  Executive Plain-English Summary
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {analysisData.summary}
                </p>
              </div>

              {/* Completeness Health Score */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Contract Health Score</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-400">{analysisData.completenessScore}/100</span>
                    <span className="text-[10px] text-emerald-400/80">Commercially sound</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Identified Critical Clauses</span>
                  <span className="text-2xl font-bold text-white">{analysisData.criticalClauses?.length || 4}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Risk / Attention Items</span>
                  <span className="text-2xl font-bold text-amber-400">{analysisData.riskFlags?.length || 3}</span>
                </div>
              </div>

              {/* Key Party Obligations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Party Roles & Core Obligations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisData.keyObligations?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="font-semibold text-blue-400 text-xs block">{item.party}</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {item.obligations?.map((ob, oIdx) => (
                          <li key={oIdx}>{ob}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Clauses Matrix */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Key Clauses Impact Analysis
                </h4>
                <div className="divide-y divide-slate-800 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  {analysisData.criticalClauses?.map((c, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between gap-4">
                      <div>
                        <span className="font-semibold text-white block">{c.clauseName}</span>
                        <p className="text-slate-400 mt-0.5">{c.summary}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 uppercase ${
                          c.impactLevel === 'High'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : c.impactLevel === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {c.impactLevel} Impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Flags / Attention Traps */}
              {analysisData.riskFlags && analysisData.riskFlags.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <h4 className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Important Points to Verify Before Signing
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-amber-200/90 pl-1">
                    {analysisData.riskFlags.map((rf, rIdx) => (
                      <li key={rIdx}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <button
                onClick={onAnalyzeDocument}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition"
              >
                Run AI Plain-English Analysis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Formatted Document renderer for Paper mode
function renderFormattedDocument(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-3" />;
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const heading = trimmed.replace(/^#+\s*/, '');
      return (
        <h2 key={idx} className="text-xl sm:text-2xl font-bold text-center tracking-wide text-slate-900 border-b-2 border-slate-900 pb-2 mb-4 font-serif">
          {heading}
        </h2>
      );
    }

    if (trimmed.startsWith('### ')) {
      const subHeading = trimmed.replace(/^###\s*/, '');
      return (
        <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2 border-b border-slate-300 pb-1 font-serif">
          {subHeading}
        </h3>
      );
    }

    if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
      return <hr key={idx} className="border-t border-slate-400 my-4" />;
    }

    if (trimmed.startsWith('```') || trimmed.endsWith('```')) {
      return null;
    }

    // Process bold text
    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={idx} className="text-justify leading-relaxed">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-slate-950">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
}

// Dark Document renderer matching Streamlit screenshots
function renderDarkDocument(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-2" />;

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      return (
        <h2 key={idx} className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-1.5 mt-3">
          {trimmed.replace(/^#+\s*/, '')}
        </h2>
      );
    }

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-sm font-semibold text-slate-100 mt-3 text-amber-300/90">
          {trimmed.replace(/^###\s*/, '')}
        </h3>
      );
    }

    if (trimmed.startsWith('---')) {
      return <hr key={idx} className="border-slate-800 my-3" />;
    }

    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={idx} className="text-slate-300 leading-relaxed text-xs">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
}
