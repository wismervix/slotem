import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import logoImageDark from '@/images/logo_dark.png';
import logoImageLight from '@/images/logo_light.png';

// import { AppLogo } from '@/Components/AppLogo'; // Assume you have a logo component

export interface NavItem {
    name: string;
    href: string;
    route: string;
}

export default function GuestLayout({ children }: PropsWithChildren) {
    const { auth, url } = usePage().props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Center navigation items
    const centerNavItems: NavItem[] = [
        { name: 'Features', href: route('features'), route: 'features' },
        { name: 'Services', href: route('services'), route: 'services' },
        { name: 'Contact Us', href: route('contact-us'), route: 'contact-us' },
    ];

    // Helper to check if route is active
    // const isActiveRoute = (routeName: string) => {
    //     return url === route(routeName).toString();
    // };

    // Navigation link component
    const NavLink = ({ item }: { item: NavItem }) => (
        <Link
            href={item.href}
            className={`font-medium transition hover:text-purple-600 ${
                route().current(item.route)
                    ? 'text-purple-600 dark:text-purple-400 hover:underline'
                    : 'text-slate-600 dark:text-slate-300'
            }`}
        >
            {item.name}
        </Link>
    );

    // Mobile menu toggle
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
            {/* Header */}
            <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <nav className="mx-auto flex flex-wrap sm:flex-nowrap gap-8 sm:gap-0 max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link href={route('home')} className="h-12 w-40">
                        <img
                            className="block h-auto w-full dark:hidden"
                            src={logoImageLight}
                            alt="Slotem Logo"
                        />
                        <img
                            className="hidden h-auto w-full dark:block"
                            src={logoImageDark}
                            alt="Slotem Logo"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {centerNavItems.map((item) => (
                            <NavLink key={item.name} item={item} />
                        ))}

                        {/* Admin Navigation */}
                        {auth?.admin ? (
                            <Link
                                href={route('admin.dashboard')}
                                className={`font-medium transition hover:text-purple-600 ${
                                    route().current('admin.dashboard')
                                        ? 'text-purple-600 hover:underline dark:text-purple-400'
                                        : 'text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                View Admin Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('admin.login')}
                                className={`font-medium transition hover:text-purple-600 ${
                                    route().current('admin.login')
                                        ? 'text-purple-600 hover:underline dark:text-purple-400'
                                        : 'text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* User Avatar / Login */}
                        {auth.user ? (
                            <Link
                                href={route('user.dashboard')}
                                className={`hidden sm:block ${
                                    route().current('user.dashboard')
                                        ? 'ring-2 ring-purple-500 ring-offset-2'
                                        : ''
                                }`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary-fixed text-2xl font-extrabold text-primary">
                                    {auth.user.avatar_url ? (
                                        <img
                                            alt="Profile Avatar"
                                            src={auth.user.avatar_url}
                                            title={`Hi, ${auth.user.name}`}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        auth.user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href={route('user.login')}
                                className={`hidden text-sm font-medium transition hover:text-purple-500 hover:underline sm:block ${
                                    route().current('user.login')
                                        ? 'text-purple-600'
                                        : 'text-purple-600'
                                }`}
                            >
                                Login
                            </Link>
                        )}

                        {/* Book Now Button */}
                        <Link
                            href={route('services')}
                            className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:bg-purple-500 active:scale-95"
                        >
                            Book Now
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="flex flex-col gap-1.5 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Toggle menu"
                        >
                            <span
                                className={`block h-0.5 w-6 bg-current transition-all ${
                                    isMobileMenuOpen
                                        ? 'translate-y-2 rotate-45'
                                        : ''
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-6 bg-current transition-all ${
                                    isMobileMenuOpen ? 'opacity-0' : ''
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-6 bg-current transition-all ${
                                    isMobileMenuOpen
                                        ? '-translate-y-2 -rotate-45'
                                        : ''
                                }`}
                            />
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation Menu */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
                        isMobileMenuOpen
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="border-t border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                        <div className="flex flex-col space-y-3 px-6 py-4">
                            {centerNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`font-medium transition hover:text-purple-600 ${
                                        route().current(item.route)
                                            ? 'text-purple-600 hover:underline dark:text-purple-400'
                                            : 'text-slate-600 dark:text-slate-300'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />

                            {/* Mobile Admin */}
                            {auth?.admin ? (
                                <Link
                                    href={route('admin.dashboard')}
                                    className={`font-medium transition hover:text-purple-600 ${
                                        route().current('admin.dashboard')
                                            ? 'text-purple-600 hover:underline dark:text-purple-400'
                                            : 'text-slate-600 dark:text-slate-300'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    View Admin Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('admin.login')}
                                    className={`font-medium transition hover:text-purple-600 ${
                                        route().current('admin.login')
                                            ? 'text-purple-600 hover:underline dark:text-purple-400'
                                            : 'text-slate-600 dark:text-slate-300'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Admin
                                </Link>
                            )}

                            {/* Mobile User Actions */}
                            {/* User Avatar / Login */}
                            {auth.user ? (
                                <Link
                                    href={route('user.dashboard')}
                                    className={` ${
                                        route().current('user.dashboard')
                                            ? 'ring-2 ring-purple-500 ring-offset-2'
                                            : ''
                                    }`}
                                >
                                    <div
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary-fixed text-2xl font-extrabold text-primary"
                                    >
                                        {auth.user.avatar_url ? (
                                            <img
                                                alt="Profile Avatar"
                                                src={auth.user.avatar_url}
                                                title={`Hi, ${auth.user.name}`}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            auth.user.name
                                                .charAt(0)
                                                .toUpperCase()
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                <Link
                                    href={route('user.login')}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-sm font-medium transition hover:text-purple-500 hover:underline ${
                                        route().current('user.login')
                                            ? 'text-purple-600'
                                            : 'text-purple-600'
                                    }`}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Child Content */}
            {children}

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row">
                    <Link href={route('home')}>
                        <div className="h-12 w-40">
                            <img
                                className="block h-auto w-full dark:hidden"
                                src={logoImageLight}
                                alt="Slotem Logo"
                            />
                            <img
                                className="hidden h-auto w-full dark:block"
                                src={logoImageDark}
                                alt="Slotem Logo"
                            />
                        </div>
                        {/* <h3 className="text-2xl font-bold text-purple-600">
                            Slotem
                        </h3> */}
                        <p className="mt-8 sm:mt-2 text-sm text-slate-500">
                            © 2026 Slotem Booking Systems. All rights reserved.
                        </p>
                    </Link>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                        <Link
                            href={route('privacy-policy')}
                            className="hover:text-purple-600"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href={route('terms-of-service')}
                            className="hover:text-purple-600"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href={route('help-center')}
                            className="hover:text-purple-600"
                        >
                            Help Center
                        </Link>
                        <Link
                            href={route('contact-sales')}
                            className="hover:text-purple-600"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
