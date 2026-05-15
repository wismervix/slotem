import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { Calendar } from '@/components/Shared/Calendar';
import { HostCard } from '@/components/Shared/HostCard';
import { Stepper } from '@/components/Shared/Stepper';
import { TimeSlotPicker } from '@/components/Shared/TimeSlotPicker';

import { INITIAL_AVAILABILITY } from '@/data/availability';
import { INITIAL_TIME_SLOTS } from '@/data/time-slots';

import GuestLayout from '@/layouts/Guest/GuestLayout';

import { getSlotsForDate } from '@/lib/availability-utils';

import type { TimeSlot } from '@/types';

export default function App() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    const availableSlots = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        return getSlotsForDate(
            INITIAL_AVAILABILITY,
            INITIAL_TIME_SLOTS,
            selectedDate,
        );
    }, [selectedDate]);

    function handleSelectDate(date: string) {
        setSelectedDate(date);
        setSelectedSlot(null);
    }

    return (
        <GuestLayout>
            <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-24 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-10"
                >
                    <div className="pb-4">
                        <Stepper currentStep={2} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Choose your slot
                        </h1>

                        <p className="text-sm font-medium text-gray-500 dark:text-slate-200">
                            Selected Service:{' '}
                            <span className="font-bold text-purple-600">
                                Strategic Consulting Session (60m)
                            </span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <Calendar
                                selectedDate={selectedDate}
                                onSelectDate={handleSelectDate}
                            />
                        </div>

                        <div className="space-y-6 lg:col-span-5">
                            <TimeSlotPicker
                                selectedDate={selectedDate}
                                slots={availableSlots}
                                selectedSlot={selectedSlot}
                                onSelectSlot={setSelectedSlot}
                            />

                            <HostCard />
                        </div>
                    </div>
                </motion.div>
            </main>
        </GuestLayout>
    );
}
