import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { OfflineBanner } from '../ui/OfflineBanner';
import { ClipboardList, Calendar, Camera, ShieldCheck, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export const FieldLayout: React.FC = () => {
  const tabs = [
    { name: 'Today', to: '/field', icon: ClipboardList, end: true },
    { name: 'Upcoming', to: '/field/upcoming', icon: Calendar },
    { name: 'Capture Asset', to: '/field/capture', icon: Camera },
    { name: 'Compliance', to: '/field/compliance', icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 max-w-md mx-auto shadow-2xl border-x border-slate-800">
      {/* Offline banner on top */}
      <OfflineBanner pendingQueue={[]} />

      {/* Header */}
      <header className="h-14 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
            FM
          </div>
          <div>
            <div className="text-xs font-bold">Field Tech App</div>
            <div className="text-[10px] text-emerald-400">Tom Bradley (On Duty)</div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 p-4">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-950 border-t border-slate-800 flex items-center justify-around py-2 px-1 z-30">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors px-2 py-1',
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{t.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
