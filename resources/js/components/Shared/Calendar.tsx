import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    formatDate,
    generateCalendarDays,
    isPastDate,
} from '@/lib/calendar-utils';
import type { Availability } from '@/types/availability';

interface CalendarProps {
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
    availabilities: Availability[];
}

export function Calendar({
    selectedDate,
    onSelectDate,
    availabilities,
}: CalendarProps) {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    const calendarDays = useMemo(() => {
        return generateCalendarDays(currentMonth, currentYear);
    }, [currentMonth, currentYear]);

    function goToPreviousMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        } else {
            setCurrentMonth((prev) => prev - 1);
        }
    }

    function goToNextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
    }

    function monthLabel() {
        return new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        });
    }

    const isCurrentMonth =
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-slate-900 dark:shadow-lg dark:shadow-white/10">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {monthLabel()}
                </h2>

                <div className="flex space-x-2">
                    <button
                        disabled={isCurrentMonth}
                        onClick={goToPreviousMonth}
                        className={`rounded-full p-2 transition-colors ${
                            isCurrentMonth
                                ? 'cursor-default opacity-30'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        <ChevronLeft
                            size={20}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>

                    <button
                        onClick={goToNextMonth}
                        className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ChevronRight
                            size={20}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
                {days.map((day) => (
                    <div
                        key={day}
                        className="py-2 text-xs font-bold text-gray-400"
                    >
                        {day}
                    </div>
                ))}

                {calendarDays.map(({ date, currentMonth }, idx) => {
                    const formatted = formatDate(date);

                    const available = availabilities.some(
                        (a) =>
                            a.date === formatted &&
                            a.time_slots.some((slot) => !slot.is_booked),
                    );

                    const disabled = isPastDate(date) || !available;

                    const selected = selectedDate === formatted;

                    return (
                        <button
                            key={idx}
                            disabled={disabled}
                            onClick={() => onSelectDate(formatted)}
                            className={`relative rounded-xl py-4 font-medium transition-all duration-200 ${
                                selected
                                    ? 'bg-purple-600 font-bold text-white shadow-lg shadow-purple-200'
                                    : disabled
                                      ? 'cursor-default text-gray-300 opacity-40 dark:text-gray-700'
                                      : currentMonth
                                        ? 'text-gray-700 hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                        : 'text-gray-500 hover:bg-purple-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                        >
                            {date.getDate()}

                            {available && !selected && (
                                <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-purple-600" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row sm:items-center">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-purple-600" />

                        <span className="text-xs font-medium text-gray-500">
                            Selected
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full border border-purple-100 bg-purple-50" />

                        <span className="text-xs font-medium text-gray-500">
                            Available
                        </span>
                    </div>
                </div>

                <span className="text-xs font-medium text-gray-400">
                    {/* Timezone: Europe/London (GMT) */}
                    Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </span>
            </div>
        </div>
    );
}
