import React, { useState } from 'react';
import { KPITile } from '../../components/ui/KPITile';
import { MoneyInput } from '../../components/ui/MoneyInput';
import { MoneyText } from '../../components/ui/MoneyText';
import { mockAISettings } from '../../lib/mockData';
import { Sparkles, Shield, DollarSign, Bot, CheckCircle } from 'lucide-react';

export const AISettings: React.FC = () => {
  const [settings, setSettings] = useState(mockAISettings);

  const toggleFeature = (feat: keyof typeof settings.enabledFeatures) => {
    setSettings({
      ...settings,
      enabledFeatures: {
        ...settings.enabledFeatures,
        [feat]: !settings.enabledFeatures[feat],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          AI Copilot Governance & Usage
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Budget caps, citation thresholds, feature toggles, and hallucination guardrails
        </p>
      </div>

      {/* Row 1: KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPITile
          title="Monthly Spend (Nov 2026)"
          value={<MoneyText cents={settings.monthSpendCents} />}
          subtitle={`Budget: $${settings.monthlyBudgetCents / 100}`}
        />
        <KPITile
          title="Daily Queries Avg"
          value={`${settings.queriesPerDayAvg} queries/day`}
        />
        <KPITile
          title="Draft Acceptance %"
          value={`${settings.draftAcceptanceRatePct}%`}
          trend={{ percentage: 4.1, direction: 'up', label: 'vs last month' }}
        />
        <KPITile
          title="Citation Coverage %"
          value={`${settings.citationCoveragePct}%`}
          subtitle="Statutory references present"
        />
      </div>

      {/* Feature Toggles & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Enabled Copilot Capabilities
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">AI Strata & FM Assistant (⌘J)</div>
              <div className="text-[11px] text-slate-400">Contextual Q&A with by-law and ledger citations</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enabledFeatures.assistant}
              onChange={() => toggleFeature('assistant')}
              className="rounded text-sky-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">Automated Invoice OCR Extraction</div>
              <div className="text-[11px] text-slate-400">Automated extraction of ABN, GST, and amounts from PDF invoices</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enabledFeatures.invoiceExtraction}
              onChange={() => toggleFeature('invoiceExtraction')}
              className="rounded text-sky-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">Helpdesk Auto-Triage & Categorisation</div>
              <div className="text-[11px] text-slate-400">Classify incoming resident requests into trade and priority</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enabledFeatures.autoTriage}
              onChange={() => toggleFeature('autoTriage')}
              className="rounded text-sky-600 w-4 h-4"
            />
          </label>
        </div>

        <div className="pt-2">
          <button
            onClick={() => alert('AI governance settings updated')}
            className="px-4 py-2 bg-sky-600 text-white rounded font-semibold hover:bg-sky-700 transition"
          >
            Save Governance Policy
          </button>
        </div>
      </div>
    </div>
  );
};
