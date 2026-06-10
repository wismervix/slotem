/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminBookingTwo } from '@/types';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: AdminBookingTwo | null;
    onUpdateNotes: (bookingId: string, notes: string) => void;
}

export default function NotesModal({
    isOpen,
    onClose,
    booking,
    onUpdateNotes,
}: NotesModalProps) {
    const [notesText, setNotesText] = useState('');

    useEffect(() => {
        if (booking) {
            setNotesText(booking.notes || '');
        }
    }, [booking, isOpen]);

    const handleSave = () => {
        if (booking) {
            onUpdateNotes(booking.id, notesText);
            onClose();
        }
    };

    if (!booking) return null;

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

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className="animate-fade-in relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 bg-purple-50/20 px-6 py-4 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <Clipboard className="h-5 w-5 text-purple-600" />
                                <div>
                                    <h3
                                        className="text-base font-bold text-zinc-900 dark:text-zinc-50"
                                        id="notes-modal-title"
                                    >
                                        Appointment Notes
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {booking.clientName} •{' '}
                                        {booking.serviceName}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                id="btn-close-notes-modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content Field */}
                        <div className="space-y-4 p-6">
                            <div className="dark:bg-zinc-850/40 space-y-1 rounded-xl border border-purple-100/50 bg-purple-50/40 p-3.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-zinc-800 dark:text-zinc-300">
                                        Scheduled:
                                    </span>
                                    <span>
                                        {booking.date} @ {booking.startTime}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-zinc-800 dark:text-zinc-300">
                                        Status:
                                    </span>
                                    <span className="font-semibold">
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-zinc-800 dark:text-zinc-300">
                                        Estimated value:
                                    </span>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">
                                        ${booking.price}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                    Session Notes & Follow-ups
                                </label>
                                <textarea
                                    value={notesText}
                                    onChange={(e) =>
                                        setNotesText(e.target.value)
                                    }
                                    placeholder="Record summary points or action items..."
                                    rows={6}
                                    className="dark:bg-zinc-850 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-zinc-800 dark:text-white"
                                    id="textarea-appointment-notes-field"
                                />
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex justify-end gap-2 border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800/80 dark:bg-zinc-950/30">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                id="btn-cancel-notes"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/10 transition-colors hover:bg-purple-700"
                                id="btn-save-notes"
                            >
                                <Save className="h-4 w-4" />
                                Save Notes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
