import React, { useState, useEffect } from 'react';
import { Search, Building2, Wrench, Shield, Users, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mockSearchResults = [
    { type: 'scheme', title: 'Horizon Towers Complex', subtitle: 'SP-52891 • 142 Pacific Highway, Chatswood NSW', link: '/app/strata/schemes', icon: Building2 },
    { type: 'scheme', title: 'Pacific Sands Oceanfront', subtitle: 'CTS-41920 • 88 Esplanade, Surfers Paradise QLD', link: '/app/strata/schemes', icon: Building2 },
    { type: 'lot', title: 'Unit 102 - Elena Rostova', subtitle: 'Lot 2 • $3,450.00 Overdue (Arrears Level 2)', link: '/app/strata/arrears', icon: Building2 },
    { type: 'invoice', title: 'Apex Fire & Safety Services - INV-4890', subtitle: 'Pending Committee Approval • $1,980.00 Inc GST', link: '/app/strata/procurement', icon: Wrench },
    { type: 'meeting', title: '2026 Annual General Meeting (AGM)', subtitle: 'Hybrid • 5 Motions Open for e-Voting', link: '/app/strata/meetings', icon: Shield },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (link: string) => {
    navigate(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search schemes, lots, owners, levies, invoices... (Esc to close)"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {mockSearchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            mockSearchResults.map((res, idx) => {
              const Icon = res.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(res.link)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{res.title}</div>
                      <div className="text-[11px] text-slate-400">{res.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              );
            })
          )}
        </div>

        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400">
          <span>Shortcuts: <strong>g p</strong> Properties • <strong>g w</strong> Work Orders • <strong>/</strong> Filter</span>
          <span>Press <strong>Enter</strong> to navigate</span>
        </div>
      </div>
    </div>
  );
};
