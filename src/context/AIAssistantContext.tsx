import React, { createContext, useContext, useState } from 'react';
import { AIMessage, AIActionProposal } from '../types/ai';

interface AIAssistantContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: AIMessage[];
  sendMessage: (text: string) => Promise<void>;
  confirmProposal: (proposalId: string) => void;
  discardProposal: (proposalId: string) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

const initialMessages: AIMessage[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    content:
      'Hello Sarah. I am your Strata AI Copilot. You can ask me questions about lot arrears, by-law interpretations, levy calculations, meeting quorums, or draft owner notices.',
    timestamp: new Date().toISOString(),
  },
];

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);

  const sendMessage = async (text: string) => {
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate AI streaming response with citation & proposal
    setTimeout(() => {
      let responseContent = `I looked up the records regarding "${text}". `;
      let proposal: AIActionProposal | undefined = undefined;

      if (text.toLowerCase().includes('arrear') || text.toLowerCase().includes('debt')) {
        responseContent +=
          'Elena Rostova (Unit 102) is currently in Arrears Level 2 with $3,450.00 outstanding (oldest due 01 Jul 2026). The Strata Schemes Management Act 2015 s85 statutory notice was dispatched 14 days ago.';
        proposal = {
          id: `prop-${Date.now()}`,
          type: 'refer_arrears',
          title: 'Issue Level 3 Formal Letter of Demand (Unit 102)',
          arguments: {
            schemeId: 'sp-10492',
            lotNumber: 2,
            ownerName: 'Elena Rostova',
            overdueBalance: '$3,450.00',
            feeAdded: '$110.00',
          },
          status: 'proposed',
        };
      } else if (text.toLowerCase().includes('bylaw') || text.toLowerCase().includes('by-law') || text.toLowerCase().includes('pet') || text.toLowerCase().includes('ev')) {
        responseContent +=
          'Under By-Law 14 of Horizon Towers (SP 52891), lot owners may install Level 2 EV charging equipment subject to committee approval and certified electrical inspection.';
        proposal = {
          id: `prop-${Date.now()}`,
          type: 'issue_work_order',
          title: 'Draft EV Charging Approval Letter for Lot 6',
          arguments: {
            schemeId: 'SP-52891',
            lotNumber: 6,
            ownerName: 'Timothy Zhang',
            byLawClause: 'By-Law 14 (Sustainability & Infrastructure)',
          },
          status: 'proposed',
        };
      } else {
        responseContent +=
          'Horizon Towers (SP 52891) has healthy trust cash reserves ($148,500.00 Admin Fund, $412,000.00 Capital Works). All 48 lot entitlements are up to date and GST registered.';
      }

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        citations: [
          {
            id: 'cit-1',
            label: 'SSMA 2015 s85',
            docTitle: 'NSW Strata Schemes Management Act 2015',
            section: 'Part 5 - Levies & Recovery',
            snippet: 'An owners corporation may recover overdue contributions and interest as a debt.',
          },
          {
            id: 'cit-2',
            label: 'Minutes AGM 2026',
            docTitle: 'The Pacific Heights - Annual General Meeting Minutes',
            page: 4,
            snippet: 'Motion 7 resolved that interest of 10% per annum applies to overdue contributions.',
          },
        ],
        proposal,
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  const confirmProposal = (proposalId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.proposal && m.proposal.id === proposalId) {
          return {
            ...m,
            proposal: { ...m.proposal, status: 'confirmed' },
          };
        }
        return m;
      })
    );
  };

  const discardProposal = (proposalId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.proposal && m.proposal.id === proposalId) {
          return {
            ...m,
            proposal: { ...m.proposal, status: 'discarded' },
          };
        }
        return m;
      })
    );
  };

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        sendMessage,
        confirmProposal,
        discardProposal,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) throw new Error('useAIAssistant must be used within AIAssistantProvider');
  return context;
};
