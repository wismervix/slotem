/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
    LayoutDashboard,
    Calendar,
    Clock,
    Settings as SettingsIcon,
    Plus,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onNewBookingClick: () => void;
    businessName: string;
    managerName: string;
}

export default function Sidebar({
    activeTab,
    setActiveTab,
    onNewBookingClick,
    businessName,
    managerName,
}: SidebarProps) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'availability', label: 'Availability', icon: Clock },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    return (
        <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-purple-100 bg-purple-50/70 p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-950">
            {/* Brand Header */}
            <div className="mb-8 px-2 py-1">
                <h2 className="text-xl font-bold tracking-tight text-purple-700 select-none dark:text-purple-400">
                    {businessName}
                </h2>
                <p className="mt-0.5 text-xs font-medium tracking-wider text-purple-500/80 uppercase dark:text-zinc-400">
                    {managerName}
                </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-1.5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            id={`nav-tab-${item.id}`}
                            className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                                isActive
                                    ? 'font-semibold text-purple-950 dark:text-purple-100'
                                    : 'text-zinc-600 hover:bg-purple-100/40 hover:text-purple-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-purple-300'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 rounded-xl bg-purple-200/60 dark:bg-purple-950/40"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 350,
                                        damping: 30,
                                    }}
                                    style={{ zIndex: -1 }}
                                />
                            )}
                            <Icon
                                className={`h-5 w-5 transition-transform duration-200 ${
                                    isActive
                                        ? 'scale-105 text-purple-700 dark:text-purple-400'
                                        : 'text-zinc-400 group-hover:scale-110 dark:text-zinc-500'
                                }`}
                            />
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* New Booking CTA */}
            <div className="mt-auto border-t border-purple-100 pt-4 dark:border-zinc-800">
                <button
                    onClick={onNewBookingClick}
                    id="btn-new-booking-sidebar"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]"
                >
                    <Plus className="h-5 w-5" />
                    <span>New Booking</span>
                </button>
            </div>
        </aside>
    );
}
