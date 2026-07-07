import { usePage } from '@inertiajs/react';
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
}

export default function AdminLayout({ children }: Props) {
    const { url } = usePage();

    const { auth } = usePage<SharedPageProps>().props;

    const { settings } = usePage<{ settings: WebsiteSettings }>().props;

    // Global adaptive search string
    const [searchQuery, setSearchQuery] = useState('');

    // Responsive sidebar toggle for smaller viewports
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Determine header search input placeholder adaptively
    const getSearchPlaceholder = () => {
        switch (url) {
            case 'dashboard':
                return 'Search global operations...';
            case 'bookings':
                return 'Search bookings client registry...';
            case 'availability':
                return 'Search services...';
            case 'settings':
                return 'Search system parameters...';
        }
    };

    return (
        <div className="flex min-h-screen bg-purple-50/20 font-sans text-zinc-800 antialiased transition-colors duration-250 dark:bg-zinc-950 dark:text-zinc-200">
            <Sidebar
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
                        <div className="flex w-44 items-center rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 sm:w-80 md:w-96 dark:border-slate-700 dark:bg-zinc-950">
                            <Search
                                className="shrink-0 animate-pulse text-outline dark:text-slate-600"
                                size={16}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                    </div>

                    {/* Right Header Navigation Panel tools */}
                    <div className="flex items-center gap-4">
                        <button className="relative cursor-pointer rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-purple-400">
                            <Bell size={18} />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
                        </button>

                        <button className="hidden cursor-pointer rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary sm:inline-block dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-purple-400">
                            <HelpCircle size={18} />
                        </button>

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
