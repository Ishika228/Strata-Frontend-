import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getActivePrimaryModule } from '../../config/navigation';
import { cn } from '../../lib/utils';

const ROUTE_ALIASES: Record<string, string> = {
  '/app/fm/properties': '/app/property/schemes',
  '/app/fm/assets': '/app/property/roll',
  '/app/fm/compliance': '/app/property/compliance',
  '/app/fm/lifecycle': '/app/property/roll',
  '/app/fm/planner': '/app/finance/budgets',
  '/app/fm/ppm': '/app/finance/budgets',
  '/app/fm/work-orders': '/app/finance/levies',
  '/app/fm/requests': '/app/finance/receipts',
  '/app/fm/ops-centre': '/app/finance/bank-rec',
  '/app/fm/inspections': '/app/finance/arrears',
  '/app/common/approvals': '/app/finance/invoices',
  '/app/fm/dispatch': '/app/operations/works',
  '/app/common/suppliers': '/app/operations/suppliers',
  '/app/fm/contacts': '/app/operations/meetings',
};

export const SubModuleNav: React.FC = () => {
  const location = useLocation();
  const currentPath = ROUTE_ALIASES[location.pathname] || location.pathname;
  const activeModule = getActivePrimaryModule(currentPath);

  // If module has no sub-modules (e.g., Dashboard or Maintenance Planning), do not show horizontal tabs
  if (!activeModule || !activeModule.subModules || activeModule.subModules.length <= 1) {
    return null;
  }

  return (
    <div className="mb-3.5 bg-white rounded-xl border border-[#E5EEF5] p-3.5 sm:p-4 shadow-[0_1px_3px_rgba(8,41,74,0.03)] select-none transition-all">
      {/* Top Row: Module Name & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-[#F0F5FA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#00B5A4] rounded-full inline-block shrink-0 shadow-[0_0_6px_rgba(0,181,164,0.4)]" />
            <h1 className="text-base sm:text-lg font-black text-[#102747] tracking-tight font-sans">
              {activeModule.name}
            </h1>
          </div>
          <p className="text-xs text-[#71849A] font-medium mt-0.5 pl-3.5 font-sans leading-normal">
            {activeModule.description}
          </p>
        </div>
      </div>

      {/* Bottom Row: Horizontal Sub-Module Tabs */}
      <div className="flex items-center gap-2 pt-2.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {activeModule.subModules.map((sub) => {
          const Icon = sub.icon;
          const currentPathWithSearch = `${currentPath}${location.search}`;
          const isSubActive = sub.to.includes('?')
            ? currentPathWithSearch === sub.to
            : (currentPath === sub.to && !location.search) ||
              (sub.to !== '/app' && currentPath.startsWith(`${sub.to}/`));

          return (
            <NavLink
              key={sub.to}
              to={sub.to}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer',
                isSubActive
                  ? 'bg-[#00B5A4] text-white shadow-[0_2px_8px_rgba(0,181,164,0.3)] border border-[#00B5A4]'
                  : 'bg-[#F4F8FC] text-[#334B68] hover:bg-[#EAF3F8] hover:text-[#102747] border border-[#E5EEF5] hover:border-[#CBD5E1]'
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'w-3.5 h-3.5 shrink-0 transition-colors',
                    isSubActive ? 'text-white' : 'text-[#00B5A4]'
                  )}
                />
              )}
              <span className="truncate">{sub.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
