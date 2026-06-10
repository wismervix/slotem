/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
    X,
    Calendar,
    Mail,
    User,
    Briefcase,
    Clock,
    FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminServiceTwo, AdminBookingTwo, BookingStatusTwo } from '@/types';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (booking: Omit<AdminBookingTwo, 'id'>) => void;
    services: AdminServiceTwo[];
}

const AVAILABLE_TIMES = [
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:15 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
];

export default function NewBookingModal({
    isOpen,
    onClose,
    onSave,
    services,
}: NewBookingModalProps) {
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState(
        services[0]?.id || '',
    );
    const [bookingDate, setBookingDate] = useState('2024-10-28');
    const [startTime, setStartTime] = useState('10:00 AM');
    const [status, setStatus] = useState<BookingStatusTwo>('Pending');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Reset fields when opening modal
    useEffect(() => {
        if (isOpen) {
            setClientName('');
            setClientEmail('');
            if (services.length > 0) {
                setSelectedServiceId(services[0].id);
            }
            setBookingDate(new Date().toISOString().split('T')[0]);
            setStartTime('10:00 AM');
            setStatus('Pending');
            setNotes('');
            setErrors({});
        }
    }, [isOpen, services]);

    const validate = () => {
        const tempErrors: { [key: string]: string } = {};
        if (!clientName.trim())
            tempErrors.clientName = 'Client name is required';
        if (!clientEmail.trim()) {
            tempErrors.clientEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
            tempErrors.clientEmail = 'Invalid email address';
        }
        if (!bookingDate) tempErrors.bookingDate = 'Please select a date';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const calculateEndTime = (start: string, durationMinutes: number) => {
        try {
            // Simple clock adjustment
            const [time, period] = start.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            const endDate = new Date(
                startDate.getTime() + durationMinutes * 60 * 1000,
            );

            let endHours = endDate.getHours();
            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
            const endPeriod = endHours >= 12 ? 'PM' : 'AM';

            if (endHours > 12) endHours -= 12;
            if (endHours === 0) endHours = 12;

            return `${endHours}:${endMinutes} ${endPeriod}`;
        } catch {
            return '11:00 AM';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const chosenService =
            services.find((s) => s.id === selectedServiceId) || services[0];
        const endTime = calculateEndTime(
            startTime,
            chosenService?.duration || 60,
        );

        onSave({
            clientName,
            clientEmail,
            serviceId: chosenService.id,
            serviceName: chosenService.name,
            date: bookingDate,
            startTime,
            endTime,
            status,
            notes,
            price: chosenService.price,
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 bg-purple-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/20">
                            <div>
                                <h3
                                    className="text-lg font-bold text-zinc-900 dark:text-zinc-50"
                                    id="modal-new-booking-title"
                                >
                                    Generate New Appointment
                                </h3>
                                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                    Input customer details and reserve a time
                                    slot.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                id="btn-close-new-booking-modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                            {/* Client Name */}
                            <div>
                                <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                    <User className="h-3.5 w-3.5 text-purple-600" />
                                    Client Name
                                </label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) =>
                                        setClientName(e.target.value)
                                    }
                                    placeholder="Jane Doe"
                                    className={`dark:bg-zinc-850 w-full rounded-xl border bg-zinc-50/50 px-4 py-2.5 text-sm transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:text-white ${
                                        errors.clientName
                                            ? 'border-red-400'
                                            : 'border-zinc-200 dark:border-zinc-800'
                                    }`}
                                    id="input-client-name"
                                />
                                {errors.clientName && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {errors.clientName}
                                    </p>
                                )}
                            </div>

                            {/* Client Email */}
                            <div>
                                <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                    <Mail className="h-3.5 w-3.5 text-purple-600" />
                                    Client Email
                                </label>
                                <input
                                    type="email"
                                    value={clientEmail}
                                    onChange={(e) =>
                                        setClientEmail(e.target.value)
                                    }
                                    placeholder="jane.doe@email.com"
                                    className={`dark:bg-zinc-850 w-full rounded-xl border bg-zinc-50/50 px-4 py-2.5 text-sm transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:text-white ${
                                        errors.clientEmail
                                            ? 'border-red-400'
                                            : 'border-zinc-200 dark:border-zinc-800'
                                    }`}
                                    id="input-client-email"
                                />
                                {errors.clientEmail && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {errors.clientEmail}
                                    </p>
                                )}
                            </div>

                            {/* Service Selection */}
                            <div>
                                <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                    <Briefcase className="h-3.5 w-3.5 text-purple-600" />
                                    Selected Service
                                </label>
                                <select
                                    value={selectedServiceId}
                                    onChange={(e) =>
                                        setSelectedServiceId(e.target.value)
                                    }
                                    className="dark:bg-zinc-850 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-zinc-800 dark:text-white"
                                    id="select-booking-service"
                                >
                                    {services.map((srv) => (
                                        <option key={srv.id} value={srv.id}>
                                            {srv.name} (${srv.price} •{' '}
                                            {srv.duration} mins)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date & Time Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                        <Calendar className="h-3.5 w-3.5 text-purple-600" />
                                        Appointment Date
                                    </label>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) =>
                                            setBookingDate(e.target.value)
                                        }
                                        className="dark:bg-zinc-850 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-zinc-800 dark:text-white"
                                        id="input-booking-date"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                        <Clock className="h-3.5 w-3.5 text-purple-600" />
                                        Start Time
                                    </label>
                                    <select
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                        className="dark:bg-zinc-850 scrollbar w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-zinc-800 dark:text-white"
                                        id="select-booking-start-time"
                                    >
                                        {AVAILABLE_TIMES.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Status Selector */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                    Initial Booking Status
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(
                                        [
                                            'Pending',
                                            'Confirmed',
                                            'Cancelled',
                                        ] as BookingStatusTwo[]
                                    ).map((st) => (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => setStatus(st)}
                                            className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                                                status === st
                                                    ? st === 'Pending'
                                                        ? 'border-amber-300 bg-amber-100 text-amber-800'
                                                        : st === 'Confirmed'
                                                          ? 'border-blue-300 bg-blue-100 text-blue-800'
                                                          : 'border-red-300 bg-red-100 text-red-800'
                                                    : 'dark:border-zinc-850 border-zinc-200 bg-transparent text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                            }`}
                                            id={`btn-select-status-${st.toLowerCase()}`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Private Notes */}
                            <div>
                                <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                                    <FileText className="h-3.5 w-3.5 text-purple-600" />
                                    Notes & Special Instructions
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Need presentation screens ready, customer is on a priority standard timeline."
                                    rows={3}
                                    className="dark:bg-zinc-850 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-zinc-800 dark:text-white"
                                    id="textarea-booking-notes"
                                />
                            </div>

                            {/* Actions Footer */}
                            <div className="dark:border-zinc-855 flex justify-end gap-3 border-t border-zinc-100 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    id="btn-cancel-new-booking"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-500/10 transition-colors hover:bg-purple-700"
                                    id="btn-submit-new-booking"
                                >
                                    Create Booking
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
