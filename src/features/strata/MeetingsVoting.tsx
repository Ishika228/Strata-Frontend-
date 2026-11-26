import React, { useState } from 'react';
import {
  Calendar,
  Vote,
  FileText,
  Users,
  Video,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Share2,
  Clock,
  Shield,
  X,
} from 'lucide-react';
import {
  mockStrataMeetings,
  mockStrataMotions,
  mockStrataProxies,
  mockSchemes,
} from '../../lib/strataMockData';
import { StrataMeeting, StrataMotion, StrataProxy } from '../../types/strata';

export const MeetingsVoting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'motions' | 'proxies' | 'minutes'>('meetings');
  const [meetings, setMeetings] = useState<StrataMeeting[]>(mockStrataMeetings);
  const [motions, setMotions] = useState<StrataMotion[]>(mockStrataMotions);
  const [proxies, setProxies] = useState<StrataProxy[]>(mockStrataProxies);
  const [selectedMeeting, setSelectedMeeting] = useState<StrataMeeting>(mockStrataMeetings[0]);

  // Handle voting simulation
  const handleCastVote = (motionId: string, choice: 'for' | 'against' | 'abstain') => {
    setMotions(
      motions.map((m) => {
        if (m.id === motionId) {
          return {
            ...m,
            votesFor: choice === 'for' ? m.votesFor + 1 : m.votesFor,
            votesAgainst: choice === 'against' ? m.votesAgainst + 1 : m.votesAgainst,
            votesAbstain: choice === 'abstain' ? m.votesAbstain + 1 : m.votesAbstain,
          };
        }
        return m;
      })
    );
    alert(`Your ballot choice "${choice.toUpperCase()}" was recorded securely.`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Meetings, Motions & Digital Voting (F-ST-10)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Statutory AGM/EGM scheduling (21 days notice verification), electronic voting with entitlement weighting, proxy forms, and minutes publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('New Meeting Scheduling Wizard (AGM/EGM/Committee)')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'meetings'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Scheduled Meetings ({meetings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('motions')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'motions'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Vote className="w-3.5 h-3.5" />
          <span>Motions & Digital Ballots ({motions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('proxies')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'proxies'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Proxy Appointments</span>
        </button>

        <button
          onClick={() => setActiveTab('minutes')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'minutes'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Statutory Minutes & Portal Documents</span>
        </button>
      </div>

      {/* Tab 1: Meetings Register */}
      {activeTab === 'meetings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((mtg) => (
            <div key={mtg.id} className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                  {mtg.type.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">{mtg.schemeCode}</span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-[#102747]">{mtg.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{mtg.location}</p>
              </div>

              {/* Statutory Rules Compliance Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Notice Dispatched</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>21 Days Met</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Quorum Representation</span>
                  <span className="font-semibold text-slate-800">
                    {mtg.lotsRepresented} / {mtg.totalLots} Lots ({Math.round((mtg.lotsRepresented / mtg.totalLots) * 100)}%)
                  </span>
                </div>
              </div>

              {mtg.videoLink && (
                <div className="flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 p-2 rounded-lg border border-sky-100 font-medium">
                  <Video className="w-3.5 h-3.5" />
                  <a href={mtg.videoLink} target="_blank" rel="noreferrer" className="text-[#102747] font-bold no-underline hover:text-[#00B5A4] transition truncate">
                    {mtg.videoLink}
                  </a>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{mtg.motionsCount} Voting Motions</span>
                <button
                  onClick={() => {
                    setSelectedMeeting(mtg);
                    setActiveTab('motions');
                  }}
                  className="px-3 py-1 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded text-xs font-bold transition"
                >
                  View Motions & e-Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Motions & Digital Voting */}
      {activeTab === 'motions' && (
        <div className="space-y-4">
          <div className="bg-[#08294A] text-white p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-300">Active Meeting Ballot</span>
              <h2 className="font-black text-sm">{selectedMeeting.title}</h2>
              <p className="text-xs text-white/70">{selectedMeeting.location} • Quorum Rule: {selectedMeeting.quorumPercentage}%</p>
            </div>
            <button
              onClick={() => alert('Download voting pack PDF...')}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Ballot Pack</span>
            </button>
          </div>

          <div className="space-y-3">
            {motions.map((motion) => (
              <div key={motion.id} className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {motion.motionNumber}
                    </span>
                    <h3 className="font-black text-sm text-[#102747]">{motion.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800">
                      {motion.resolutionType} Resolution
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      Weighting: {motion.weighting === 'entitlement' ? 'Unit Entitlement' : '1 Vote / Lot'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {motion.text}
                </div>

                {/* Live Tally Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                    <span className="text-emerald-700 text-[10px] font-bold block">FOR</span>
                    <strong className="text-emerald-900 font-mono text-base font-black">
                      {motion.votesFor}
                    </strong>
                    {motion.entitlementFor && (
                      <span className="text-[10px] text-emerald-600 block">
                        ({motion.entitlementFor} UOE)
                      </span>
                    )}
                  </div>

                  <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg">
                    <span className="text-rose-700 text-[10px] font-bold block">AGAINST</span>
                    <strong className="text-rose-900 font-mono text-base font-black">
                      {motion.votesAgainst}
                    </strong>
                    {motion.entitlementAgainst && (
                      <span className="text-[10px] text-rose-600 block">
                        ({motion.entitlementAgainst} UOE)
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] font-bold block">ABSTAIN</span>
                    <strong className="text-slate-700 font-mono text-base font-black">
                      {motion.votesAbstain}
                    </strong>
                  </div>
                </div>

                {/* Digital Vote Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-start gap-2">
                  <span className="text-xs font-medium text-slate-500 mr-2">Cast Lot 1 Vote:</span>
                  <button
                    onClick={() => handleCastVote(motion.id, 'for')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition cursor-pointer"
                  >
                    Vote FOR
                  </button>
                  <button
                    onClick={() => handleCastVote(motion.id, 'against')}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition cursor-pointer"
                  >
                    Vote AGAINST
                  </button>
                  <button
                    onClick={() => handleCastVote(motion.id, 'abstain')}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold transition cursor-pointer"
                  >
                    Abstain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Proxies */}
      {activeTab === 'proxies' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
          <div className="border-b border-[#F0F5FA] pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Registered Proxy Appointments</h2>
              <p className="text-[11px] text-[#71849A]">
                Statutory proxy form verification per Section 24 of the Strata Schemes Management Regulation.
              </p>
            </div>
            <button
              onClick={() => alert('Register New Proxy Form modal')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Proxy</span>
            </button>
          </div>

          <div className="space-y-2">
            {proxies.map((p) => (
              <div key={p.id} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#102747]">
                    Lot #{p.lotNumber} ({p.grantorName}) &rarr; {p.proxyHolderName}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Authorized Date: {p.authorizedDate} • Form Verified by Secretary
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Valid Proxy</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Minutes & Portal Documents */}
      {activeTab === 'minutes' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
          <div className="border-b border-[#F0F5FA] pb-2">
            <h2 className="text-sm font-black text-[#102747]">Statutory Minutes & Documentation</h2>
            <p className="text-[11px] text-[#71849A]">
              Automated minutes compilation from template, merging attendance, quorum validation, and motion vote outcomes.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5EEF5] flex items-center justify-between text-xs">
            <div>
              <div className="font-extrabold text-sm text-[#102747]">
                2025 Annual General Meeting Confirmed Minutes
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Published to Owner Portal on 22 Nov 2025 • Visibility: All Lot Owners
              </div>
            </div>

            <button
              onClick={() => alert('Downloading minutes PDF...')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Minutes PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
