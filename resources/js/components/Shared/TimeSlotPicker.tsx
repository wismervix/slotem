import { Link } from '@inertiajs/react';
import { Info } from 'lucide-react';

import type { Service, TimeSlot } from '@/types';

interface TimeSlotPickerProps {
    service: Service;

    selectedDate: string | null;

    slots: TimeSlot[];

    selectedSlot: TimeSlot | null;

    onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({
    service,
    selectedDate,
    slots,
    selectedSlot,
    onSelectSlot,
}: TimeSlotPickerProps) {
    function formatTime(time: string) {
        return new Date(`2026-01-01T${time}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    function formatSelectedDate(date: string) {
        const [year, month, day] = date.split('-').map(Number);

        return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    }

    const availableCount = slots.filter((s) => !s.is_booked).length;

    // console.log(
    //     "TimeSlot's Passed Service Prop: ",
    //     service,
    // );

    return (
        <div
            className="flex h-full flex-col rounded-2xl border border-purple-100 bg-purple-50/50 p-8 shadow-sm backdrop-blur-sm dark:border-purple-900/40 dark:bg-purple-950/20 dark:shadow-black/20"
            id="time-slot-container"
        >
            <div className="mb-6">
                <h2
                    className="text-xl font-bold text-gray-900 dark:text-white"
                    id="selected-date-title"
                >
                    {selectedDate
                        ? formatSelectedDate(selectedDate)
                        : 'Select a date'}
                </h2>
                <p
                    className="text-sm text-gray-500 dark:text-gray-300"
                    id="slots-count"
                >
                    {availableCount} slots available
                </p>
            </div>

            <div className="grid flex-grow grid-cols-2 gap-4">
                {slots.length === 0 ? (
                    <p className="col-span-2 text-center text-sm text-gray-400">
                        No available slots for this date. Please select another
                        date.
                    </p>
                ) : (
                    slots.map((slot) => {
                        const selected =
                            selectedSlot?.start_time === slot.start_time;

                        const isBooked = slot.is_booked;

                        return (
                            <button
                                key={slot.start_time}
                                disabled={isBooked}
                                onClick={() => onSelectSlot(slot)}
                                className={`rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                    isBooked
                                        ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through opacity-60 dark:bg-gray-800'
                                        : selected
                                          ? 'border-purple-600 bg-purple-600 text-white shadow-md ring-2 ring-purple-600/10'
                                          : 'border-gray-200 bg-white text-gray-700 shadow-sm hover:border-purple-600 hover:text-purple-600 dark:border-purple-300'
                                }`}
                            >
                                {formatTime(slot.start_time)} -{' '}
                                {formatTime(slot.end_time)}
                                {isBooked && (
                                    <span className="ml-2 text-xs">
                                        (Booked)
                                    </span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            <div className="mt-8 border-t border-purple-100 pt-8">
                {selectedDate && selectedSlot && (
                    <div className="mb-8 flex items-start space-x-3 rounded-xl border border-purple-600/5 bg-purple-600/10 p-4 dark:border-purple-600/20 dark:bg-purple-600/15">
                        <Info
                            size={18}
                            className="mt-0.5 shrink-0 text-purple-600"
                        />

                        <p className="text-xs leading-relaxed font-medium text-purple-600 dark:text-purple-600/90">
                            You are booking for{' '}
                            <span className="font-bold underline decoration-purple-600/30 dark:decoration-purple-600/50">
                                {formatSelectedDate(selectedDate)} at{' '}
                                {formatTime(selectedSlot.start_time)} -{' '}
                                {formatTime(selectedSlot.end_time)}
                            </span>
                            . You can change this later if needed.
                        </p>
                    </div>
                )}

                <div className="flex gap-4">
                    <Link
                        href={route('services')}
                        className="flex-1 rounded-full border border-gray-200 px-6 py-4 text-center text-sm font-bold text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        id="back-btn"
                    >
                        Back
                    </Link>
                    {selectedSlot ? (
                        <Link
                            href={route('booking.create', {
                                service: service.id,
                                date: selectedDate,
                                slot: selectedSlot?.id,
                            })}
                            id="next-step-btn"
                            className="flex-[2] transform rounded-full bg-purple-600 px-6 py-4 text-center text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 active:scale-[0.98]"
                        >
                            Next Step
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="flex-[2] cursor-default rounded-full bg-gray-300 px-6 py-4 text-sm font-bold text-white opacity-70"
                        >
                            Select a slot first
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
