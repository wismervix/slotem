import React from 'react';
import {
    LayoutDashboard,
    Users,
    CalendarRange,
    Clock,
    Settings,
    Plus,
    Sparkles,
} from 'lucide-react';

interface SidebarProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
    onOpenNewBooking: () => void;
}

export default function Sidebar({
    currentTab,
    onTabChange,
    onOpenNewBooking,
}: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'bookings', label: 'Bookings', icon: CalendarRange },
        { id: 'availability', label: 'Availability', icon: Clock },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-outline-variant bg-surface py-8">
            {/* Brand Header */}
            <div className="group mb-8 px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-primary text-xl font-bold text-white shadow-md transition-transform group-hover:rotate-12">
                        S
                    </div>
                    <div>
                        <h1 className="font-sans text-xl font-bold tracking-tight text-primary">
                            Slotem
                        </h1>
                        <p className="text-[10px] leading-none font-semibold tracking-widest text-on-surface-variant/70 uppercase">
                            Admin Suite
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex w-full items-center px-6 py-3.5 text-left transition-all ${
                                isActive
                                    ? 'border-r-4 border-primary bg-surface-container-low font-semibold text-primary'
                                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                            }`}
                        >
                            <Icon
                                className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                            />
                            <span className="text-sm tracking-wide">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* New Booking Call-out Trigger at bottom */}
            <div className="mt-auto px-4">
                <div className="mb-4 hidden rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 md:block">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>Interactive Guide</span>
                    </div>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                        Quickly assign client bookings directly or toggle slot
                        availability in the operational planner.
                    </p>
                </div>

                <button
                    onClick={onOpenNewBooking}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-on-primary shadow-sm shadow-primary/20 transition-all duration-150 hover:bg-primary-container active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Booking</span>
                </button>
            </div>
        </aside>
    );
}
