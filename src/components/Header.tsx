import React from 'react';
import {
  Scale,
  GitBranch,
  FileCheck2,
  Sparkles,
  Printer,
  Moon,
  Sun,
  ShieldAlert,
  Settings,
  History,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  onOpenGitHubGuide: () => void;
  onOpenSignatories: () => void;
  onOpenHistory: () => void;
  onOpenClauseLibrary: () => void;
  historyCount: number;
  onSelectPreset: (presetId: string) => void;
  isPrintPreview: boolean;
  setIsPrintPreview: (val: boolean) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGitHubGuide,
  onOpenSignatories,
  onOpenHistory,
  onOpenClauseLibrary,
  historyCount,
  onSelectPreset,
  isPrintPreview,
  setIsPrintPreview,
  isDark,
  setIsDark,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand matching the SmartInternz specification */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Scale className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white flex items-center">
                  Legal<span className="text-amber-400">Ease</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI v1.5 Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                AI Legal Document Generator & Drafting Suite
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Clause Library Button */}
            <button
              onClick={onOpenClauseLibrary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition shadow-sm"
              title="Open Legal Boilerplate Clause Library"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Clause Library</span>
              <span className="sm:hidden">Clauses</span>
            </button>

            {/* Document History Button */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition relative"
              title="Open Document Version History"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            {/* VS Code & GitHub Guide Button (requested by user) */}
            <button
              onClick={onOpenGitHubGuide}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-900/30 transition transform active:scale-95"
              title="Open VS Code setup, terminal commands, directory tree, and GitHub publishing guide"
            >
              <GitBranch className="w-4 h-4" />
              <span className="hidden sm:inline">VS Code & GitHub</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {/* Signatory & Branding */}
            <button
              onClick={onOpenSignatories}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
              title="Configure signature blocks, company logo & watermark"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Signatories & Branding</span>
            </button>

            {/* Print/Parchment Mode */}
            <button
              onClick={() => setIsPrintPreview(!isPrintPreview)}
              className={`p-2 rounded-lg text-xs font-medium transition border ${
                isPrintPreview
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border-slate-800'
              }`}
              title="Toggle Legal Paper White / Print Preview"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
