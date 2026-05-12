import { motion } from 'motion/react';
import { Calendar } from '@/components/Shared/Calendar';
import { HostCard } from '@/components/Shared/HostCard';
import { Stepper } from '@/components/Shared/Stepper';
import { TimeSlotPicker } from '@/components/Shared/TimeSlotPicker';
import GuestLayout from '@/layouts/Guest/GuestLayout';

export default function App() {
    return (
        <GuestLayout>
            <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-24 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-10"
                >
                    {/* Stepper Section */}
                    <div className="pb-4" id="stepper-section">
                        <Stepper currentStep={2} />
                    </div>

                    {/* Heading Section */}
                    <div className="space-y-2" id="page-header">
                        <h1
                            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
                            id="main-heading"
                        >
                            Choose your slot
                        </h1>
                        <p
                            className="text-sm font-medium text-gray-500 dark:text-slate-200"
                            id="selected-service-info"
                        >
                            Selected Service:{' '}
                            <span className="font-bold text-purple-600">
                                Strategic Consulting Session (60m)
                            </span>
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* Left Column: Calendar */}
                        <div className="lg:col-span-7" id="calendar-column">
                            <Calendar />
                        </div>

                        {/* Right Column: Slots & Host */}
                        <div
                            className="space-y-6 lg:col-span-5"
                            id="slots-column"
                        >
                            <TimeSlotPicker />
                            <HostCard />
                        </div>
                    </div>
                </motion.div>
            </main>
        </GuestLayout>
    );
}
