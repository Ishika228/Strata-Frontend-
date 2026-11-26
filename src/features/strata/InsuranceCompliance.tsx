import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Calendar,
  Building2,
  DollarSign,
  Download,
  Plus,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  mockInsurancePolicies,
  mockComplianceItems,
  mockSchemes,
} from '../../lib/strataMockData';
import { InsurancePolicy, ComplianceItem } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';

export const InsuranceCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insurance' | 'compliance'>('insurance');
  const [policies, setPolicies] = useState<InsurancePolicy[]>(mockInsurancePolicies);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(mockComplianceItems);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Insurance Policies & Statutory Compliance (F-ST-14)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Building replacement valuations, public liability, Office Bearers indemnity, and statutory compliance registers (AFSS, Lift, Pool, Asbestos).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('New Insurance Policy / Compliance Item modal')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Register Item</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('insurance')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'insurance'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Strata Insurance Policies ({policies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'compliance'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Statutory Compliance Register ({complianceItems.length})</span>
        </button>
      </div>

      {/* Tab 1: Insurance Policies */}
      {activeTab === 'insurance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {policies.map((pol) => (
              <div key={pol.id} className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-teal-100 text-teal-800">
                    {pol.policyType}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {pol.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-[#102747]">{pol.insurer}</h3>
                  <span className="font-mono text-slate-400 text-[11px] block">{pol.policyNumber}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-500">Sum Insured:</span>
                    <strong className="font-mono text-slate-900 font-bold text-sm">
                      <MoneyText cents={pol.buildingSumInsuredCents} />
                    </strong>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-500">Annual Premium:</span>
                    <strong className="font-mono text-slate-700 font-semibold">
                      <MoneyText cents={pol.premiumCents} />
                    </strong>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px] text-slate-500 pt-1">
                    <span>Expiry Date:</span>
                    <strong className="text-slate-800">{pol.expiryDate}</strong>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading Certificate of Currency for ${pol.policyNumber}...`)}
                  className="w-full py-1.5 bg-[#F4F8FC] hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition flex items-center justify-start gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Certificate of Currency</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Statutory Compliance */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#F0F5FA] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Statutory Compliance Registers</h2>
              <p className="text-[11px] text-[#71849A]">
                Mandatory legal obligations under NSW Strata Schemes Management Act 2015 & SafeWork regulations.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                  <th className="py-2.5 px-4">Compliance Title</th>
                  <th className="py-2.5 px-3">Statutory Category</th>
                  <th className="py-2.5 px-3">Last Inspected</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-left">Status</th>
                  <th className="py-2.5 px-4 text-left">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {complianceItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFD] transition">
                    <td className="py-3 px-4 font-bold text-[#102747]">{item.title}</td>
                    <td className="py-3 px-3 font-semibold text-[#102747] font-bold">{item.category}</td>
                    <td className="py-3 px-3 text-[#102747] font-bold">{item.lastInspectionDate}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.dueDate}</td>
                    <td className="py-3 px-3 text-left">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          item.status === 'compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                      {item.certificateRef ? (
                        <button
                          onClick={() => alert(`Downloading certificate ${item.certificateRef}...`)}
                          className="px-2.5 py-1 bg-[#F4F8FC] hover:bg-slate-100 text-slate-700 rounded text-[11px] font-bold border border-slate-300 transition"
                        >
                          View Certificate
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Pending renewal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
