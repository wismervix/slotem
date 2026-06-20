/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Calendar as CalendarIcon,
    Award,
    MapPin,
    ArrowRight,
    MoreVertical,
    Check,
    X,
    RotateCcw,
    Sparkles,
    UserCheck,
    CreditCard,
    User,
    Info,
} from 'lucide-react';

import EditProfileModal from '@/components/Admin/EditProfileModal';
import {
    CustomerProfile,
    BookingFour,
    ActivityLog,
    BookingStatusFour,
} from '@/types';
import {
    INITIAL_PROFILE,
    INITIAL_BOOKINGSSS,
    INITIAL_LOGS,
} from '@/data/initial-data';
import AdminLayout from '@/layouts/Admin/AdminLayout';

export default function DashboardView() {
    const [profile, setProfile] = useState<CustomerProfile>(INITIAL_PROFILE);
    const [bookings, setBookings] = useState<BookingFour[]>(INITIAL_BOOKINGSSS);
    const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [selectedBookingForDetails, setSelectedBookingForDetails] =
        useState<BookingFour | null>(null);

    // Derive stats dynamically from current master list for responsive updates!
    const completedCount =
        bookings.filter((b) => b.status === 'Confirmed').length + 38; // Initial layout had 42
    const cancelledCount = bookings.filter(
        (b) => b.status === 'Cancelled',
    ).length; // Initial had 3
    const upcomingCount =
        bookings.filter((b) => b.status === 'Pending').length + 6; // Initial had 8

    const handleClearLogs = () => {
        setLogs([]);
    };

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

    const handleToggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleStatusChange = (
        id: string,
        status: 'Confirmed' | 'Pending' | 'Cancelled',
        serviceName: string,
    ) => {
        handleUpdateBookingStatus(id, status);
        setActiveMenuId(null);
        handleAddLog(
            status === 'Cancelled'
                ? 'system'
                : status === 'Confirmed'
                  ? 'payment'
                  : 'rescheduled',
            `Status: ${status}`,
            `"${serviceName}" has been set to ${status}.`,
        );
    };

    const getLogIcon = (type: string) => {
        switch (type) {
            case 'rescheduled':
                return (
                    <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                );
            case 'payment':
                return (
                    <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                );
            case 'profile':
                return (
                    <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                );
            case 'email':
                return (
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                );
            default:
                return (
                    <Info className="h-4 w-4 text-on-surface-variant dark:text-slate-500" />
                );
        }
    };

    const getLogBg = (type: string) => {
        switch (type) {
            case 'rescheduled':
                return 'bg-purple-100/70 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400';
            case 'payment':
                return 'bg-amber-100/70 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
            case 'profile':
                return 'bg-indigo-100/70 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400';
            case 'email':
                return 'bg-blue-100/70 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
            default:
                return 'bg-neutral-100 text-neutral-800 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    return (
        <AdminLayout>
            <div
                id="dashboard_view"
                className="animate-in fade-in space-y-6 duration-300"
            >
                {/* Top Section: Customer Profile Info */}
                <section className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm md:flex-row md:items-start md:p-8 dark:border-slate-700 dark:bg-slate-900">
                    <div className="absolute top-4 right-4">
                        <button
                            id="edit_profile_btn"
                            onClick={() => setIsEditProfileOpen(true)}
                            className="flex cursor-pointer items-center gap-1 rounded-xl bg-primary-container px-4 py-2 text-xs font-semibold text-on-primary-container shadow-sm transition-all hover:bg-primary-container/80 active:scale-95 dark:bg-purple-950/50 dark:text-primary dark:text-purple-400 dark:hover:bg-purple-950/70"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Profile Avatar with live indicator */}
                    <div className="relative">
                        <img
                            alt="Customer Profile"
                            className="h-28 w-28 rounded-full border-4 border-surface bg-primary-container object-cover shadow-md dark:border-slate-800 dark:bg-slate-800"
                            src={profile.avatar}
                        />
                        {profile.active && (
                            <div
                                className="absolute right-1 bottom-1 h-5 w-5 animate-pulse rounded-full border-2 border-surface bg-emerald-500 dark:border-slate-900"
                                title="Active Status"
                            ></div>
                        )}
                    </div>

                    {/* Profile meta info */}
                    <div className="flex-grow pt-2 text-center md:text-left">
                        <div className="mb-1 flex items-center justify-center gap-2.5 md:justify-start">
                            <h2 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
                                {profile.name}
                            </h2>
                            <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold tracking-wide text-on-primary-container uppercase dark:bg-purple-950/50 dark:text-purple-400">
                                Client Profile
                            </span>
                        </div>

                        <p className="mb-4 flex items-center justify-center gap-1.5 text-sm text-on-surface-variant selection:bg-primary-container md:justify-start dark:text-slate-400">
                            <Mail className="h-4 w-4 text-primary dark:text-purple-400" />
                            <span>{profile.email}</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                            <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/20 bg-primary-container px-3 py-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800/50">
                                <CalendarIcon className="h-4 w-4 text-on-primary-container dark:text-purple-400" />
                                <span className="text-xs font-semibold text-on-primary-container dark:text-slate-500">
                                    Joined {profile.joinedDate}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/20 bg-primary-container px-3 py-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800/50">
                                <Award className="h-4 w-4 text-on-primary-container dark:text-purple-400" />
                                <span className="text-xs font-semibold text-on-primary-container dark:text-slate-500">
                                    {profile.tier}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/20 bg-primary-container px-3 py-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800/50">
                                <MapPin className="h-4 w-4 text-on-primary-container dark:text-purple-400" />
                                <span className="text-xs font-semibold text-on-primary-container dark:text-slate-500">
                                    {profile.city}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Middle Section: Stat Cards (Bento Style) */}
                <section
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    id="bento_stats_grid"
                >
                    {/* Completed card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm transition-all duration-300 hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:hover:border-purple-500">
                        <div className="mb-3 flex items-start justify-between">
                            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                                <CheckCircle className="h-5 w-5" />
                            </span>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                +12% vs last month
                            </span>
                        </div>
                        <p className="mb-0.5 text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase dark:text-slate-500">
                            Completed Bookings
                        </p>
                        <h3 className="text-3xl font-extrabold text-on-surface dark:text-white">
                            {completedCount}
                        </h3>

                        <div className="pointer-events-none absolute -right-2 -bottom-2 text-emerald-500 opacity-5 transition-transform group-hover:scale-110 dark:text-emerald-600">
                            <CheckCircle className="h-24 w-24" />
                        </div>
                    </div>

                    {/* Cancelled card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm transition-all duration-300 hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:hover:border-purple-500">
                        <div className="mb-3 flex items-start justify-between">
                            <span className="rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                                <XCircle className="h-5 w-5" />
                            </span>
                            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                                -2% improvement
                            </span>
                        </div>
                        <p className="mb-0.5 text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase dark:text-slate-500">
                            Cancelled
                        </p>
                        <h3 className="text-3xl font-extrabold text-on-surface dark:text-white">
                            {cancelledCount}
                        </h3>

                        <div className="pointer-events-none absolute -right-2 -bottom-2 text-rose-500 opacity-5 transition-transform group-hover:scale-110 dark:text-rose-600">
                            <XCircle className="h-24 w-24" />
                        </div>
                    </div>

                    {/* Upcoming card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm transition-all duration-300 hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:hover:border-purple-500">
                        <div className="mb-3 flex items-start justify-between">
                            <span className="rounded-xl bg-primary-container p-2.5 text-primary dark:bg-purple-950/30 dark:text-purple-400">
                                <Clock className="h-5 w-5" />
                            </span>
                            <div className="flex -space-x-2">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS4hUTLFx0E6J98uzd04i3YX6UOkhedlYUCmPnbrvti24Ue_CL6ri6q8vvcD63qahKE-7K_01ONMTOkm7IPXtgdV-TEaq37JuFM-5sjMu1ZaVI1rzD_8U8PNnuBFrixHoY11-QO-v2o22VH5iCzzuqXgzXh8ziXm5jJpj3gYs7mJICzXvnr61i7sCB6Q1do1IsZEgg-ruxOHu7mP4fkgIIXgkTMq0CfMnHZc29JZ51XanpLw0JXNLLrR0XIr2A_YvkkkTl4TVWVbs"
                                    className="h-5.5 w-5.5 rounded-full border border-white dark:border-slate-900"
                                    alt="avatar"
                                />
                                <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-white bg-primary-container text-[8px] font-semibold text-on-primary-container dark:border-slate-900 dark:bg-purple-950/50 dark:text-purple-400">
                                    +4
                                </div>
                            </div>
                        </div>
                        <p className="mb-0.5 text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase dark:text-slate-500">
                            Upcoming Slots
                        </p>
                        <h3 className="text-3xl font-extrabold text-on-surface dark:text-white">
                            {upcomingCount}
                        </h3>

                        <div className="pointer-events-none absolute -right-2 -bottom-2 text-primary opacity-5 transition-transform group-hover:scale-110 dark:text-purple-600">
                            <Clock className="h-24 w-24" />
                        </div>
                    </div>
                </section>

                {/* Bottom Section: Grid Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Booking History Table */}
                    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                        <div>
                            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4.5 dark:border-slate-700 dark:bg-slate-800/50">
                                <h3 className="text-base font-semibold text-primary dark:text-white">
                                    Booking History
                                </h3>
                                <button
                                    onClick={() =>
                                        console.log('Go to bookings page')
                                    }
                                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline dark:text-purple-400"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-outline-variant bg-surface-container-low dark:border-slate-700 dark:bg-slate-800/30">
                                            <th className="px-6 py-3 text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                                Service
                                            </th>
                                            <th className="px-6 py-3 text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-bold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant dark:divide-slate-700">
                                        {bookings.slice(0, 5).map((bk) => (
                                            <tr
                                                key={bk.id}
                                                className="group cursor-pointer transition-colors hover:bg-surface-container-low dark:hover:bg-slate-800/30"
                                                onClick={() =>
                                                    setSelectedBookingForDetails(
                                                        bk,
                                                    )
                                                }
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-on-surface dark:text-white">
                                                        {bk.service}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-[10px] text-on-surface-variant/60 dark:text-slate-500">
                                                        {bk.ref}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-on-surface/90 dark:text-slate-300">
                                                    {bk.date}
                                                    <span className="mt-0.5 block text-[9px] text-on-surface-variant/60 dark:text-slate-500">
                                                        {
                                                            bk.timeSlot?.split(
                                                                ' - ',
                                                            )[0]
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-on-surface dark:text-white">
                                                    ${bk.amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                            bk.status ===
                                                            'Confirmed'
                                                                ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                                : bk.status ===
                                                                    'Pending'
                                                                  ? 'bg-amber-100/80 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                                                                  : 'bg-rose-100/80 text-rose-800 dark:bg-red-950/40 dark:text-red-400'
                                                        }`}
                                                    >
                                                        {bk.status}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-right whitespace-nowrap"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div className="relative inline-block text-left">
                                                        <button
                                                            onClick={(e) =>
                                                                handleToggleMenu(
                                                                    bk.id,
                                                                    e,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-full p-1 text-on-surface-variant/70 transition-all outline-none hover:bg-surface-container/50 hover:text-primary dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>

                                                        {activeMenuId ===
                                                            bk.id && (
                                                            <div className="animate-in fade-in absolute right-0 z-20 mt-1.5 w-36 overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-xl dark:border-slate-700 dark:bg-slate-800">
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                bk.id,
                                                                                'Confirmed',
                                                                                bk.service,
                                                                            )
                                                                        }
                                                                        className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700"
                                                                    >
                                                                        <Check className="h-3.5 w-3.5" />{' '}
                                                                        Confirm
                                                                        Slot
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                bk.id,
                                                                                'Pending',
                                                                                bk.service,
                                                                            )
                                                                        }
                                                                        className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-slate-700"
                                                                    >
                                                                        <RotateCcw className="h-3.5 w-3.5" />{' '}
                                                                        Set
                                                                        Pending
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                bk.id,
                                                                                'Cancelled',
                                                                                bk.service,
                                                                            )
                                                                        }
                                                                        className="flex w-full cursor-pointer items-center gap-1.5 border-t border-gray-100 px-3 py-2 text-left text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-slate-700"
                                                                    >
                                                                        <X className="h-3.5 w-3.5" />{' '}
                                                                        Cancel
                                                                        Slot
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 bg-surface-container-low p-4 text-center dark:border-slate-700 dark:bg-slate-800/30">
                            <p className="text-[11px] text-on-surface-variant/60 dark:text-slate-500">
                                Interactive Row Action: Click any row to view
                                complete booking files & remarks.
                            </p>
                        </div>
                    </div>

                    {/* Recent Notifications Feed */}
                    <div className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div>
                            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4.5 dark:border-slate-700 dark:bg-slate-800/50">
                                <h3 className="text-base font-semibold text-primary dark:text-white">
                                    Recent Activity
                                </h3>
                                <span className="rounded bg-primary-container px-2 py-0.5 text-[10px] font-bold tracking-wider text-on-primary-container uppercase dark:bg-purple-950/50 dark:text-purple-400">
                                    Live
                                </span>
                            </div>

                            <div className="custom-scrollbar max-h-[380px] flex-grow space-y-5 overflow-y-auto p-5">
                                {logs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <span className="mb-3 rounded-full bg-gray-50 p-3 text-gray-300 dark:bg-slate-800 dark:text-slate-600">
                                            <Info className="h-6 w-6" />
                                        </span>
                                        <p className="text-sm font-medium text-gray-400 dark:text-slate-500">
                                            No logs on file
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                                            Actions you trigger will record
                                            automatically.
                                        </p>
                                    </div>
                                ) : (
                                    logs.map((log, index) => (
                                        <div
                                            key={log.id}
                                            className="relative flex gap-3.5"
                                        >
                                            {/* Line connection */}
                                            {index < logs.length - 1 && (
                                                <div className="absolute top-[30px] bottom-[-20px] left-[15px] w-0.5 bg-gray-100 dark:bg-slate-700"></div>
                                            )}

                                            {/* Log action icon badge */}
                                            <div
                                                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-1.5 ${getLogBg(log.type)}`}
                                            >
                                                {getLogIcon(log.type)}
                                            </div>

                                            <div className="pt-0.5 text-left">
                                                <p className="text-xs font-bold text-on-surface dark:text-white">
                                                    {log.title}
                                                </p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant/85 dark:text-slate-400">
                                                    {log.subtitle}
                                                </p>
                                                <p className="mt-1 text-[9px] font-bold tracking-wider text-on-surface-variant/50 uppercase dark:text-slate-500">
                                                    {log.timeText}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="border-t border-outline-variant/20 bg-surface-container-low p-4 dark:border-slate-700 dark:bg-slate-800/30">
                            <button
                                onClick={handleClearLogs}
                                className="w-full cursor-pointer rounded-xl border border-outline-variant py-2 text-xs font-semibold text-on-surface-variant transition-all hover:border-primary hover:bg-neutral-50 hover:text-primary active:scale-98 dark:border-slate-700 dark:text-slate-400 dark:hover:border-purple-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                            >
                                Clear All Logs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking Detail Modal popup */}
                {selectedBookingForDetails && (
                    <div
                        className="fixed inset-0 z-100 flex cursor-default items-center justify-center bg-black/40 p-4 backdrop-blur-xs dark:bg-black/60"
                        onClick={() => setSelectedBookingForDetails(null)}
                    >
                        <div
                            className="animate-in zoom-in-95 relative w-full max-w-md rounded-2xl border border-outline-variant bg-surface p-6 text-left shadow-2xl duration-150 dark:border-slate-700 dark:bg-slate-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() =>
                                    setSelectedBookingForDetails(null)
                                }
                                className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="mb-1 flex items-center gap-2 pl-1 text-[10px] font-extrabold tracking-widest text-primary uppercase dark:text-purple-400">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Full Booking File</span>
                            </div>

                            <h3 className="text-lg font-bold text-on-surface dark:text-white">
                                {selectedBookingForDetails.service}
                            </h3>
                            <p className="mt-0.5 mb-4 font-mono text-xs text-on-surface-variant/70 dark:text-slate-500">
                                Reference: {selectedBookingForDetails.ref}
                            </p>

                            <div className="space-y-3 border-t border-outline-variant pt-3 dark:border-slate-700">
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Client Name
                                    </span>
                                    <span className="font-bold text-on-surface dark:text-white">
                                        {selectedBookingForDetails.customerName}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Email
                                    </span>
                                    <span
                                        className="truncate font-medium text-on-surface dark:text-white"
                                        title={
                                            selectedBookingForDetails.customerEmail
                                        }
                                    >
                                        {
                                            selectedBookingForDetails.customerEmail
                                        }
                                    </span>
                                </div>
                                {selectedBookingForDetails.phoneNumber && (
                                    <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                        <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                            Phone Number
                                        </span>
                                        <span className="font-medium text-on-surface dark:text-white">
                                            {
                                                selectedBookingForDetails.phoneNumber
                                            }
                                        </span>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Target Date
                                    </span>
                                    <span className="font-semibold text-on-surface dark:text-white">
                                        {selectedBookingForDetails.date}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Time Slot
                                    </span>
                                    <span className="font-semibold text-on-surface dark:text-white">
                                        {selectedBookingForDetails.timeSlot}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Subtotal Value
                                    </span>
                                    <span className="text-sm font-bold text-primary dark:text-purple-400">
                                        $
                                        {selectedBookingForDetails.amount.toFixed(
                                            2,
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Workflow Status
                                    </span>
                                    <span>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wide uppercase ${
                                                selectedBookingForDetails.status ===
                                                'Confirmed'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                    : selectedBookingForDetails.status ===
                                                        'Pending'
                                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                                                      : 'bg-rose-100 text-rose-800 dark:bg-red-950/40 dark:text-red-400'
                                            }`}
                                        >
                                            {selectedBookingForDetails.status}
                                        </span>
                                    </span>
                                </div>

                                {/* Note details */}
                                <div className="pt-2">
                                    <span className="mb-1 block text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Administrative Notes
                                    </span>
                                    <p className="max-h-24 overflow-y-auto rounded-lg bg-neutral-50 p-3 text-[11px] leading-relaxed text-neutral-600 italic dark:bg-slate-800 dark:text-slate-400">
                                        {selectedBookingForDetails.notes ||
                                            'No custom remarks annotated for this slot.'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex justify-end gap-2 border-t border-outline-variant pt-3 dark:border-slate-700">
                                <button
                                    onClick={() =>
                                        setSelectedBookingForDetails(null)
                                    }
                                    className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow transition-all hover:bg-primary-container active:scale-95 dark:bg-purple-600 dark:hover:bg-purple-700"
                                >
                                    Close File
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <EditProfileModal
                    isOpen={isEditProfileOpen}
                    onClose={() => setIsEditProfileOpen(false)}
                    profile={profile}
                    onSave={handleSaveProfile}
                />
            </div>
        </AdminLayout>
    );
}
