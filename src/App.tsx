import React, { useState } from 'react';
import { Header } from './components/Header';
import { DocumentForm } from './components/DocumentForm';
import { DocumentViewer } from './components/DocumentViewer';
import { GitHubGuideModal } from './components/GitHubGuideModal';
import { SignatureModal } from './components/SignatureModal';
import { DocumentRequest, DocumentAnalysis, SignatoryDetails, DocumentTemplatePreset, DocumentHistoryEntry } from './types';
import { DOCUMENT_PRESETS } from './presets';
import { AlertCircle, Scale, History, BookOpen } from 'lucide-react';
import { DocumentHistoryModal } from './components/DocumentHistoryModal';
import { ClauseLibraryModal } from './components/ClauseLibraryModal';

export default function App() {
  // Initial state pre-filled with the primary scenario from pages 18 & 19 of the specification
  const [formData, setFormData] = useState<DocumentRequest>({
    document_type: 'Freelance Work Contract',
    parties: 'Jane Doe (Service Provider), TechNova Inc. (Client)',
    terms: 'Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Either party may terminate with 14 days notice',
    dates: 'April 15, 2025',
    jurisdiction: 'State of California, United States',
  });

  const [documentText, setDocumentText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<DocumentAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Document History State (local array storing previous versions)
  const [history, setHistory] = useState<DocumentHistoryEntry[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isClauseLibraryOpen, setIsClauseLibraryOpen] = useState<boolean>(false);

  // Modals & UI states
  const [isGitHubGuideOpen, setIsGitHubGuideOpen] = useState<boolean>(false);
  const [isSignaturesOpen, setIsSignaturesOpen] = useState<boolean>(false);
  const [isPrintPreview, setIsPrintPreview] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Signatory & Branding customization
  const [signatories, setSignatories] = useState<SignatoryDetails>({
    firstPartyName: 'Jane Doe',
    firstPartyTitle: 'Independent Service Provider',
    secondPartyName: 'Alex Henderson',
    secondPartyTitle: 'Authorized Corporate Representative',
    customOrgName: 'LegalEase Legal Systems',
    includeWatermark: true,
  });

  // Helper to append a new history version
  const recordHistoryVersion = (
    text: string,
    req: DocumentRequest,
    source: 'generated' | 'refined' | 'edited'
  ) => {
    const newVersionNum = history.length + 1;
    const newEntry: DocumentHistoryEntry = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `${req.document_type} (v${newVersionNum})`,
      documentType: req.document_type,
      documentText: text,
      timestamp: Date.now(),
      parties: req.parties,
      dates: req.dates,
      terms: req.terms,
      jurisdiction: req.jurisdiction,
      version: newVersionNum,
      source,
    };

    setHistory(prev => [newEntry, ...prev]);
    setCurrentHistoryId(newEntry.id);
  };

  // Switch to a previous document version from history
  const handleSelectHistoryVersion = (entry: DocumentHistoryEntry) => {
    setDocumentText(entry.documentText);
    setCurrentHistoryId(entry.id);
    setFormData({
      document_type: entry.documentType,
      parties: entry.parties,
      terms: entry.terms,
      dates: entry.dates,
      jurisdiction: entry.jurisdiction,
    });
    setAnalysisData(null);
  };

  // Delete a specific history entry
  const handleDeleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(h => h.id !== id));
    if (currentHistoryId === id) {
      setCurrentHistoryId(null);
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    setCurrentHistoryId(null);
  };

  // Manually snapshot/save current editor state
  const handleSaveCurrentVersion = () => {
    if (!documentText) return;
    recordHistoryVersion(documentText, formData, 'edited');
  };

  // Insert standard boilerplate clause into the current document text
  const handleInsertClause = (clauseText: string, placement: 'append' | 'before_signatures' | 'prepend' = 'before_signatures') => {
    let updatedText = documentText;

    if (!updatedText.trim()) {
      updatedText = `## ${formData.document_type.toUpperCase()}\n\n${clauseText}`;
    } else if (placement === 'before_signatures') {
      // Look for signatures block marker
      const signatureMarkers = [
        '### EXECUTION AND SIGNATURES',
        '### Signatures',
        '### Execution',
        'IN WITNESS WHEREOF',
        'IN WITNESS WHEREOF,',
      ];
      let insertIndex = -1;
      for (const marker of signatureMarkers) {
        const idx = updatedText.indexOf(marker);
        if (idx !== -1) {
          insertIndex = idx;
          break;
        }
      }

      if (insertIndex !== -1) {
        updatedText =
          updatedText.slice(0, insertIndex).trimEnd() +
          '\n\n' +
          clauseText +
          '\n\n---\n\n' +
          updatedText.slice(insertIndex);
      } else {
        updatedText = updatedText.trimEnd() + '\n\n' + clauseText;
      }
    } else {
      // Append mode
      updatedText = updatedText.trimEnd() + '\n\n' + clauseText;
    }

    setDocumentText(updatedText);
    setAnalysisData(null);
    // Record into history
    recordHistoryVersion(updatedText, formData, 'edited');
  };

  // Handle Preset application
  const handleApplyPreset = (preset: DocumentTemplatePreset) => {
    setFormData({
      document_type: preset.docType,
      parties: preset.parties,
      terms: preset.terms,
      dates: preset.dates,
      jurisdiction: preset.jurisdiction,
    });
    setErrorMessage(null);
  };

  // Generate Document via backend endpoint
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const generated = data.document || '';
      setDocumentText(generated);
      setAnalysisData(null); // Reset analysis for newly generated document

      // Store in Document History
      if (generated) {
        recordHistoryVersion(generated, formData, 'generated');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Failed to generate document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Plain-English analysis & risk extraction via backend endpoint
  const handleAnalyzeDocument = async () => {
    if (!documentText) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: documentText,
          document_type: formData.document_type,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Refine document with AI instruction
  const handleRefineWithAI = async (instruction: string) => {
    if (!documentText || !instruction) return;
    setIsRefining(true);
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: documentText,
          instructions: instruction,
        }),
      });

      if (!response.ok) {
        throw new Error('Refine request failed');
      }

      const data = await response.json();
      if (data.document) {
        setDocumentText(data.document);
        setAnalysisData(null);
        // Record refined document in history
        recordHistoryVersion(data.document, formData, 'refined');
      }
    } catch (err: any) {
      console.error('Refining error:', err);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        onOpenGitHubGuide={() => setIsGitHubGuideOpen(true)}
        onOpenSignatories={() => setIsSignaturesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenClauseLibrary={() => setIsClauseLibraryOpen(true)}
        historyCount={history.length}
        onSelectPreset={presetId => {
          const found = DOCUMENT_PRESETS.find(p => p.id === presetId);
          if (found) handleApplyPreset(found);
        }}
        isPrintPreview={isPrintPreview}
        setIsPrintPreview={setIsPrintPreview}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form (45% on wide screens) */}
          <div className="lg:col-span-5">
            <DocumentForm
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onApplyPreset={handleApplyPreset}
            />
          </div>

          {/* Right Column: Live Document Preview, Editor, Analysis & Exports */}
          <div className="lg:col-span-7">
            <DocumentViewer
              documentText={documentText}
              setDocumentText={setDocumentText}
              requestData={formData}
              signatories={signatories}
              isPrintPreview={isPrintPreview}
              onRefineWithAI={handleRefineWithAI}
              isRefining={isRefining}
              onAnalyzeDocument={handleAnalyzeDocument}
              analysisData={analysisData}
              isAnalyzing={isAnalyzing}
              history={history}
              currentHistoryId={currentHistoryId}
              onSelectHistoryVersion={handleSelectHistoryVersion}
              onOpenHistoryModal={() => setIsHistoryOpen(true)}
              onSaveCurrentVersion={handleSaveCurrentVersion}
              onOpenClauseLibrary={() => setIsClauseLibraryOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>LegalEase AI Legal Document Generator • SmartInternz Project</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI + Gemini AI Core</span>
            <span>Export: .PDF, .DOCX, .TXT</span>
            <button
              onClick={() => setIsClauseLibraryOpen(true)}
              className="text-slate-300 hover:text-amber-400 flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              Clause Library
            </button>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="text-slate-300 hover:text-amber-400 flex items-center gap-1"
            >
              <History className="w-3 h-3" />
              History ({history.length})
            </button>
            <button
              onClick={() => setIsGitHubGuideOpen(true)}
              className="text-amber-400 hover:underline"
            >
              VS Code & GitHub Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GitHubGuideModal
        isOpen={isGitHubGuideOpen}
        onClose={() => setIsGitHubGuideOpen(false)}
      />

      <SignatureModal
        isOpen={isSignaturesOpen}
        onClose={() => setIsSignaturesOpen(false)}
        signatories={signatories}
        setSignatories={setSignatories}
      />

      <DocumentHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        currentHistoryId={currentHistoryId}
        onSelectVersion={handleSelectHistoryVersion}
        onDeleteVersion={handleDeleteHistoryEntry}
        onClearHistory={handleClearHistory}
      />

      <ClauseLibraryModal
        isOpen={isClauseLibraryOpen}
        onClose={() => setIsClauseLibraryOpen(false)}
        onInsertClause={handleInsertClause}
      />
    </div>
  );
}
