import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import Footer from '@/components/Admin/Footer';
import Sidebar from '@/components/Admin/Sidebar';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteSettings, SharedPageProps } from '@/types';
import { HelpCircle, Bell, Search, Menu, X } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
}
interface Props {
    children: ReactNode;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

export default function AdminLayout({
    children,
    searchQuery = '',
    setSearchQuery = () => {},
}: Props) {
    const { url } = usePage();

    const { auth } = usePage<SharedPageProps>().props;

    const { settings } = usePage<{ settings: WebsiteSettings }>().props;

    const { notifications } = usePage<
        SharedPageProps & {
            notifications: {
                items: Notification[];
                unreadCount: number;
            };
        }
    >().props;

    // Responsive sidebar toggle for smaller viewports
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Determine header search input placeholder adaptively
    const getSearchPlaceholder = () => {
        if (route().current('admin.dashboard')) {
            return 'Search global operations...';
        }

        if (route().current('admin.bookings')) {
            return 'Search bookings client registry...';
        }

        if (route().current('admin.services')) {
            return 'Search services...';
        }

        if (route().current('admin.users')) {
            return 'Search users registry...';
        }

        if (route().current('admin.settings')) {
            return 'Search system parameters...';
        }

        return 'Search...';
    };

    const hideSearchRoutes = [
        'admin.availability',
        'admin.users.details',
        'admin.notifications',
        'admin.broadcasts.show',
        'admin.settings',
        'admin.website-settings',
    ];

    const shouldShowSearch = !hideSearchRoutes.some((routeName) =>
        route().current(routeName),
    );

    return (
        <div className="flex min-h-screen bg-purple-50/20 font-sans text-zinc-800 antialiased transition-colors duration-250 dark:bg-zinc-950 dark:text-zinc-200">
            <Sidebar
                unreadCount={notifications.unreadCount}
                businessName={settings.name}
                managerName={settings.manager_name}
                mobileSidebarOpen={mobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
            />

            <main className="motion-safe:animate-in motion-safe:fade-in flex min-h-screen w-full flex-1 flex-col overflow-hidden pb-24 duration-500">
                {/* Top Header Bar */}
                <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-6 select-none dark:border-slate-700 dark:bg-zinc-950">
                    {/* Logo toggle on mobile */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setMobileSidebarOpen(!mobileSidebarOpen)
                            }
                            className="cursor-pointer rounded-lg p-2 text-on-surface-variant hover:bg-surface-container lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Active search bar */}
                        {shouldShowSearch && (
                            <div className="flex w-44 items-center rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 sm:w-80 md:w-96 dark:border-slate-700 dark:bg-zinc-950">
                                <Search
                                    className="shrink-0 animate-pulse text-outline dark:text-slate-600"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="ml-2 w-full border-none bg-transparent text-xs font-medium text-on-surface outline-none placeholder:text-outline focus:ring-0 dark:bg-transparent dark:text-white dark:placeholder:text-slate-500"
                                    placeholder={getSearchPlaceholder()}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="text-outline hover:text-on-surface dark:text-slate-500 dark:hover:text-slate-300"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Header Navigation Panel tools */}
                    <div className="flex items-center gap-4">
                        {/* <button className="relative cursor-pointer rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-purple-400">
                            <Bell size={18} />
                            {notifications.unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex min-h-3.5 min-w-3.5 scale-90 items-center justify-center rounded-full bg-red-600 text-[9px] font-extrabold text-white ring-2 ring-white">
                                    {notifications.unreadCount}
                                </span>
                            )}
                        </button> */}

                        <button className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-purple-400">
                            <span className="relative block">
                                <Bell size={18} />

                                {notifications.unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-none font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                                        {notifications.unreadCount > 99
                                            ? '99+'
                                            : notifications.unreadCount}
                                    </span>
                                )}
                            </span>
                        </button>

                        <Link
                            href={route('help-center')}
                            className="hidden cursor-pointer rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary sm:inline-block dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                        >
                            <HelpCircle size={18} />
                        </Link>

                        {/* Avatar block */}
                        <div className="flex items-center gap-3 border-l border-outline-variant pl-4 select-none dark:border-slate-700">
                            <div className="hidden text-right sm:block">
                                <p className="text-xs font-bold text-on-surface dark:text-white">
                                    {auth.admin?.name}
                                </p>
                                <p className="mt-0.5 text-[9px] leading-none tracking-tighter text-outline dark:text-slate-500">
                                    {auth.admin?.email}
                                </p>
                            </div>
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest dark:border-slate-700 dark:bg-slate-800">
                                <img
                                    className="h-full w-full object-cover"
                                    src={auth.admin?.avatar_url}
                                    alt={auth.admin?.name}
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Core Screen Display Scrollable Page Body */}
                <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="p-6">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
