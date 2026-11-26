import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SubModuleNav } from './SubModuleNav';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AssistantDrawer } from './AssistantDrawer';
import { NotificationCentre } from './NotificationCentre';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F8FC] text-[#334B68] font-sans antialiased p-0 sm:p-2.5">
      {/* Primary Sidebar - Dark Navy Rounded Container */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="rounded-none sm:rounded-2xl"
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F4F8FC]">
        {/* TopBar container */}
        <div className="px-3 sm:px-6 pt-2.5 pb-0">
          <div className="max-w-[1440px] mx-auto">
            <TopBar
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onOpenSearch={() => setSearchOpen(true)}
              onOpenNotifications={() => setNotificationsOpen(!notificationsOpen)}
            />
          </div>
        </div>

        {/* Content Outlet with Enterprise Horizontal SubModule Navigation */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 pb-6 scrollbar-thin scrollbar-thumb-slate-300">
          <div className="max-w-[1440px] mx-auto">
            <SubModuleNav />
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlays */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AssistantDrawer />
      <NotificationCentre isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
};
