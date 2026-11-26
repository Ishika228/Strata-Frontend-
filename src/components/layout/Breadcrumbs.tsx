import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getActivePrimaryModule } from '../../config/navigation';

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

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const currentPath = ROUTE_ALIASES[location.pathname] || location.pathname;
  const activeModule = getActivePrimaryModule(currentPath);

  // If on root dashboard
  if (
    currentPath === '/app/fm/dashboard' ||
    currentPath === '/app/strata/dashboard' ||
    currentPath === '/app'
  ) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#71849A] font-semibold select-none">
        <Home className="w-4 h-4 text-[#00B5A4] shrink-0" />
        <span>Dashboard</span>
      </div>
    );
  }

  // Parse search params for tab sub-routing
  const searchParams = new URLSearchParams(location.search);
  const activeTabParam = searchParams.get('tab');

  // Find active sub-module if any
  let activeSubModule = activeModule?.subModules?.find((sub) => {
    if (activeTabParam && sub.to.includes(`tab=${activeTabParam}`)) return true;
    return false;
  });

  if (!activeSubModule && activeModule?.subModules) {
    activeSubModule = activeModule.subModules.find((sub) => {
      const cleanTo = sub.to.split('?')[0];
      return cleanTo !== activeModule.defaultTo && (currentPath === cleanTo || currentPath.startsWith(`${cleanTo}/`));
    });
  }

  const isAtModuleRoot = !activeSubModule;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#71849A] font-medium select-none truncate">
      <Link
        to="/app/fm/dashboard"
        className="hover:text-[#00B5A4] transition-colors flex items-center gap-1.5 text-[#71849A]"
      >
        <Home className="w-4 h-4 text-[#00B5A4] shrink-0" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {activeModule && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0] shrink-0" />
          {isAtModuleRoot ? (
            <span className="text-[#102747] font-bold truncate">
              {activeModule.name}
            </span>
          ) : (
            <Link
              to={activeModule.defaultTo}
              className="hover:text-[#00B5A4] transition-colors text-[#71849A] truncate"
            >
              {activeModule.name}
            </Link>
          )}
        </>
      )}

      {activeSubModule && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0] shrink-0" />
          <span className="text-[#102747] font-bold truncate">
            {activeSubModule.name}
          </span>
        </>
      )}
    </nav>
  );
};
