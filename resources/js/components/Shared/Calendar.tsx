import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function Calendar() {
    const [selectedDay, setSelectedDay] = useState(14);
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    // Dummy data for November 2024
    const monthDays = [
        { day: 28, current: false },
        { day: 29, current: false },
        { day: 30, current: false },
        { day: 31, current: false },
        { day: 1, current: true },
        { day: 2, current: true },
        { day: 3, current: true },
        { day: 4, current: true },
        { day: 5, current: true },
        { day: 6, current: true },
        { day: 7, current: true },
        { day: 8, current: true },
        { day: 9, current: true },
        { day: 10, current: true },
        { day: 11, current: true },
        { day: 12, current: true, dot: true },
        { day: 13, current: true },
        { day: 14, current: true },
        { day: 15, current: true },
        { day: 16, current: true },
        { day: 17, current: true },
        { day: 18, current: true },
        { day: 19, current: true },
        { day: 20, current: true },
        { day: 21, current: true },
        { day: 22, current: true },
        { day: 23, current: true },
        { day: 24, current: true },
    ];

    return (
        <div
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-slate-900 dark:shadow-lg dark:shadow-white/10"
            id="calendar-container"
        >
            <div className="mb-8 flex items-center justify-between">
                <h2
                    className="text-xl font-bold text-gray-900 dark:text-gray-100"
                    id="current-month"
                >
                    November 2024
                </h2>
                <div className="flex space-x-2">
                    <button
                        className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        id="prev-month"
                    >
                        <ChevronLeft
                            size={20}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>
                    <button
                        className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        id="next-month"
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

                {monthDays.map((date, idx) => (
                    <button
                        key={idx}
                        onClick={() => date.current && setSelectedDay(date.day)}
                        className={`relative rounded-xl py-4 font-medium transition-all duration-200 ${
                            !date.current
                                ? 'cursor-default text-gray-300 dark:text-gray-700'
                                : date.day === selectedDay
                                  ? 'bg-purple-600 font-bold text-white shadow-lg shadow-purple-200'
                                  : 'text-gray-700 hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                        disabled={!date.current}
                        id={`calendar-day-${date.day}-${idx}`}
                    >
                        {date.day}
                        {date.dot && date.day !== selectedDay && (
                            <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-purple-600" />
                        )}
                    </button>
                ))}
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
                    Timezone: Europe/London (GMT)
                </span>
            </div>
        </div>
    );
}
