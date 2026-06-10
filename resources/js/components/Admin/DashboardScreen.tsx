import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    DollarSign,
    Calendar,
    Users,
    Smile,
    TrendingUp,
    Star,
    ArrowRight,
    MoreVertical,
    CheckSquare,
    CalendarDays,
    XCircle,
    UserPlus,
    HelpCircle,
    Clock,
    Briefcase,
} from 'lucide-react';
import { AdminBooking, ActivityLog, ClinicService, Staff } from '@/types';

interface DashboardScreenProps {
    bookings: AdminBooking[];
    services: ClinicService[];
    staff: Staff[];
    activityLogs: ActivityLog[];
    onNavigate: (
        screen: 'dashboard' | 'bookings' | 'availability' | 'settings',
    ) => void;
    onSelectBooking: (booking: AdminBooking) => void;
    onOpenNewBooking: () => void;
}

export default function DashboardScreen({
    bookings,
    services,
    staff,
    activityLogs,
    onNavigate,
    onSelectBooking,
    onOpenNewBooking,
}: DashboardScreenProps) {
    const [trendsRange, setTrendsRange] = useState<'7days' | '30days'>('7days');

    // Find related service for custom rendering
    const getService = (id: string): ClinicService | undefined => {
        return services.find((s) => s.id === id);
    };

    // 1. Calculate dynamic statistics based on bookings
    const todayDateStr = '2026-06-09'; // static align to requirements timestamp
    const todayBookings = bookings.filter(
        (b) => b.date === todayDateStr && b.status !== 'Cancelled',
    );

    // Calculate revenue dynamically
    const totalRevenueBase = 24592;
    const currentRevenue =
        totalRevenueBase +
        bookings
            .filter(
                (b) =>
                    b.status === 'Completed' ||
                    b.status === 'Confirmed' ||
                    b.status === 'In Progress',
            )
            .reduce((sum, b) => sum + (getService(b.serviceId)?.price || 0), 0);

    // Active staff statistics
    const activeStaffCount = staff.filter(
        (s) => s.isActive && !s.onLeave,
    ).length;
    const totalStaffCount = staff.length;

    // Render icons for activity feed
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'booking_new':
                return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaddff] text-[#630ed4]">
                        <CalendarDays className="h-4 w-4" />
                    </div>
                );
            case 'booking_rescheduled':
                return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffdcc6] text-[#7d3d00]">
                        <Clock className="h-4 w-4" />
                    </div>
                );
            case 'booking_cancelled':
                return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                        <XCircle className="h-4 w-4" />
                    </div>
                );
            case 'staff_new':
                return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dae2fd] text-[#565e74]">
                        <UserPlus className="h-4 w-4" />
                    </div>
                );
            default:
                return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                    </div>
                );
        }
    };

    // Filter 4 main schedule entries shown in mock picture
    // Sorting them chronologically
    const sortedTodayBookings = [...todayBookings].sort((a, b) => {
        return a.time.localeCompare(b.time);
    });

    // Render weekly trends data
    const generateTrendsData = () => {
        if (trendsRange === '7days') {
            return [
                { label: 'MON', confirmed: 45, pending: 15 },
                { label: 'TUE', confirmed: 60, pending: 20 },
                { label: 'WED', confirmed: 85, pending: 10 },
                { label: 'THU', confirmed: 70, pending: 25 },
                { label: 'FRI', confirmed: 95, pending: 15 },
                { label: 'SAT', confirmed: 30, pending: 40 },
                { label: 'SUN', confirmed: 15, pending: 5 },
            ];
        } else {
            return [
                { label: 'WK 1', confirmed: 75, pending: 18 },
                { label: 'WK 2', confirmed: 80, pending: 22 },
                { label: 'WK 3', confirmed: 92, pending: 12 },
                { label: 'WK 4', confirmed: 88, pending: 15 },
            ];
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="mb-1 text-3xl font-bold tracking-tight text-[#1d1a24]">
                    Dashboard
                </h2>
                <p className="text-gray-500">
                    Welcome back, here's an overview of today's performance.
                </p>
            </div>

            {/* Key Metrics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-xl border border-[#e8dfee] bg-white p-6 shadow-sm transition-all hover:border-[#630ed4]"
                >
                    <div className="mb-2 flex items-start justify-between">
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Total Revenue
                        </span>
                        <span className="rounded-lg bg-[#eaddff] p-2 text-[#630ed4]">
                            <DollarSign className="h-5 w-5" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-[#1d1a24]">
                        ${currentRevenue.toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#630ed4]">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>+12.5% from last month</span>
                    </div>
                </motion.div>

                {/* New Bookings */}
                <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-xl border border-[#e8dfee] bg-white p-6 shadow-sm transition-all hover:border-[#630ed4]"
                >
                    <div className="mb-2 flex items-start justify-between">
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            New Bookings
                        </span>
                        <span className="rounded-lg bg-[#ffdcc6] p-2 text-[#7d3d00]">
                            <Calendar className="h-5 w-5" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-[#1d1a24]">
                        {120 + todayBookings.length}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#7d3d00]">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>+8% from yesterday</span>
                    </div>
                </motion.div>

                {/* Active Staff */}
                <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-xl border border-[#e8dfee] bg-white p-6 shadow-sm transition-all hover:border-[#630ed4]"
                >
                    <div className="mb-2 flex items-start justify-between">
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Active Staff
                        </span>
                        <span className="rounded-lg bg-[#dae2fd] p-2 text-[#565e74]">
                            <Users className="h-5 w-5" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-[#1d1a24]">
                        {activeStaffCount}/{totalStaffCount}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                            {staff.filter((s) => s.onLeave).length} on leave
                        </span>
                    </div>
                </motion.div>

                {/* Satisfaction */}
                <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-xl border border-[#e8dfee] bg-white p-6 shadow-sm transition-all hover:border-[#630ed4]"
                >
                    <div className="mb-2 flex items-start justify-between">
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Satisfaction
                        </span>
                        <span className="rounded-lg bg-[#ffdad6] p-2 text-red-500">
                            <Smile className="h-5 w-5" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-[#1d1a24]">98.2%</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>Based on 450+ reviews</span>
                    </div>
                </motion.div>
            </div>

            {/* Main Grid Layout */}
            <div className="mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {/* Today's Schedule Card */}
                <div className="overflow-hidden rounded-xl border border-[#e8dfee] bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-[#e8dfee] bg-white px-6 py-4">
                        <h3 className="text-lg font-bold text-[#1d1a24]">
                            Today's Schedule
                        </h3>
                        <button
                            onClick={() => onNavigate('bookings')}
                            className="flex cursor-pointer items-center gap-1 text-xs font-bold text-[#630ed4] transition-colors hover:underline"
                        >
                            View Full Calendar
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="divide-y divide-[#e8dfee]">
                        {sortedTodayBookings.length === 0 ? (
                            <div className="p-12 text-center text-sm text-gray-500">
                                No active appointments scheduled for today.
                            </div>
                        ) : (
                            sortedTodayBookings.map((b) => {
                                const srv = getService(b.serviceId);
                                const assignedStaff = staff.find(
                                    (s) => s.id === b.staffId,
                                );

                                // Color badges depending on appointment status
                                let badgeStyle = 'bg-[#eaddff] text-[#630ed4]';
                                if (b.status === 'Confirmed') {
                                    badgeStyle =
                                        'bg-emerald-100 text-emerald-800';
                                } else if (b.status === 'In Progress') {
                                    badgeStyle =
                                        'bg-[#f3ebfa] text-[#630ed4] border border-[#630ed4]/20';
                                } else if (b.status === 'Completed') {
                                    badgeStyle = 'bg-blue-100 text-blue-800';
                                }

                                // Primary border based on treatment template color
                                let borderStyle = 'border-l-[#630ed4]';
                                if (srv?.color === 'tertiary') {
                                    borderStyle = 'border-l-[#7d3d00]';
                                } else if (srv?.color === 'muted') {
                                    borderStyle = 'border-l-[#565e74]';
                                } else if (srv?.color === 'error') {
                                    borderStyle = 'border-l-[#ba1a1a]';
                                }

                                return (
                                    <div
                                        key={b.id}
                                        onClick={() => onSelectBooking(b)}
                                        className="group flex cursor-pointer items-center gap-6 p-6 transition-colors hover:bg-violet-50/50"
                                    >
                                        {/* Time display */}
                                        <div className="w-20 shrink-0 text-center">
                                            <p className="text-base font-bold text-gray-900">
                                                {b.time.split(' ')[0]}
                                            </p>
                                            <p className="text-xs font-semibold text-gray-500">
                                                {b.time.split(' ')[1] || 'AM'}
                                            </p>
                                        </div>

                                        {/* Left Border Accent Info */}
                                        <div
                                            className={`flex-1 border-l-4 ${borderStyle} pl-4`}
                                        >
                                            <h4 className="text-sm font-bold text-[#1d1a24] transition-colors group-hover:text-[#630ed4]">
                                                {srv?.name || b.serviceId}
                                            </h4>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Client:{' '}
                                                <span className="font-semibold text-gray-700">
                                                    {b.clientName}
                                                </span>{' '}
                                                • Room {b.room}{' '}
                                                {assignedStaff &&
                                                    `• Dr. ${assignedStaff.name.split(' ').pop()}`}
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="hidden items-center gap-3 sm:flex">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${badgeStyle}`}
                                            >
                                                {b.status}
                                            </span>
                                            <button className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-900">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="flex h-full flex-col rounded-xl border border-[#e8dfee] bg-white shadow-sm">
                    <div className="border-b border-[#e8dfee] px-6 py-4">
                        <h3 className="text-lg font-bold text-[#1d1a24]">
                            Recent Activity
                        </h3>
                    </div>
                    <div className="hide-scrollbar max-h-[448px] flex-1 space-y-6 overflow-y-auto p-6">
                        {activityLogs.slice(0, 5).map((log, idx) => (
                            <div
                                key={log.id || idx}
                                className="flex items-start gap-4"
                            >
                                <div className="relative shrink-0">
                                    {getActivityIcon(log.type)}
                                    {idx < activityLogs.length - 1 && (
                                        <div className="absolute top-9 left-1/2 h-10 w-[1px] -translate-x-1/2 bg-gray-100" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs leading-normal text-gray-800 md:text-sm">
                                        <span className="font-bold text-gray-900">
                                            {log.title}:
                                        </span>{' '}
                                        {log.description}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-gray-400">
                                        {log.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Trends Bento Grid Item */}
            <div className="rounded-xl border border-[#e8dfee] bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h3 className="text-lg font-bold text-[#1d1a24]">
                            Weekly Booking Trends
                        </h3>
                        <p className="text-sm text-gray-500">
                            Performance comparison across the current week.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#630ed4]"></span>
                            <span className="text-xs font-semibold text-gray-500">
                                Confirmed
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#ccc3d8]"></span>
                            <span className="text-xs font-semibold text-gray-500">
                                Pending
                            </span>
                        </div>

                        <select
                            value={trendsRange}
                            onChange={(e) =>
                                setTrendsRange(
                                    e.target.value as '7days' | '30days',
                                )
                            }
                            className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-[#630ed4] focus:outline-none"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Visual Simulated Chart Bars */}
                <div className="hide-scrollbar flex h-64 items-end gap-3 overflow-x-auto px-2 md:gap-6">
                    {generateTrendsData().map((data, index) => {
                        const sum = data.confirmed + data.pending;
                        return (
                            <div
                                key={index}
                                className="group flex min-w-[50px] flex-1 flex-col items-center gap-3"
                            >
                                <div className="relative flex h-48 w-full flex-col items-center justify-end gap-1.5">
                                    {/* Tooltip on Hover */}
                                    <div className="pointer-events-none absolute -top-10 z-10 rounded bg-gray-900 px-2 py-1 font-mono text-[10px] whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                        Conf: {data.confirmed}% | Pending:{' '}
                                        {data.pending}%
                                    </div>

                                    {/* Pending Bar (stacked top-like or side-by-side; bar visualization uses stacked height percentages) */}
                                    <div
                                        style={{ height: `${data.pending}%` }}
                                        className="w-8 rounded-t-lg bg-[#ccc3d8] transition-all hover:bg-[#b8adc6] md:w-12"
                                        title={`Pending: ${data.pending}%`}
                                    />

                                    {/* Confirmed Bar */}
                                    <div
                                        style={{ height: `${data.confirmed}%` }}
                                        className="w-8 rounded-t-lg bg-[#630ed4] transition-all hover:bg-[#7c3aed] md:w-12"
                                        title={`Confirmed: ${data.confirmed}%`}
                                    />
                                </div>
                                <span className="text-[11px] font-bold tracking-wider text-gray-500">
                                    {data.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
