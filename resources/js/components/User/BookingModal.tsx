import { router } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { Service, TimeSlot, Availability } from '@/types';
import {
    X,
    Calendar as CalendarIcon,
    Clock,
    Heart,
    FileText,
    MapPin,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePage } from '@inertiajs/react';
import { getServiceIcon } from '@/lib/service-icons';
import { useBookingModalContext } from '@/contexts/BookingModalContext';

export default function BookModal() {
    const { isOpen, slotId, date, serviceId, closeModal } =
        useBookingModalContext();

    const { services } = usePage<{ services: Service[] }>().props;

    const { availabilities } = usePage<{ availabilities: Availability[] }>()
        .props;

    const [step, setStep] = useState(1);

    const [notes, setNotes] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [selectedPreset, setSelectedPreset] = useState(0);

    const [selectedDate, setSelectedDate] = useState(
        () => normalizeDate(date) ?? new Date().toISOString().split('T')[0],
    );

    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    function normalizeDate(input?: string | null): string | null {
        if (!input) return null;

        const d = new Date(input);
        if (isNaN(d.getTime())) return null;

        return d.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    const availableSlots = useMemo(() => {
        const normalizedSelected = normalizeDate(selectedDate);
        if (!normalizedSelected) return [];

        const availability = availabilities.find(
            (a) => normalizeDate(a.date) === normalizedSelected,
        );

        return availability?.time_slots ?? [];
    }, [selectedDate, availabilities]);

    const availableCount = availableSlots.filter((s) => !s.is_booked).length;

    const preselectedBooking = useMemo(() => {
        const normalizedDate = normalizeDate(date);

        // validate service
        const serviceIndex = services.findIndex(
            (service) => service.id === serviceId,
        );

        const serviceValid = serviceIndex !== -1;

        // validate date
        const dateValid =
            !!normalizedDate &&
            new Date(normalizedDate).getTime() >
                Date.now() + 24 * 60 * 60 * 1000;

        // find availability
        const availability = availabilities.find(
            (a) => normalizeDate(a.date) === normalizedDate,
        );

        const slot = availability?.time_slots.find((s) => s.id === slotId);

        const slotValid = !!slot && !slot.is_booked;

        return {
            serviceValid,
            serviceIndex,
            dateValid,
            slotValid,
            slot,
            normalizedDate,
        };
    }, [serviceId, slotId, date, services, availabilities]);

    function determineInitialStep() {
        if (!preselectedBooking.serviceValid) {
            return 1;
        }

        if (!preselectedBooking.dateValid || !preselectedBooking.slotValid) {
            return 2;
        }

        return 3;
    }

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (preselectedBooking.serviceValid) {
            setSelectedPreset(preselectedBooking.serviceIndex);
        }

        if (preselectedBooking.dateValid && preselectedBooking.normalizedDate) {
            setSelectedDate(preselectedBooking.normalizedDate);
        }

        if (preselectedBooking.slotValid) {
            setSelectedSlot(preselectedBooking.slot!);
        }

        setStep(determineInitialStep());
    }, [isOpen, preselectedBooking, date]);

    React.useEffect(() => {
        if (date) {
            setSelectedDate(normalizeDate(date) ?? '');
        }
    }, [date]);

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

    const handleNextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Confirm booking
            if (!selectedSlot) return;

            router.post(
                route('booking.modal.store'),
                {
                    service_id: currentPreset.id,
                    time_slot_id: selectedSlot.id,
                    date: selectedDate,
                    notes,
                },
                {
                    preserveScroll: true,

                    onStart: () => setProcessing(true),

                    onFinish: () => setProcessing(false),

                    onSuccess: () => {
                        setShowSuccess(true);
                    },
                },
            );
        }
    };

    const handleClose = (redirect = false) => {
        setStep(1);
        setSelectedPreset(0);
        setSelectedDate(
            normalizeDate(date) || new Date().toISOString().split('T')[0],
        );
        setSelectedSlot(null);
        setNotes('');
        setShowSuccess(false);
        closeModal();

        if (redirect) {
            router.visit(route('user.bookings'));
        }

        if (showSuccess) {
            router.visit(route('user.bookings'));
        }
    };

    const currentPreset = services[selectedPreset];

    const CurrentPresetIcon = currentPreset
        ? getServiceIcon(currentPreset.icon)
        : Heart;

    // console.log('Modal Props (Date): ', date);

    // console.log('Modal Props (Slot ID): ', slotId);

    // console.log('Modal Props (Service ID): ', serviceId);

    if (!isOpen) return null;

    // console.log('selected date: ', selectedDate);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
                onClick={() => handleClose(false)}
            />

            <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant bg-gray-50 px-6 py-4 dark:bg-neutral-800">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {showSuccess ? 'Success!' : 'Book New Appointment'}
                        </h3>
                        {!showSuccess && (
                            <p className="text-xs text-secondary">
                                Step {step} of 3:{' '}
                                {step === 1
                                    ? 'Select Treatment'
                                    : step === 2
                                      ? 'Schedule Date & Time'
                                      : 'Add Details & Confirm'}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => handleClose(false)}
                        className="rounded-lg p-1 px-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-700 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content body */}
                <div className="flex-grow overflow-y-auto p-6 text-gray-700 dark:text-neutral-200">
                    {showSuccess ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <CheckCircle className="h-10 w-10 animate-bounce" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                Appointment Booked!
                            </h4>
                            <p className="max-w-sm text-sm text-secondary">
                                Your appointment for{' '}
                                <strong>{currentPreset.name}</strong> at{' '}
                                <strong>{currentPreset.variant}</strong> has
                                been scheduled successfully.
                            </p>

                            <div className="mt-4 w-full space-y-2 rounded-xl border border-outline-variant bg-gray-50 p-4 text-left text-xs font-medium dark:bg-neutral-800">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Service:
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {currentPreset.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Provider:
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        {currentPreset.variant}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date:</span>
                                    {selectedSlot && (
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatSelectedDate(
                                                selectedDate,
                                            )}{' '}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Time:</span>
                                    {selectedSlot && (
                                        <span className="text-gray-900 dark:text-white">
                                            {formatTime(
                                                selectedSlot.start_time,
                                            )}{' '}
                                            -{' '}
                                            {formatTime(selectedSlot.end_time)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Estimated Cost:
                                    </span>
                                    <span className="font-bold text-primary">
                                        ${currentPreset.price}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleClose(true)}
                                className="mt-6 w-full cursor-pointer rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:backdrop-brightness-95"
                            >
                                Close and View Calendar
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* STEP 1: SELECT PRESET SERVICE */}
                            {step === 1 && (
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        What service do you need?
                                    </label>
                                    <div className="grid gap-3">
                                        {services.map((preset, idx) => {
                                            const IconComponent =
                                                getServiceIcon(preset.icon);
                                            const isSelected =
                                                selectedPreset === idx;
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() =>
                                                        setSelectedPreset(idx)
                                                    }
                                                    className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5 ring-2 ring-primary'
                                                            : 'border-outline-variant hover:bg-gray-50 dark:hover:bg-neutral-800'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                            isSelected
                                                                ? 'bg-primary text-white'
                                                                : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'
                                                        }`}
                                                    >
                                                        <IconComponent className="h-5 w-5" />
                                                    </div>

                                                    <div className="flex-grow space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                                                                {preset.name}
                                                            </h5>
                                                            <span className="text-xs font-extrabold text-primary">
                                                                ${preset.price}
                                                            </span>
                                                        </div>
                                                        <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                                            <MapPin className="h-3 w-3 shrink-0 text-secondary" />
                                                            {preset.variant}
                                                        </p>
                                                        <p className="text-[11px] leading-normal text-gray-400">
                                                            {preset.description}
                                                        </p>
                                                        <div className="mt-1 flex w-max items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase dark:bg-neutral-800">
                                                            <Clock className="h-3 w-3" />
                                                            {preset.duration}{' '}
                                                            MINS
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: SELECT DATE AND TIME */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <div className="mb-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <CurrentPresetIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                                                {currentPreset.name}
                                            </h5>
                                            <p className="text-xs font-medium text-gray-500">
                                                {currentPreset.variant}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            <CalendarIcon className="h-4 w-4 text-primary" />
                                            Pick Appointment Date
                                        </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) =>
                                                setSelectedDate(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-outline-variant bg-white p-3 font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                        />
                                        <p className="text-[11px] text-gray-400">
                                            Standard operating hours are Mon-Sat
                                            from 08:00 AM to 06:00 PM.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Select Available Time Slot (
                                            {availableCount} slots available)
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableSlots.length === 0 ? (
                                                <p className="col-span-2 text-center text-sm text-gray-400">
                                                    No available slots for this
                                                    date. Please select another
                                                    date.
                                                </p>
                                            ) : (
                                                availableSlots.map((slot) => {
                                                    const selected =
                                                        selectedSlot?.start_time ===
                                                        slot.start_time;

                                                    const isBooked =
                                                        slot.is_booked;
                                                    return (
                                                        <button
                                                            key={
                                                                slot.start_time
                                                            }
                                                            disabled={isBooked}
                                                            onClick={() =>
                                                                setSelectedSlot(
                                                                    slot,
                                                                )
                                                            }
                                                            className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition-all duration-200 ${
                                                                isBooked
                                                                    ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through opacity-60 dark:bg-gray-800'
                                                                    : selected
                                                                      ? 'border-purple-600 bg-purple-600 text-white shadow-md ring-2 ring-purple-600/10'
                                                                      : 'border-gray-200 bg-white text-gray-700 shadow-sm hover:border-purple-600 hover:text-purple-600 dark:border-purple-300'
                                                            }`}
                                                        >
                                                            {formatTime(
                                                                slot.start_time,
                                                            )}{' '}
                                                            -{' '}
                                                            {formatTime(
                                                                slot.end_time,
                                                            )}
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
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: DETAILS AND CONFIRMATION */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-xl border border-outline-variant shadow-xs">
                                        <div className="flex items-center justify-between border-b border-outline-variant bg-gray-50 p-4 text-xs dark:bg-neutral-800">
                                            <span className="font-bold text-gray-500 uppercase">
                                                Appointment Summary
                                            </span>
                                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-600 dark:bg-emerald-900/30">
                                                Instant Booking
                                            </span>
                                        </div>

                                        <div className="space-y-3 p-4">
                                            <div className="flex gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                                    <CurrentPresetIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {currentPreset.name}
                                                    </h4>
                                                    <p className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                                        {currentPreset.variant}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="h-px bg-outline-variant" />

                                            <div className="grid grid-cols-2 gap-y-2 text-xs leading-relaxed font-semibold">
                                                <span className="text-gray-400">
                                                    Scheduled Date:
                                                </span>
                                                <span className="text-right text-gray-900 dark:text-white">
                                                    {selectedSlot && (
                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                            {formatSelectedDate(
                                                                selectedDate,
                                                            )}{' '}
                                                        </span>
                                                    )}
                                                </span>

                                                <span className="text-gray-400">
                                                    Scheduled Time:
                                                </span>
                                                <span className="text-right text-gray-900 dark:text-white">
                                                    {selectedSlot && (
                                                        <span className="text-gray-900 dark:text-white">
                                                            {formatTime(
                                                                selectedSlot.start_time,
                                                            )}{' '}
                                                            -{' '}
                                                            {formatTime(
                                                                selectedSlot.end_time,
                                                            )}
                                                        </span>
                                                    )}
                                                </span>

                                                <span className="text-gray-400">
                                                    Duration Limit:
                                                </span>
                                                <span className="text-right text-gray-900 dark:text-white">
                                                    {currentPreset.duration}{' '}
                                                    mins
                                                </span>

                                                <span className="text-gray-400">
                                                    Estimated Charge:
                                                </span>
                                                <span className="text-right font-bold text-primary">
                                                    ${currentPreset.price} USD
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Add suggestions (optional)
                                        </label>
                                        <textarea
                                            placeholder="e.g. Low taper fade, beard trim included, natural products only, sensitive scalp, inspiration photo available."
                                            rows={3}
                                            value={notes}
                                            onChange={(e) =>
                                                setNotes(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-outline-variant bg-white p-3 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                        />
                                    </div>

                                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/50 bg-amber-50 p-3 text-[11px] text-amber-800 dark:bg-amber-950/20 dark:text-amber-200">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                        <p>
                                            Cancellations must be requested at
                                            least 24 hours prior to the slot.
                                            Insurance verification occurs at
                                            reception.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* NAV BUTTONS */}
                            <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-gray-600 transition-all hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                    >
                                        Go Back
                                    </button>
                                ) : (
                                    <div />
                                )}

                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={handleNextStep}
                                    className="flex cursor-pointer items-center gap-1 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white transition-all hover:shadow-md active:scale-98"
                                >
                                    {processing && (
                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    )}

                                    {processing
                                        ? 'Processing...'
                                        : step === 3
                                          ? 'Schedule Appointment'
                                          : 'Continue'}
                                    {/* {step === 3
                                        ? 'Schedule Appointment'
                                        : 'Continue'} */}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
