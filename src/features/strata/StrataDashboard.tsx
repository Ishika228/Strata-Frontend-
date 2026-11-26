import React, { useState } from 'react';
import {
  Building2,
  Users,
  Layers,
  DollarSign,
  BarChart2,
  ArrowRight,
  Zap,
  Send,
  CalendarCheck,
  FileText,
  MapPin,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// Performance chart data mapped by time range (6M, 1Y, 2Y)
const performanceDataMap: Record<'6M' | '1Y' | '2Y', Array<{ month: string; collected: number; target: number }>> = {
  '6M': [
    { month: 'Jun', collected: 50, target: 38 },
    { month: 'Jul', collected: 62, target: 45 },
    { month: 'Aug', collected: 70, target: 55 },
    { month: 'Sep', collected: 75, target: 60 },
    { month: 'Oct', collected: 86, target: 68 },
    { month: 'Nov', collected: 90, target: 72 },
  ],
  '1Y': [
    { month: 'Dec', collected: 45, target: 36 },
    { month: 'Jan', collected: 48, target: 38 },
    { month: 'Feb', collected: 52, target: 40 },
    { month: 'Mar', collected: 57, target: 44 },
    { month: 'Apr', collected: 61, target: 47 },
    { month: 'May', collected: 65, target: 50 },
    { month: 'Jun', collected: 70, target: 55 },
    { month: 'Jul', collected: 74, target: 58 },
    { month: 'Aug', collected: 79, target: 62 },
    { month: 'Sep', collected: 83, target: 65 },
    { month: 'Oct', collected: 87, target: 69 },
    { month: 'Nov', collected: 92, target: 74 },
  ],
  '2Y': [
    { month: "Q1 '25", collected: 46, target: 38 },
    { month: "Q2 '25", collected: 56, target: 46 },
    { month: "Q3 '25", collected: 65, target: 54 },
    { month: "Q4 '25", collected: 73, target: 60 },
    { month: "Q1 '26", collected: 79, target: 65 },
    { month: "Q2 '26", collected: 84, target: 69 },
    { month: "Q3 '26", collected: 89, target: 72 },
    { month: "Q4 '26", collected: 94, target: 76 },
  ],
};

// Donut data for 85% Portfolio Health
const donutData = [
  { name: 'Healthy', value: 85, color: '#008F87' },
  { name: 'Attention', value: 10, color: '#27C6B8' },
  { name: 'Critical', value: 5, color: '#B2EBF2' },
];

export const StrataDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'6M' | '1Y' | '2Y'>('6M');

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto select-none">
      {/* 1. Hero Banner */}
      <div className="relative w-full h-[170px] min-h-[170px] rounded-2xl overflow-hidden border border-[#D5E5F2] shadow-[0_2px_8px_rgba(8,41,74,0.04)] flex items-center justify-between bg-white">
        {/* Right Background Image */}
        <img
          src="/assets/user-hero-banner.jpg"
          alt="Building Architecture"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none"
        />

        {/* Smooth white-to-transparent gradient overlay on left for crisp typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none w-[65%]" />

        {/* Content on Left */}
        <div className="relative z-10 pl-6 sm:pl-8 py-4 flex flex-col justify-start max-w-[70%] sm:max-w-[60%]">
          <div className="flex items-stretch gap-3">
            {/* Vertical Teal Line */}
            <div className="w-[3.5px] bg-[#00B5A4] rounded-full shrink-0 shadow-[0_0_6px_rgba(0,181,164,0.3)]" />

            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.14em] text-[#008F87] uppercase font-sans">
                WELCOME BACK, ISHIKA!
              </span>

              <h1 className="text-xl sm:text-[23px] font-black text-[#102747] tracking-tight leading-[1.25] mt-1 font-sans">
                Smarter Building Management.
                <br />
                <span className="text-[#102747]">A More Connected Community.</span>
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#5A7184] font-medium mt-2 pl-[16px] font-sans">
            Manage. Maintain. Grow — with Vertex.
          </p>
        </div>
      </div>

      {/* 2. Row of 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 12 Total Buildings */}
        <div className="bg-white rounded-2xl border border-[#E5EEF5] p-4 shadow-[0_2px_6px_rgba(8,41,74,0.02)] hover:border-[#00B5A4]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#E6F8F6] text-[#00B5A4] border border-[#C8F0EC]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#102747] tracking-tight leading-none font-sans">
                  12
                </div>
                <div className="text-xs font-semibold text-[#102747] mt-1 font-sans">
                  Total Buildings
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-[#10B981] flex items-center gap-0.5 shrink-0 bg-[#E8FAF2] border border-[#B6F0D8] px-2 py-0.5 rounded-md">
              <span>↑ 5%</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#F0F5FA] flex items-center justify-between gap-1.5">
            <span className="text-[10.5px] font-medium text-[#102747] leading-tight">
              98% occupancy across sites
            </span>
            <svg className="w-12 h-3.5 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGrad-bld" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                  <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z"
                fill="url(#sparkGrad-bld)"
              />
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5"
                fill="none"
                stroke="#00B5A4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: 1,250 Total Owners */}
        <div className="bg-white rounded-2xl border border-[#E5EEF5] p-4 shadow-[0_2px_6px_rgba(8,41,74,0.02)] hover:border-[#00B5A4]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#E6F8F6] text-[#00B5A4] border border-[#C8F0EC]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#102747] tracking-tight leading-none font-sans">
                  1,250
                </div>
                <div className="text-xs font-semibold text-[#102747] mt-1 font-sans">
                  Total Owners
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-[#10B981] flex items-center gap-0.5 shrink-0 bg-[#E8FAF2] border border-[#B6F0D8] px-2 py-0.5 rounded-md">
              <span>↑ 8%</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#F0F5FA] flex items-center justify-between gap-1.5">
            <span className="text-[10.5px] font-medium text-[#102747] leading-tight">
              94.2% verified accounts
            </span>
            <svg className="w-12 h-3.5 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGrad-own" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                  <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z"
                fill="url(#sparkGrad-own)"
              />
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5"
                fill="none"
                stroke="#00B5A4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: 480 Total Lots */}
        <div className="bg-white rounded-2xl border border-[#E5EEF5] p-4 shadow-[0_2px_6px_rgba(8,41,74,0.02)] hover:border-[#00B5A4]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#E6F8F6] text-[#00B5A4] border border-[#C8F0EC]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#102747] tracking-tight leading-none font-sans">
                  480
                </div>
                <div className="text-xs font-semibold text-[#102747] mt-1 font-sans">
                  Total Lots
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-[#10B981] flex items-center gap-0.5 shrink-0 bg-[#E8FAF2] border border-[#B6F0D8] px-2 py-0.5 rounded-md">
              <span>↑ 6%</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#F0F5FA] flex items-center justify-between gap-1.5">
            <span className="text-[10.5px] font-medium text-[#102747] leading-tight">
              100% statutory roll registered
            </span>
            <svg className="w-12 h-3.5 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGrad-lot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                  <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z"
                fill="url(#sparkGrad-lot)"
              />
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5"
                fill="none"
                stroke="#00B5A4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: $245K Outstanding Levies */}
        <div className="bg-white rounded-2xl border border-[#E5EEF5] p-4 shadow-[0_2px_6px_rgba(8,41,74,0.02)] hover:border-[#00B5A4]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#E6F8F6] text-[#00B5A4] border border-[#C8F0EC]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#102747] tracking-tight leading-none font-sans">
                  $245K
                </div>
                <div className="text-xs font-semibold text-[#102747] mt-1 font-sans">
                  Outstanding Levies
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-[#10B981] flex items-center gap-0.5 shrink-0 bg-[#E8FAF2] border border-[#B6F0D8] px-2 py-0.5 rounded-md">
              <span>↑ 3%</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#F0F5FA] flex items-center justify-between gap-1.5">
            <span className="text-[10.5px] font-medium text-[#102747] leading-tight">
              91% on-time collection rate
            </span>
            <svg className="w-12 h-3.5 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGrad-lev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                  <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z"
                fill="url(#sparkGrad-lev)"
              />
              <path
                d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5"
                fill="none"
                stroke="#00B5A4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: 2 Cards (Portfolio Overview & Strata Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Portfolio Overview (Left 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5EEF5] p-5 shadow-[0_2px_6px_rgba(8,41,74,0.02)] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#00B5A4]" />
              <h2 className="text-sm font-bold text-[#102747] font-sans">
                Portfolio Overview
              </h2>
            </div>
            <button
              onClick={() => navigate('/app/property/schemes')}
              className="text-xs font-bold text-[#00B5A4] hover:text-[#008F87] flex items-center gap-1 transition cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Donut Chart with Centered Health % and Legend on Right */}
          <div className="py-4 flex items-center justify-start gap-5">
            {/* Donut Circle */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Text inside the Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-black text-[#102747] font-sans leading-none">
                  85%
                </span>
                <span className="text-[10px] font-semibold text-[#71849A] mt-1">
                  Portfolio Health
                </span>
              </div>
            </div>

            {/* Legend on Right */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008F87] shrink-0" />
                  <span className="font-semibold text-[#334B68]">Healthy</span>
                </div>
                <span className="font-bold text-[#102747] font-mono">10</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C6B8] shrink-0" />
                  <span className="font-semibold text-[#334B68]">Attention</span>
                </div>
                <span className="font-bold text-[#102747] font-mono">1</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B2EBF2] shrink-0" />
                  <span className="font-semibold text-[#334B68]">Critical</span>
                </div>
                <span className="font-bold text-[#102747] font-mono">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Strata Performance (Right 8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5EEF5] p-5 shadow-[0_2px_6px_rgba(8,41,74,0.02)] flex flex-col justify-between">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0F5FA]">
            <div>
              <h2 className="text-sm font-bold text-[#008F87] pb-1 border-b-2 border-[#00B5A4] font-sans">
                Strata Performance
              </h2>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008F87] shrink-0" />
                <span className="text-[#334B68] font-semibold text-[11px]">Levies Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C6B8] shrink-0" />
                <span className="text-[#334B68] font-semibold text-[11px]">Collection Target</span>
              </div>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center gap-1 bg-[#F4F8FC] p-0.5 rounded-lg border border-[#E5EEF5]">
              {(['6M', '1Y', '2Y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${timeRange === range
                    ? 'bg-white text-[#102747] shadow-2xs border border-[#CBD5E1]'
                    : 'text-[#71849A] hover:text-[#102747]'
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart Canvas */}
          <div className="h-48 w-full pt-3 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                key={timeRange}
                data={performanceDataMap[timeRange]}
                margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008F87" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#008F87" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27C6B8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#27C6B8" stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#F0F5FA" />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71849A', fontSize: 11, fontWeight: 600 }}
                  dy={6}
                />

                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71849A', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(v) => `${v}%`}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #D5E5F2',
                    boxShadow: '0 4px 12px rgba(8, 41, 74, 0.08)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#102747',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value}%`,
                    name === 'collected' ? 'Levies Collected' : 'Collection Target',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#008F87"
                  strokeWidth={2.5}
                  fill="url(#collectedGrad)"
                  dot={{ stroke: '#008F87', strokeWidth: 2, fill: '#FFFFFF', r: 3.5 }}
                  activeDot={{ r: 5, fill: '#008F87', stroke: '#FFFFFF', strokeWidth: 2 }}
                />

                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#27C6B8"
                  strokeWidth={2.5}
                  fill="url(#targetGrad)"
                  dot={{ stroke: '#27C6B8', strokeWidth: 2, fill: '#FFFFFF', r: 3.5 }}
                  activeDot={{ r: 5, fill: '#27C6B8', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Your Buildings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Your Buildings (Left) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5EEF5] p-5 shadow-[0_2px_6px_rgba(8,41,74,0.02)] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00B5A4]" />
              <h2 className="text-sm font-bold text-[#102747] font-sans">
                Your Buildings
              </h2>
            </div>
            <button
              onClick={() => navigate('/app/property/schemes')}
              className="text-xs font-bold text-[#00B5A4] hover:text-[#008F87] flex items-center gap-1 transition cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Building Card */}
          <div
            onClick={() => navigate('/app/property/schemes')}
            className="pt-4 flex items-center gap-4 cursor-pointer group"
          >
            <img
              src="/assets/building-thumb.png"
              alt="Riverside Residences"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-[#E5EEF5] group-hover:scale-102 transition-transform shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-[#102747] font-sans group-hover:text-[#00B5A4] transition truncate">
                  Riverside Residences
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8FAF2] text-[#00A878] border border-[#B6F0D8]">
                  Healthy
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#71849A] mt-1 font-medium truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">125 Riverside Drive, Sydney NSW</span>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-[#F0F5FA] text-xs">
                <div>
                  <span className="text-sm sm:text-base font-black text-[#102747] font-mono leading-none block">
                    24
                  </span>
                  <span className="text-[10px] text-[#71849A] font-medium block mt-0.5">
                    Lots
                  </span>
                </div>

                <div>
                  <span className="text-sm sm:text-base font-black text-[#102747] font-mono leading-none block">
                    98%
                  </span>
                  <span className="text-[10px] text-[#71849A] font-medium block mt-0.5">
                    Occupancy
                  </span>
                </div>

                <div className="h-6 w-px bg-[#E5EEF5]" />

                <div>
                  <span className="text-sm sm:text-base font-black text-[#102747] font-mono leading-none block">
                    $85K
                  </span>
                  <span className="text-[10px] text-[#71849A] font-medium block mt-0.5">
                    Levies
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Right) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5EEF5] p-5 shadow-[0_2px_6px_rgba(8,41,74,0.02)] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00B5A4]" />
              <h2 className="text-sm font-bold text-[#102747] font-sans">
                Quick Actions
              </h2>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              {
                title: 'Strata\nRoll',
                icon: Layers,
                to: '/app/property/roll',
              },
              {
                title: 'Issue\nLevies',
                icon: Receipt,
                to: '/app/finance/levies',
              },
              {
                title: 'Broadcast\nNotice',
                icon: Send,
                to: '/app/communication/comms',
              },
              {
                title: 'Schedule\nMeeting',
                icon: CalendarCheck,
                to: '/app/operations/meetings',
              },
              {
                title: 'Insurance &\nCompliance',
                icon: ShieldCheck,
                to: '/app/property/compliance',
              },
              {
                title: 'Strata\nReports',
                icon: FileText,
                to: '/app/reports/statements',
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.to)}
                  className="flex flex-col items-center justify-center gap-2.5 px-2.5 py-3.5 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E5EEF5] hover:border-[#00B5A4]/60 active:border-[#008F87] shadow-[0_1px_2px_rgba(8,41,74,0.02)] hover:shadow-[0_6px_16px_rgba(0,181,164,0.12)] hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group text-center min-h-[108px]"
                  title={`Navigate to ${action.title.replace('\n', ' ')}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] border border-[#C8F0EC] text-[#00B5A4] group-hover:bg-[#00B5A4] group-hover:text-white group-hover:border-[#00B5A4] flex items-center justify-center transition-colors shrink-0">
                    <Icon className="w-4.5 h-4.5 transition-transform group-hover:scale-105" />
                  </div>
                  <span className="text-[11.5px] font-bold text-[#102747] group-hover:text-[#008F87] transition-colors leading-snug whitespace-pre-line font-sans">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
