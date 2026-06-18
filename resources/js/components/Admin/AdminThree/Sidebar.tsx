/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
    LayoutDashboard,
    Calendar,
    CalendarClock,
    Settings as SettingsIcon,
    Plus,
} from 'lucide-react';

interface SidebarProps {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    onOpenNewBooking: () => void;
}

export default function Sidebar({
    currentTab,
    setCurrentTab,
    onOpenNewBooking,
}: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', name: 'Bookings', icon: Calendar },
        { id: 'availability', name: 'Availability', icon: CalendarClock },
        { id: 'settings', name: 'Settings', icon: SettingsIcon },
    ];

    return (
        <aside
            id="slotem_sidebar"
            className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-[#ccc3d8]/40 bg-white/90 py-8 shadow-sm backdrop-blur-md transition-all duration-300"
        >
            {/* Brand Logo and Title */}
            <div className="group mb-8 px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#630ed4] font-extrabold text-white shadow-md shadow-[#630ed4]/20 transition-transform group-hover:scale-105">
                        S
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#630ed4]">
                            Slotem
                        </h1>
                        <p className="text-[10px] font-medium tracking-wider text-[#4a4455]/70 uppercase">
                            Admin Suite
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation list */}
            <nav className="flex-grow space-y-1.5 px-3">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                        <button
                            key={item.id}
                            id={`sidebar_tab_${item.id}`}
                            onClick={() => setCurrentTab(item.id)}
                            className={`flex w-full cursor-pointer items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'border-l-4 border-[#630ed4] bg-[#eaddff] font-semibold text-[#25005a] shadow-sm'
                                    : 'text-[#4a4455] hover:bg-[#f3ebfa] hover:text-[#25005a]'
                            }`}
                        >
                            <IconComponent
                                className={`mr-3 h-5 w-5 transition-colors ${
                                    isActive
                                        ? 'text-[#630ed4]'
                                        : 'text-[#4a4455]/70'
                                }`}
                            />
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            {/* CTA Button */}
            <div className="mt-auto px-4">
                <button
                    id="sidebar_new_booking_btn"
                    onClick={onOpenNewBooking}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#630ed4] py-3 text-sm font-semibold text-white shadow-lg shadow-[#630ed4]/10 transition-all outline-none hover:bg-[#7c3aed] hover:shadow-xl hover:shadow-[#630ed4]/20 active:scale-98"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Booking</span>
                </button>
            </div>
        </aside>
    );
}
