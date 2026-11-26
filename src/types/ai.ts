export interface AICitation {
  id: string;
  label: string;
  docTitle: string;
  page?: number;
  section?: string;
  snippet?: string;
  link?: string;
}

export interface AIActionProposal {
  id: string;
  type: 'create_task' | 'issue_work_order' | 'refer_arrears' | 'send_email';
  title: string;
  arguments: Record<string, any>;
  status: 'proposed' | 'confirmed' | 'discarded';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: AICitation[];
  proposal?: AIActionProposal;
  isStreaming?: boolean;
}

export interface AISettings {
  enabledFeatures: {
    assistant: boolean;
    draftReply: boolean;
    invoiceExtraction: boolean;
    autoTriage: boolean;
  };
  monthlyBudgetCents: number;
  monthSpendCents: number;
  retentionDays: number;
  queriesPerDayAvg: number;
  draftAcceptanceRatePct: number;
  citationCoveragePct: number;
}
