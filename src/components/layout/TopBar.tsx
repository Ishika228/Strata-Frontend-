import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '../../lib/utils';

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
}) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <header className="w-full bg-white rounded-xl border border-[#E5EEF5] px-4 py-2 flex items-center justify-between gap-4 mb-3.5 shadow-[0_1px_3px_rgba(8,41,74,0.03)] z-30 transition-all select-none">
      {/* Left side: Mobile Toggle & Breadcrumbs / Module Indicator */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg text-[#334B68] bg-[#F4F8FC] border border-[#E5EEF5] hover:bg-[#EAF3F8] transition shrink-0 cursor-pointer"
          title="Toggle Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Right side: Search Box, Notifications, Divider & User Profile */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {/* Search Input Box matching screenshot */}
        <div
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[#F4F8FC] hover:bg-[#EAF3F8] border border-[#D5E5F2] hover:border-[#00B5A4]/60 rounded-lg text-xs text-[#71849A] transition cursor-pointer group shadow-2xs w-60 sm:w-72 md:w-80"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-[#00B5A4] transition shrink-0" />
          <span className="truncate text-xs font-normal text-slate-500 font-sans">
            Search properties, assets, work or...
          </span>
        </div>

        {/* Bell Notification */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 text-slate-600 hover:text-[#00B5A4] rounded-lg hover:bg-[#F4F8FC] transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00B5A4]" />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-[#E5EEF5]" />

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              'flex items-center gap-2.5 px-1 py-0.5 rounded-lg transition cursor-pointer select-none group',
              userMenuOpen ? 'bg-[#F4F8FC]' : 'hover:bg-[#F4F8FC]'
            )}
            title="Ishika Bhatia (Strata Administrator)"
          >
            <img
              src="/assets/ishika-avatar.png"
              alt="Ishika Bhatia"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-[#102747] font-sans">
                Ishika Bhatia
              </span>
              <span className="text-[10px] text-[#71849A] font-medium font-sans">
                Strata Administrator
              </span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-slate-400 group-hover:text-[#102747] transition-transform duration-200',
                userMenuOpen && 'rotate-180 text-[#00B5A4]'
              )}
            />
          </button>

          {/* Interactive User Profile Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#D5E5F2] rounded-2xl shadow-[0_12px_28px_rgba(8,41,74,0.12)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#102747]">
              {/* Header inside popup */}
              <div className="flex items-center gap-2.5 p-2 pb-2.5 mb-1.5 border-b border-[#F0F5FA]">
                <img
                  src="/assets/ishika-avatar.png"
                  alt="Ishika Bhatia"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00B5A4]"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#102747] truncate">Ishika Bhatia</div>
                  <div className="text-[10px] text-[#00B5A4] font-semibold truncate">Strata Administrator</div>
                  <div className="text-[10px] text-slate-400 truncate">ishika.bhatia@vertex.com.au</div>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/app/users');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-700 hover:text-[#102747] hover:bg-[#F4F8FC] transition text-left cursor-pointer font-medium"
                >
                  <User className="w-4 h-4 text-[#00B5A4]" />
                  <span>Users & Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/app/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-700 hover:text-[#102747] hover:bg-[#F4F8FC] transition text-left cursor-pointer font-medium"
                >
                  <Settings className="w-4 h-4 text-[#00B5A4]" />
                  <span>System Settings</span>
                </button>

                <div className="border-t border-[#F0F5FA] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/app/fm/dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
