import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { Calendar } from '@/components/Shared/Calendar';
import { HostCard } from '@/components/Shared/HostCard';
import { Stepper } from '@/components/Shared/Stepper';
import { TimeSlotPicker } from '@/components/Shared/TimeSlotPicker';
import GuestLayout from '@/layouts/Guest/GuestLayout';
import type { Availability, TimeSlot } from '@/types';

interface DateAndTimeProps {
    availabilities: Availability[];
}

export default function DateAndTime({ availabilities }: DateAndTimeProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    const availableSlots = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        const availability = availabilities.find(
            (a) => a.date === selectedDate,
        );

        if (!availability) {
            return [];
        }

        // return availability.time_slots.filter((slot) => !slot.is_booked);
        return availability.time_slots;
    }, [selectedDate, availabilities]);

    function handleSelectDate(date: string) {
        setSelectedDate(date);
        setSelectedSlot(null);
    }

    // console.log(
    //     'Availabilities (with time slots) from backend: ',
    //     availabilities,
    // );

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
                                availabilities={availabilities}
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
