import AdminLayout from '@/layouts/Admin/AdminLayout';
import {
    Download,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Clock,
    AlertTriangle,
    X,
    Pencil,
} from 'lucide-react';
import { useEffect, useState, FormEvent, useMemo } from 'react';

import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/components/Shared/ConfirmationModal';

import type { Availability, TimeSlot } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    formatDate,
    generateCalendarDays,
    isPastDate,
} from '@/lib/calendar-utils';

export default function AdminAvailability() {
    const { availabilities } = usePage<{
        availabilities: Availability[];
    }>().props;

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    // Use the confirmation hook
    const confirmation = useConfirmation();

    const today = new Date();
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const [selectedDate, setSelectedDate] = useState(today);
    const selectedDateStr = formatDate(selectedDate);

    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickStartTime, setQuickStartTime] = useState('');
    const [quickEndTime, setQuickEndTime] = useState('');

    const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
    const [editStartTime, setEditStartTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');

    const [showCopyModal, setShowCopyModal] = useState(false);
    const [copyWeekdays, setCopyWeekdays] = useState<number[]>([]);
    const [copyTargetDate, setCopyTargetDate] = useState('');

    const weekdays = [
        { label: 'Sunday', value: 0 },
        { label: 'Monday', value: 1 },
        { label: 'Tuesday', value: 2 },
        { label: 'Wednesday', value: 3 },
        { label: 'Thursday', value: 4 },
        { label: 'Friday', value: 5 },
        { label: 'Saturday', value: 6 },
    ];

    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);

    // Presets for form state(s)
    const [selectedPreset, setSelectedPreset] = useState<
        'custom' | 'weekdays' | 'weekends'
    >('custom');

    // Form state for bulk slot creation
    const [formDateStart, setFormDateStart] = useState('2027-01-01');
    const [formDateEnd, setFormDateEnd] = useState('2027-01-13');
    const [formTimeStart, setFormTimeStart] = useState('09:00');
    const [formTimeEnd, setFormTimeEnd] = useState('17:00');
    const [formClosedDates, setFormClosedDates] = useState<string[]>([]);
    const [formClosedWeekdays, setFormClosedWeekdays] = useState<number[]>([]);

    const applyPreset = (preset: 'weekdays' | 'weekends' | 'custom') => {
        setSelectedPreset(preset);

        if (preset === 'weekdays') {
            setFormClosedWeekdays([0, 6]); // Sunday + Saturday closed
        }

        if (preset === 'weekends') {
            setFormClosedWeekdays([1, 2, 3, 4, 5]); // Mon–Fri closed
        }

        if (preset === 'custom') {
            setFormClosedWeekdays([]);
        }
    };

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
    function monthLabel() {
        return new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        });
    }

    const handleToday = () => {
        const today = new Date();

        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(today);
    };

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

    const calendarDays = useMemo(() => {
        return generateCalendarDays(currentMonth, currentYear);
    }, [currentMonth, currentYear]);

    const isCurrentMonth =
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    const getAvailabilityForDate = (
        dateStr: String,
    ): Availability | undefined => {
        return availabilities.find((a) => a.date === dateStr);
    };

    const selectedAvailability = getAvailabilityForDate(selectedDateStr);

    const selectedDayStats = useMemo(() => {
        const slots = selectedAvailability?.time_slots ?? [];

        const total = slots.length;
        const booked = slots.filter((s) => s.is_booked).length;
        const available = total - booked;

        return { total, booked, available };
    }, [selectedAvailability]);

    const isDateClosed = (date: Date) => {
        const dateStr = formatDate(date);
        return !availabilities.some((a) => a.date === dateStr);
    };

    const isClosed = !selectedAvailability;

    // Actual close-day logic, now only invoked after confirmation.
    const performCloseDay = () => {
        inertiaRouter.delete(
            route('admin.availability.destroy', selectedAvailability?.id),
            {
                preserveScroll: true,

                onSuccess: () => {
                    triggerToast('Day marked as closed');
                },
            },
        );
    };

    const handleCloseDay = () => {
        if (!selectedAvailability) return;

        const bookedCount = selectedAvailability.time_slots.filter(
            (s) => s.is_booked,
        ).length;

        confirmation.confirm({
            title: 'Mark day as closed?',
            message:
                bookedCount > 0
                    ? `${formatDateLabel(selectedDateStr)} has ${bookedCount} booked slot${
                          bookedCount === 1 ? '' : 's'
                      }. Closing this day will remove all of its time slots. This cannot be undone.`
                    : `This will remove all time slots for ${formatDateLabel(
                          selectedDateStr,
                      )} and mark it as closed. This cannot be undone.`,
            confirmLabel: 'Mark Closed',
            variant: 'danger',
            onConfirm: performCloseDay,
        });
    };

    const handleReopenDay = (dateStr: string) => {
        // inertiaRouter.post(route('admin.availability.store'), {
        //     date: dateStr,
        // });

        setShowQuickAdd(true);

        triggerToast('Day reopened');
    };

    // ============================================
    // TIME SLOT OPERATIONS
    // ============================================
    const performDeleteTimeSlot = (slotId: number) => {
        inertiaRouter.delete(route('admin.time-slots.destroy', slotId));

        triggerToast('Slot deleted');
    };

    const handleDeleteTimeSlot = (slot: TimeSlot) => {
        if (slot.is_booked) return;

        confirmation.confirm({
            title: 'Delete this time slot?',
            message: `This will permanently delete the ${slot.start_time} – ${slot.end_time} slot. This cannot be undone.`,
            confirmLabel: 'Delete Slot',
            variant: 'danger',
            onConfirm: () => performDeleteTimeSlot(slot.id),
        });
    };

    // const handleDeleteTimeSlot = (slotId: number) => {
    //     inertiaRouter.delete(route('admin.time-slots.destroy', slotId));
    // };

    const handleCopyToDate = () => {
        inertiaRouter.post(route('admin.availability.copy-schedule'), {
            source_date: selectedDateStr,
            target_dates: [copyTargetDate],
        });

        triggerToast('Schedule copied');
        setShowCopyModal(false);
    };

    const handleCopyToWeekdays = () => {
        const sourceAvailability = getAvailabilityForDate(selectedDateStr);

        if (!sourceAvailability) return;

        const targetDates = calendarDays
            .filter(
                ({ date, currentMonth }) =>
                    currentMonth && copyWeekdays.includes(date.getDay()),
            )
            .map(({ date }) => formatDate(date))
            .filter((date) => date !== selectedDateStr);

        inertiaRouter.post(route('admin.availability.copy-schedule'), {
            source_date: selectedDateStr,
            target_dates: targetDates,
        });

        triggerToast('Schedule copied');
        setShowCopyModal(false);
    };

    const handleOpenEditSlotModal = (slot: TimeSlot) => {
        setEditingSlot(slot);

        setEditStartTime(slot.start_time);
        setEditEndTime(slot.end_time);
    };

    const handleEditSlot = () => {
        if (!editingSlot) return;

        inertiaRouter.put(route('admin.time-slots.update', editingSlot.id), {
            start_time: editStartTime,
            end_time: editEndTime,
        });

        setEditingSlot(null);

        triggerToast('Slot updated');
    };

    const handleQuickAddSlot = () => {
        if (!quickStartTime || !quickEndTime) return;

        inertiaRouter.post(route('admin.time-slots.store'), {
            date: selectedDateStr,
            start_time: quickStartTime,
            end_time: quickEndTime,
        });

        setQuickStartTime('');
        setQuickEndTime('');
        setShowQuickAdd(false);

        triggerToast('Slot added');
    };

    // ============================================
    // FORM SUBMISSION
    // ============================================
    const performSubmitBulkForm = () => {
        inertiaRouter.post(route('admin.time-slots.bulk-create'), {
            start_date: formDateStart,
            end_date: formDateEnd,
            start_time: formTimeStart,
            end_time: formTimeEnd,
            closed_dates: formClosedDates,
            closed_weekdays: formClosedWeekdays,
        });

        triggerToast('Time slots created successfully!');
    };

    const handleSubmitBulkForm = (e: FormEvent) => {
        e.preventDefault();

        // Bulk creation can touch many days at once (and silently overwrite
        // existing slots depending on backend behavior), so confirm first.
        confirmation.confirm({
            title: 'Create time slots in bulk?',
            message: `This will create time slots from ${formatDateLabel(
                formDateStart,
            )} to ${formatDateLabel(
                formDateEnd,
            )} (${formTimeStart}–${formTimeEnd}), skipping any closed dates or weekdays you've excluded.`,
            confirmLabel: 'Create Slots',
            variant: 'warning',
            onConfirm: performSubmitBulkForm,
        });
    };

    // const handleSubmitBulkForm = (e: FormEvent) => {
    //     e.preventDefault();

    //     inertiaRouter.post(route('admin.time-slots.bulk-create'), {
    //         start_date: formDateStart,
    //         end_date: formDateEnd,
    //         start_time: formTimeStart,
    //         end_time: formTimeEnd,
    //         closed_dates: formClosedDates,
    //         closed_weekdays: formClosedWeekdays,
    //     });

    //     triggerToast('Time slots created successfully!');
    // };

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

    // console.log('Availabilities: ', DatabaseAvailabilities);

    // ============================================
    // UI HELPERS
    // ============================================
    const getStatusStyles = (
        status: 'none' | 'available' | 'partial' | 'full',
    ) => {
        switch (status) {
            case 'available':
                return {
                    dot: 'bg-green-500',
                    badge: 'text-green-600 dark:text-green-400',
                };

            case 'partial':
                return {
                    dot: 'bg-amber-500',
                    badge: 'text-amber-600 dark:text-amber-400',
                };

            case 'full':
                return {
                    dot: 'bg-red-500',
                    badge: 'text-red-600 dark:text-red-400',
                };

            default:
                return {
                    dot: 'bg-gray-400',
                    badge: 'text-gray-500 dark:text-gray-400',
                };
        }
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
                                    {monthLabel()}
                                </h2>
                                <div className="flex gap-0.5">
                                    <button
                                        onClick={handleToday}
                                        className="rounded rounded-sm border border-on-primary px-3 py-1 text-xs font-semibold hover:bg-white dark:hover:bg-slate-600"
                                    >
                                        Today
                                    </button>
                                    <button
                                        disabled={isCurrentMonth}
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
                                    {days.map((day) => (
                                        <div
                                            key={day}
                                            className="border-t border-r border-outline-variant/30 py-2.5 dark:border-slate-700"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 border-l border-outline-variant/20 dark:border-slate-700">
                                    {calendarDays.map(
                                        (
                                            {
                                                date,
                                                currentMonth: isCurrentMonthDay,
                                            },
                                            idx,
                                        ) => {
                                            const formattedDate =
                                                formatDate(date);

                                            const isToday =
                                                formatDate(new Date()) ===
                                                formattedDate;

                                            const isSelected =
                                                selectedDateStr ===
                                                formattedDate;
                                            // selectedDate === formattedDate;

                                            //Give me the availability record whose date matches.
                                            const availability =
                                                getAvailabilityForDate(
                                                    formattedDate,
                                                );

                                            const bookedCount =
                                                availability?.time_slots.filter(
                                                    (slot) => slot.is_booked,
                                                ).length ?? 0;

                                            const totalCount =
                                                availability?.time_slots
                                                    .length ?? 0;

                                            const closed = !availability;

                                            const status =
                                                totalCount === 0
                                                    ? 'none'
                                                    : bookedCount === totalCount
                                                      ? 'full'
                                                      : bookedCount > 0
                                                        ? 'partial'
                                                        : 'available';

                                            const statusStyles =
                                                getStatusStyles(status);

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        if (isPastDate(date))
                                                            return;
                                                        setSelectedDate(date);
                                                    }}
                                                    className={`relative flex min-h-[80px] cursor-pointer flex-col justify-between border-t border-r border-outline-variant/30 p-2 transition-all select-none dark:border-slate-700 ${
                                                        isPastDate(date) ||
                                                        !isCurrentMonthDay
                                                            ? 'bg-gray-50/40 opacity-30 dark:bg-slate-800/30'
                                                            : 'bg-surface dark:bg-slate-900'
                                                    } ${
                                                        closed
                                                            ? 'bg-red-50 opacity-60 dark:bg-red-950/20'
                                                            : ''
                                                    } ${
                                                        isSelected
                                                            ? 'bg-primary/5 ring-2 ring-primary ring-inset dark:bg-purple-950/20 dark:ring-purple-500'
                                                            : 'hover:bg-primary/5 dark:hover:bg-purple-950/10'
                                                    } ${isPastDate(date) ? 'pointer-events-none' : ''}`}
                                                >
                                                    <span
                                                        className={`font-mono text-xs font-bold ${isSelected ? 'text-primary dark:text-purple-400' : 'text-on-surface dark:text-white'}`}
                                                    >
                                                        {date.getDate()}
                                                    </span>
                                                    {closed && (
                                                        <div className="text-[9px] font-bold text-red-500">
                                                            CLOSED
                                                        </div>
                                                    )}
                                                    <div
                                                        className="flex items-center gap-1"
                                                        title="Total amount of available slots"
                                                    >
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                                                        />
                                                        <span
                                                            className={`text-[9px] font-semibold ${statusStyles.badge}`}
                                                        >
                                                            {totalCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
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

                        <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row">
                            <button
                                onClick={handleCloseDay}
                                className="mt-2 cursor-pointer text-xs font-semibold text-red-500"
                            >
                                Mark Closed
                            </button>

                            <button
                                onClick={() => handleReopenDay(selectedDateStr)}
                                className="mt-2 cursor-pointer text-xs font-semibold text-green-500"
                            >
                                Reopen Day
                            </button>
                        </div>

                        <div className="mb-3 rounded-lg bg-surface-container-low p-3 text-xs dark:bg-slate-800">
                            <div className="flex justify-between">
                                <span>{selectedDate.toDateString()}</span>
                            </div>

                            <div className="mt-2 flex gap-4 font-semibold">
                                <span>{selectedDayStats.total} slots</span>
                                <span className="text-red-500">
                                    {selectedDayStats.booked} booked
                                </span>
                                <span className="text-green-500">
                                    {selectedDayStats.available} available
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {isClosed ? (
                                <p className="py-4 text-center text-xs font-semibold text-red-500">
                                    This day is marked as closed
                                </p>
                            ) : !selectedAvailability ||
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
                                        {slot.is_booked && (
                                            <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-950 dark:text-red-300">
                                                Booked
                                            </span>
                                        )}
                                        <span className="font-mono text-xs font-semibold text-on-surface dark:text-white">
                                            {slot.start_time} – {slot.end_time}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() =>
                                                    handleOpenEditSlotModal(
                                                        slot,
                                                    )
                                                }
                                                className="cursor-pointer rounded p-1 text-on-surface-variant transition-colors hover:bg-white/20 dark:hover:bg-slate-700"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (slot.is_booked) return;
                                                    handleDeleteTimeSlot(slot);
                                                }}
                                                className={` ${
                                                    slot.is_booked
                                                        ? 'cursor-not-allowed opacity-40'
                                                        : 'hover:bg-white/20 dark:hover:bg-slate-700'
                                                } cursor-pointer rounded p-1 text-on-surface-variant transition-colors hover:bg-white/20 dark:hover:bg-slate-700`}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row">
                            <button
                                onClick={() => setShowQuickAdd(true)}
                                className="w-full rounded-lg border border-outline px-4 py-2 text-xs font-semibold hover:bg-surface-container/5 dark:border-slate-700 dark:text-white"
                            >
                                + Add Slot
                            </button>

                            <button
                                onClick={() => setShowCopyModal(true)}
                                disabled={
                                    !selectedAvailability ||
                                    selectedAvailability.time_slots.length === 0
                                }
                                className="w-full rounded-lg border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-500 dark:text-purple-400"
                            >
                                Copy Schedule
                            </button>
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
                        <div>
                            <label className="mb-2 block text-xs font-bold text-on-surface-variant uppercase dark:text-slate-400">
                                Presets
                            </label>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => applyPreset('weekdays')}
                                    className={`rounded border px-3 py-1 text-xs font-semibold ${
                                        selectedPreset === 'weekdays'
                                            ? 'bg-primary text-white'
                                            : 'border-outline-variant dark:border-slate-700'
                                    }`}
                                >
                                    Weekdays Only
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyPreset('weekends')}
                                    className={`rounded border px-3 py-1 text-xs font-semibold ${
                                        selectedPreset === 'weekends'
                                            ? 'bg-primary text-white'
                                            : 'border-outline-variant dark:border-slate-700'
                                    }`}
                                >
                                    Weekends Only
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyPreset('custom')}
                                    className={`rounded border px-3 py-1 text-xs font-semibold ${
                                        selectedPreset === 'custom'
                                            ? 'bg-primary text-white'
                                            : 'border-outline-variant dark:border-slate-700'
                                    }`}
                                >
                                    Custom
                                </button>
                            </div>
                        </div>

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

                        {/* Exclude Dates (Closed Days) */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase">
                                Closed Dates
                            </label>

                            <input
                                type="date"
                                onChange={(e) => {
                                    if (!e.target.value) return;

                                    setFormClosedDates((prev) => [
                                        ...prev,
                                        e.target.value,
                                    ]);
                                }}
                                className="w-full rounded border p-2"
                            />

                            <div className="mt-2 flex flex-wrap gap-2">
                                {formClosedDates.map((d) => (
                                    <span
                                        key={d}
                                        className="rounded bg-red-100 px-2 py-1 text-xs"
                                    >
                                        {d}
                                        <button
                                            onClick={() =>
                                                setFormClosedDates((prev) =>
                                                    prev.filter((x) => x !== d),
                                                )
                                            }
                                            className="ml-2"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Closed Weekdays */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase">
                                Closed Weekdays
                            </label>

                            <div className="grid grid-cols-2 gap-2">
                                {weekdays.map((day) => (
                                    <label
                                        key={day.value}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formClosedWeekdays.includes(
                                                day.value,
                                            )}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormClosedWeekdays(
                                                        (prev) => [
                                                            ...prev,
                                                            day.value,
                                                        ],
                                                    );
                                                } else {
                                                    setFormClosedWeekdays(
                                                        (prev) =>
                                                            prev.filter(
                                                                (v) =>
                                                                    v !==
                                                                    day.value,
                                                            ),
                                                    );
                                                }
                                            }}
                                        />
                                        {day.label}
                                    </label>
                                ))}
                            </div>
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

            {showQuickAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 dark:bg-slate-900">
                        <h3 className="mb-4 text-lg font-semibold text-on-surface dark:text-white">
                            Add Time Slot
                        </h3>

                        {/* Add this line to show the date */}
                        <p className="mb-4 text-sm text-on-surface-variant dark:text-slate-400">
                            For {formatDateLabel(selectedDateStr)}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs">Start Time</label>
                                <input
                                    type="time"
                                    value={quickStartTime}
                                    onChange={(e) =>
                                        setQuickStartTime(e.target.value)
                                    }
                                    className="w-full rounded border p-2"
                                />
                            </div>

                            <div>
                                <label className="text-xs">End Time</label>
                                <input
                                    type="time"
                                    value={quickEndTime}
                                    onChange={(e) =>
                                        setQuickEndTime(e.target.value)
                                    }
                                    className="w-full rounded border p-2"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleQuickAddSlot}
                                    className="flex-1 rounded bg-primary px-3 py-2 text-xs text-white"
                                >
                                    Add
                                </button>

                                <button
                                    onClick={() => setShowQuickAdd(false)}
                                    className="flex-1 rounded border px-3 py-2 text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 dark:bg-slate-900">
                        <h3 className="mb-4 text-lg font-semibold">
                            Edit Time Slot
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={editStartTime}
                                    onChange={(e) =>
                                        setEditStartTime(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={editEndTime}
                                    onChange={(e) =>
                                        setEditEndTime(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex gap-2">
                                <button onClick={handleEditSlot}>Save</button>

                                <button onClick={() => setEditingSlot(null)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCopyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface shadow-xl dark:border-slate-700 dark:bg-slate-900">
                        {/* Header */}
                        <div className="border-b border-outline-variant p-5 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-on-surface dark:text-white">
                                Copy Schedule
                            </h3>

                            <p className="mt-1 text-xs text-on-surface-variant dark:text-slate-400">
                                Copy all time slots from{' '}
                                <span className="font-semibold">
                                    {formatDateLabel(selectedDateStr)}
                                </span>
                            </p>
                        </div>

                        {/* Body */}
                        <div className="space-y-6 p-5">
                            {/* Weekdays */}
                            <div>
                                <label className="mb-3 block text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-400">
                                    Apply To Weekdays
                                </label>

                                <div className="grid grid-cols-2 gap-2">
                                    {weekdays.map((day) => (
                                        <label
                                            key={day.value}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant p-2 dark:border-slate-700"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={copyWeekdays.includes(
                                                    day.value,
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setCopyWeekdays(
                                                            (prev) => [
                                                                ...prev,
                                                                day.value,
                                                            ],
                                                        );
                                                    } else {
                                                        setCopyWeekdays(
                                                            (prev) =>
                                                                prev.filter(
                                                                    (v) =>
                                                                        v !==
                                                                        day.value,
                                                                ),
                                                        );
                                                    }
                                                }}
                                            />

                                            <span className="text-xs dark:text-white">
                                                {day.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCopyToWeekdays}
                                    disabled={copyWeekdays.length === 0}
                                    className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 dark:bg-purple-600"
                                >
                                    Copy To Selected Weekdays
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-outline-variant dark:border-slate-700" />

                            {/* Specific Date */}
                            <div>
                                <label className="mb-2 block text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-400">
                                    Copy To Specific Date
                                </label>

                                <input
                                    type="date"
                                    value={copyTargetDate}
                                    onChange={(e) =>
                                        setCopyTargetDate(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-outline-variant bg-surface p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />

                                <button
                                    type="button"
                                    onClick={handleCopyToDate}
                                    disabled={!copyTargetDate}
                                    className="mt-3 w-full rounded-lg border border-primary px-4 py-2 text-xs font-semibold text-primary disabled:opacity-50 dark:border-purple-500 dark:text-purple-400"
                                >
                                    Copy To Date
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t border-outline-variant p-4 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCopyModal(false);
                                    setCopyTargetDate('');
                                    setCopyWeekdays([]);
                                }}
                                className="rounded-lg border border-outline px-4 py-2 text-xs font-semibold dark:border-slate-700 dark:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Generic confirmation modal for destructive / high-impact actions */}
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={confirmation.close}
                onConfirm={confirmation.handleConfirm}
                title={confirmation.options?.title || ''}
                message={confirmation.options?.message || ''}
                confirmLabel={confirmation.options?.confirmLabel}
                cancelLabel={confirmation.options?.cancelLabel}
                variant={confirmation.options?.variant}
                isLoading={confirmation.isLoading}
            />

            {/* Toast notification */}
            {isToastVisible && (
                <div className="fixed right-6 bottom-6 left-6 rounded-lg border border-outline-variant bg-surface-container-low p-4 text-xs font-semibold text-on-surface shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    {toastMessage}
                </div>
            )}
        </AdminLayout>
    );
}
