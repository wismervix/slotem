import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    ShieldCheck,
    Zap,
    ListTodo,
} from 'lucide-react';
import GuestLayout from '@/layouts/Guest/GuestLayout';

// interface Props {
//     auth: any; // Laravel's default prop
//     laravelVersion: string;
//     phpVersion: string;
// }

// const Home = ({ auth, laravelVersion, phpVersion }: Props) => {
const Home = () => {
    return (
        <GuestLayout>
            <Head title="Welcome" />

            <main className="pt-24">
                {/* Hero */}
                <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-32">
                    <div className="flex flex-col gap-8">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                            <ShieldCheck className="h-4 w-4" />

                            <span className="text-sm font-medium">
                                Simplified Scheduling
                            </span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="max-w-2xl text-5xl font-black tracking-tight text-slate-900 md:text-6xl dark:text-white">
                                Simple Booking for Your Small Business
                            </h1>

                            <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                                Streamline your appointments with an elegant
                                interface designed for efficiency. Focus on your
                                craft while Slotem handles the logistics of your
                                calendar.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button className="rounded-2xl bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-purple-500/20 transition hover:bg-purple-500">
                                Book Now
                            </button>

                            <button className="rounded-2xl border border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
                                View Pricing
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-purple-200 text-xs font-bold text-purple-800 dark:border-slate-900">
                                    JD
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-pink-200 text-xs font-bold text-pink-800 dark:border-slate-900">
                                    AS
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-amber-200 text-xs font-bold text-amber-800 dark:border-slate-900">
                                    MK
                                </div>
                            </div>

                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Trusted by 2,000+ business owners
                            </span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-3xl"></div>

                        <div className="relative aspect-square overflow-hidden rounded-full border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                            <img
                                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop"
                                alt="Studio"
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent"></div>
                        </div>

                        {/* Floating Card */}
                        <div className="absolute top-1/2 right-0 hidden max-w-xs -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:block dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex flex-col gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                                    <Calendar className="h-6 w-6" />
                                </div>

                                <h3 className="text-lg font-bold">Next Slot</h3>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Today at 2:00 PM available for booking.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-slate-100 py-24 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl font-bold">How it Works</h2>

                            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                                Three simple steps to secure your next
                                appointment.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Step 1 */}
                            <div className="relative rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-800">
                                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                                    1
                                </div>

                                <ListTodo className="mt-4 mb-6 h-10 w-10 text-purple-600" />

                                <h3 className="mb-3 text-xl font-bold">
                                    Choose Service
                                </h3>

                                <p className="text-slate-600 dark:text-slate-400">
                                    Browse our curated list of professional
                                    services and select the perfect one.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-800">
                                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                                    2
                                </div>

                                <Calendar className="mt-4 mb-6 h-10 w-10 text-purple-600" />

                                <h3 className="mb-3 text-xl font-bold">
                                    Pick a Time
                                </h3>

                                <p className="text-slate-600 dark:text-slate-400">
                                    Choose a booking slot from our real-time
                                    availability calendar.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-800">
                                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                                    3
                                </div>

                                <CheckCircle2 className="mt-4 mb-6 h-10 w-10 text-purple-600" />

                                <h3 className="mb-3 text-xl font-bold">
                                    Confirm
                                </h3>

                                <p className="text-slate-600 dark:text-slate-400">
                                    Receive instant confirmation and reminders
                                    automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto max-w-7xl px-6 py-24">
                    <div className="grid auto-rows-[220px] grid-cols-1 gap-6 md:grid-cols-12">
                        {/* Big Card */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-purple-600 p-10 text-white md:col-span-8">
                            <div className="absolute top-8 right-8 opacity-10">
                                <Zap className="h-32 w-32" />
                            </div>

                            <div className="relative z-10 flex h-full flex-col justify-end">
                                <h3 className="mb-4 text-4xl font-black">
                                    Lightning Fast Booking
                                </h3>

                                <p className="max-w-xl text-lg text-purple-100">
                                    Our optimized flow reduces booking time by
                                    60% compared to traditional calls.
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-100 p-8 text-center md:col-span-4 dark:bg-slate-800">
                            <span className="text-5xl font-black text-purple-600">
                                99.9%
                            </span>

                            <span className="mt-3 text-sm tracking-[0.3em] text-slate-500 uppercase">
                                Uptime Guaranteed
                            </span>
                        </div>

                        {/* Secure */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:col-span-4 dark:border-slate-700 dark:bg-slate-800">
                            <ShieldCheck className="mb-4 h-10 w-10 text-purple-600" />

                            <h3 className="mb-3 text-2xl font-bold">
                                Secure Payments
                            </h3>

                            <p className="text-slate-600 dark:text-slate-400">
                                Industry-standard encryption for every
                                transaction.
                            </p>
                        </div>

                        {/* Testimonial */}
                        <div className="flex items-center gap-8 rounded-3xl bg-purple-100 p-8 md:col-span-8 dark:bg-purple-500/10">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
                                alt="Business Owner"
                                className="hidden h-32 w-32 rounded-full object-cover sm:block"
                            />

                            <div>
                                <p className="mb-4 text-lg text-slate-700 italic dark:text-slate-300">
                                    "Slotem has completely changed how I manage
                                    my salon. I save 5 hours every week on admin
                                    work alone."
                                </p>

                                <p className="font-semibold">
                                    — Sarah Jenkins, Founder of Glow Studio
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-7xl px-6 pb-24">
                    <div className="relative overflow-hidden rounded-[3rem] bg-purple-600 px-8 py-20 text-center text-white md:px-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]"></div>

                        <div className="relative z-10 mx-auto max-w-3xl">
                            <h2 className="text-5xl font-black tracking-tight">
                                Ready to automate your appointment scheduling?
                            </h2>

                            <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-100">
                                Join thousands of small businesses that trust
                                Slotem for their daily operations.
                            </p>

                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                <button className="rounded-2xl bg-white px-10 py-4 text-lg font-semibold text-purple-600 transition hover:bg-slate-100">
                                    Get Started for Free
                                </button>

                                <button className="rounded-2xl border border-white/30 px-10 py-4 text-lg font-semibold text-white transition hover:bg-white/10">
                                    Talk to Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
};

export default Home;
