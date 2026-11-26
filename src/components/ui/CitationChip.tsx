import React, { useState } from 'react';
import { AICitation } from '../../types/ai';
import { FileText, X, ExternalLink, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CitationChipProps {
  citation: AICitation;
  className?: string;
}

export const CitationChip: React.FC<CitationChipProps> = ({ citation, className }) => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDrawer(true)}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors',
          className
        )}
        title={`Source: ${citation.docTitle}`}
      >
        <Bookmark className="w-3 h-3" />
        <span>{citation.label}</span>
        {citation.page && <span className="opacity-75">p.{citation.page}</span>}
      </button>

      {/* SourcePanel Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Document Source Evidence
                </h3>
              </div>
              <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Document Title</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {citation.docTitle}
                </p>
              </div>

              {(citation.page || citation.section) && (
                <div className="flex gap-4">
                  {citation.page && <div><span className="text-slate-400">Page:</span> {citation.page}</div>}
                  {citation.section && <div><span className="text-slate-400">Section:</span> {citation.section}</div>}
                </div>
              )}

              {citation.snippet && (
                <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30 border-l-2 border-purple-500 rounded text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                  "{citation.snippet}"
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[10px]">Indexed with OCR and vector citation reference</span>
              <button
                onClick={() => setShowDrawer(false)}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
