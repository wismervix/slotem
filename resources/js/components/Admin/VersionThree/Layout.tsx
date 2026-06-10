import { ReactNode, useState } from 'react';
import { LayoutDashboard, CalendarDays, Clock, Settings, Plus, Search, Bell, HelpCircle, Sparkles } from 'lucide-react';
import { ActiveTab } from '@/types';

interface LayoutProps {
  children: ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewBooking: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Layout({
  children,
  activeTab,
  onTabChange,
  onOpenNewBooking,
  searchQuery,
  onSearchChange,
}: LayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings' as const, label: 'Bookings', icon: CalendarDays },
    { id: 'availability' as const, label: 'Availability', icon: Clock },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SideNavBar Grid */}
      <aside className="w-64 fixed left-0 top-0 bottom-0 border-r border-slate-200 bg-white flex flex-col py-8 z-40">
        {/* Brand title */}
        <div className="px-8 mb-8 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-purple-700">Slotem</h1>
            <Sparkles className="w-4 h-4 text-purple-500 fill-purple-500 animate-pulse" />
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Admin Suite</p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-4 px-8 py-3.5 text-sm font-semibold transition-all text-left ${
                  isActive
                    ? 'text-purple-700 bg-purple-50 border-r-[4px] border-purple-700'
                    : 'text-gray-500 hover:text-purple-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-purple-700 scale-105' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Lower "+ New Booking" Button */}
        <div className="px-6 mt-auto shrink-0">
          <button
            onClick={onOpenNewBooking}
            className="w-full bg-purple-700 hover:bg-purple-800 text-on-primary py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </aside>

      {/* Primary body frame offset left */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* TopNavBar Header */}
        <header className="flex justify-between items-center h-16 px-8 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          {/* Quick search settings */}
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search settings, bookings, handlers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 text-xs py-2.5 pl-10 pr-4 rounded-full border-none focus:ring-1 focus:ring-purple-700 outline-none transition-all placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Quick Action elements */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-purple-700 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full" />
              </button>

              {/* Notification overlay */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 bg-white border border-slate-100 p-4 rounded-xl shadow-xl w-64 text-xs space-y-2 text-slate-700">
                  <h4 className="font-bold border-b border-slate-50 pb-1 text-purple-700">System Notifications</h4>
                  <div className="space-y-2 pt-1 font-medium">
                    <p className="p-1 hover:bg-slate-50 rounded">⏰ Liams booking details confirmed.</p>
                    <p className="p-1 hover:bg-slate-50 rounded">📩 Sarah White accepted invitation request.</p>
                    <p className="p-1 hover:bg-slate-50 rounded">💻 Server booted successfully in Cloud Run.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Help Indicator */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 text-gray-400 hover:text-purple-700 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Avatar */}
            <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 select-none ml-2">
              <img
                alt="Admin User Avatar"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiqB92OEstaha-KTswu9_J1L217k1VW9IdQzqxQyMfSU_tgu16Vw4H7Rg6MQ6mMCxOVbqqkJ6vj_xddQgZrxeGCRtxm75KSJe4srStnO-XJtKJWNQaxkJM_8f_xCroXzjUcLKhYC_SygAeb-JYN_dq38JOcwDHNd1LIcgOaEFXrBTLHxdAx9xgO-7RNEeCIcJmFxendlUwJrDwcKwAGuyv7rcimOHpim8_SKDOgopbXv5FSY1CMeUVBzYfGrtLqD8NU_qCk-3XA4U"
              />
            </div>
          </div>
        </header>

        {/* Inner page content container */}
        <main className="flex-1 p-8 max-w-[1240px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowHelp(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl z-10 border border-gray-100">
            <h4 className="text-md font-bold text-slate-800 mb-2 flex items-center gap-1">
              <Sparkles className="w-4.5 h-4.5 text-purple-700 fill-purple-700" />
              About Slotem Suite
            </h4>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Slotem is a responsive booking administrative orchestrator built for creative agencies, design workshops, and handling customer leads. You can schedule slots, manage shift rotations, and define custom cancellation boundaries instantly.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-purple-700 text-xs font-bold text-white rounded-xl hover:bg-purple-800 transition-colors"
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
