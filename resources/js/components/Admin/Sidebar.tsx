import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    Clock,
    Settings,
    ChevronDown,
    ChevronRight,
    Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

type MenuKey = 'bookings' | 'settings';

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

export default function Sidebar() {
    const [openMenus, setOpenMenus] = useState<Record<MenuKey, boolean>>({
        bookings: true,
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
            menuKey: 'bookings',
            children: [
                {
                    name: 'All Bookings',
                    route: 'admin.bookings',
                },
                {
                    name: 'Create Booking',
                    route: 'admin.bookings.create',
                },
            ],
        },

        {
            name: 'Availability',
            icon: Clock,
            route: 'admin.availability',
        },

        {
            name: 'Settings',
            icon: Settings,
            menuKey: 'settings',
            children: [
                {
                    name: 'General',
                    route: 'admin.settings',
                },
                {
                    name: 'Profile',
                    route: 'admin.profile',
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
        <aside className="fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-low p-4">
            <div className="mb-8 px-2">
                <h2 className="text-lg font-bold text-primary">Slotem Admin</h2>

                <p className="text-xs font-medium text-on-surface-variant">
                    Business Manager
                </p>
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
                                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-secondary-container text-primary'
                                            : 'text-on-surface-variant hover:bg-surface-container-highest'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            size={20}
                                            fill={
                                                active ? 'currentColor' : 'none'
                                            }
                                        />

                                        {item.name}
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
                                            const activeChild = isActiveRoute(
                                                child.route,
                                            );

                                            return (
                                                <Link
                                                    key={child.name}
                                                    href={route(child.route)}
                                                    className={`block rounded-xl px-4 py-2 text-sm transition-colors ${
                                                        activeChild
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'text-on-surface-variant hover:bg-surface-container-highest'
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
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-secondary-container text-primary'
                                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                            }`}
                        >
                            <Icon
                                size={20}
                                fill={active ? 'currentColor' : 'none'}
                            />

                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <Link
                href={route('services')}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
            >
                <Plus size={20} />
                New Booking
            </Link>
        </aside>
    );
}
