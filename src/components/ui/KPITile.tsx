import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Table } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KPITileProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: {
    percentage: number;
    direction: 'up' | 'down';
    label?: string;
  };
  asAtTimestamp?: string;
  drillDownLink?: () => void;
  tabularFallback?: {
    headers: string[];
    rows: (string | number)[][];
  };
  className?: string;
}

export const KPITile: React.FC<KPITileProps> = ({
  title,
  value,
  subtitle,
  trend,
  asAtTimestamp,
  drillDownLink,
  tabularFallback,
  className,
}) => {
  const [showTable, setShowTable] = useState(false);

  return (
    <div
      onClick={drillDownLink}
      className={cn(
        'group relative flex flex-col justify-between p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-soft-sm transition-card hover:border-[#00B5A4]/40 hover:shadow-soft',
        drillDownLink && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans">
          {title}
        </span>
        {tabularFallback && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTable(!showTable);
            }}
            className="text-[#71849A] hover:text-[#102747] p-0.5 rounded transition"
            title="Toggle accessible tabular view"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showTable && tabularFallback ? (
        <div className="mt-3 overflow-x-auto text-[11px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] font-semibold text-[#102747]">
                {tabularFallback.headers.map((h, i) => (
                  <th key={i} className="py-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabularFallback.rows.map((row, i) => (
                <tr key={i} className="border-b border-[#EAF3F8] text-[#334B68]">
                  {row.map((cell, j) => (
                    <td key={j} className="py-1">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black tracking-tight text-[#102747] font-sans">
              {value}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-[#102747] font-medium font-sans">{subtitle}</p>
            )}
          </div>

          {trend && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border',
                trend.direction === 'up'
                  ? 'text-[#00A878] bg-[#e6f7f2] border-[#a3e8d2]'
                  : 'text-[#E665B1] bg-[#fdeff7] border-[#f8c2e1]'
              )}
            >
              {trend.direction === 'up' ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(trend.percentage)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Micro-Metric & Wavy Sparkline */}
      <div className="mt-3 pt-2.5 border-t border-[#F0F5FA] flex items-center justify-between gap-1.5">
        <span className="text-[10.5px] font-medium text-[#102747] leading-tight font-sans">
          {asAtTimestamp ? `Updated ${asAtTimestamp}` : 'Performance index'}
        </span>
        <svg className="w-12 h-3.5 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`sparkGrad-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
              <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z"
            fill={`url(#sparkGrad-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()})`}
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
  );
};
