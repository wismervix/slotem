/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkles, X, Heart } from 'lucide-react';

import {
    AdminBookingTwo,
    BookingStatusTwo,
    AdminServiceTwo,
    BusinessSettings,
    BusinessHours,
    HolidayBlock,
} from '@/types';
import {
    INITIAL_BOOKINGS,
    INITIAL_SERVICES,
    INITIAL_BUSINESS_SETTINGS,
    INITIAL_BUSINESS_HOURS,
} from '@/data/initial-data-two';

import Sidebar from '@/components/Admin/VersionTwo/Sidebar';
import DashboardView from '@/components/Admin/VersionTwo/DashboardView';
import BookingsView from '@/components/Admin/VersionTwo/BookingsView';
import AvailabilityView from '@/components/Admin/VersionTwo/AvailabilityView';
import SettingsView from '@/components/Admin/VersionTwo/SettingsView';
import NewBookingModal from '@/components/Admin/VersionTwo/NewBookingModal';
import NotesModal from '@/components/Admin/VersionTwo/NotesModal';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
}

export default function App() {
    // 1. Core State with LocalStorage fallbacks
    const [activeTab, setActiveTab] = useState<string>('bookings'); // default is bookings to match screenshot
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('slotem-dark') === 'true';
    });

    const [bookings, setBookings] = useState<AdminBookingTwo[]>(() => {
        const saved = localStorage.getItem('slotem-bookings');
        return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    });

    const [services, setServices] = useState<AdminServiceTwo[]>(() => {
        const saved = localStorage.getItem('slotem-services');
        return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    });

    const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(
        () => {
            const saved = localStorage.getItem('slotem-settings');
            return saved ? JSON.parse(saved) : INITIAL_BUSINESS_SETTINGS;
        },
    );

    const [businessHours, setBusinessHours] = useState<BusinessHours[]>(() => {
        const saved = localStorage.getItem('slotem-hours');
        return saved ? JSON.parse(saved) : INITIAL_BUSINESS_HOURS;
    });

    const [holidayBlocks, setHolidayBlocks] = useState<HolidayBlock[]>(() => {
        const saved = localStorage.getItem('slotem-holidays');
        return saved ? JSON.parse(saved) : [];
    });

    // Modal display states
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
    const [selectedBookingForNotes, setSelectedBookingForNotes] =
        useState<AdminBookingTwo | null>(null);
    const [isNotesOpen, setIsNotesOpen] = useState(false);

    // Floating notifications
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Apply dark class
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('slotem-dark', String(darkMode));
    }, [darkMode]);

    // Sync state modifications back to localStorage
    useEffect(() => {
        localStorage.setItem('slotem-bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('slotem-services', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem(
            'slotem-settings',
            JSON.stringify(businessSettings),
        );
    }, [businessSettings]);

    useEffect(() => {
        localStorage.setItem('slotem-hours', JSON.stringify(businessHours));
    }, [businessHours]);

    useEffect(() => {
        localStorage.setItem('slotem-holidays', JSON.stringify(holidayBlocks));
    }, [holidayBlocks]);

    // Toast Helpers
    const addToast = (
        message: string,
        type: 'success' | 'info' | 'error' = 'success',
    ) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // 2. Global Event Handlers for Bookings state
    const handleApproveBooking = (id: string) => {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === id
                    ? { ...b, status: 'Confirmed' as BookingStatusTwo }
                    : b,
            ),
        );
        const target = bookings.find((b) => b.id === id);
        addToast(
            `Approved booking for ${target?.clientName || 'customer'}!`,
            'success',
        );
    };

    const handleRejectBooking = (id: string) => {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === id
                    ? { ...b, status: 'Cancelled' as BookingStatusTwo }
                    : b,
            ),
        );
        const target = bookings.find((b) => b.id === id);
        addToast(
            `Cancelled appointment for ${target?.clientName || 'customer'}.`,
            'info',
        );
    };

    const handleCompleteBooking = (id: string) => {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === id
                    ? { ...b, status: 'Completed' as BookingStatusTwo }
                    : b,
            ),
        );
        const target = bookings.find((b) => b.id === id);
        addToast(
            `Marked Done: ${target?.clientName}'s session completed!`,
            'success',
        );
    };

    const handleRestoreBooking = (id: string) => {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, status: 'Pending' as BookingStatusTwo } : b,
            ),
        );
        const target = bookings.find((b) => b.id === id);
        addToast(
            `Restored booking for ${target?.clientName || 'customer'} to Pending state.`,
            'info',
        );
    };

    const handleSaveBooking = (newB: Omit<AdminBookingTwo, 'id'>) => {
        const id =
            'b' +
            (bookings.length + 1) +
            Math.random().toString(36).substring(2, 5);
        const fullyConfigured: AdminBookingTwo = { id, ...newB };
        setBookings((prev) => [fullyConfigured, ...prev]);
        addToast(
            `New booking added successfully for ${newB.clientName}!`,
            'success',
        );
    };

    const handleUpdateNotes = (bookingId: string, updatedNotes: string) => {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === bookingId ? { ...b, notes: updatedNotes } : b,
            ),
        );
        addToast(`Updated notes for appointment logs.`, 'success');
    };

    // 3. Reminder trigger notification
    const handleSendReminders = () => {
        // Notify clients on pending or confirmed bookings
        const activeClientsCount = bookings.filter(
            (b) => b.status === 'Pending' || b.status === 'Confirmed',
        ).length;
        if (activeClientsCount === 0) {
            addToast(
                'No upcoming active clients found to notify tomorrow.',
                'info',
            );
        } else {
            addToast(
                `Sent automatic notification reminders (SMS & Email) to ${activeClientsCount} active clients!`,
                'success',
            );
        }
    };

    // 4. Physical CSV Downloader
    const handleExportCSV = () => {
        try {
            const headers = [
                'Booking ID',
                'Client Name',
                'Email',
                'Service name',
                'Date',
                'Start Time',
                'End Time',
                'Status',
                'Price ($)',
                'Notes',
            ];
            const rows = bookings.map((b) => [
                b.id,
                `"${b.clientName.replace(/"/g, '""')}"`,
                b.clientEmail,
                `"${b.serviceName.replace(/"/g, '""')}"`,
                b.date,
                b.startTime,
                b.endTime,
                b.status,
                b.price,
                `"${(b.notes || '').replace(/"/g, '""')}"`,
            ]);

            const csvContent =
                'data:text/csv;charset=utf-8,' +
                [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute(
                'download',
                `slotem_bookings_export_${new Date().toISOString().split('T')[0]}.csv`,
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            addToast(
                'Applet spreadsheet CSV successfully compiled and downloaded!',
                'success',
            );
        } catch (err) {
            addToast('Export failed. Error packaging list elements.', 'error');
        }
    };

    // Helper Notes Modal launcher
    const handleShowNotes = (b: AdminBookingTwo) => {
        setSelectedBookingForNotes(b);
        setIsNotesOpen(true);
    };

    // Services admin actions
    const handleAddService = (newS: Omit<AdminServiceTwo, 'id'>) => {
        const id =
            'srv' +
            (services.length + 1) +
            Math.random().toString(36).substring(2, 5);
        setServices((prev) => [...prev, { id, ...newS }]);
        addToast(`Service "${newS.name}" registered successfully.`, 'success');
    };

    const handleDeleteService = (id: string) => {
        setServices((prev) => prev.filter((s) => s.id !== id));
        addToast(`Service removed from corporate catalog.`, 'info');
    };

    // Availability admin actions
    const handleAddHolidayBlock = (block: Omit<HolidayBlock, 'id'>) => {
        const id = 'hol' + Math.random().toString(36).substring(2, 7);
        setHolidayBlocks((prev) => [...prev, { id, ...block }]);
        addToast(`Blocked calendar schedule for ${block.date}.`, 'success');
    };

    const handleRemoveHolidayBlock = (id: string) => {
        setHolidayBlocks((prev) => prev.filter((hb) => hb.id !== id));
        addToast(`Calendar restriction successfully removed.`, 'info');
    };

    return (
        <div className="min-h-screen bg-purple-50/20 font-sans text-zinc-800 transition-colors duration-250 dark:bg-zinc-950 dark:text-zinc-200">
            {/* Sidebar Component Panel */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onNewBookingClick={() => setIsNewBookingOpen(true)}
                businessName={businessSettings.name}
                managerName={businessSettings.managerName}
            />

            {/* Floating Theme Switcher Option */}
            <div className="fixed top-4 right-4 z-30 flex items-center gap-1.5 rounded-full border border-purple-100/50 bg-white/80 p-1.5 shadow-sm backdrop-blur-md transition-colors dark:border-zinc-800 dark:bg-zinc-900/80">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="cursor-pointer rounded-full p-2 text-zinc-500 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-300"
                    title={
                        darkMode
                            ? 'Switch to Light Mode'
                            : 'Switch to Dark Mode'
                    }
                >
                    {darkMode ? (
                        <Sun className="h-4 w-4 text-amber-400" />
                    ) : (
                        <Moon className="h-4 w-4 text-purple-600" />
                    )}
                </button>
            </div>

            {/* Main Main Content Container */}
            <div className="flex min-h-screen flex-col pl-64">
                <main className="mx-auto w-full max-w-5xl flex-grow p-6 pb-24 sm:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                        >
                            {activeTab === 'dashboard' && (
                                <DashboardView
                                    bookings={bookings}
                                    services={services}
                                    onTabChange={setActiveTab}
                                    onApprove={handleApproveBooking}
                                    onComplete={handleCompleteBooking}
                                    onNewBookingClick={() =>
                                        setIsNewBookingOpen(true)
                                    }
                                />
                            )}

                            {activeTab === 'bookings' && (
                                <BookingsView
                                    bookings={bookings}
                                    onApprove={handleApproveBooking}
                                    onReject={handleRejectBooking}
                                    onComplete={handleCompleteBooking}
                                    onRestore={handleRestoreBooking}
                                    onShowNotes={handleShowNotes}
                                    onSendReminders={handleSendReminders}
                                    onExport={handleExportCSV}
                                />
                            )}

                            {activeTab === 'availability' && (
                                <AvailabilityView
                                    businessHours={businessHours}
                                    onUpdateHours={setBusinessHours}
                                    holidayBlocks={holidayBlocks}
                                    onAddHolidayBlock={handleAddHolidayBlock}
                                    onRemoveHolidayBlock={
                                        handleRemoveHolidayBlock
                                    }
                                />
                            )}

                            {activeTab === 'settings' && (
                                <SettingsView
                                    settings={businessSettings}
                                    onUpdateSettings={setBusinessSettings}
                                    services={services}
                                    onAddService={handleAddService}
                                    onDeleteService={handleDeleteService}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Elegant Footer component matching mockups */}
                    <footer className="dark:border-zinc-850 mt-16 flex w-full shrink-0 flex-col items-center justify-between gap-4 border-t border-purple-100 pt-8 pb-4 md:flex-row">
                        <div className="text-center select-none md:text-left">
                            <span className="text-sm font-extrabold tracking-tight text-purple-700 dark:text-purple-400">
                                Slotem
                            </span>
                            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                                © {new Date().getFullYear()} Slotem Booking
                                Systems. All rights reserved.
                            </p>
                        </div>

                        <div className="flex gap-8">
                            {[
                                'Privacy Policy',
                                'Terms of Service',
                                'Help Center',
                                'Contact Sales',
                            ].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-[11px] font-semibold text-on-surface-variant transition-colors hover:text-primary"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </footer>
                </main>
            </div>

            {/* Popups & Modals */}
            <NewBookingModal
                isOpen={isNewBookingOpen}
                onClose={() => setIsNewBookingOpen(false)}
                onSave={handleSaveBooking}
                services={services}
            />

            <NotesModal
                isOpen={isNotesOpen}
                onClose={() => setIsNotesOpen(false)}
                booking={selectedBookingForNotes}
                onUpdateNotes={handleUpdateNotes}
            />

            {/* Floating System Toasts list overlay */}
            <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2 font-sans">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.95 }}
                            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3 text-xs font-semibold shadow-lg backdrop-blur-md ${
                                toast.type === 'success'
                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400'
                                    : toast.type === 'info'
                                      ? 'border-blue-500/20 bg-blue-500/10 text-blue-800 dark:text-blue-400'
                                      : 'border-red-500/20 bg-red-500/10 text-red-800 dark:text-red-400'
                            }`}
                        >
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 shrink-0" />
                                <span>{toast.message}</span>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="cursor-pointer rounded p-0.5 text-zinc-400 transition-all hover:bg-black/5 hover:text-zinc-600 dark:hover:bg-white/5 dark:hover:text-zinc-200"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
