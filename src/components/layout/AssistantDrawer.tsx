import React, { useState } from 'react';
import { useAIAssistant } from '../../context/AIAssistantContext';
import { Sparkles, X, Send, Bot, User, Bookmark } from 'lucide-react';
import { CitationChip } from '../ui/CitationChip';
import { ActionProposalCard } from '../ui/ActionProposalCard';
import { cn } from '../../lib/utils';

export const AssistantDrawer: React.FC = () => {
  const { isOpen, setIsOpen, messages, sendMessage, confirmProposal, discardProposal } = useAIAssistant();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const t = inputText;
    setInputText('');
    setLoading(true);
    await sendMessage(t);
    setLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-purple-50/40 dark:bg-purple-950/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Vertex FM AI Copilot</h3>
            <span className="text-[10px] text-slate-400">Context: The Pacific Heights Complex (PR-MANLY)</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex flex-col space-y-2', msg.sender === 'user' ? 'items-end' : 'items-start')}
          >
            <div
              className={cn(
                'p-3 rounded-lg text-xs max-w-[90%] shadow-sm leading-relaxed',
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
              )}
            >
              {msg.content}
            </div>

            {/* Citations if any */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {msg.citations.map((c) => (
                  <CitationChip key={c.id} citation={c} />
                ))}
              </div>
            )}

            {/* Action Proposal Card if any */}
            {msg.proposal && (
              <div className="w-full pt-1">
                <ActionProposalCard
                  proposal={msg.proposal}
                  onConfirm={confirmProposal}
                  onDiscard={discardProposal}
                />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-600 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Checking maintenance schedules, assets & SLA timers...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about arrears, by-laws, work orders..."
            className="w-full text-xs pr-10 pl-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 top-1.5 p-1 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-2 text-[10px] text-center text-slate-400">
          AI Copilot answers with statutory citations. Always verify financial outputs.
        </div>
      </form>
    </div>
  );
};
