import React from 'react';
import { Appointment } from '@/types';
import {
    Smile,
    Sparkles,
    Activity,
    Clock,
    ShieldAlert,
    Heart,
} from 'lucide-react';

interface CalendarViewProps {
    appointments: Appointment[];
    selectedDate: string; // YYYY-MM-DD
    searchQuery: string;
    onSelectDate: (date: string) => void;
    onOpenBookingModal: () => void;
}

export default function CalendarView({
    appointments,
    selectedDate,
    searchQuery,
    onSelectDate,
    onOpenBookingModal,
}: CalendarViewProps) {
    // October 2023 Helper Info:
    // Starts on Sunday (Oct 1). Has 31 days.
    // We can build an elegant list of days.
    const year = 2023;
    const month = 9; // October (0-indexed in Date is 9, but let's draw strictly)

    // Array of days for our grid. October 2023 starts exactly on Sunday 1st.
    // There are 31 days.
    // To keep the grid layout correct, let's list them:
    // Week 1: 1, 2, 3, 4, 5, 6, 7
    // Week 2: 8, 9, 10, 11, 12, 13, 14
    // Week 3: 15, 16, 17, 18, 19, 20, 21
    // Week 4: 22, 23, 24, 25, 26 (Today), 27, 28
    // Week 5: 29, 30, 31, and next month bleed 1, 2, 3, 4
    const daysInOctober = 31;
    const nextMonthBleed = 4; // 1, 2, 3, 4 Nov

    const getDayFormattedStr = (dayNum: number) => {
        return `2023-10-${dayNum.toString().padStart(2, '0')}`;
    };

    const getCategoryTheme = (category: string) => {
        switch (category) {
            case 'dental':
                return 'bg-primary-container text-on-primary-container border-l-4 border-primary';
            case 'wellness':
                return 'bg-tertiary-fixed text-on-tertiary-fixed border-l-4 border-tertiary';
            case 'general':
                return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-l-4 border-blue-600';
            default:
                return 'bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 border-l-4 border-purple-600';
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-xs transition-colors hover:border-primary/30 dark:bg-neutral-900">
            {/* Weekdays Labels */}
            <div className="grid grid-cols-7 border-b border-outline-variant bg-gray-50/50 dark:bg-neutral-800/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                        <div
                            key={day}
                            className="border-r border-outline-variant py-3 text-center text-xs font-bold tracking-widest text-secondary uppercase last:border-r-0"
                        >
                            {day}
                        </div>
                    ),
                )}
            </div>

            {/* Days Interactive Grid */}
            <div
                className="grid grid-flow-row grid-cols-7"
                style={{ gridAutoRows: 'minmax(115px, auto)' }}
            >
                {/* Render 1 to 31 days */}
                {Array.from({ length: daysInOctober }).map((_, index) => {
                    const dayNum = index + 1;
                    const formattedDate = getDayFormattedStr(dayNum);

                    // Check if today: October 26, 2023
                    const isToday = dayNum === 26;

                    // Check if selected
                    const isSelected = selectedDate === formattedDate;

                    // Find active appointments on this day (non-cancelled) and match search query
                    const rawDayAppts = appointments.filter(
                        (a) =>
                            a.date === formattedDate &&
                            a.status !== 'Cancelled',
                    );
                    const dayAppts = rawDayAppts.filter(
                        (a) =>
                            a.title
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            a.provider
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                    );

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
                                        26
                                    </span>
                                ) : (
                                    <span
                                        className={`text-xs font-bold ${dayAppts.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                                    >
                                        {dayNum}
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
                                {dayAppts.slice(0, 2).map((appt) => (
                                    <div
                                        key={appt.id}
                                        title={`${appt.title} at ${appt.provider}`}
                                        className={`truncate rounded-lg border-l-4 p-1.5 font-sans text-[10px] leading-normal shadow-xs ${getCategoryTheme(appt.category)}`}
                                    >
                                        <p className="truncate leading-tight font-extrabold">
                                            {appt.title}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-0.5 font-mono text-[9px] leading-none opacity-80">
                                            <Clock className="inline h-2.5 w-2.5" />{' '}
                                            {appt.time}
                                        </p>
                                    </div>
                                ))}

                                {/* Overflows indicator */}
                                {dayAppts.length > 2 && (
                                    <p className="block pl-1 text-[9px] font-bold text-primary dark:text-primary-fixed">
                                        + {dayAppts.length - 2} more slots
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Bleed next month days (November 1 to 4) matches the visual mockup exactly */}
                {Array.from({ length: nextMonthBleed }).map((_, index) => {
                    const nextDayNum = index + 1;
                    return (
                        <div
                            key={`bleed-${nextDayNum}`}
                            className="flex flex-col justify-between border-r border-b border-outline-variant bg-gray-50/30 p-3.5 opacity-40 select-none dark:bg-neutral-900/30"
                        >
                            <div className="flex items-start justify-between">
                                <span className="text-xs font-bold text-gray-400">
                                    {nextDayNum}
                                </span>
                                <span className="text-[8px] font-extrabold tracking-widest text-gray-300 uppercase">
                                    Nov
                                </span>
                            </div>
                            <div />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
