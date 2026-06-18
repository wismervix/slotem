import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    Bell,
    HelpCircle,
    User as UserIcon,
    LogOut,
    Shield,
    Settings2,
    Info,
} from 'lucide-react';
import { AdminProfileThree } from '@/types';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    adminProfile: AdminProfileThree;
    onNavigateToSettings: () => void;
}

export default function Header({
    searchQuery,
    onSearchChange,
    adminProfile,
    onNavigateToSettings,
}: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside clicks
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const notifications = [
        {
            id: 1,
            title: 'New User Registered',
            message: 'Mateo Silva created an account.',
            time: '5 mins ago',
            read: false,
        },
        {
            id: 2,
            title: 'Booking Rescheduled',
            message: 'Sonia Mehta changed Booking #BK-1005 date.',
            time: '20 mins ago',
            read: false,
        },
        {
            id: 3,
            title: 'Pending Report Alert',
            message: 'Id SL-49202 flagged for activity limit check.',
            time: '2 hours ago',
            read: true,
        },
        {
            id: 4,
            title: 'System Backup Success',
            message: 'Weekly metadata catalog is successfully archived.',
            time: '1 day ago',
            read: true,
        },
    ];

    return (
        <>
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-8">
                {/* Search Bar Input */}
                <div className="flex max-w-xl flex-1 items-center">
                    <div className="relative w-full">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-outline" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2 pr-4 pl-10 font-sans text-sm placeholder-outline transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            placeholder="Search users by name, email, or ID..."
                        />
                    </div>
                </div>

                {/* Right Nav Utilities */}
                <div className="ml-8 flex items-center gap-4">
                    {/* Notifications Trigger */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            className="relative cursor-pointer rounded-full p-2 text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary"
                            title="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {adminProfile.notificationsCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 animate-ping rounded-full bg-error ring-2 ring-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown list */}
                        {showNotifications && (
                            <div className="absolute right-0 z-50 mt-2 w-80 divide-y divide-outline-variant/60 overflow-hidden rounded-xl border border-outline-variant bg-white shadow-xl">
                                <div className="flex items-center justify-between bg-surface-container-low px-4 py-3">
                                    <span className="text-xs font-semibold tracking-wide text-on-surface">
                                        Notifications
                                    </span>
                                    <span className="cursor-pointer text-[10px] font-medium text-primary hover:underline">
                                        Mark all read
                                    </span>
                                </div>
                                <div className="max-h-64 divide-y divide-outline-variant/40 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`cursor-pointer p-3.5 transition-colors hover:bg-surface-container ${
                                                !notif.read
                                                    ? 'bg-primary/5'
                                                    : ''
                                            }`}
                                        >
                                            <div className="mb-0.5 flex items-start justify-between">
                                                <span className="text-xs leading-tight font-semibold text-on-surface">
                                                    {notif.title}
                                                </span>
                                                {!notif.read && (
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></span>
                                                )}
                                            </div>
                                            <p className="mb-1 text-[11px] leading-relaxed text-on-surface-variant">
                                                {notif.message}
                                            </p>
                                            <span className="text-[9px] font-medium tracking-wide text-outline">
                                                {notif.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-surface-container/20 py-2 text-center">
                                    <span className="cursor-pointer text-[10px] leading-none font-medium text-on-surface-variant hover:text-primary">
                                        View all notifications page
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Help Info Trigger */}
                    <button
                        onClick={() => setShowHelpModal(true)}
                        className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary"
                        title="Help Suite"
                    >
                        <HelpCircle className="h-5 w-5" />
                    </button>

                    {/* Vertical Separator */}
                    <div className="mx-1 h-6 w-[1.5px] bg-outline-variant"></div>

                    {/* Profile Dropdown Trigger */}
                    <div className="relative" ref={profileRef}>
                        <div
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="group flex cursor-pointer items-center gap-3 rounded-full px-1.5 py-1 transition-all select-none hover:bg-surface-container"
                        >
                            <div className="hidden pl-1 text-right sm:block">
                                <p className="text-xs leading-normal font-semibold text-on-surface transition-colors group-hover:text-primary">
                                    {adminProfile.name}
                                </p>
                                <p className="text-[9px] leading-none font-semibold tracking-widest text-on-surface-variant uppercase">
                                    {adminProfile.role}
                                </p>
                            </div>
                            <img
                                alt="Admin Avatar"
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 rounded-full border border-outline-variant transition-colors group-hover:border-primary"
                                src={adminProfile.avatar}
                            />
                        </div>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-outline-variant bg-white py-1 shadow-xl">
                                <div className="border-b border-outline-variant/60 px-4 py-2.5">
                                    <span className="block text-[10px] font-bold tracking-wider text-outline uppercase">
                                        Signed in as
                                    </span>
                                    <span className="block truncate text-xs font-semibold text-on-surface">
                                        etangdgm001@gmail.com
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        onNavigateToSettings();
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-left text-xs text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary"
                                >
                                    <Settings2 className="mr-2.5 h-4 w-4 text-outline" />
                                    <span>Edit Profile</span>
                                </button>

                                <div className="my-1 border-t border-outline-variant/60"></div>

                                <div className="px-4 py-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-outline">
                                        <Shield className="h-3.5 w-3.5 text-green-600" />
                                        <span>Secure Admin Session</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Help Instructions Modal Dialogue */}
            {showHelpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-md rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-on-surface">
                                    Slotem Admin Guide
                                </h3>
                                <p className="text-xs text-on-surface-variant">
                                    Quick tutorial for navigating the console
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 space-y-3.5 text-xs leading-relaxed text-on-surface-variant">
                            <p>
                                Welcome to <strong>Slotem Admin Suite</strong>!
                                This dashboard offers an interactive platform
                                for monitoring your business operations.
                            </p>
                            <div className="space-y-2 border-l-2 border-primary/30 pl-2">
                                <div>
                                    <strong className="text-on-surface">
                                        👥 User Directory:
                                    </strong>{' '}
                                    Search clients via keywords, filter by
                                    activation status, edit credentials, or
                                    toggle suspended states instantly.
                                </div>
                                <div>
                                    <strong className="text-on-surface">
                                        📅 Bookings Panel:
                                    </strong>{' '}
                                    Track upcoming and cancelled service slots,
                                    modify reservation details, and export
                                    schedules seamlessly.
                                </div>
                                <div>
                                    <strong className="text-on-surface">
                                        ⏰ Availability Planner:
                                    </strong>{' '}
                                    Control default time-slits of the week.
                                    Hover and click to open or block calendar
                                    vacancies dynamically.
                                </div>
                                <div>
                                    <strong className="text-on-surface">
                                        📈 Live Persistence:
                                    </strong>{' '}
                                    All operations are tracked and saved
                                    securely inside the sandbox browser{' '}
                                    <code className="rounded bg-surface-container px-1 py-0.5 font-mono text-primary">
                                        localStorage
                                    </code>
                                    .
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowHelpModal(false)}
                            className="w-full cursor-pointer rounded-xl bg-primary py-2.5 text-xs font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container"
                        >
                            Mastered, Close Guide
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
