import React from 'react';
import {
  History,
  Clock,
  ChevronRight,
  Trash2,
  FileText,
  RotateCcw,
  Sparkles,
  Edit3,
  Calendar,
} from 'lucide-react';
import { DocumentHistoryEntry } from '../types';

interface DocumentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: DocumentHistoryEntry[];
  currentHistoryId: string | null;
  onSelectVersion: (entry: DocumentHistoryEntry) => void;
  onDeleteVersion: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
}

export const DocumentHistoryModal: React.FC<DocumentHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  currentHistoryId,
  onSelectVersion,
  onDeleteVersion,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                Document Version History
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                  {history.length} {history.length === 1 ? 'version' : 'versions'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Switch between previously generated or refined drafts anytime
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">No history saved yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Generated, refined, or saved versions will automatically appear here.
              </p>
            </div>
          ) : (
            history.map((entry, idx) => {
              const isCurrent = entry.id === currentHistoryId;
              const dateStr = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    onSelectVersion(entry);
                    onClose();
                  }}
                  className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        entry.source === 'refined'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : entry.source === 'edited'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {entry.source === 'refined' ? (
                        <Sparkles className="w-4 h-4" />
                      ) : entry.source === 'edited' ? (
                        <Edit3 className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white truncate">
                          {entry.title || entry.documentType}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.2 rounded font-medium bg-slate-800 text-slate-300">
                          v{entry.version}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-amber-500 text-slate-950">
                            Active Draft
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">Parties: {entry.parties}</span>
                        {entry.jurisdiction && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">{entry.jurisdiction}</span>
                          </>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {entry.documentText.slice(0, 100).replace(/[#*`_]/g, '')}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e => onDeleteVersion(entry.id, e)}
                      title="Delete this version"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Load</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
            <span>
              Tip: Click any past version to immediately restore it in the editor and export views.
            </span>
            <button
              onClick={onClearHistory}
              className="text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
