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
                return <CalendarIcon className="h-4 w-4 text-purple-600" />;
            case 'payment':
                return <CreditCard className="h-4 w-4 text-amber-600" />;
            case 'profile':
                return <UserCheck className="h-4 w-4 text-indigo-600" />;
            case 'email':
                return <Mail className="h-4 w-4 text-blue-600" />;
            default:
                return <Info className="h-4 w-4 text-[#4a4455]" />;
        }
    };

    const getLogBg = (type: string) => {
        switch (type) {
            case 'rescheduled':
                return 'bg-purple-100/70 text-purple-700';
            case 'payment':
                return 'bg-amber-100/70 text-amber-800';
            case 'profile':
                return 'bg-indigo-100/70 text-indigo-800';
            case 'email':
                return 'bg-blue-100/70 text-blue-800';
            default:
                return 'bg-neutral-100 text-neutral-800';
        }
    };

    return (
        <AdminLayout>
        <div
            id="dashboard_view"
            className="animate-in fade-in space-y-6 duration-300"
        >
            {/* Top Section: Customer Profile Info */}
            <section className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-[#ccc3d8]/40 bg-white p-6 shadow-sm md:flex-row md:items-start md:p-8">
                <div className="absolute top-4 right-4">
                    <button
                        id="edit_profile_btn"
                        onClick={() => setIsEditProfileOpen(true)}
                        className="flex cursor-pointer items-center gap-1 rounded-xl bg-[#f3ebfa] px-4 py-2 text-xs font-semibold text-[#630ed4] shadow-sm transition-all hover:bg-[#eaddff] hover:shadow active:scale-95"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Profile Avatar with live indicator */}
                <div className="relative">
                    <img
                        alt="Customer Profile"
                        className="h-28 w-28 rounded-full border-4 border-white bg-[#f3ebfa] object-cover shadow-md"
                        src={profile.avatar}
                    />
                    {profile.active && (
                        <div
                            className="absolute right-1 bottom-1 h-5 w-5 animate-pulse rounded-full border-2 border-white bg-emerald-500"
                            title="Active Status"
                        ></div>
                    )}
                </div>

                {/* Profile meta info */}
                <div className="flex-grow pt-2 text-center md:text-left">
                    <div className="mb-1 flex items-center justify-center gap-2.5 md:justify-start">
                        <h2 className="text-2xl font-bold tracking-tight text-[#1d1a24]">
                            {profile.name}
                        </h2>
                        <span className="rounded-full bg-[#eaddff] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#5a00c6] uppercase">
                            Client Profile
                        </span>
                    </div>

                    <p className="mb-4 flex items-center justify-center gap-1.5 text-sm text-[#4a4455] selection:bg-[#eaddff] md:justify-start">
                        <Mail className="h-4 w-4 text-[#630ed4]" />
                        <span>{profile.email}</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                        <div className="flex items-center gap-1.5 rounded-xl border border-[#ccc3d8]/20 bg-[#f3ebfa] px-3 py-1.5 shadow-xs">
                            <CalendarIcon className="h-4 w-4 text-[#630ed4]" />
                            <span className="text-xs font-semibold text-[#4a4455]/95">
                                Joined {profile.joinedDate}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl border border-[#ccc3d8]/20 bg-[#f3ebfa] px-3 py-1.5 shadow-xs">
                            <Award className="h-4 w-4 text-[#630ed4]" />
                            <span className="text-xs font-semibold text-[#4a4455]/95">
                                {profile.tier}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl border border-[#ccc3d8]/20 bg-[#f3ebfa] px-3 py-1.5 shadow-xs">
                            <MapPin className="h-4 w-4 text-[#630ed4]" />
                            <span className="text-xs font-semibold text-[#4a4455]/95">
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
                <div className="group relative overflow-hidden rounded-2xl border border-[#ccc3d8]/40 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#630ed4]">
                    <div className="mb-3 flex items-start justify-between">
                        <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                            <CheckCircle className="h-5 w-5" />
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            +12% vs last month
                        </span>
                    </div>
                    <p className="mb-0.5 text-[11px] font-bold tracking-widest text-[#4a4455]/70 uppercase">
                        Completed Bookings
                    </p>
                    <h3 className="text-3xl font-extrabold text-[#1d1a24]">
                        {completedCount}
                    </h3>

                    <div className="pointer-events-none absolute -right-2 -bottom-2 text-emerald-500 opacity-5 transition-transform group-hover:scale-110">
                        <CheckCircle className="h-24 w-24" />
                    </div>
                </div>

                {/* Cancelled card */}
                <div className="group relative overflow-hidden rounded-2xl border border-[#ccc3d8]/40 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#630ed4]">
                    <div className="mb-3 flex items-start justify-between">
                        <span className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                            <XCircle className="h-5 w-5" />
                        </span>
                        <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                            -2% improvement
                        </span>
                    </div>
                    <p className="mb-0.5 text-[11px] font-bold tracking-widest text-[#4a4455]/70 uppercase">
                        Cancelled
                    </p>
                    <h3 className="text-3xl font-extrabold text-[#1d1a24]">
                        {cancelledCount}
                    </h3>

                    <div className="pointer-events-none absolute -right-2 -bottom-2 text-rose-500 opacity-5 transition-transform group-hover:scale-110">
                        <XCircle className="h-24 w-24" />
                    </div>
                </div>

                {/* Upcoming card */}
                <div className="group relative overflow-hidden rounded-2xl border border-[#ccc3d8]/40 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#630ed4]">
                    <div className="mb-3 flex items-start justify-between">
                        <span className="rounded-xl bg-[#f3ebfa] p-2.5 text-[#630ed4]">
                            <Clock className="h-5 w-5" />
                        </span>
                        <div className="flex -space-x-2">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS4hUTLFx0E6J98uzd04i3YX6UOkhedlYUCmPnbrvti24Ue_CL6ri6q8vvcD63qahKE-7K_01ONMTOkm7IPXtgdV-TEaq37JuFM-5sjMu1ZaVI1rzD_8U8PNnuBFrixHoY11-QO-v2o22VH5iCzzuqXgzXh8ziXm5jJpj3gYs7mJICzXvnr61i7sCB6Q1do1IsZEgg-ruxOHu7mP4fkgIIXgkTMq0CfMnHZc29JZ51XanpLw0JXNLLrR0XIr2A_YvkkkTl4TVWVbs"
                                className="h-5.5 w-5.5 rounded-full border border-white"
                                alt="avatar"
                            />
                            <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-white bg-[#eaddff] text-[8px] font-semibold text-[#630ed4]">
                                +4
                            </div>
                        </div>
                    </div>
                    <p className="mb-0.5 text-[11px] font-bold tracking-widest text-[#4a4455]/70 uppercase">
                        Upcoming Slots
                    </p>
                    <h3 className="text-3xl font-extrabold text-[#1d1a24]">
                        {upcomingCount}
                    </h3>

                    <div className="pointer-events-none absolute -right-2 -bottom-2 text-[#630ed4] opacity-5 transition-transform group-hover:scale-110">
                        <Clock className="h-24 w-24" />
                    </div>
                </div>
            </section>

            {/* Bottom Section: Grid Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Booking History Table */}
                <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ccc3d8]/40 bg-white shadow-sm lg:col-span-2">
                    <div>
                        <div className="flex items-center justify-between border-b border-[#ccc3d8]/30 bg-[#fef7ff]/50 px-6 py-4.5">
                            <h3 className="text-base font-semibold text-[#25005a]">
                                Booking History
                            </h3>
                            <button
                                onClick={() =>
                                    console.log('Go to bookings page')
                                }
                                className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#630ed4] hover:underline"
                            >
                                <span>View All</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-[#ccc3d8]/25 bg-[#f9f1ff]">
                                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-[#4a4455]/85 uppercase">
                                            Service
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-[#4a4455]/85 uppercase">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-[#4a4455]/85 uppercase">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold tracking-wider text-[#4a4455]/85 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-bold tracking-wider text-[#4a4455]/85 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#ccc3d8]/20">
                                    {bookings.slice(0, 5).map((bk) => (
                                        <tr
                                            key={bk.id}
                                            className="group cursor-pointer transition-colors hover:bg-[#fef7ff]/30"
                                            onClick={() =>
                                                setSelectedBookingForDetails(bk)
                                            }
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-[#1d1a24]">
                                                    {bk.service}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[10px] text-[#4a4455]/60">
                                                    {bk.ref}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-[#1d1a24]/90">
                                                {bk.date}
                                                <span className="mt-0.5 block text-[9px] text-[#4a4455]/60">
                                                    {
                                                        bk.timeSlot?.split(
                                                            ' - ',
                                                        )[0]
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-[#1d1a24]">
                                                ${bk.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                        bk.status ===
                                                        'Confirmed'
                                                            ? 'bg-emerald-100/80 text-emerald-800'
                                                            : bk.status ===
                                                                'Pending'
                                                              ? 'bg-amber-100/80 text-amber-800'
                                                              : 'bg-rose-100/80 text-rose-800'
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
                                                        className="cursor-pointer rounded-full p-1 text-[#4a4455]/70 transition-all outline-none hover:bg-[#e8dfee]/50 hover:text-[#630ed4]"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>

                                                    {activeMenuId === bk.id && (
                                                        <div className="animate-in fade-in absolute right-0 z-20 mt-1.5 w-36 overflow-hidden rounded-xl border border-[#ccc3d8]/30 bg-white shadow-xl duration-100">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            bk.id,
                                                                            'Confirmed',
                                                                            bk.service,
                                                                        )
                                                                    }
                                                                    className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />{' '}
                                                                    Confirm Slot
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            bk.id,
                                                                            'Pending',
                                                                            bk.service,
                                                                        )
                                                                    }
                                                                    className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-medium text-amber-700 hover:bg-amber-50"
                                                                >
                                                                    <RotateCcw className="h-3.5 w-3.5" />{' '}
                                                                    Set Pending
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            bk.id,
                                                                            'Cancelled',
                                                                            bk.service,
                                                                        )
                                                                    }
                                                                    className="flex w-full cursor-pointer items-center gap-1.5 border-t border-gray-100 px-3 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />{' '}
                                                                    Cancel Slot
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

                    <div className="border-t border-gray-100 bg-[#fef7ff]/20 p-4 text-center">
                        <p className="text-[11px] text-[#4a4455]/60">
                            Interactive Row Action: Click any row to view
                            complete booking files & remarks.
                        </p>
                    </div>
                </div>

                {/* Recent Notifications Feed */}
                <div className="flex flex-col justify-between rounded-2xl border border-[#ccc3d8]/40 bg-white shadow-sm">
                    <div>
                        <div className="flex items-center justify-between border-b border-[#ccc3d8]/30 bg-[#fef7ff]/50 px-6 py-4.5">
                            <h3 className="text-base font-semibold text-[#25005a]">
                                Recent Activity
                            </h3>
                            <span className="rounded bg-[#eaddff]/50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#630ed4] uppercase">
                                Live
                            </span>
                        </div>

                        <div className="custom-scrollbar max-h-[380px] flex-grow space-y-5 overflow-y-auto p-5">
                            {logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <span className="mb-3 rounded-full bg-gray-50 p-3 text-gray-300">
                                        <Info className="h-6 w-6" />
                                    </span>
                                    <p className="text-sm font-medium text-gray-400">
                                        No logs on file
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
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
                                            <div className="absolute top-[30px] bottom-[-20px] left-[15px] w-0.5 bg-gray-100"></div>
                                        )}

                                        {/* Log action icon badge */}
                                        <div
                                            className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-1.5 ${getLogBg(log.type)}`}
                                        >
                                            {getLogIcon(log.type)}
                                        </div>

                                        <div className="pt-0.5 text-left">
                                            <p className="text-xs font-bold text-[#1d1a24]">
                                                {log.title}
                                            </p>
                                            <p className="mt-0.5 text-xs leading-relaxed text-[#4a4455]/85">
                                                {log.subtitle}
                                            </p>
                                            <p className="mt-1 text-[9px] font-bold tracking-wider text-[#4a4455]/50 uppercase">
                                                {log.timeText}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="border-t border-[#ccc3d8]/20 bg-[#fef7ff]/10 p-4">
                        <button
                            onClick={handleClearLogs}
                            className="w-full cursor-pointer rounded-xl border border-[#ccc3d8] py-2 text-xs font-semibold text-[#4a4455] transition-all hover:border-[#630ed4] hover:bg-neutral-50 hover:text-[#630ed4] active:scale-98"
                        >
                            Clear All Logs
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Detail Modal popup */}
            {selectedBookingForDetails && (
                <div
                    className="fixed inset-0 z-100 flex cursor-default items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setSelectedBookingForDetails(null)}
                >
                    <div
                        className="animate-in zoom-in-95 relative w-full max-w-md rounded-2xl border border-[#ccc3d8]/30 bg-white p-6 text-left shadow-2xl duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedBookingForDetails(null)}
                            className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-[#630ed4]"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-1 flex items-center gap-2 pl-1 text-[10px] font-extrabold tracking-widest text-[#630ed4] uppercase">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Full Booking File</span>
                        </div>

                        <h3 className="text-lg font-bold text-[#1d1a24]">
                            {selectedBookingForDetails.service}
                        </h3>
                        <p className="mt-0.5 mb-4 font-mono text-xs text-[#4a4455]/70">
                            Reference: {selectedBookingForDetails.ref}
                        </p>

                        <div className="space-y-3 border-t border-[#f3ebfa] pt-3 text-xs">
                            <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Client Name
                                </span>
                                <span className="font-bold text-[#1d1a24]">
                                    {selectedBookingForDetails.customerName}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Email
                                </span>
                                <span
                                    className="truncate font-medium text-[#1d1a24]"
                                    title={
                                        selectedBookingForDetails.customerEmail
                                    }
                                >
                                    {selectedBookingForDetails.customerEmail}
                                </span>
                            </div>
                            {selectedBookingForDetails.phoneNumber && (
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5">
                                    <span className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                        Phone Number
                                    </span>
                                    <span className="font-medium text-[#1d1a24]">
                                        {selectedBookingForDetails.phoneNumber}
                                    </span>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Target Date
                                </span>
                                <span className="font-semibold text-[#1d1a24]">
                                    {selectedBookingForDetails.date}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Time Slot
                                </span>
                                <span className="font-semibold text-[#1d1a24]">
                                    {selectedBookingForDetails.timeSlot}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Subtotal Value
                                </span>
                                <span className="text-sm font-bold text-[#630ed4]">
                                    $
                                    {selectedBookingForDetails.amount.toFixed(
                                        2,
                                    )}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Workflow Status
                                </span>
                                <span>
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wide uppercase ${
                                            selectedBookingForDetails.status ===
                                            'Confirmed'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : selectedBookingForDetails.status ===
                                                    'Pending'
                                                  ? 'bg-amber-100 text-amber-800'
                                                  : 'bg-rose-100 text-rose-800'
                                        }`}
                                    >
                                        {selectedBookingForDetails.status}
                                    </span>
                                </span>
                            </div>

                            {/* Note details */}
                            <div className="pt-2">
                                <span className="mb-1 block text-[10px] font-semibold tracking-wider text-[#4a4455]/70 uppercase">
                                    Administrative Notes
                                </span>
                                <p className="max-h-24 overflow-y-auto rounded-lg bg-neutral-50 p-3 text-[11px] leading-relaxed text-neutral-600 italic">
                                    {selectedBookingForDetails.notes ||
                                        'No custom remarks annotated for this slot.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2 border-t border-[#f3ebfa] pt-3">
                            <button
                                onClick={() =>
                                    setSelectedBookingForDetails(null)
                                }
                                className="cursor-pointer rounded-lg bg-[#630ed4] px-4 py-2 text-xs font-semibold text-white shadow transition-all hover:bg-[#7c3aed] active:scale-95"
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
