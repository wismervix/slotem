import { Info } from 'lucide-react';

export function TimeSlotPicker() {
    const slots = [
        { time: '09:00 AM', available: true },
        { time: '10:30 AM', available: true },
        { time: '12:00 PM', available: true, selected: true },
        { time: '01:30 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:30 PM', available: true },
        { time: '06:00 PM', available: false },
        { time: '07:30 PM', available: true },
    ];

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
                    Thursday, Nov 14
                </h2>
                <p
                    className="text-sm text-gray-500 dark:text-gray-300"
                    id="slots-count"
                >
                    8 slots available
                </p>
            </div>

            <div className="grid flex-grow grid-cols-2 gap-4">
                {slots.map((slot) => (
                    <button
                        key={slot.time}
                        disabled={!slot.available}
                        className={`rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            slot.selected
                                ? 'bg-purple-600 border-purple-600 ring-purple-600/10 text-white shadow-md ring-2'
                                : !slot.available
                                  ? 'cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400 opacity-50'
                                  : 'hover:border-purple-600 dark:border-purple-300 hover:text-purple-600 border-gray-200 bg-white text-gray-700 shadow-sm'
                        }`}
                        id={`time-slot-${slot.time.replace(/[:\s]/g, '-')}`}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>

            <div className="mt-8 border-t border-purple-100 pt-8">
                <div
                    className="bg-purple-600/10 border-purple-600/5 dark:bg-purple-600/15 dark:border-purple-600/20 mb-8 flex items-start space-x-3 rounded-xl border p-4"
                    id="booking-info-box"
                >
                    <Info size={18} className="text-purple-600 mt-0.5 shrink-0" />
                    <p className="text-purple-600 dark:text-purple-600/90 text-xs leading-relaxed font-medium">
                        You are booking for{' '}
                        <span className="decoration-purple-600/30 dark:decoration-purple-600/50 font-bold underline">
                            Thursday, November 14th at 12:00 PM
                        </span>
                        . You can change this later if needed.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        className="flex-1 rounded-full border border-gray-200 dark:border-gray-700 px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                        id="back-btn"
                    >
                        Back
                    </button>
                    <button
                        className="bg-purple-600 hover:bg-purple-700 flex-[2] transform rounded-full px-6 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
                        id="next-step-btn"
                    >
                        Next Step
                    </button>
                </div>
            </div>
        </div>
    );
}
