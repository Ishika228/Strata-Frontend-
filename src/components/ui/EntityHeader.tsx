import React from 'react';
import { StatusBadge, StatusFamily } from './StatusBadge';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface KeyFact {
  label: string;
  value: React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface EntityHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  status?: string;
  statusFamily?: StatusFamily;
  keyFacts?: KeyFact[];
  primaryActions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  className?: string;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  status,
  statusFamily,
  keyFacts,
  primaryActions,
  secondaryActions,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-xl border border-[#E2E8F0] px-6 py-5 shadow-soft-sm', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-[#71849A] mb-2.5">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#71849A]" />}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-[#102747] font-medium transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#102747] font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#102747] font-sans">{title}</h1>
            {status && <StatusBadge status={status} family={statusFamily} />}
          </div>
          {subtitle && <p className="mt-1 text-xs text-[#71849A] font-medium">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {secondaryActions}
          {primaryActions}
        </div>
      </div>

      {keyFacts && keyFacts.length > 0 && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-[#E2E8F0]">
          {keyFacts.map((fact, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[10px] font-semibold text-[#71849A] uppercase tracking-wider">{fact.label}</span>
              <span className="mt-0.5 text-sm font-semibold text-[#102747]">{fact.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
