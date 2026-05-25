import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    formatDate,
    formatTime,
    generateCalendarDays,
    isPastDate,
} from '@/lib/calendar-utils';
import { Booking, Availability } from '@/types';
import {
    Smile,
    Sparkles,
    Activity,
    Clock,
    ShieldAlert,
    Heart,
} from 'lucide-react';
import { getServiceTheme } from '@/lib/service-icons';

interface CalendarViewProps {
    bookings: Booking[];
    availabilities: Availability[];
    selectedDate: string; // YYYY-MM-DD
    onSelectDate: (date: string) => void;
    searchQuery: string;
    onOpenBookingModal: () => void;
}

export default function CalendarView({
    bookings,
    availabilities,
    selectedDate,
    searchQuery,
    onSelectDate,
    onOpenBookingModal,
}: CalendarViewProps) {
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

    function truncate(text: string, maxLength: number) {
        return text.length > maxLength
            ? text.slice(0, maxLength) + '...'
            : text;
    }

    console.log('Bookings: ', bookings);

    return (
        <>
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

            <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-white shadow-xs transition-colors hover:border-primary/30 dark:bg-neutral-900">
                {/* Weekdays Labels */}
                <div className="grid min-w-[1100px] grid-cols-7 border-b border-outline-variant bg-gray-50/50 dark:bg-neutral-800/50">
                    {days.map((day) => (
                        <div
                            key={day}
                            className="border-r border-outline-variant py-3 text-center text-xs font-bold tracking-widest text-secondary uppercase last:border-r-0"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Interactive Grid */}
                <div
                    className="grid min-w-[1100px] grid-flow-row grid-cols-7"
                    style={{ gridAutoRows: 'minmax(115px, auto)' }}
                >
                    {/* Render 1 to 31 days */}
                    {/* {Array.from({ length: daysInOctober }).map((_, index) => { */}
                    {calendarDays.map(({ date, currentMonth }, idx) => {
                        const formattedDate = formatDate(date);

                        const isToday =
                            formatDate(new Date()) === formattedDate;

                        const isSelected = selectedDate === formattedDate;

                        const available = availabilities.some(
                            (a) =>
                                a.date === formattedDate &&
                                a.time_slots.some((slot) => !slot.is_booked),
                        );

                        const disabled = isPastDate(date) || !available;

                        // Find active appointments on this day (non-cancelled) and match search query
                        const activeBookings = bookings.filter((booking) => {
                            const bookingDate = booking.date.split('T')[0];

                            return (
                                bookingDate === formattedDate &&
                                booking.status !== 'cancelled' &&
                                booking.status !== 'rejected'
                            );
                        });

                        const dayBookings = activeBookings.filter((booking) => {
                            const query = searchQuery.toLowerCase();

                            const name =
                                booking.service?.name?.toLowerCase() ?? 'No name';
                            const description =
                                booking.service?.description?.toLowerCase() ??
                                'No description';

                            return (
                                name.includes(query) ||
                                description.includes(query)
                            );
                        });

                        return (
                            <div
                                key={formattedDate}
                                onClick={() => onSelectDate(formattedDate)}
                                onDoubleClick={() => {
                                    onSelectDate(formattedDate);
                                    onOpenBookingModal();
                                }}
                                className={`group relative flex cursor-pointer flex-col justify-between border-r border-b border-outline-variant p-3.5 transition-all hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 ${
                                    isToday
                                        ? 'z-10 bg-primary/5 ring-2 ring-primary ring-inset'
                                        : ''
                                } ${isSelected ? 'bg-neutral-100/70 dark:bg-neutral-800/70' : 'bg-white dark:bg-neutral-900'}`}
                            >
                                {/* Day Header details */}
                                <div className="mb-2 flex items-start justify-between">
                                    {isToday ? (
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                                            {date.getDate()}
                                        </span>
                                    ) : (
                                        <span
                                            className={`text-xs font-bold ${dayBookings.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                                        >
                                            {date.getDate()}
                                        </span>
                                    )}

                                    {isToday && (
                                        <span className="rounded-md bg-primary-container/20 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-primary uppercase">
                                            Today
                                        </span>
                                    )}

                                    {/* Micro Plus/Schedule trigger on hover for clean UX */}
                                    <span className="shrink-0 text-[10px] font-extrabold text-primary uppercase opacity-0 transition-opacity group-hover:opacity-100">
                                        + Book
                                    </span>
                                </div>

                                {/* Day badges (appointments) */}
                                <div className="mt-auto space-y-1">
                                    {dayBookings.slice(0, 2).map((booking) => (
                                        <div
                                            key={booking.id}
                                            title={`${booking.service?.name} • ${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`}
                                            className={`truncate rounded-lg border-l-4 p-1.5 font-sans text-[10px] leading-normal shadow-xs ${getServiceTheme(
                                                booking.service?.icon ?? '',
                                            )}`}
                                        >
                                            <p className="truncate leading-tight font-extrabold">
                                                {booking.service?.name}
                                            </p>

                                            {/* Service Description */}
                                            {booking.service?.description && (
                                                <p className="truncate text-[9px] opacity-75">
                                                    {truncate(
                                                        booking.service
                                                            .description,
                                                        24,
                                                    )}
                                                </p>
                                            )}
                                            <p className="mt-0.5 flex items-center gap-0.5 font-mono text-[9px] leading-none opacity-80">
                                                <Clock className="inline h-2.5 w-2.5" />{' '}
                                                {formatTime(booking.start_time)}{' '}
                                                                                                — {formatTime(booking.end_time)}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Overflows indicator */}
                                    {dayBookings.length > 2 && (
                                        <p className="block pl-1 text-[9px] font-bold text-primary dark:text-primary-fixed">
                                            + {dayBookings.length - 2} more
                                            slots
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
