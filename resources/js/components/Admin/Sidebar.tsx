import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    BriefcaseBusiness,
    CalendarClock,
    Users,
    Settings as SettingsIcon,
    ChevronDown,
    ChevronRight,
    SquareArrowOutUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface SidebarProps {
    businessName: string;
    managerName: string;
    mobileSidebarOpen: boolean;
    setMobileSidebarOpen: (isOpen: boolean) => void;
}

type MenuKey = 'settings';

type ChildNavItem = {
    name: string;
    route: string;
};

type NavItem = {
    name: string;
    icon: LucideIcon;
    route?: string;
    children?: ChildNavItem[];
    menuKey?: MenuKey;
};

export default function Sidebar({
    businessName,
    managerName,
    mobileSidebarOpen,
    setMobileSidebarOpen,
}: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<Record<MenuKey, boolean>>({
        settings: false,
    });

    const toggleMenu = (menu: MenuKey) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const navItems: NavItem[] = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            route: 'admin.dashboard',
        },

        {
            name: 'Bookings',
            icon: Calendar,
            route: 'admin.bookings',
        },

        {
            name: 'Service',
            icon: BriefcaseBusiness,
            route: 'admin.services',
        },

        {
            name: 'Availability',
            icon: CalendarClock,
            route: 'admin.availability',
        },

        {
            name: 'Users',
            icon: Users,
            route: 'admin.users',
        },

        {
            name: 'Settings',
            icon: SettingsIcon,
            menuKey: 'settings',
            children: [
                {
                    name: 'General Settings',
                    route: 'admin.settings',
                },
                {
                    name: 'Website Settings',
                    route: 'admin.website-settings',
                },
            ],
        },
    ];

    const isActiveRoute = (routeName: string): boolean => {
        return route().current(routeName);
    };

    const isChildActive = (children?: ChildNavItem[]): boolean => {
        return children?.some((child) => route().current(child.route)) ?? false;
    };

    return (
        <>
            <aside
                className={`fixed top-0 left-0 z-50 flex min-h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-purple-100 bg-purple-50/70 p-4 transition-colors transition-transform duration-300 lg:relative lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950 ${
                    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="group mb-8 px-2 py-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-purple-700 text-xl font-bold text-white shadow-md transition-transform group-hover:rotate-12">
                            S
                        </div>
                        <div>
                            <h1 className="font-sans text-xl font-bold tracking-tight text-purple-700 select-none dark:text-purple-400">
                                {businessName}
                            </h1>
                            <p className="text-[10px] leading-none font-semibold tracking-widest text-purple-500/80 uppercase dark:text-zinc-400">
                                {managerName}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-grow space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        // DROPDOWN MENU
                        if (item.children) {
                            const active = isChildActive(item.children);
                            const menuKey = item.menuKey!;

                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => toggleMenu(menuKey)}
                                        className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                                            active
                                                ? 'font-semibold text-purple-950 dark:text-purple-100'
                                                : 'text-zinc-600 hover:bg-purple-100/40 hover:text-purple-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-purple-300'
                                        }`}
                                    >
                                        {active && (
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
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                className={`h-5 w-5 transition-transform duration-200 ${
                                                    active
                                                        ? 'scale-105 text-purple-700 dark:text-purple-400'
                                                        : 'text-zinc-400 group-hover:scale-110 dark:text-zinc-500'
                                                }`}
                                            />

                                            <span className="relative z-10">
                                                {item.name}
                                            </span>
                                        </div>

                                        {openMenus[menuKey] ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </button>

                                    {openMenus[menuKey] && (
                                        <div className="mt-1 ml-6 space-y-1">
                                            {item.children.map((child) => {
                                                const activeChild =
                                                    isActiveRoute(child.route);

                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={route(
                                                            child.route,
                                                        )}
                                                        className={`block rounded-xl px-4 py-2 text-sm transition-colors ${
                                                            activeChild
                                                                ? 'bg-primary text-purple-950 dark:text-purple-100'
                                                                : 'text-zinc-600 hover:bg-purple-100/40 hover:text-purple-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-purple-300'
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // NORMAL LINK
                        const active = item.route
                            ? isActiveRoute(item.route)
                            : false;

                        return (
                            <Link
                                key={item.name}
                                href={item.route ? route(item.route) : '#'}
                                className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                                    active
                                        ? 'font-semibold text-purple-950 dark:text-purple-100'
                                        : 'text-zinc-600 hover:bg-purple-100/40 hover:text-purple-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-purple-300'
                                }`}
                            >
                                {active && (
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
                                        active
                                            ? 'scale-105 text-purple-700 dark:text-purple-400'
                                            : 'text-zinc-400 group-hover:scale-110 dark:text-zinc-500'
                                    }`}
                                />
                                <span className="relative z-10">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* New Booking CTA */}
                <div className="mt-auto border-t border-purple-100 pt-4 dark:border-zinc-800">
                    <Link
                        href={route('home')}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]"
                    >
                        <SquareArrowOutUpRight size={20} />
                        Go To Website
                    </Link>
                </div>
            </aside>

            {/* Backdrop for mobile navigation drawer */}
            {mobileSidebarOpen && (
                <div
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs lg:hidden"
                />
            )}
        </>
    );
}
