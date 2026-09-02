import { useState, useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Mail, Check, Share2, Globe, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { NavItem } from '@/layouts/Guest/GuestLayout';
import logoImageDark from '@/images/logo_dark.png';
import logoImageLight from '@/images/logo_light.png';


export default function ContactUs() {
    const { auth, flash } = usePage().props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Center navigation items
    const centerNavItems: NavItem[] = [
        { name: 'Features', href: route('features'), route: 'features' },
        { name: 'Services', href: route('services'), route: 'services' },
        { name: 'Contact Us', href: route('contact-us'), route: 'contact-us' },
    ];

    // Navigation link component
    const NavLink = ({ item }: { item: NavItem }) => (
        <Link
            href={item.href}
            className={`text-sm font-medium transition hover:text-white ${
                route().current(item.route)
                    ? 'text-white hover:underline'
                    : 'text-white/70'
            }`}
        >
            {item.name}
        </Link>
    );

    // Mobile menu toggle
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    // Watch for flash messages
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Toast auto-hide
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Handle form submission
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('contact-us.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="flex min-h-screen flex-col selection:bg-primary/30">
            {/* Background with Overlay */}
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')`,
                }}
            >
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] backdrop-brightness-75" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-transparent backdrop-blur-md">
                <nav className="mx-auto flex gap-2 sm:gap-0 py-2 sm:py-0 flex-wrap sm:flex-nowrap min-h-20 max-w-7xl items-center justify-between px-6">
                    <Link href={route('home')} className="h-12 w-40">
                        {/* <img
                            className="block h-auto w-full dark:hidden"
                            src={logoImageLight}
                            alt="Slotem Logo"
                        />
                        <img
                            className="hidden h-auto w-full dark:block"
                            src={logoImageDark}
                            alt="Slotem Logo"
                        /> */}
                        <img
                            className="h-auto w-full dark:block"
                            src={logoImageDark}
                            alt="Slotem Logo"
                        />
                    </Link>

                    <div className="hidden items-center space-x-8 md:flex">
                        {centerNavItems.map((item) => (
                            <NavLink key={item.name} item={item} />
                        ))}

                        {auth?.admin ? (
                            <Link
                                href={route('admin.dashboard')}
                                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                            >
                                View Admin Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('admin.login')}
                                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* User Avatar / Login */}
                        {auth.user ? (
                            <>
                                <Link href={route('user.dashboard')}>
                                    <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary-fixed text-2xl font-extrabold text-primary sm:flex">
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
                                className="hidden px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:block"
                            >
                                Login
                            </Link>
                        )}

                        {/* Book Now Button */}
                        <Link
                            href={route('services')}
                            className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition transition-all hover:scale-[1.02] hover:bg-purple-500 active:scale-95"
                        >
                            Book Now
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="flex flex-col gap-1.5 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-400"
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
                    <div className="border-t border-slate-200 bg-transparent backdrop-blur">
                        <div className="flex flex-col space-y-3 px-6 py-4">
                            {centerNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition hover:text-white ${
                                        route().current(item.route)
                                            ? 'text-white hover:underline'
                                            : 'text-white/70'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="my-2 h-px bg-slate-200" />

                            {/* Mobile Admin */}
                            {auth?.admin ? (
                                <Link
                                    href={route('admin.dashboard')}
                                    className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    View Admin Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('admin.login')}
                                    className="text-sm font-medium text-white/70 transition-colors hover:text-white"
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
                                    className={`text-sm font-medium text-white/70 transition hover:text-white`}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-grow items-center justify-center px-6 py-20">
                <motion.div
                    className="w-full max-w-5xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Toast Notification */}
                    {showToast && toastMessage && (
                        <div
                            className={`animate-slide-in fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 text-white shadow-2xl ${
                                toastType === 'success'
                                    ? 'border-emerald-500/30 bg-emerald-600'
                                    : 'border-red-500/30 bg-red-600'
                            }`}
                        >
                            <Check className="h-5 w-5 shrink-0" />
                            <p className="text-xs font-bold">{toastMessage}</p>
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <motion.h1
                            className="mb-4 font-heading text-5xl tracking-widest text-white drop-shadow-2xl sm:text-6xl md:text-8xl"
                            variants={itemVariants}
                        >
                            CONNECT WITH SLOTEM
                        </motion.h1>
                        <motion.p
                            className="text-lg font-light tracking-wide text-white/80 md:text-xl"
                            variants={itemVariants}
                        >
                            Simple. Transparent. Immersive.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* Form Section */}
                        <motion.div
                            className="group relative lg:col-span-7"
                            variants={itemVariants}
                        >
                            {/* Decorative background shadow/blur */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 opacity-50 blur-2xl transition duration-1000 group-hover:opacity-100" />

                            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
                                <form
                                    className="space-y-6"
                                    onSubmit={handleSave}
                                >
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Your Name"
                                                className="w-full border-b border-white/20 bg-white/5 p-4 text-white transition-all outline-none placeholder:text-white/40 focus:border-primary-container focus:bg-white/10"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Email Address"
                                                className="w-full border-b border-white/20 bg-white/5 p-4 text-white transition-all outline-none placeholder:text-white/40 focus:border-primary-container focus:bg-white/10"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) =>
                                            setData('subject', e.target.value)
                                        }
                                        placeholder="Subject"
                                        className="w-full border-b border-white/20 bg-white/5 p-4 text-white transition-all outline-none placeholder:text-white/40 focus:border-primary-container focus:bg-white/10"
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.subject}
                                        </p>
                                    )}

                                    <textarea
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        placeholder="Message"
                                        rows={4}
                                        className="w-full resize-none border-b border-white/20 bg-white/5 p-4 text-white transition-all outline-none placeholder:text-white/40 focus:border-primary-container focus:bg-white/10"
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.message}
                                        </p>
                                    )}

                                    <button className="w-full rounded-xl bg-primary-container py-4 font-heading text-xl tracking-widest text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary active:scale-95 active:scale-[0.98] sm:text-3xl">
                                        {processing
                                            ? 'SENDING INQUIRY'
                                            : 'SEND INQUIRY'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Sidebar Section */}
                        <motion.div
                            className="flex flex-col gap-6 lg:col-span-5"
                            variants={itemVariants}
                        >
                            {/* Direct Card */}
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition-all hover:bg-white/15">
                                <h3 className="mb-6 font-heading text-3xl tracking-wider text-white">
                                    DIRECT
                                </h3>
                                <div className="group flex cursor-pointer items-center gap-4 text-white/80 transition-colors hover:text-white">
                                    <div className="rounded-full bg-white/5 p-3 transition-all group-hover:bg-primary/20">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <span className="text-base sm:text-lg">
                                        support@slotem.com
                                    </span>
                                </div>
                            </div>

                            {/* Social Card */}
                            <div className="rounded-3xl border border-white/10 bg-primary-container/10 p-8 backdrop-blur-xl transition-all hover:bg-primary-container/20">
                                <h3 className="mb-6 font-heading text-3xl tracking-wider text-white">
                                    SOCIAL
                                </h3>
                                <div className="flex gap-6">
                                    <button className="rounded-full bg-white/5 p-4 text-white/70 transition-all hover:bg-white/10 hover:text-primary active:scale-95">
                                        <Share2 className="h-6 w-6" />
                                    </button>
                                    <button className="rounded-full bg-white/5 p-4 text-white/70 transition-all hover:bg-white/10 hover:text-primary active:scale-95">
                                        <Globe className="h-6 w-6" />
                                    </button>
                                    <button className="rounded-full bg-white/5 p-4 text-white/70 transition-all hover:bg-white/10 hover:text-primary active:scale-95">
                                        <MessageSquare className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/40 px-6 py-12 backdrop-blur-lg">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
                    <Link href={route('home')} className="cursor-pointer">
                        <div className="mb-2 text-xl font-bold text-white">
                            Slotem
                        </div>
                        <p className="text-sm text-white/50">
                            © 2024 Slotem Booking Systems. All rights reserved.
                        </p>
                    </Link>

                    <div className="flex flex-wrap justify-center gap-8">
                        <Link
                            href={route('privacy-policy')}
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href={route('terms-of-service')}
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href={route('help-center')}
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Help Center
                        </Link>
                        <Link
                            href={route('contact-sales')}
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
