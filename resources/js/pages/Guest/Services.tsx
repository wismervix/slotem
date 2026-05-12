import { Head } from '@inertiajs/react';
import {
    Calendar,
    Bell,
    Clock3,
    CheckCircle2,
    Scissors,
    Sparkles,
    ShieldCheck,
    Paintbrush,
    UserCheck,
} from 'lucide-react';
import GuestLayout from '@/layouts/Guest/GuestLayout';

const Home = () => {
    return (
        <GuestLayout>
            <Head title="Services" />

            <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 pt-24">
                {/* Progress Stepper */}
                <div className="mb-16 flex justify-center">
                    <div className="flex w-full max-w-2xl items-center">
                        {/* Step 1 */}
                        <div className="flex flex-1 flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white ring-4 ring-purple-200">
                                1
                            </div>

                            <span className="mt-2 text-sm font-semibold text-purple-600">
                                Service
                            </span>
                        </div>

                        <div className="h-[2px] flex-[2] bg-slate-300"></div>

                        {/* Step 2 */}
                        <div className="flex flex-1 flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500 dark:bg-slate-800">
                                2
                            </div>

                            <span className="mt-2 text-sm text-slate-500">
                                DateTime
                            </span>
                        </div>

                        <div className="h-[2px] flex-[2] bg-slate-300"></div>

                        {/* Step 3 */}
                        <div className="flex flex-1 flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500 dark:bg-slate-800">
                                3
                            </div>

                            <span className="mt-2 text-sm text-slate-500">
                                Details
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hero */}
                <section className="mb-12">
                    <h1 className="mb-4 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        Choose your service
                    </h1>

                    <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Select from our range of premium grooming services. Our
                        specialists are dedicated to providing you with the most
                        efficient and relaxing experience.
                    </p>
                </section>

                {/* Services Grid */}
                <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1 */}
                    <div className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-900">
                        <div className="absolute top-6 right-6 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                            Popular
                        </div>

                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                            <Scissors className="h-7 w-7" />
                        </div>

                        <h3 className="mb-2 text-2xl font-bold">
                            Signature Haircut
                        </h3>

                        <p className="mb-8 flex-grow text-slate-600 dark:text-slate-400">
                            Our most requested service. Includes consultation,
                            precision cut, scalp massage, and styling.
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                            <div>
                                <span className="text-3xl font-black text-purple-600">
                                    $45
                                </span>

                                <span className="ml-2 text-sm text-slate-500">
                                    / 45 min
                                </span>
                            </div>

                            <button className="rounded-xl bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-500">
                                Select
                            </button>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                            <UserCheck className="h-7 w-7" />
                        </div>

                        <h3 className="mb-2 text-2xl font-bold">
                            Beard Trim & Sculpt
                        </h3>

                        <p className="mb-8 flex-grow text-slate-600 dark:text-slate-400">
                            A meticulous trim and shape-up using clippers and
                            shears. Finished with organic beard oil.
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                            <div>
                                <span className="text-3xl font-black text-purple-600">
                                    $25
                                </span>

                                <span className="ml-2 text-sm text-slate-500">
                                    / 20 min
                                </span>
                            </div>

                            <button className="rounded-xl bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-500">
                                Select
                            </button>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                            <Sparkles className="h-7 w-7" />
                        </div>

                        <h3 className="mb-2 text-2xl font-bold">
                            Classic Hot Towel Shave
                        </h3>

                        <p className="mb-8 flex-grow text-slate-600 dark:text-slate-400">
                            Traditional straight razor shave with hot towels and
                            premium pre-shave treatment.
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                            <div>
                                <span className="text-3xl font-black text-purple-600">
                                    $35
                                </span>

                                <span className="ml-2 text-sm text-slate-500">
                                    / 30 min
                                </span>
                            </div>

                            <button className="rounded-xl bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-500">
                                Select
                            </button>
                        </div>
                    </div>

                    {/* Deluxe Package */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 transition hover:border-purple-500 md:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex h-full flex-col md:flex-row">
                            <div className="md:w-1/3">
                                <img
                                    src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop"
                                    alt="Deluxe Package"
                                    className="h-64 w-full object-cover md:h-full"
                                />
                            </div>

                            <div className="flex flex-1 flex-col p-8">
                                <h3 className="mb-3 text-3xl font-black">
                                    The Deluxe Package
                                </h3>

                                <p className="mb-6 text-slate-600 dark:text-slate-400">
                                    Our ultimate experience combining the
                                    Signature Haircut, Beard Trim, and Charcoal
                                    Facial Mask.
                                </p>

                                <div className="mb-8 flex flex-wrap gap-6 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Clock3 className="h-4 w-4" />

                                        <span>90 min</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />

                                        <span>Master Barber</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <div>
                                        <span className="text-4xl font-black text-purple-600">
                                            $85
                                        </span>

                                        <span className="ml-2 text-sm text-slate-500">
                                            All inclusive
                                        </span>
                                    </div>

                                    <button className="rounded-2xl bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-500">
                                        Book Package
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 5 */}
                    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                            <Paintbrush className="h-7 w-7" />
                        </div>

                        <h3 className="mb-2 text-2xl font-bold">
                            Hair Coloring
                        </h3>

                        <p className="mb-8 flex-grow text-slate-600 dark:text-slate-400">
                            Full color or grey coverage using premium dyes that
                            protect your hair's health.
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                            <div>
                                <span className="text-3xl font-black text-purple-600">
                                    $60
                                </span>

                                <span className="ml-2 text-sm text-slate-500">
                                    / 60 min
                                </span>
                            </div>

                            <button className="rounded-xl bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-500">
                                Select
                            </button>
                        </div>
                    </div>
                </section>

                {/* Info Section */}
                <section className="mt-20 border-t border-slate-200 pt-16 dark:border-slate-700">
                    <div className="grid gap-10 md:grid-cols-3">
                        {/* Item 1 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                                <CheckCircle2 className="h-7 w-7" />
                            </div>

                            <div>
                                <h4 className="mb-2 text-xl font-bold">
                                    Instant Confirmation
                                </h4>

                                <p className="text-slate-600 dark:text-slate-400">
                                    Your booking is confirmed immediately after
                                    selection.
                                </p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                                <Calendar className="h-7 w-7" />
                            </div>

                            <div>
                                <h4 className="mb-2 text-xl font-bold">
                                    Easy Rescheduling
                                </h4>

                                <p className="text-slate-600 dark:text-slate-400">
                                    Plans change? Move your appointment with one
                                    click.
                                </p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                                <Bell className="h-7 w-7" />
                            </div>

                            <div>
                                <h4 className="mb-2 text-xl font-bold">
                                    Smart Reminders
                                </h4>

                                <p className="text-slate-600 dark:text-slate-400">
                                    Receive SMS and email reminders before your
                                    appointment.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
};

export default Home;
