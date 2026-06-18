/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
    Bell,
    HelpCircle,
    Search,
    Plus,
    Sparkles,
    Info,
    CheckCircle,
    X,
    XCircle,
    CalendarCheck,
} from 'lucide-react';

import Sidebar from '@/components/Admin/AdminThree/Sidebar';
import DashboardView from '@/components/Admin/AdminThree/DashboardView';
import BookingsView from '@/components/Admin/AdminThree/BookingsView';
import AvailabilityView from '@/components/Admin/AdminThree/AvailabilityView';
import SettingsView from '@/components/Admin/AdminThree/SettingsView';
import NewBookingModal from '@/components/Admin/AdminThree/NewBookingModal';
import EditProfileModal from '@/components/Admin/AdminThree/EditProfileModal';

import { CustomerProfile, BookingFour, ActivityLog, BookingStatusFour } from '@/types';
import { INITIAL_PROFILE, INITIAL_BOOKINGS, INITIAL_LOGS } from '@/data/initial-data-four';

export default function App() {
    const [currentTab, setCurrentTab] = useState<string>('bookings'); // Bookings active in the mockup
    const [profile, setProfile] = useState<CustomerProfile>(INITIAL_PROFILE);
    const [bookings, setBookings] = useState<BookingFour[]>(INITIAL_BOOKINGS);
    const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

    // Modal open states
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    // Global search input in top nav
    const [headerSearchTerm, setHeaderSearchTerm] = useState('');

    // Custom interactive system alert states
    const [showNotificationAlert, setShowNotificationAlert] = useState(false);
    const [showHelpAlert, setShowHelpAlert] = useState(false);

    const handleUpdateBookingStatus = (
        id: string,
        newStatus: BookingStatusFour,
    ) => {
        setBookings((prevBookings) =>
            prevBookings.map((bk) =>
                bk.id === id ? { ...bk, status: newStatus } : bk,
            ),
        );
    };

    const handleUpdateBookingAmount = (id: string, newAmount: number) => {
        setBookings((prevBookings) =>
            prevBookings.map((bk) =>
                bk.id === id ? { ...bk, amount: newAmount } : bk,
            ),
        );
        // Add real event log
        const booking = bookings.find((b) => b.id === id);
        if (booking) {
            handleAddLog(
                'payment',
                'Invoice Adjusted',
                `Quote for "${booking.service}" adjusted to $${newAmount.toFixed(2)}`,
            );
        }
    };

    const handleDeleteBooking = (id: string) => {
        const bookingToDelete = bookings.find((b) => b.id === id);
        setBookings((prevBookings) =>
            prevBookings.filter((bk) => bk.id !== id),
        );

        if (bookingToDelete) {
            handleAddLog(
                'system',
                'Booking Deleted',
                `Session record for Ref: ${bookingToDelete.ref} removed.`,
            );
        }
    };

    const handleAddBooking = (newBooking: BookingFour) => {
        setBookings((prevBookings) => [newBooking, ...prevBookings]);

        // Add real event timeline log
        handleAddLog(
            'rescheduled',
            'Booking Registered',
            `Scheduled ${newBooking.service} with ${newBooking.customerName} on ${newBooking.date}.`,
        );

        // Swap to Bookings view so they can see their newly created slot clearly!
        setCurrentTab('bookings');
    };

    const handleSaveProfile = (updatedProfile: CustomerProfile) => {
        setProfile(updatedProfile);
        handleAddLog(
            'profile',
            'Profile Updated',
            `Admin updated profile files, email, and active flags for ${updatedProfile.name}.`,
        );
    };

    const handleAddLog = (
        type: 'rescheduled' | 'payment' | 'profile' | 'email' | 'system',
        title: string,
        subtitle: string,
    ) => {
        const newLog: ActivityLog = {
            id: `log-${Date.now()}`,
            type,
            title,
            subtitle,
            timeText: 'Just now',
            timestamp: Date.now(),
        };
        setLogs((prev) => [newLog, ...prev]);
    };

    const handleClearLogs = () => {
        setLogs([]);
    };

    // Switch to bookings tab and set keyword search automatically when users type in Header Search!
    const handleHeaderSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const val = e.target.value;
        setHeaderSearchTerm(val);
        if (currentTab !== 'bookings' && val.trim() !== '') {
            setCurrentTab('bookings');
        }
    };

    return (
        <div
            className="flex min-h-screen bg-[#fef7ff] font-sans text-[#1d1a24]"
            id="slotem_root"
        >
            {/* Sidebar Navigation Panel */}
            <Sidebar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                onOpenNewBooking={() => setIsNewBookingOpen(true)}
            />

            {/* Main Content Area */}
            <main
                className="relative ml-64 flex min-h-screen flex-grow flex-col"
                id="layout_main"
            >
                {/* Top Header Bar */}
                <header
                    id="slotem_topbar"
                    className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#ccc3d8]/40 bg-white/80 px-8 shadow-xs backdrop-blur-md"
                >
                    {/* Booking search proxy */}
                    <div className="group flex w-96 items-center rounded-full border border-[#ccc3d8]/15 bg-[#f3ebfa] px-4 py-1.5 transition-all focus-within:ring-2 focus-within:ring-[#630ed4]/20">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-[#4a4455]/70" />
                        <input
                            type="text"
                            placeholder="Search customers, services, or codes..."
                            value={headerSearchTerm}
                            onChange={handleHeaderSearchChange}
                            className="w-full cursor-text border-none bg-transparent text-xs text-[#1d1a24] outline-none placeholder:text-[#4a4455]/50 focus:ring-0"
                        />
                        {headerSearchTerm && (
                            <button
                                onClick={() => setHeaderSearchTerm('')}
                                className="cursor-pointer rounded-full p-0.5 text-[#4a4455]/50 hover:bg-neutral-100"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* User profile metadata controls */}
                    <div className="flex items-center gap-6">
                        {/* Notifications trigger */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotificationAlert(
                                        !showNotificationAlert,
                                    );
                                    setShowHelpAlert(false);
                                }}
                                className={`relative cursor-pointer rounded-full p-2 text-[#4a4455] transition-all outline-none hover:bg-[#f3ebfa] hover:text-[#630ed4] ${
                                    showNotificationAlert
                                        ? 'bg-[#eaddff] text-[#25005a]'
                                        : ''
                                }`}
                                title="System Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 animate-bounce rounded-full border-2 border-white bg-rose-600"></span>
                            </button>

                            {showNotificationAlert && (
                                <div className="animate-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[#ccc3d8]/40 bg-white p-4 text-left text-xs shadow-2xl duration-150">
                                    <div className="flex items-center justify-between border-b border-[#f3ebfa] pb-2.5">
                                        <span className="font-bold text-[#630ed4]">
                                            Alert Center
                                        </span>
                                        <button
                                            onClick={() =>
                                                setShowNotificationAlert(false)
                                            }
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-3 pt-2.5">
                                        <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-[11px] text-emerald-800">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                            <div>
                                                <p className="font-bold">
                                                    System Status Optimal
                                                </p>
                                                <p className="mt-0.5">
                                                    All booking engines and
                                                    timeslots are synchronized
                                                    on port 3000.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 rounded-lg border border-purple-100 bg-purple-50 p-2 text-[11px] text-[#25005a]">
                                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-[#630ed4]" />
                                            <div>
                                                <p className="font-bold">
                                                    Live Synced State
                                                </p>
                                                <p className="mt-0.5">
                                                    Added data automatically
                                                    refreshes metric card
                                                    graphs.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Help guidelines toggle */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowHelpAlert(!showHelpAlert);
                                    setShowNotificationAlert(false);
                                }}
                                className={`cursor-pointer rounded-full p-2 text-[#4a4455] transition-all outline-none hover:bg-[#f3ebfa] hover:text-[#630ed4] ${
                                    showHelpAlert
                                        ? 'bg-[#eaddff] text-[#25005a]'
                                        : ''
                                }`}
                                title="Application Help Guide"
                            >
                                <HelpCircle className="h-5 w-5" />
                            </button>

                            {showHelpAlert && (
                                <div className="animate-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-64 rounded-xl border border-[#ccc3d8]/40 bg-white p-4 text-left text-xs shadow-2xl duration-150">
                                    <h4 className="mb-1.5 flex items-center gap-1 font-bold text-[#25005a]">
                                        <CalendarCheck className="h-4 w-4 text-[#630ed4]" />{' '}
                                        Slotem Instructions
                                    </h4>
                                    <p className="text-[11px] leading-relaxed text-[#4a4455]">
                                        Welcome to the slot scheduling suite!
                                        You can:
                                    </p>
                                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[10px] text-neutral-600">
                                        <li>
                                            Edit Eleanor Vance's profile live.
                                        </li>
                                        <li>
                                            Toggle custom timeslot states in
                                            "Availability".
                                        </li>
                                        <li>
                                            Add/Adjust services & base prices in
                                            "Settings".
                                        </li>
                                        <li>
                                            Register and cancel bookings in
                                            real-time.
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => setShowHelpAlert(false)}
                                        className="mt-3.5 w-full cursor-pointer rounded-lg bg-[#630ed4] py-1 text-[10px] font-bold text-white hover:bg-[#7c3aed]"
                                    >
                                        Got It
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Alex Rivera Admin Profile card */}
                        <div className="flex items-center gap-2.5 border-l border-[#ccc3d8]/30 pl-4">
                            <img
                                alt="Slotem Admin"
                                className="h-8 w-8 rounded-full border border-[#630ed4]/20 bg-slate-100 object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLHMEOwkWkIpE-ZGTznIhXNjanHbvO-MqO8cukLWr7gBItbf0yAGypR76VNCcTfNfzRxi9y-c28sp_VcoGTRMQ7cglHilWL1_EJTa1YUSobKyEx5IwuBObpGdhKD3oQPxTNEWSZ3kKLHd5krapHb82v1xgVKfQoq1KGIqTF7eFfPryVkk6ubsr98LywmkXwbgHQKaQzoSWwoBlP5-LeslrZpScSMQlqfLGuFZ58yW2Ypy_dOn90n6lJbLjzmw3TRzKyFKa-H5cH7E"
                            />
                            <div className="hidden text-left lg:block">
                                <p className="text-xs leading-tight font-bold text-[#1d1a24]">
                                    Alex Rivera
                                </p>
                                <p className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Senior Admin
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* View Content Port */}
                <div className="mx-auto w-full max-w-7xl flex-grow p-8">
                    {currentTab === 'dashboard' && (
                        <DashboardView
                            profile={profile}
                            bookings={bookings}
                            logs={logs}
                            onOpenEditProfile={() => setIsEditProfileOpen(true)}
                            onSetTab={setCurrentTab}
                            onUpdateBookingStatus={handleUpdateBookingStatus}
                            onClearLogs={handleClearLogs}
                            onAddLog={handleAddLog}
                        />
                    )}

                    {currentTab === 'bookings' && (
                        <BookingsView
                            bookings={bookings}
                            onUpdateBookingStatus={handleUpdateBookingStatus}
                            onUpdateBookingAmount={handleUpdateBookingAmount}
                            onDeleteBooking={handleDeleteBooking}
                            onOpenNewBooking={() => setIsNewBookingOpen(true)}
                        />
                    )}

                    {currentTab === 'availability' && <AvailabilityView />}

                    {currentTab === 'settings' && <SettingsView />}
                </div>

                {/* Quick Action FAB on the bottom right corner */}
                <button
                    id="quick_action_fab"
                    onClick={() => setIsNewBookingOpen(true)}
                    className="group fixed right-8 bottom-8 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#630ed4] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:rotate-90 hover:bg-[#7c3aed] active:scale-95"
                    title="Create New Slot quickly"
                >
                    <Plus className="h-6 w-6 transition-transform group-hover:rotate-0" />
                    <span className="pointer-events-none absolute right-16 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[10px] font-bold whitespace-nowrap text-white opacity-0 shadow transition-all duration-300 group-hover:opacity-100">
                        Quick Appointment
                    </span>
                </button>
            </main>

            {/* Persistent Modals Injection */}
            <NewBookingModal
                isOpen={isNewBookingOpen}
                onClose={() => setIsNewBookingOpen(false)}
                defaultCustomerName={profile.name}
                defaultCustomerEmail={profile.email}
                onAddBooking={handleAddBooking}
            />

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                profile={profile}
                onSave={handleSaveProfile}
            />
        </div>
    );
}
