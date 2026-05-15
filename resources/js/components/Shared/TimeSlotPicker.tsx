import { Link } from '@inertiajs/react';
import { Info } from 'lucide-react';

import type { TimeSlot } from '@/types';

interface TimeSlotPickerProps {
    selectedDate: string | null;

    slots: TimeSlot[];

    selectedSlot: TimeSlot | null;

    onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({
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
                    {slots.length} slots available
                </p>
            </div>

            <div className="grid flex-grow grid-cols-2 gap-4">
                {slots.map((slot) => {
                    const selected =
                        selectedSlot?.start_time === slot.start_time;

                    return (
                        <button
                            key={slot.start_time}
                            onClick={() => onSelectSlot(slot)}
                            className={`rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                selected
                                    ? 'border-purple-600 bg-purple-600 text-white shadow-md ring-2 ring-purple-600/10'
                                    : 'border-gray-200 bg-white text-gray-700 shadow-sm hover:border-purple-600 hover:text-purple-600 dark:border-purple-300'
                            }`}
                        >
                            {formatTime(slot.start_time)} -{' '}
                            {formatTime(slot.end_time)}
                        </button>
                    );
                })}
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
                    <Link
                        href={route('booking.create')}
                        className="flex-[2] transform rounded-full bg-purple-600 px-6 py-4 text-center text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 active:scale-[0.98]"
                        id="next-step-btn"
                    >
                        Next Step
                    </Link>
                </div>
            </div>
        </div>
    );
}
