import { Head } from '@inertiajs/react';
import {
    Calendar,
    Bell,
    CheckCircle2,
    Scissors,
    Sparkles,
    ShieldCheck,
    Paintbrush,
    UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ServiceCard } from '@/components/Shared/ServiceCard';
import { Stepper } from '@/components/Shared/Stepper';
import { services } from '@/data/services';
import GuestLayout from '@/layouts/Guest/GuestLayout';

export type IconName = keyof typeof icons;

const icons = {
    Scissors,
    UserCheck,
    Sparkles,
    Paintbrush,
    ShieldCheck,
} as const;

const Services = () => {
    return (
        <GuestLayout>
            <Head title="Services" />

            <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-10"
                >
                    {/* Stepper Section */}
                    <div className="mx-auto pb-4" id="stepper-section">
                        <Stepper currentStep={1} />
                    </div>

                    {/* Hero */}
                    <section className="mb-12">
                        <h1 className="mb-4 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                            Choose your service
                        </h1>

                        <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                            Select from our range of premium grooming services.
                            Our specialists are dedicated to providing you with
                            the most efficient and relaxing experience.
                        </p>
                    </section>

                    {/* Services Grid */}
                    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => {
                            const Icon =
                                icons[service.icon as keyof typeof icons];

                            return (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    Icon={Icon}
                                />
                            );
                        })}
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
                                        Your booking is confirmed immediately
                                        after selection.
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
                                        Plans change? Move your appointment with
                                        one click.
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
                                        Receive SMS and email reminders before
                                        your appointment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </main>
        </GuestLayout>
    );
};

export default Services;
