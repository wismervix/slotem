import AdminLayout from '@/layouts/Admin/AdminLayout';
import {
    Download,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Clock,
    AlertTriangle,
    X,
} from 'lucide-react';
import { useEffect, useState, FormEvent } from 'react';

import type { Availability, TimeSlot } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AdminAvailability() {
    const { availabilities: DatabaseAvailabilities } = usePage<{
        availabilities: Availability[];
    }>().props;

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const [currentYear, setCurrentYear] = useState(2024);
    const [currentMonth, setCurrentMonth] = useState(8); // September
    const [selectedDateStr, setSelectedDateStr] = useState('2024-09-06');

    const [availabilities, setAvailabilities] = useState<Availability[]>(
        DatabaseAvailabilities,
    );

    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);

    // Form state for bulk slot creation
    const [formDateStart, setFormDateStart] = useState('2024-09-09');
    const [formDateEnd, setFormDateEnd] = useState('2024-09-13');
    const [formTimeStart, setFormTimeStart] = useState('09:00');
    const [formTimeEnd, setFormTimeEnd] = useState('17:00');
    const [includeWeekends, setIncludeWeekends] = useState(false);
    const [weekendTimeStart, setWeekendTimeStart] = useState('10:00');
    const [weekendTimeEnd, setWeekendTimeEnd] = useState('14:00');
    const [isHoliday, setIsHoliday] = useState(false);
    const [holidayDate, setHolidayDate] = useState('2024-09-10');
    const [holidayTimeStart, setHolidayTimeStart] = useState('09:00');
    const [holidayTimeEnd, setHolidayTimeEnd] = useState('12:00');

    // Toast helper
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setIsToastVisible(true);
    };

    useEffect(() => {
        if (isToastVisible) {
            const timer = setTimeout(() => setIsToastVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [isToastVisible]);

    // ============================================
    // CALENDAR LOGIC
    // ============================================
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        } else {
            setCurrentMonth((prev) => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
    };

    const getDaysInMonth = (year: number, month: number) => {
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const days: Array<{
            dayNum: number;
            isCurrentMonth: boolean;
            dateString: string;
        }> = [];

        // Previous month filler
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const prevMonthDay = prevMonthTotalDays - i;
            const mStr = month === 0 ? '12' : String(month).padStart(2, '0');
            const yStr = month === 0 ? String(year - 1) : String(year);
            const dStr = String(prevMonthDay).padStart(2, '0');
            days.push({
                dayNum: prevMonthDay,
                isCurrentMonth: false,
                dateString: `${yStr}-${mStr}-${dStr}`,
            });
        }

        // Current month
        const currentMStr = String(month + 1).padStart(2, '0');
        for (let day = 1; day <= totalDays; day++) {
            const dayStr = String(day).padStart(2, '0');
            days.push({
                dayNum: day,
                isCurrentMonth: true,
                dateString: `${year}-${currentMStr}-${dayStr}`,
            });
        }

        // Next month filler
        const remainingSlots = 42 - days.length;
        for (let i = 1; i <= remainingSlots; i++) {
            const mStr =
                month === 11 ? '01' : String(month + 2).padStart(2, '0');
            const yStr = month === 11 ? String(year + 1) : String(year);
            const dStr = String(i).padStart(2, '0');
            days.push({
                dayNum: i,
                isCurrentMonth: false,
                dateString: `${yStr}-${mStr}-${dStr}`,
            });
        }

        return days;
    };

    const calendarDays = getDaysInMonth(currentYear, currentMonth);

    // Get availability for a specific date
    const getAvailabilityForDate = (
        dateStr: string,
    ): Availability | undefined => {
        return availabilities.find((a) => a.date === dateStr);
    };

    const selectedAvailability = getAvailabilityForDate(selectedDateStr);

    // ============================================
    // TIME SLOT OPERATIONS
    // ============================================
    const generateTimeSlots = (
        startTime: string,
        endTime: string,
    ): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMin = startMin;
        let id =
            Math.max(
                ...availabilities.flatMap((a) =>
                    a.time_slots.map((ts) => ts.id),
                ),
                0,
            ) + 1;

        while (
            currentHour < endHour ||
            (currentHour === endHour && currentMin < endMin)
        ) {
            const nextHour = currentHour + 1;
            const nextMin = currentMin;

            if (nextHour <= endHour) {
                slots.push({
                    id: id++,
                    availability_id: 0, // Will be set when saved
                    start_time: `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`,
                    end_time: `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`,
                    is_booked: false,
                });
            }

            currentHour = nextHour;
            currentMin = nextMin;
        }

        return slots;
    };

    const handleDeleteTimeSlot = (slotId: number) => {
        setAvailabilities(
            availabilities.map((a) => {
                if (a.date === selectedDateStr) {
                    return {
                        ...a,
                        time_slots: a.time_slots.filter(
                            (ts) => ts.id !== slotId,
                        ),
                    };
                }
                return a;
            }),
        );
    };

    const handleAddTimeSlot = (dateStr: string, timeSlots: TimeSlot[]) => {
        const existing = availabilities.find((a) => a.date === dateStr);

        if (existing) {
            setAvailabilities(
                availabilities.map((a) => {
                    if (a.date === dateStr) {
                        return {
                            ...a,
                            time_slots: [...a.time_slots, ...timeSlots],
                        };
                    }
                    return a;
                }),
            );
        } else {
            setAvailabilities([
                ...availabilities,
                {
                    id: Math.max(...availabilities.map((a) => a.id), 0) + 1,
                    date: dateStr,
                    time_slots: timeSlots,
                },
            ]);
        }
    };

    // ============================================
    // FORM SUBMISSION
    // ============================================
    const handleSubmitBulkForm = (e: FormEvent) => {
        e.preventDefault();

        const startDate = new Date(formDateStart);
        const endDate = new Date(formDateEnd);
        const datesInRange: string[] = [];

        for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
        ) {
            const dayOfWeek = d.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            // Skip weekends unless enabled
            if (isWeekend && !includeWeekends) continue;

            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            const slots = generateTimeSlots(
                isWeekend && includeWeekends ? weekendTimeStart : formTimeStart,
                isWeekend && includeWeekends ? weekendTimeEnd : formTimeEnd,
            );

            handleAddTimeSlot(dateStr, slots);
        }

        // Handle holiday if enabled
        if (isHoliday) {
            const holidaySlots = generateTimeSlots(
                holidayTimeStart,
                holidayTimeEnd,
            );
            handleAddTimeSlot(holidayDate, holidaySlots);
        }

        triggerToast('Time slots created successfully!');
    };

    const handleSaveAll = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            triggerToast('All availability rules synchronized!');
        }, 1200);
    };

    const handleExportRules = () => {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(availabilities, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'availability_rules.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        triggerToast('Availability rules exported!');
    };

    const formatDateLabel = (dateStr: string) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const dateObj = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2]),
        );
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // ============================================
    // RENDER
    // ============================================
    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/15 pb-5 sm:flex-row sm:items-end dark:border-slate-700/50">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
                        Availability Management
                    </h1>
                    <p className="mt-1 text-xs text-on-surface-variant dark:text-slate-400">
                        Select a day to manage time slots, or set up bulk slots
                        below.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportRules}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-outline bg-surface px-4 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    >
                        <Download className="h-3.5 w-3.5" /> Export
                    </button>

                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="flex min-w-[124px] cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95 disabled:bg-primary/75 dark:bg-purple-600 dark:hover:bg-purple-700 dark:disabled:bg-purple-600/75"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />{' '}
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-6 py-6">
                {/* Two-column layout: Calendar + Form */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* CALENDAR SECTION */}
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-xs dark:border-slate-700 dark:bg-slate-900">
                            {/* Calendar header */}
                            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest p-5 dark:border-slate-700 dark:bg-slate-800">
                                <h2 className="text-lg font-bold text-on-surface dark:text-white">
                                    {monthNames[currentMonth]} {currentYear}
                                </h2>
                                <div className="flex gap-0.5">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="cursor-pointer rounded p-1 transition-all hover:bg-white active:scale-90 dark:hover:bg-slate-600"
                                    >
                                        <ChevronLeft className="h-4 w-4 text-on-surface-variant dark:text-slate-500" />
                                    </button>
                                    <button
                                        onClick={handleNextMonth}
                                        className="cursor-pointer rounded p-1 transition-all hover:bg-white active:scale-90 dark:hover:bg-slate-600"
                                    >
                                        <ChevronRight className="h-4 w-4 text-on-surface-variant dark:text-slate-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Calendar grid */}
                            <div className="bg-surface p-4 dark:bg-slate-900">
                                <div className="grid grid-cols-7 border-b border-l border-outline-variant/30 bg-surface-container-low/20 text-center text-[10px] font-bold text-on-surface-variant dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-500">
                                    {[
                                        'SUN',
                                        'MON',
                                        'TUE',
                                        'WED',
                                        'THU',
                                        'FRI',
                                        'SAT',
                                    ].map((day) => (
                                        <div
                                            key={day}
                                            className="border-t border-r border-outline-variant/30 py-2.5 dark:border-slate-700"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 border-l border-outline-variant/20 dark:border-slate-700">
                                    {calendarDays.map((day, ix) => {
                                        const avail = getAvailabilityForDate(
                                            day.dateString,
                                        );
                                        const isSelected =
                                            selectedDateStr === day.dateString;
                                        const slotCount =
                                            avail?.time_slots.length || 0;

                                        return (
                                            <div
                                                key={ix}
                                                onClick={() =>
                                                    setSelectedDateStr(
                                                        day.dateString,
                                                    )
                                                }
                                                className={`relative flex min-h-[80px] cursor-pointer flex-col justify-between border-t border-r border-outline-variant/30 p-2 transition-all select-none dark:border-slate-700 ${
                                                    !day.isCurrentMonth
                                                        ? 'bg-gray-50/40 opacity-30 dark:bg-slate-800/30'
                                                        : 'bg-surface dark:bg-slate-900'
                                                } ${
                                                    isSelected
                                                        ? 'bg-primary/5 ring-2 ring-primary ring-inset dark:bg-purple-950/20 dark:ring-purple-500'
                                                        : 'hover:bg-primary/5 dark:hover:bg-purple-950/10'
                                                }`}
                                            >
                                                <span
                                                    className={`font-mono text-xs font-bold ${isSelected ? 'text-primary dark:text-purple-400' : 'text-on-surface dark:text-white'}`}
                                                >
                                                    {day.dayNum}
                                                </span>
                                                {slotCount > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-purple-500" />
                                                        <span className="text-[9px] font-semibold text-primary dark:text-purple-400">
                                                            {slotCount}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SELECTED DAY TIME SLOTS CARD */}
                    <div className="rounded-xl border border-outline-variant bg-surface p-6 shadow-xs dark:border-slate-700 dark:bg-slate-900">
                        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-on-surface dark:text-white">
                            <Clock className="h-5 w-5 text-primary dark:text-purple-400" />
                            {formatDateLabel(selectedDateStr)}
                        </h3>

                        <div className="space-y-2.5">
                            {!selectedAvailability ||
                            selectedAvailability.time_slots.length === 0 ? (
                                <p className="py-4 text-center text-xs text-on-surface-variant/75 italic dark:text-slate-500">
                                    No slots configured
                                </p>
                            ) : (
                                selectedAvailability.time_slots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface-container-low p-2.5 dark:border-slate-700/50 dark:bg-slate-800/50"
                                    >
                                        <span className="font-mono text-xs font-semibold text-on-surface dark:text-white">
                                            {slot.start_time} – {slot.end_time}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleDeleteTimeSlot(slot.id)
                                            }
                                            className="cursor-pointer rounded p-1 text-on-surface-variant transition-colors hover:bg-white/20 dark:hover:bg-slate-700"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* BULK SLOT CREATION FORM */}
                <div className="rounded-xl border border-outline-variant bg-surface p-6 shadow-xs dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-on-surface dark:text-white">
                        <AlertTriangle className="h-5 w-5 text-tertiary dark:text-amber-400" />
                        Create Time Slots
                    </h3>

                    <form onSubmit={handleSubmitBulkForm} className="space-y-5">
                        {/* Date Range */}
                        <div>
                            <label className="mb-2 block text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-400">
                                Date Range
                            </label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                    type="date"
                                    value={formDateStart}
                                    onChange={(e) =>
                                        setFormDateStart(e.target.value)
                                    }
                                    className="rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <input
                                    type="date"
                                    value={formDateEnd}
                                    onChange={(e) =>
                                        setFormDateEnd(e.target.value)
                                    }
                                    className="rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Weekday Time Range */}
                        <div>
                            <label className="mb-2 block text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-400">
                                Weekday Time Range
                            </label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-[11px] text-on-surface-variant dark:text-slate-500">
                                        From
                                    </label>
                                    <input
                                        type="time"
                                        value={formTimeStart}
                                        onChange={(e) =>
                                            setFormTimeStart(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] text-on-surface-variant dark:text-slate-500">
                                        To
                                    </label>
                                    <input
                                        type="time"
                                        value={formTimeEnd}
                                        onChange={(e) =>
                                            setFormTimeEnd(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Weekends Toggle */}
                        <div className="rounded-lg border border-outline-variant/30 p-4 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-on-surface dark:text-white">
                                    Include weekends?
                                </label>
                                <input
                                    type="checkbox"
                                    checked={includeWeekends}
                                    onChange={(e) =>
                                        setIncludeWeekends(e.target.checked)
                                    }
                                    className="h-4 w-4 cursor-pointer rounded text-primary dark:text-purple-600"
                                />
                            </div>

                            {includeWeekends && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-[11px] text-on-surface-variant dark:text-slate-500">
                                            From
                                        </label>
                                        <input
                                            type="time"
                                            value={weekendTimeStart}
                                            onChange={(e) =>
                                                setWeekendTimeStart(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] text-on-surface-variant dark:text-slate-500">
                                            To
                                        </label>
                                        <input
                                            type="time"
                                            value={weekendTimeEnd}
                                            onChange={(e) =>
                                                setWeekendTimeEnd(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Holiday Toggle */}
                        <div className="rounded-lg border border-outline-variant/30 p-4 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-on-surface dark:text-white">
                                    Set a holiday?
                                </label>
                                <input
                                    type="checkbox"
                                    checked={isHoliday}
                                    onChange={(e) =>
                                        setIsHoliday(e.target.checked)
                                    }
                                    className="h-4 w-4 cursor-pointer rounded text-primary dark:text-purple-600"
                                />
                            </div>

                            {isHoliday && (
                                <div className="mt-3 space-y-2">
                                    <div>
                                        <label className="mb-1 block text-[11px] text-on-surface-variant dark:text-slate-500">
                                            Holiday Date
                                        </label>
                                        <input
                                            type="date"
                                            value={holidayDate}
                                            onChange={(e) =>
                                                setHolidayDate(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[11px] text-on-surface-variant dark:text-slate-500">
                                                From
                                            </label>
                                            <input
                                                type="time"
                                                value={holidayTimeStart}
                                                onChange={(e) =>
                                                    setHolidayTimeStart(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] text-on-surface-variant dark:text-slate-500">
                                                To
                                            </label>
                                            <input
                                                type="time"
                                                value={holidayTimeEnd}
                                                onChange={(e) =>
                                                    setHolidayTimeEnd(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary transition-all hover:bg-primary-container active:scale-95 dark:bg-purple-600 dark:hover:bg-purple-700"
                        >
                            Create Time Slots
                        </button>
                    </form>
                </div>
            </div>

            {/* Toast notification */}
            {isToastVisible && (
                <div className="fixed right-6 bottom-6 left-6 rounded-lg border border-outline-variant bg-surface-container-low p-4 text-xs font-semibold text-on-surface shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    {toastMessage}
                </div>
            )}
        </AdminLayout>
    );
}
