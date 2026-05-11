import {
    ArrowLeft,
    Scissors,
    Calendar,
    Clock,
    Info,
    CheckCircle,
    ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Footer from '@/components/Admin/Footer';

// Sub-components for better organization
const Header = () => (
    <header className="mx-auto mb-8 flex w-full max-w-7xl items-center justify-between border-b border-outline-variant bg-white px-6 py-4 md:px-12">
        <div className="flex items-center gap-4">
            <button
                className="rounded-full p-2 transition-colors hover:bg-surface-container"
                aria-label="Go back"
            >
                <ArrowLeft className="h-5 w-5 text-primary" />
            </button>
            <span className="text-2xl font-bold tracking-tight text-primary">
                Slotem
            </span>
        </div>
        <div className="hidden gap-4 md:flex">
            <span className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase opacity-60">
                Step 3 of 3
            </span>
        </div>
    </header>
);

const Create = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsBooked(true);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex flex-grow items-center justify-center overflow-hidden px-6 py-8">
                <div className="grid w-full max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-12">
                    {/* Left Column: Form */}
                    <section className="rounded-2xl border border-outline-variant bg-white p-8 shadow-sm md:col-span-7">
                        <div className="mb-8">
                            <h1 className="mb-2 text-3xl font-bold tracking-tight text-on-surface">
                                Almost there
                            </h1>
                            <p className="text-base text-on-surface-variant">
                                Please provide your contact details to finalize
                                the booking.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleConfirm}>
                            <div>
                                <label
                                    className="mb-2 block text-xs font-medium tracking-wider text-on-surface-variant uppercase"
                                    htmlFor="full_name"
                                >
                                    Full Name
                                </label>
                                <input
                                    className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-on-surface transition-all placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    id="full_name"
                                    placeholder="Enter your full name"
                                    type="text"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-xs font-medium tracking-wider text-on-surface-variant uppercase"
                                    htmlFor="phone_number"
                                >
                                    Phone Number
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative w-24">
                                        <select className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-white px-4 py-3 text-on-surface transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
                                            <option>+1</option>
                                            <option>+44</option>
                                            <option>+61</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                                    </div>
                                    <input
                                        className="flex-grow rounded-lg border border-outline-variant bg-white px-4 py-3 text-on-surface transition-all placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                        id="phone_number"
                                        placeholder="(555) 000-0000"
                                        type="tel"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-xl bg-surface-container p-4">
                                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <p className="text-xs leading-relaxed text-on-surface-variant">
                                    A confirmation SMS will be sent to this
                                    number 15 minutes before your appointment
                                    starts.
                                </p>
                            </div>

                            <button
                                className="hover:bg-primary-hover flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Confirming...'
                                    : 'Confirm Booking'}
                                {!isSubmitting && (
                                    <CheckCircle className="h-5 w-5" />
                                )}
                            </button>
                        </form>
                    </section>

                    {/* Right Column: Sidebar */}
                    <aside className="flex flex-col gap-4 md:col-span-5">
                        <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container/50 p-6 backdrop-blur-sm">
                            <div className="absolute -top-4 -right-4 opacity-[0.03]">
                                <Calendar className="h-48 w-48 rotate-12" />
                            </div>

                            <h3 className="mb-8 text-lg font-bold tracking-tight text-primary">
                                Booking Summary
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                        <Scissors className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                            Service
                                        </p>
                                        <p className="text-base leading-tight font-semibold">
                                            Premium Haircut & Styling
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                            Date
                                        </p>
                                        <p className="text-base leading-tight font-semibold">
                                            Tuesday, Oct 24, 2024
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                            Time
                                        </p>
                                        <p className="text-base leading-tight font-semibold">
                                            10:30 AM — 11:15 AM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-between border-t border-outline-variant px-1 pt-6">
                                <span className="text-sm font-medium text-on-surface-variant">
                                    Total Duration
                                </span>
                                <span className="text-sm font-bold text-on-surface">
                                    45 Minutes
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container/30 p-4">
                            <div className="relative">
                                <img
                                    className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMfYV4KrqpvAuHuOtgjAqlZnRDfy5DWqpZYcHyWUkktOfwI4970Sx5WvHtqmBAEBKf8FYKk7x7pNmcDuhnSdDKinM4S3SvQbQ6nU7wzz1IN5HMbSimpGgnMRzjjm7N0x4TGguAjoH64B04jaRrz7PLIgaxboFBNuP_1uoi0VkYiwMnEIJE5IjuowNAkGbCP7IdGDf419FNveBSyQpp-9ngOJ7H38rHFrttfcESGndR6P9bL9_fke4CKXxXluuTro1hxZnpS-ZPd8o"
                                    alt="Jordan Henderson"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            <div>
                                <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                    Your Stylist
                                </p>
                                <p className="text-base font-bold text-primary">
                                    Jordan Henderson
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />

            {/* Success Overlay */}
            <AnimatePresence>
                {isBooked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-md"
                        >
                            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/30">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>

                            <h1 className="mb-3 text-4xl font-bold tracking-tight text-on-surface">
                                Booking Confirmed!
                            </h1>
                            <p className="mb-10 text-lg leading-relaxed text-on-surface-variant">
                                We've sent the confirmation details to your
                                phone. See you soon!
                            </p>

                            <div className="mb-10 rounded-2xl border border-outline-variant bg-surface-container p-8 text-left shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                                        Booking ID
                                    </span>
                                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-primary">
                                        #SLT-88219
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-on-surface">
                                        <Scissors className="h-5 w-5 text-primary opacity-70" />
                                        <span className="font-semibold">
                                            Premium Haircut
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-on-surface">
                                        <Calendar className="h-5 w-5 text-primary opacity-70" />
                                        <span className="font-semibold">
                                            Tuesday, Oct 24 • 10:30 AM
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button className="hover:bg-primary-hover w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all">
                                    Add to Calendar
                                </button>
                                <button
                                    onClick={() => setIsBooked(false)}
                                    className="w-full rounded-xl border-2 border-primary py-4 text-lg font-bold text-primary transition-all hover:bg-primary/5"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Create;
