import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  X,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  PRIMARY_MODULES,
  USERS_MODULE,
  SETTINGS_MODULE,
  getActivePrimaryModule,
} from '../../config/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, className }) => {
  const location = useLocation();
  const activeModule = getActivePrimaryModule(location.pathname);

  // Check active states for administration items
  const isUsersActive = location.pathname.startsWith('/app/users');
  const isSettingsActive =
    location.pathname.startsWith('/app/settings') && !isUsersActive;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#061D33]/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-[216px] min-w-[216px] max-w-[216px] bg-[#0A2540] text-white flex flex-col justify-between transition-all duration-200 ease-out lg:static lg:translate-x-0 border-r border-[#123659]/50 shadow-xl lg:shadow-none select-none text-[13px] overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-4 pt-3 pb-2 shrink-0 border-b border-[#123659]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <img
                src="/assets/vertex-logo.png"
                alt="VERTEX"
                className="w-7 h-7 object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-[15px] tracking-[0.12em] text-white font-sans">
                VERTEX
              </span>
              <span className="text-[11px] text-[#00B5A4] font-semibold tracking-wide font-sans">
                Strata
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded hover:bg-[#123659]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items Area */}
        <div className="flex flex-col flex-1 px-2.5 pt-3 pb-4 space-y-1 overflow-y-auto sidebar-scrollbar">
          {/* Modules Section */}
          <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/40 font-sans">
            Modules
          </div>

          {PRIMARY_MODULES.map((item) => {
            const Icon = item.icon;
            const isModuleActive = activeModule?.id === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.defaultTo}
                title={item.name}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group',
                  isModuleActive
                    ? 'border border-[#00B5A4] bg-[#00B5A4]/15 text-white font-bold shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/5 border border-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isModuleActive
                      ? 'text-[#00B5A4]'
                      : 'text-white/70 group-hover:text-white'
                  )}
                />
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.sidebarLabel || item.name}</span>
              </NavLink>
            );
          })}

          {/* Distinct Section: Administration with User and Settings as 2 different options */}
          <div className="pt-2.5 mt-2 border-t border-[#123659]/60 space-y-1">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/40 font-sans">
              Administration
            </div>

            {/* Option 1: Users & Roles */}
            <NavLink
              to={USERS_MODULE.defaultTo}
              title={USERS_MODULE.name}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group',
                isUsersActive
                  ? 'border border-[#00B5A4] bg-[#00B5A4]/15 text-white font-bold shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <Users
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isUsersActive ? 'text-[#00B5A4]' : 'text-white/70 group-hover:text-white'
                )}
              />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">{USERS_MODULE.sidebarLabel || USERS_MODULE.name}</span>
            </NavLink>

            {/* Option 2: Settings */}
            <NavLink
              to={SETTINGS_MODULE.defaultTo}
              title={SETTINGS_MODULE.name}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group',
                isSettingsActive
                  ? 'border border-[#00B5A4] bg-[#00B5A4]/15 text-white font-bold shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <Settings
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isSettingsActive ? 'text-[#00B5A4]' : 'text-white/70 group-hover:text-white'
                )}
              />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">{SETTINGS_MODULE.sidebarLabel || SETTINGS_MODULE.name}</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
