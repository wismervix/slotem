import { Link } from '@inertiajs/react';
import { Mail, Share2, Globe, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactUs() {
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
        <div className="selection:bg-primary/30 flex min-h-screen flex-col">
            {/* Background with Overlay */}
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')`,
                }}
            >
                <div className="bg-primary/20 absolute inset-0 backdrop-blur-[2px] backdrop-brightness-75" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-transparent backdrop-blur-md">
                <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link
                        href={route('home')}
                        className="cursor-pointer text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
                    >
                        Slotem
                    </Link>

                    <div className="hidden items-center space-x-8 md:flex">
                        <a
                            href="/#how-it-works"
                            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                        >
                            How It Works
                        </a>

                        <Link
                            href={route('services')}
                            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                        >
                            Services
                        </Link>

                        <Link
                            href={route('contact-us')}
                            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                        >
                            Contact Us
                        </Link>

                        <Link
                            href={route('admin.dashboard')}
                            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                        >
                            Admin
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('login')}
                            className="px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                        >
                            Login
                        </Link>

                        <Link
                            href={route('services')}
                            className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] hover:bg-purple-500"
                        >
                            Book Now
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex flex-grow items-center justify-center px-6 py-20">
                <motion.div
                    className="w-full max-w-5xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <motion.h1
                            className="font-heading mb-4 text-6xl tracking-widest text-white drop-shadow-2xl md:text-8xl"
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
                            <div className="from-primary/30 absolute -inset-1 bg-gradient-to-r to-purple-500/30 opacity-50 blur-2xl transition duration-1000 group-hover:opacity-100" />

                            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                className="focus:border-primary-container w-full border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all placeholder:text-white/40 focus:bg-white/10"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                className="focus:border-primary-container w-full border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all placeholder:text-white/40 focus:bg-white/10"
                                            />
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="focus:border-primary-container w-full border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all placeholder:text-white/40 focus:bg-white/10"
                                    />

                                    <textarea
                                        placeholder="Message"
                                        rows={4}
                                        className="focus:border-primary-container w-full resize-none border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all placeholder:text-white/40 focus:bg-white/10"
                                    />

                                    <button className="bg-primary-container font-heading hover:bg-primary shadow-primary/30 w-full rounded-xl py-4 text-3xl tracking-widest text-white shadow-xl transition-all active:scale-[0.98]">
                                        SEND INQUIRY
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
                                <h3 className="font-heading mb-6 text-3xl tracking-wider text-white">
                                    DIRECT
                                </h3>
                                <div className="group flex cursor-pointer items-center gap-4 text-white/80 transition-colors hover:text-white">
                                    <div className="group-hover:bg-primary/20 rounded-full bg-white/5 p-3 transition-all">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <span className="text-lg">
                                        support@slotem.com
                                    </span>
                                </div>
                            </div>

                            {/* Social Card */}
                            <div className="bg-primary-container/10 hover:bg-primary-container/20 rounded-3xl border border-white/10 p-8 backdrop-blur-xl transition-all">
                                <h3 className="font-heading mb-6 text-3xl tracking-wider text-white">
                                    SOCIAL
                                </h3>
                                <div className="flex gap-6">
                                    <button className="hover:text-primary rounded-full bg-white/5 p-4 text-white/70 transition-all hover:bg-white/10">
                                        <Share2 className="h-6 w-6" />
                                    </button>
                                    <button className="hover:text-primary rounded-full bg-white/5 p-4 text-white/70 transition-all hover:bg-white/10">
                                        <Globe className="h-6 w-6" />
                                    </button>
                                    <button className="hover:text-primary rounded-full bg-white/5 p-4 text-white/70 transition-all hover:bg-white/10">
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
                    <div>
                        <div className="mb-2 text-xl font-bold text-white">
                            Slotem
                        </div>
                        <p className="text-sm text-white/50">
                            © 2024 Slotem Booking Systems. All rights reserved.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <a
                            href="#"
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Help Center
                        </a>
                        <a
                            href="#"
                            className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
