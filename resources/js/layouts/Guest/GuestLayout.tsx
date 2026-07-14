import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
// import { AppLogo } from '@/Components/AppLogo'; // Assume you have a logo component

export default function GuestLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
            {/* Header */}
            <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link
                        href={route('home')}
                        className="text-2xl font-bold tracking-tight text-purple-600"
                    >
                        Slotem
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            // href="/#how-it-works"
                            href={route('features')}
                            className="font-medium text-slate-600 transition hover:text-purple-600 dark:text-slate-300"
                        >
                            Features
                        </a>

                        <Link
                            href={route('services')}
                            className="text-slate-600 transition hover:text-purple-600 dark:text-slate-300"
                        >
                            Services
                        </Link>

                        <Link
                            href={route('contact-us')}
                            className="text-slate-600 transition hover:text-purple-600 dark:text-slate-300"
                        >
                            Contact Us
                        </Link>

                        {auth?.admin ? (
                            <Link
                                href={route('admin.dashboard')}
                                className="text-slate-600 transition hover:text-purple-600 dark:text-slate-300"
                            >
                                View Admin Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('admin.login')}
                                className="text-slate-600 transition hover:text-purple-600 dark:text-slate-300"
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={route('user.dashboard')}
                                    // className="hidden text-sm font-medium text-purple-600 transition hover:text-purple-500 sm:block"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary-fixed text-2xl font-extrabold text-primary">
                                        {auth.user.name ? (
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
                                    {/* View Bookings */}
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={route('user.login')}
                                className="hidden text-sm font-medium text-purple-600 transition hover:text-purple-500 sm:block"
                            >
                                Login
                            </Link>
                        )}

                        <Link
                            href={route('services')}
                            className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] hover:bg-purple-500"
                        >
                            Book Now
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Child Content */}
            {children}

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row">
                    <Link href={route('home')}>
                        <h3 className="text-2xl font-bold text-purple-600">
                            Slotem
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            © 2026 Slotem Booking Systems. All rights reserved.
                        </p>
                    </Link>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                        <Link href={route('privacy-policy')} className="hover:text-purple-600">
                            Privacy Policy
                        </Link>

                        <Link href={route('terms-of-service')} className="hover:text-purple-600">
                            Terms of Service
                        </Link>

                        <Link href={route('help-center')} className="hover:text-purple-600">
                            Help Center
                        </Link>

                        <Link href={route('contact-sales')} className="hover:text-purple-600">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
