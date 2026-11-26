import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Users,
  Pin,
  Mail,
  Smartphone,
  CheckCircle,
  Eye,
  Plus,
  Filter,
  ThumbsUp,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  mockCommsCampaigns,
  mockWallPosts,
  mockSchemes,
} from '../../lib/strataMockData';
import { CommsCampaign, WallPost } from '../../types/strata';

export const CommunicationsWall: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'community_wall' | 'committee_wall'>('campaigns');
  const [campaigns, setCampaigns] = useState<CommsCampaign[]>(mockCommsCampaigns);
  const [posts, setPosts] = useState<WallPost[]>(mockWallPosts);

  // New Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms' | 'in_app'>('email');
  const [audienceFilter, setAudienceFilter] = useState('All Lot Owners');
  const [messageBody, setMessageBody] = useState(
    'Dear {{owner.first_name}},\n\nPlease be advised that the quarterly strata levy for {{lot.label}} is due on 01 Jan 2027. Your current balance is {{balance.total}}.\n\nKind regards,\n{{scheme.name}} Strata Management'
  );

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: CommsCampaign = {
      id: `cmp-${Date.now()}`,
      title: campaignTitle,
      schemeId: 'scheme-01',
      targetAudience: audienceFilter,
      channel,
      recipientCount: 48,
      scheduledAt: new Date().toISOString(),
      status: 'sent',
      deliveredCount: 48,
      openRatePct: 92.0,
    };
    setCampaigns([newCamp, ...campaigns]);
    setCampaignTitle('');
    alert(`Campaign "${newCamp.title}" dispatched successfully to 48 recipients across ${channel.toUpperCase()}!`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Communications, Broadcast Campaigns & Wall (F-ST-11, F-ST-13)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Dynamic audience broadcast campaigns (Email, SMS, In-App), merge tag templates, and Community/Committee interactive notice boards.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'campaigns'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Campaigns</span>
        </button>

        <button
          onClick={() => setActiveTab('community_wall')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'community_wall'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Wall (All Residents)</span>
        </button>

        <button
          onClick={() => setActiveTab('committee_wall')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'committee_wall'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Committee Private Wall</span>
        </button>
      </div>

      {/* Tab 1: Broadcast Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Compose Broadcast Campaign (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
            <h2 className="text-sm font-black text-[#102747]">Compose Broadcast Campaign</h2>
            <p className="text-[11px] text-[#71849A]">
              Dynamic audience targeting with statutory merge field resolution.
            </p>

            <form onSubmit={handleSendCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campaign Subject / Title</label>
                <input
                  type="text"
                  required
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Q3 Levy Notice Dispatched"
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Audience</label>
                  <select
                    value={audienceFilter}
                    onChange={(e) => setAudienceFilter(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                  >
                    <option value="All Lot Owners">All Lot Owners</option>
                    <option value="Owner-Occupiers">Owner-Occupiers Only</option>
                    <option value="Investors">Investors Only</option>
                    <option value="Lots in Arrears">Lots in Arrears (L1-L3)</option>
                    <option value="Committee Members">Executive Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                  >
                    <option value="email">Email Notification</option>
                    <option value="sms">SMS Text Alert</option>
                    <option value="in_app">In-App Notice Banner</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">Message Content</label>
                  <span className="text-[10px] text-teal-700 font-mono font-bold">Merge Tags Active</span>
                </div>
                <textarea
                  rows={5}
                  required
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-2 font-sans border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#00B5A4] shrink-0" />
                <span>Available merge fields: <code>{'{{owner.first_name}}'}</code>, <code>{'{{lot.label}}'}</code>, <code>{'{{scheme.name}}'}</code>, <code>{'{{balance.total}}'}</code></span>
              </div>

              <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => alert('Test message dispatched to Sarah Jenkins (s.jenkins@vertexstrata.com.au)')}
                  className="px-3 py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-bold"
                >
                  Send Test to Self
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-md font-bold shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Campaign</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Campaign History & Analytics (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
            <h2 className="text-sm font-black text-[#102747]">Campaign Delivery Log & Engagement</h2>

            <div className="space-y-3">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E5EEF5] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#102747]">{camp.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      {camp.status}
                    </span>
                  </div>

                  <div className="text-slate-500 text-[11px]">
                    Target: <strong>{camp.targetAudience}</strong> • Channel: <strong className="uppercase">{camp.channel}</strong>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-400">Recipients: </span>
                      <strong className="text-slate-800">{camp.recipientCount}</strong>
                    </div>

                    {camp.openRatePct && (
                      <div className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{camp.openRatePct}% Open Rate</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 & 3: Community & Committee Wall */}
      {(activeTab === 'community_wall' || activeTab === 'committee_wall') && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">
                {activeTab === 'community_wall' ? 'Community Notice Board' : 'Committee Private Executive Wall'}
              </h2>
              <p className="text-[11px] text-[#71849A]">
                {activeTab === 'community_wall'
                  ? 'Official notices & announcements visible to all registered lot owners & occupiers.'
                  : 'Restricted discussion forum exclusively for appointed Strata Committee members.'}
              </p>
            </div>
            <button
              onClick={() => alert('New Post Modal')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {posts
              .filter(
                (p) =>
                  (activeTab === 'community_wall' && p.wallType === 'community') ||
                  (activeTab === 'committee_wall' && p.wallType === 'committee')
              )
              .map((post) => (
                <div key={post.id} className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {post.authorName[0]}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#102747]">{post.authorName}</div>
                        <span className="text-[10px] text-slate-400">
                          {post.authorRole} • {new Date(post.createdAt).toLocaleDateString('en-AU')}
                        </span>
                      </div>
                    </div>

                    {post.isPinned && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                        <Pin className="w-3 h-3 text-amber-600" />
                        <span>Pinned Notice</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm text-[#102747]">{post.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{post.content}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-slate-500 hover:text-teal-600 font-bold">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likesCount} Likes</span>
                      </button>
                      <button className="flex items-center gap-1 text-slate-500 hover:text-teal-600 font-bold">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.commentsCount} Comments</span>
                      </button>
                    </div>

                    <button
                      onClick={() => alert('Post reported for manager review.')}
                      className="text-[11px] text-slate-400 hover:text-rose-600"
                    >
                      Report Post
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
