import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Check,
  Shield,
  FileCheck,
  Scale,
  X,
  Filter,
  Copy,
  ChevronDown,
  ArrowRight,
  Info,
} from 'lucide-react';
import { BoilerplateClause, CLAUSE_LIBRARY_DATA } from '../clauseLibraryData';

interface ClauseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertClause: (clauseText: string, insertionMode: 'append' | 'before_signatures' | 'prepend') => void;
}

export const ClauseLibraryModal: React.FC<ClauseLibraryModalProps> = ({
  isOpen,
  onClose,
  onInsertClause,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(CLAUSE_LIBRARY_DATA[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);
  const [insertMode, setInsertMode] = useState<'append' | 'before_signatures'>('before_signatures');

  const categories = useMemo(() => {
    const set = new Set<string>();
    CLAUSE_LIBRARY_DATA.forEach(c => set.add(c.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredClauses = useMemo(() => {
    return CLAUSE_LIBRARY_DATA.filter(clause => {
      const matchesCategory = selectedCategory === 'All' || clause.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        clause.name.toLowerCase().includes(q) ||
        clause.summary.toLowerCase().includes(q) ||
        clause.tags.some(t => t.toLowerCase().includes(q)) ||
        clause.fullClauseText.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleCopy = (clause: BoilerplateClause, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(clause.fullClauseText);
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (clause: BoilerplateClause, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onInsertClause(clause.fullClauseText, insertMode);
    setInsertedId(clause.id);
    setTimeout(() => setInsertedId(null), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                Standard Legal Clause Library
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                  {CLAUSE_LIBRARY_DATA.length} Verified Boilerplates
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Browse and insert battle-tested legal boilerplate clauses directly into your current document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search, Category filters & Insertion placement selector */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search clauses (e.g. NDA, Indemnification, Liability Cap, Force Majeure, IP)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Insertion Placement Mode */}
            <div className="flex items-center gap-2 text-xs text-slate-300 shrink-0">
              <span className="text-slate-400 font-medium">Insert Placement:</span>
              <select
                value={insertMode}
                onChange={e => setInsertMode(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="before_signatures">Before Signatures (Recommended)</option>
                <option value="append">Append to End of Document</option>
              </select>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-semibold border-amber-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clause List & Inspector */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {filteredClauses.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Scale className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">No clauses matching "{searchQuery}"</p>
              <p className="text-xs text-slate-500 mt-1">Try another search term or select "All" categories.</p>
            </div>
          ) : (
            filteredClauses.map(clause => {
              const isExpanded = expandedClauseId === clause.id;
              const isJustInserted = insertedId === clause.id;

              return (
                <div
                  key={clause.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-slate-950 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header / Summary row */}
                  <div
                    onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 mt-0.5 shrink-0">
                        <Scale className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-white truncate">{clause.name}</h3>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                            {clause.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{clause.summary}</p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {clause.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={e => handleCopy(clause, e)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition"
                        title="Copy clause text"
                      >
                        {copiedId === clause.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={e => handleInsert(clause, e)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                          isJustInserted
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20'
                        }`}
                        title="Insert clause directly into document"
                      >
                        {isJustInserted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Inserted!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Insert Clause</span>
                          </>
                        )}
                      </button>

                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Full Legal Text Preview */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-900/60">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="font-semibold text-slate-300">Full Standard Contract Provision:</span>
                        <span>Formatted Markdown</span>
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto scrollbar-thin">
                        {clause.fullClauseText}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            Will be positioned: <strong className="text-slate-300">{insertMode === 'before_signatures' ? 'Right before the Signature block' : 'At the very end of the agreement'}</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => handleInsert(clause)}
                          className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Active Document</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>
            Tip: You can insert multiple clauses in sequence; each will be numbered and formatted consistently.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
