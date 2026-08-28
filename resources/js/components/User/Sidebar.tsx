import { useBookingModalContext } from '@/contexts/BookingModalContext';
import { AdminProfile, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    Bell,
    User as UserIcon,
    Plus,
    Menu,
    X,
    LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import logoImageDark from '@/images/logo_dark.png';

type NavItem = {
    name: string;
    icon: LucideIcon;
    route?: string;
};

interface SidebarProps {
    unreadNotificationsCount: number;
    mobileSidebarOpen: boolean;
    setMobileSidebarOpen: (isOpen: boolean) => void;
}

type PageProps = {
    auth: {
        user: User | null;
        admin: AdminProfile | null;
    };
};

export default function Sidebar({
    unreadNotificationsCount,
    mobileSidebarOpen,
    setMobileSidebarOpen,
}: SidebarProps) {
    const { auth } = usePage<PageProps>().props;

    const user = auth.user;

    const navItems: NavItem[] = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            route: 'user.dashboard',
        },

        {
            name: 'Bookings',
            icon: Calendar,
            route: 'user.bookings',
        },

        {
            name: 'Profile',
            icon: UserIcon,
            route: 'user.profile',
        },
        {
            name: 'Notifications',
            icon: Bell,
            route: 'user.notifications',
        },
    ];

    const isActiveRoute = (routeName: string): boolean => {
        return route().current(routeName);
    };

    const { openModal } = useBookingModalContext();

    return (
        <>
            {/* Mobile top navigation header bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-outline-variant bg-[#f9f1ff] p-4 md:hidden dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                    {/* <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-white select-none">
                        S
                    </span> */}
                    <div>
                        <div className="h-12 w-40">
                            <img
                                className="logo-img"
                                src={logoImageDark}
                                alt="Slotem Logo"
                            />
                        </div>
                        <p className="pt-2 text-[10px] leading-none text-gray-500">
                            {user?.name}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Notifications micro badge */}
                    <Link
                        href={route('user.notifications')}
                        className="relative p-1 text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 scale-90 items-center justify-center rounded-full bg-red-600 text-[9px] font-extrabold text-white ring-2 ring-white">
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="cursor-pointer rounded-lg bg-gray-100 p-1.5 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Sidebar navigation */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r border-outline-variant bg-[#f9f1ff] p-4 transition-transform duration-300 md:relative md:translate-x-0 dark:border-neutral-800 dark:bg-neutral-900/40 ${
                    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="mb-6 flex items-center justify-between">
                    {/* <div className="space-y-0.5">
                        <h1 className="text-2xl font-black tracking-tight text-primary dark:text-primary-fixed">
                            Slotem
                        </h1>
                        <p className="text-xs font-medium tracking-wide text-secondary opacity-80 dark:text-secondary-fixed">
                            Management Suite
                        </p>
                    </div> */}

                    <div className="flex items-center gap-3 space-y-0.5">
                        {user?.avatar_url && (
                            <img
                                src={user?.avatar_url}
                                alt={user?.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        )}

                        <div>
                            <div className="h-12 w-28">
                                <img
                                    className="logo-img"
                                    src={logoImageDark}
                                    alt="Slotem Logo"
                                />
                            </div>

                            <p className="text-xs font-medium tracking-wide text-secondary opacity-80 dark:text-secondary-fixed">
                                {user?.name}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="cursor-pointer rounded-lg bg-gray-100 p-1 md:hidden dark:bg-neutral-800"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Tab Buttons bar */}
                <nav className="flex-grow space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        // NORMAL LINK
                        const active = item.route
                            ? isActiveRoute(item.route)
                            : false;

                        return (
                            <Link
                                key={item.name}
                                href={item.route ? route(item.route) : '#'}
                                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-secondary-container text-primary'
                                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        size={20}
                                        fill={active ? 'currentColor' : 'none'}
                                    />

                                    {item.name}
                                </div>
                                {item.name === 'Notifications' &&
                                    unreadNotificationsCount > 0 && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                                active
                                                    ? 'bg-white text-primary'
                                                    : 'bg-primary text-white'
                                            }`}
                                        >
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Action Button at bottom */}
                {/* <button
                    onClick={() => {
                        openModal();
                        setMobileSidebarOpen(false);
                    }}
                    className="mt-auto flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all hover:shadow-lg active:scale-95"
                >
                    <Plus className="h-4 w-4 shrink-0" />
                    Book New Appointment
                </button> */}

                <div className="mt-auto space-y-3 border-t border-outline-variant pt-4 dark:border-neutral-800">
                    <Link
                        href={route('user.logout')}
                        method="post"
                        as="button"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-[0.98] dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>

                    <button
                        onClick={() => {
                            openModal();
                            setMobileSidebarOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all hover:shadow-lg active:scale-95"
                    >
                        <Plus className="h-4 w-4 shrink-0" />
                        Book New Appointment
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile navigation drawer */}
            {mobileSidebarOpen && (
                <div
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs md:hidden"
                />
            )}
        </>
    );
}
