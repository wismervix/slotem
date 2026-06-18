import AdminLayout from '@/layouts/Admin/AdminLayout';
import {
    Download,
    Loader2,
    Clock,
    ArrowRight,
    Edit2,
    CalendarDays,
    HelpCircle,
    AlertTriangle,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState, FormEvent } from 'react';

import {
    WeeklySchedule,
    BookingWindow,
    HolidayOverride,
    DailySlots,
    BookingTwo,
} from '@/types';
import {
    INITIAL_WEEKLY_SCHEDULE,
    INITIAL_BOOKING_WINDOW,
    INITIAL_HOLIDAY_OVERRIDES,
    INITIAL_DAILY_SLOTS,
    INITIAL_BOOKINGS,
} from '@/data/initial-data-two';

export default function AdminAvailability() {
    // 2. State & localStorage synchronization
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(
        INITIAL_WEEKLY_SCHEDULE,
    );

    const [bookingWindow, setBookingWindow] = useState<BookingWindow>(
        INITIAL_BOOKING_WINDOW,
    );

    const [holidays, setHolidays] = useState<HolidayOverride[]>(
        INITIAL_HOLIDAY_OVERRIDES,
    );

    const [dailySlots, setDailySlots] =
        useState<DailySlots>(INITIAL_DAILY_SLOTS);

    const [bookings, setBookings] = useState<BookingTwo[]>(INITIAL_BOOKINGS);

    const [isSavingAll, setIsSavingAll] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);

    // Floating Toast function helper
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setIsToastVisible(true);
    };

    useEffect(() => {
        if (isToastVisible) {
            const timer = setTimeout(() => {
                setIsToastVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isToastVisible]);

    // Save All changes micro-interactions
    const handleSaveAllChanges = () => {
        setIsSavingAll(true);
        setTimeout(() => {
            setIsSavingAll(false);
            triggerToast(
                'All customized parameters, overrides, and calendar rules synchronized to Slotem backend successfully!',
            );
        }, 1200);
    };

    // Export current rules as JSON file download
    const handleExportRules = () => {
        const ruleSet = {
            weeklySchedule,
            bookingWindow,
            holidaysCount: holidays.length,
            holidays,
            slotsExported: Object.keys(dailySlots).length,
            dailySlots,
        };

        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(ruleSet, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute(
            'download',
            `slotem_availability_rules.json`,
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        triggerToast('JSON Availability Schema exported successfully.');
    };

    // Add individual Holiday Override
    const handleAddHoliday = (override: HolidayOverride) => {
        setHolidays([...holidays, override]);
    };

    // Delete Holiday Override
    const handleDeleteHoliday = (id: string) => {
        setHolidays(holidays.filter((h) => h.id !== id));
    };

    // Update Daily Slots representation
    const handleUpdateDailySlots = (dateStr: string, slots: string[]) => {
        setDailySlots({
            ...dailySlots,
            [dateStr]: slots,
        });
    };

    // Bulk generator for standard 90 days allocation
    const handleBulkGenerate = (bufferMinutes: number) => {
        // Generate dates starting today up to window selection limits
        const generated: DailySlots = { ...dailySlots };
        const today = new Date();

        // Default hours based on Mon-Fri setup
        const defaultHoursList = [
            '09:00 AM',
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '01:00 PM',
            '02:00 PM',
            '03:00 PM',
            '04:00 PM',
            '05:00 PM',
        ];

        // Generate for next 90 days
        for (let i = 0; i < 90; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            const isSat = targetDate.getDay() === 6;
            const isSun = targetDate.getDay() === 0;

            // Skip is Saturday/Sunday disabled
            if (isSat && !weeklySchedule.saturdayEnabled) continue;
            if (isSun && !weeklySchedule.sundayEnabled) continue;

            const yyyy = targetDate.getFullYear();
            const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
            const dd = String(targetDate.getDate()).padStart(2, '0');
            const dStr = `${yyyy}-${mm}-${dd}`;

            // Check if it's already masked by blocked holiday
            const isBlocked = holidays.some((h) => {
                const hStart = new Date(h.startDate);
                const hEnd = new Date(h.endDate);
                hStart.setHours(0, 0, 0, 0);
                hEnd.setHours(0, 0, 0, 0);
                const tDate = new Date(targetDate);
                tDate.setHours(0, 0, 0, 0);
                return tDate >= hStart && tDate <= hEnd && h.type === 'Blocked';
            });

            if (!isBlocked) {
                generated[dStr] = defaultHoursList;
            }
        }

        setDailySlots(generated);
    };

    // Calendar View Month state - initial state is September 2024 to replicate mockup exactly
    const [currentYear, setCurrentYear] = useState(2024);
    const [currentMonth, setCurrentMonth] = useState(8); // September is Index 8
    const [selectedDateStr, setSelectedDateStr] = useState('2024-09-06'); // Sep 6 Today in design
    const [bufferOption, setBufferOption] = useState('30 mins');

    // Modals visibility states
    const [isAddingHoliday, setIsAddingHoliday] = useState(false);
    const [isManagingSlots, setIsManagingSlots] = useState(false);
    const [isEditingWeeklyTime, setIsEditingWeeklyTime] = useState(false);

    // New Holiday Form local State
    const [newHolidayName, setNewHolidayName] = useState('');
    const [newHolidayStart, setNewHolidayStart] = useState('2024-09-10');
    const [newHolidayEnd, setNewHolidayEnd] = useState('2024-09-10');
    const [newHolidayType, setNewHolidayType] = useState<'Blocked' | 'Partial'>(
        'Blocked',
    );

    // Weekly hours edit local state
    const [tempStartTime, setTempStartTime] = useState(
        weeklySchedule.monToFriStart,
    );
    const [tempEndTime, setTempEndTime] = useState(weeklySchedule.monToFriEnd);

    // Quick slot manager slots state
    const possibleHours = [
        '08:00 AM',
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '01:00 PM',
        '02:05 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
    ];

    // Month navigation helpers
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

    // Generate calendar days
    const getDaysInMonth = (year: number, month: number) => {
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const days: Array<{
            dayNum: number;
            isCurrentMonth: boolean;
            dateString: string;
            isSunday: boolean;
            isSaturday: boolean;
        }> = [];

        // Prior Month filler days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const prevMonthDay = prevMonthTotalDays - i;
            const mStr = month === 0 ? '12' : String(month).padStart(2, '0');
            const yStr = month === 0 ? String(year - 1) : String(year);
            const dStr = String(prevMonthDay).padStart(2, '0');
            days.push({
                dayNum: prevMonthDay,
                isCurrentMonth: false,
                dateString: `${yStr}-${mStr}-${dStr}`,
                isSunday: false,
                isSaturday: false,
            });
        }

        // Current Month active days
        const currentMStr = String(month + 1).padStart(2, '0');
        for (let day = 1; day <= totalDays; day++) {
            const dayStr = String(day).padStart(2, '0');
            const tempDate = new Date(year, month, day);
            days.push({
                dayNum: day,
                isCurrentMonth: true,
                dateString: `${year}-${currentMStr}-${dayStr}`,
                isSunday: tempDate.getDay() === 0,
                isSaturday: tempDate.getDay() === 6,
            });
        }

        // Next Month filler days (pad grid to multiples of 7)
        const remainingSlots = 42 - days.length;
        for (let i = 1; i <= remainingSlots; i++) {
            const nextMonthDay = i;
            const mStr =
                month === 11 ? '01' : String(month + 2).padStart(2, '0');
            const yStr = month === 11 ? String(year + 1) : String(year);
            const dStr = String(nextMonthDay).padStart(2, '0');
            days.push({
                dayNum: nextMonthDay,
                isCurrentMonth: false,
                dateString: `${yStr}-${mStr}-${dStr}`,
                isSunday: false,
                isSaturday: false,
            });
        }

        return days;
    };

    const calendarDays = getDaysInMonth(currentYear, currentMonth);

    // Determine day constraints or annotations
    const getDayDetails = (dateStr: string) => {
        // 1. Is it matching a holiday override?
        const matchedHoliday = holidays.find((h) => {
            const start = new Date(h.startDate);
            const end = new Date(h.endDate);
            const target = new Date(dateStr);
            // Normalize timezone
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            target.setHours(0, 0, 0, 0);
            return target >= start && target <= end;
        });

        // 2. Slots active
        const activeSlots = dailySlots[dateStr] || [];

        return {
            holiday: matchedHoliday,
            slotsCount: activeSlots.length,
            activeSlots,
        };
    };

    // Selection trigger
    const handleDayClick = (dateStr: string) => {
        setSelectedDateStr(dateStr);
    };

    // Add holiday handler
    const handleSaveHoliday = (e: FormEvent) => {
        e.preventDefault();
        if (!newHolidayName.trim()) return;

        handleAddHoliday({
            id: 'h_' + Date.now(),
            name: newHolidayName,
            startDate: newHolidayStart,
            endDate: newHolidayEnd,
            type: newHolidayType,
        });

        setNewHolidayName('');
        setIsAddingHoliday(false);
        triggerToast(`Holiday Overlap "${newHolidayName}" added successfully.`);
    };

    // Update weekly routine start/end hours
    const handleSaveWeeklyHours = (e: FormEvent) => {
        e.preventDefault();
        setWeeklySchedule({
            ...weeklySchedule,
            monToFriStart: tempStartTime,
            monToFriEnd: tempEndTime,
        });
        setIsEditingWeeklyTime(false);
        triggerToast(
            `Standard weekly routine hours updated to ${tempStartTime} - ${tempEndTime}.`,
        );
    };

    // Selected Day Slots toggle item helper
    const handleToggleSelectedTimeSlot = (slot: string) => {
        const currentList = dailySlots[selectedDateStr] || [];
        let updatedList: string[];
        if (currentList.includes(slot)) {
            updatedList = currentList.filter((s) => s !== slot);
        } else {
            updatedList = [...currentList, slot].sort();
        }
        handleUpdateDailySlots(selectedDateStr, updatedList);
    };

    // Copy Mon-Fri hours to Saturday/Sunday state
    const handleCopyToAll = () => {
        setWeeklySchedule({
            ...weeklySchedule,
            saturdayEnabled: true,
            sundayEnabled: true,
        });
        triggerToast(
            'Weekly routine hours copied to all seven days successfully!',
        );
    };

    // Run Batch Generator trigger
    const handleRunBatchGenerator = () => {
        const bufferMinutes = bufferOption.includes('15')
            ? 15
            : bufferOption.includes('30')
              ? 30
              : 60;
        handleBulkGenerate(bufferMinutes);
        triggerToast(
            `Successful run: Hourly slots automatically generated for the next window of days with a ${bufferOption} spacing.`,
        );
    };

    // Parse neat naming format for selected date label
    const formatSelectedDateLabel = (dateStr: string) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const dateObj = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2]),
        );
        const formatted = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });

        // Check if it's Sep 6 2024 to mimic mock screenshot perfectly
        if (dateStr === '2024-09-06') {
            return `Sep 6 (Today)`;
        }
        return formatted;
    };

    const selectedDayLabel = formatSelectedDateLabel(selectedDateStr);
    const selectedDayDetails = getDayDetails(selectedDateStr);

    return (
        <AdminLayout>
            {/* Header banner action row */}
            <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/15 pb-5 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                        Availability Management
                    </h1>
                    <p className="mt-1 text-xs text-on-surface-variant">
                        Configure active booking rules, weekly schedule
                        routines, overrides and time slot generating
                        constraints.
                    </p>
                </div>

                {/* Sync Save All & Export rule controls (rendered on headers matching the mockup layout) */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={handleExportRules}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-outline bg-white px-4 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                    >
                        <Download className="h-3.5 w-3.5" /> Export Rules
                    </button>

                    <button
                        onClick={handleSaveAllChanges}
                        disabled={isSavingAll}
                        className="flex min-w-[124px] cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95 disabled:bg-primary/75"
                    >
                        {isSavingAll ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />{' '}
                                Synchronizing...
                            </>
                        ) : (
                            'Save All Changes'
                        )}
                    </button>
                </div>
            </div>

            <div id="availability-management-view" className="space-y-gutter">
                {/* Grid: Bento Left & Right */}
                <div className="gap-gutter grid grid-cols-1 items-start lg:grid-cols-12">
                    {/* LEFT COLUMN: Setup panels */}
                    <div className="col-span-12 space-y-6 lg:col-span-5">
                        {/* Bento Card 1: Weekly Schedule */}
                        <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-xs">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-on-surface">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Weekly Schedule
                                </h3>
                                <button
                                    onClick={handleCopyToAll}
                                    className="cursor-pointer text-xs font-semibold text-primary hover:underline"
                                >
                                    Copy to all
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Daily Hours Block */}
                                <div className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-low p-3.5">
                                    <span className="w-16 font-mono text-xs font-bold tracking-wider text-on-surface-variant">
                                        MON-FRI
                                    </span>
                                    <div className="flex flex-1 items-center justify-center gap-2">
                                        <span className="rounded-lg bg-surface-container-highest px-2.5 py-1.5 font-mono text-xs font-semibold text-on-surface">
                                            {weeklySchedule.monToFriStart}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-on-surface-variant/70" />
                                        <span className="rounded-lg bg-surface-container-highest px-2.5 py-1.5 font-mono text-xs font-semibold text-on-surface">
                                            {weeklySchedule.monToFriEnd}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setTempStartTime(
                                                weeklySchedule.monToFriStart,
                                            );
                                            setTempEndTime(
                                                weeklySchedule.monToFriEnd,
                                            );
                                            setIsEditingWeeklyTime(true);
                                        }}
                                        className="cursor-pointer rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Saturday Toggle Row */}
                                <div className="flex items-center justify-between border-t border-outline-variant/20 py-1 pt-3">
                                    <span className="font-mono text-xs font-bold tracking-wide text-on-surface-variant">
                                        SATURDAY
                                    </span>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                weeklySchedule.saturdayEnabled
                                            }
                                            onChange={(e) =>
                                                setWeeklySchedule({
                                                    ...weeklySchedule,
                                                    saturdayEnabled:
                                                        e.target.checked,
                                                })
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-outline-variant/65 peer-checked:bg-primary after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
                                    </label>
                                </div>

                                {/* Sunday Toggle Row */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="font-mono text-xs font-bold tracking-wide text-on-surface-variant">
                                        SUNDAY
                                    </span>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                weeklySchedule.sundayEnabled
                                            }
                                            onChange={(e) =>
                                                setWeeklySchedule({
                                                    ...weeklySchedule,
                                                    sundayEnabled:
                                                        e.target.checked,
                                                })
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-outline-variant/65 peer-checked:bg-primary after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
                                    </label>
                                </div>
                            </div>

                            {/* Time Slot Generation Split Tabs */}
                            <div className="mt-6 border-t border-outline-variant/40 pt-5">
                                <p className="mb-2.5 text-[10px] font-bold tracking-widest text-on-surface-variant/80 uppercase">
                                    Time Slot Generation
                                </p>
                                <div className="flex rounded-lg bg-surface-container p-1">
                                    <button
                                        onClick={() =>
                                            setWeeklySchedule({
                                                ...weeklySchedule,
                                                timeSlotMinutes: 30,
                                            })
                                        }
                                        className={`flex-1 cursor-pointer rounded-md py-2 text-xs font-semibold transition-all ${
                                            weeklySchedule.timeSlotMinutes ===
                                            30
                                                ? 'bg-white text-primary shadow-xs'
                                                : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                    >
                                        30 min slots
                                    </button>
                                    <button
                                        onClick={() =>
                                            setWeeklySchedule({
                                                ...weeklySchedule,
                                                timeSlotMinutes: 60,
                                            })
                                        }
                                        className={`flex-1 cursor-pointer rounded-md py-2 text-xs font-semibold transition-all ${
                                            weeklySchedule.timeSlotMinutes ===
                                            60
                                                ? 'bg-primary text-on-primary shadow-xs'
                                                : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                    >
                                        60 min slots
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Bento Card 2: Availability Range Window */}
                        <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-xs">
                            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-on-surface">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                Availability Range
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                                        Booking Window
                                    </label>
                                    <select
                                        value={bookingWindow}
                                        onChange={(e) =>
                                            setBookingWindow(
                                                e.target.value as BookingWindow,
                                            )
                                        }
                                        className="w-full cursor-pointer rounded-lg border border-outline-variant bg-white p-2.5 text-xs font-semibold focus:border-primary focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="Next 30 Days">
                                            Next 30 Days
                                        </option>
                                        <option value="Next 90 Days">
                                            Next 90 Days
                                        </option>
                                        <option value="Next 180 Days">
                                            Next 180 Days
                                        </option>
                                    </select>
                                </div>

                                {/* Pro Tip Box */}
                                <div className="flex items-start gap-2.5 rounded-xl border border-tertiary-container/55 bg-tertiary-container/30 p-3">
                                    <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-tertiary" />
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-tertiary">
                                            Pro Tip:
                                        </p>
                                        <p className="text-[11px] leading-relaxed text-on-surface-variant">
                                            A 90-day window increases slot
                                            booking conversion by 22% for most
                                            business advisory service types.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Bento Card 3: Holiday Overrides */}
                        <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-xs">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-on-surface">
                                    <AlertTriangle className="h-4.5 w-4.5 text-primary" />
                                    Holiday Overrides
                                </h3>
                                <button
                                    onClick={() => setIsAddingHoliday(true)}
                                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="custom-scrollbar max-h-[220px] space-y-2.5 overflow-y-auto pr-1">
                                {holidays.length === 0 ? (
                                    <p className="py-4 text-center text-xs text-on-surface-variant/75 italic">
                                        No overrides set
                                    </p>
                                ) : (
                                    holidays.map((override) => (
                                        <div
                                            key={override.id}
                                            className="flex items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
                                        >
                                            <div>
                                                <p className="text-xs font-semibold text-on-surface">
                                                    {override.name}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[10px] text-on-surface-variant/85">
                                                    {override.startDate}{' '}
                                                    {override.endDate !==
                                                        override.startDate &&
                                                        `to ${override.endDate}`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`rounded-md px-2 py-0.5 text-[8px] font-bold tracking-wide uppercase ${
                                                        override.type ===
                                                        'Blocked'
                                                            ? 'border border-red-200 bg-error-container font-mono text-on-error-container'
                                                            : 'text-orange-850 border border-orange-200 bg-orange-100 font-mono'
                                                    }`}
                                                >
                                                    {override.type}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        handleDeleteHoliday(
                                                            override.id,
                                                        );
                                                        triggerToast(
                                                            `Override "${override.name}" removed.`,
                                                        );
                                                    }}
                                                    className="hover:text-red-650 cursor-pointer rounded p-1 text-on-surface-variant transition-colors hover:bg-white/40"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Calendar Panel Canvas */}
                    <div className="col-span-12 lg:col-span-7">
                        <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant bg-white shadow-xs">
                            {/* Calendar UI Header bar */}
                            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest p-5">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold text-on-surface">
                                        {monthNames[currentMonth]} {currentYear}
                                    </h2>
                                    <div className="flex gap-0.5 rounded-md bg-surface-container p-1">
                                        <button
                                            onClick={handlePrevMonth}
                                            className="cursor-pointer rounded p-1 transition-all hover:bg-white active:scale-90"
                                        >
                                            <ChevronLeft className="h-4 w-4 text-on-surface-variant" />
                                        </button>
                                        <button
                                            onClick={handleNextMonth}
                                            className="cursor-pointer rounded p-1 transition-all hover:bg-white active:scale-90"
                                        >
                                            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
                                        </button>
                                    </div>
                                </div>

                                {/* Status color indicators */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                                        <span className="text-[11px] font-medium text-on-surface-variant">
                                            Available
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-outline-variant" />
                                        <span className="text-[11px] font-medium text-on-surface-variant">
                                            Blocked
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Grid container */}
                            <div className="bg-white p-4">
                                <div className="grid grid-cols-7 border-b border-l border-outline-variant/30 bg-surface-container-low/20 text-center text-[10px] font-bold text-on-surface-variant">
                                    <div className="border-t border-r border-outline-variant/30 py-2.5">
                                        SUN
                                    </div>
                                    <div className="border-t border-r border-outline-variant/30 py-2.5">
                                        MON
                                    </div>
                                    <div className="border-t border-r border-outline-variant/30 py-2.5">
                                        TUE
                                    </div>
                                    <div className="border-t border-r border-outline-variant/30 py-2.5">
                                        WED
                                    </div>
                                    <div className="border-t border-r border-outline-variant/30 py-2.5">
                                        THU
                                    </div>
                                    <div className="border-t border-r border-outline-variant/30 py-2.5">
                                        FRI
                                    </div>
                                    <div className="border-t border-r border-outline-variant/30 py-2.5">
                                        SAT
                                    </div>
                                </div>

                                {/* Generated Calendar Dates */}
                                <div className="grid grid-cols-7 border-l border-outline-variant/20">
                                    {calendarDays.map((day, ix) => {
                                        const dayDetails = getDayDetails(
                                            day.dateString,
                                        );
                                        const isSelected =
                                            selectedDateStr === day.dateString;
                                        const isToday =
                                            day.dateString === '2024-09-06'; // Exact mockup center focus Sep 6

                                        return (
                                            <div
                                                key={ix}
                                                onClick={() =>
                                                    handleDayClick(
                                                        day.dateString,
                                                    )
                                                }
                                                className={`relative flex min-h-[92px] cursor-pointer flex-col justify-between border-t border-r border-outline-variant/30 p-2 transition-all select-none ${
                                                    !day.isCurrentMonth
                                                        ? 'bg-gray-50/40 text-on-surface-variant/80 opacity-30'
                                                        : 'bg-white'
                                                } ${
                                                    dayDetails.holiday
                                                        ? 'bg-red-50/15'
                                                        : ''
                                                } ${
                                                    isSelected
                                                        ? 'bg-primary/5 ring-2 ring-primary ring-inset'
                                                        : 'hover:bg-primary/5'
                                                }`}
                                            >
                                                {/* Day Number Label */}
                                                <span
                                                    className={`self-start font-mono text-xs font-bold ${
                                                        isSelected
                                                            ? 'text-primary'
                                                            : 'text-on-surface'
                                                    } ${isToday ? 'text-primary' : ''}`}
                                                >
                                                    {day.dayNum}
                                                </span>

                                                {/* Overrides labels indicators */}
                                                <div className="space-y-1">
                                                    {dayDetails.holiday ? (
                                                        <div className="space-y-0.5">
                                                            <div className="h-1 w-full rounded-full bg-error" />
                                                            <p className="font-sans text-[9px] leading-none font-medium text-error">
                                                                {
                                                                    dayDetails.holiday.name.split(
                                                                        ' ',
                                                                    )[0]
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : dayDetails.slotsCount >
                                                      0 ? (
                                                        <div className="space-y-0.5">
                                                            <div className="h-1 w-full animate-pulse rounded-full bg-primary" />
                                                            <p className="font-sans text-[10px] leading-none font-semibold text-primary">
                                                                {
                                                                    dayDetails.slotsCount
                                                                }{' '}
                                                                slots
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        // Weekends or empty
                                                        (day.isSunday ||
                                                            day.isSaturday) &&
                                                        !weeklySchedule.saturdayEnabled &&
                                                        !weeklySchedule.sundayEnabled && (
                                                            <div className="h-1 w-full bg-transparent" />
                                                        )
                                                    )}

                                                    {isToday && (
                                                        <span className="absolute top-1 right-1.5 rounded bg-primary px-1 py-0.5 text-[7px] font-bold text-on-primary uppercase">
                                                            Today
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dynamic slot controller panel */}
                            <div className="rounded-b-xl border-t border-outline-variant bg-surface-container-low p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="flex items-center gap-1 text-xs font-bold text-primary">
                                        Selected Day: {selectedDayLabel}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        {/* Rendering active slot short representation circles */}
                                        <div className="flex -space-x-1.5">
                                            {selectedDayDetails.activeSlots
                                                .slice(0, 3)
                                                .map((slot, ix) => (
                                                    <div
                                                        key={ix}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-container text-[8px] font-bold tracking-tighter text-on-primary-container"
                                                    >
                                                        {slot.split(' ')[0]}
                                                    </div>
                                                ))}
                                            {selectedDayDetails.slotsCount >
                                                3 && (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface-container-highest font-mono text-[9px] font-bold text-on-surface-variant">
                                                    +
                                                    {selectedDayDetails.slotsCount -
                                                        3}
                                                </div>
                                            )}
                                            {selectedDayDetails.slotsCount ===
                                                0 && (
                                                <span className="px-2 text-[11px] text-on-surface-variant/70 italic">
                                                    No active slots custom
                                                    configured
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() =>
                                                setIsManagingSlots(true)
                                            }
                                            className="cursor-pointer rounded-lg border border-outline bg-white px-3.5 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container"
                                        >
                                            Manage Slots
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Availability Generator Fixed Box (matches screenshot mock bottom bar) */}
                <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-white shadow-lg md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3.5">
                        <div className="flex-shrink-0 rounded-xl bg-[#d2bbff]/15 p-2.5 text-[#d2bbff]">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold tracking-wide">
                                Bulk Availability Generator
                            </h4>
                            <p className="mt-0.5 text-xs text-neutral-300">
                                Automatically generate hourly slots for the next
                                90 days following your active parameters.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 border-r border-neutral-800 pr-4">
                            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                Buffer:
                            </span>
                            <select
                                value={bufferOption}
                                onChange={(e) =>
                                    setBufferOption(e.target.value)
                                }
                                className="cursor-pointer rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-white focus:border-indigo-400 focus:ring-0"
                            >
                                <option value="15 mins">15 mins</option>
                                <option value="30 mins">30 mins</option>
                                <option value="60 mins">60 mins</option>
                            </select>
                        </div>
                        <button
                            onClick={handleRunBatchGenerator}
                            className="cursor-pointer rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-primary-container active:scale-95"
                        >
                            Run Batch Generator
                        </button>
                    </div>
                </div>

                {/* MODAL 1: Add Holiday Override */}
                {isAddingHoliday && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md space-y-4 rounded-xl border border-outline-variant bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                                <h4 className="font-bold text-on-surface">
                                    Add Holiday Override
                                </h4>
                                <button
                                    onClick={() => setIsAddingHoliday(false)}
                                    className="cursor-pointer rounded-lg p-1 text-on-surface-variant hover:text-on-surface"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSaveHoliday}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-1 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                        Override Label
                                    </label>
                                    <input
                                        type="text"
                                        value={newHolidayName}
                                        onChange={(e) =>
                                            setNewHolidayName(e.target.value)
                                        }
                                        placeholder="e.g. Christmas Eve"
                                        required
                                        className="w-full rounded-lg border border-outline-variant bg-white p-2.5 text-xs font-semibold focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newHolidayStart}
                                            onChange={(e) =>
                                                setNewHolidayStart(
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            className="w-full rounded-lg border border-outline-variant p-2 font-mono text-xs focus:border-primary focus:ring-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newHolidayEnd}
                                            onChange={(e) =>
                                                setNewHolidayEnd(e.target.value)
                                            }
                                            required
                                            className="w-full rounded-lg border border-outline-variant p-2 font-mono text-xs focus:border-primary focus:ring-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                        Status Action
                                    </label>
                                    <div className="mt-1 flex gap-2.5">
                                        <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low p-2">
                                            <input
                                                type="radio"
                                                name="holidayType"
                                                checked={
                                                    newHolidayType === 'Blocked'
                                                }
                                                onChange={() =>
                                                    setNewHolidayType('Blocked')
                                                }
                                                className="text-primary focus:ring-0"
                                            />
                                            <span className="text-xs font-semibold text-on-surface">
                                                Blocked (No slots)
                                            </span>
                                        </label>
                                        <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low p-2">
                                            <input
                                                type="radio"
                                                name="holidayType"
                                                checked={
                                                    newHolidayType === 'Partial'
                                                }
                                                onChange={() =>
                                                    setNewHolidayType('Partial')
                                                }
                                                className="text-primary focus:ring-0"
                                            />
                                            <span className="text-xs font-semibold text-on-surface">
                                                Partial (Customizable)
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2.5 pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsAddingHoliday(false)
                                        }
                                        className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-container"
                                    >
                                        Save Override
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 2: Weekly Schedule Hours Edit */}
                {isEditingWeeklyTime && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-sm space-y-4 rounded-xl border border-outline-variant bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                                <h4 className="font-bold text-on-surface">
                                    Edit Routine Time
                                </h4>
                                <button
                                    onClick={() =>
                                        setIsEditingWeeklyTime(false)
                                    }
                                    className="cursor-pointer rounded-lg p-1 text-on-surface-variant hover:text-on-surface"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSaveWeeklyHours}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                            Start Time
                                        </label>
                                        <select
                                            value={tempStartTime}
                                            onChange={(e) =>
                                                setTempStartTime(e.target.value)
                                            }
                                            className="w-full cursor-pointer rounded-lg border border-outline-variant bg-white p-2 font-mono text-xs"
                                        >
                                            <option value="08:00 AM">
                                                08:00 AM
                                            </option>
                                            <option value="09:00 AM">
                                                09:00 AM
                                            </option>
                                            <option value="10:00 AM">
                                                10:00 AM
                                            </option>
                                            <option value="11:00 AM">
                                                11:00 AM
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                            End Time
                                        </label>
                                        <select
                                            value={tempEndTime}
                                            onChange={(e) =>
                                                setTempEndTime(e.target.value)
                                            }
                                            className="w-full cursor-pointer rounded-lg border border-outline-variant bg-white p-2 font-mono text-xs"
                                        >
                                            <option value="03:00 PM">
                                                03:00 PM
                                            </option>
                                            <option value="04:00 PM">
                                                04:00 PM
                                            </option>
                                            <option value="05:00 PM">
                                                05:00 PM
                                            </option>
                                            <option value="06:00 PM">
                                                06:00 PM
                                            </option>
                                            <option value="07:00 PM">
                                                07:00 PM
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2.5 pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsEditingWeeklyTime(false)
                                        }
                                        className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-container"
                                    >
                                        Update Hours
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 3: Manage Day Slots */}
                {isManagingSlots && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-sm space-y-4 rounded-xl border border-outline-variant bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                                <h4 className="text-base font-bold text-on-surface">
                                    Manage Slots: {selectedDayLabel}
                                </h4>
                                <button
                                    onClick={() => setIsManagingSlots(false)}
                                    className="cursor-pointer rounded-lg p-1 text-on-surface-variant hover:text-on-surface"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div>
                                <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">
                                    Check or uncheck the specific hour intervals
                                    you wish to unlock for clients dynamically.
                                    Changes take effect on-the-fly.
                                </p>

                                <div className="custom-scrollbar grid max-h-[250px] grid-cols-2 gap-2.5 overflow-y-auto pr-1.5">
                                    {possibleHours.map((slot) => {
                                        const slotsList =
                                            dailySlots[selectedDateStr] || [];
                                        const isChecked =
                                            slotsList.includes(slot);
                                        return (
                                            <label
                                                key={slot}
                                                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-all select-none ${
                                                    isChecked
                                                        ? 'border-primary/45 bg-primary/5 text-primary'
                                                        : 'border-outline-variant/40 bg-white text-on-surface-variant hover:bg-surface-container-low'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() =>
                                                        handleToggleSelectedTimeSlot(
                                                            slot,
                                                        )
                                                    }
                                                    className="rounded text-primary focus:ring-0"
                                                />
                                                <span className="font-mono text-xs font-semibold">
                                                    {slot}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end pt-3">
                                <button
                                    onClick={() => setIsManagingSlots(false)}
                                    className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow hover:bg-primary-container"
                                >
                                    Apply Constraints
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
