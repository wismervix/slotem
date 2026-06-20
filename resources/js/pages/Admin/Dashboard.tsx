import AdminLayout from '@/layouts/Admin/AdminLayout';
import React, { useMemo, useState } from 'react';

import {
    TrendingUp,
    BookOpen,
    Clock,
    CalendarDays,
    CheckCircle2,
    AlertCircle,
    Activity,
    ArrowUpRight,
    UserCheck,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { Service, Booking, BookingStatus } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { formatTime } from '@/lib/calendar-utils';

interface AdminDashboardProps {
    bookings: Booking[];
}

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
}

export default function AdminDashboard({ bookings }: AdminDashboardProps) {
    const { services } = usePage<{ services: Service[] }>().props;

    // 2. Global Event Handlers for Bookings state
    const handleApproveBooking = (id: string) => {
        console.log('Handle Approve Booking!');
    };

    const handleCompleteBooking = (id: string) => {
        console.log('Handle Complete Booking!');
    };

    const handleUpdateBookingStatus = (id: number, status: BookingStatus) => {
        console.log('Handle Update Booking Status!');
    };

    const today = new Date().toISOString().split('T')[0];

    const todayBookings = bookings.filter((a) => a.date === today);
    const pendingBookings = bookings.filter((a) => a.status === 'pending');
    const completedBookings = bookings.filter((a) => a.status === 'completed');
    const cancelledBookings = bookings.filter((a) => a.status === 'cancelled');

    // completion rate math
    let completionRate;
    if (bookings.length > 0) {
        completionRate = Math.round(
            (completedBookings.length /
                (completedBookings.length + cancelledBookings.length || 1)) *
                100,
        );
        if (isNaN(completionRate) || completionRate === 0) completionRate = 0;
        // completionRate = 'No completed bookings yet!';
    }

    // 2. Charts Data
    // Weekly Load Analysis
    const weeklyLoadData = useMemo(() => {
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // Aggregate bookings by day or distribute them realistically
        return [
            { name: 'Mon', bookings: 14, revenue: 2100 },
            { name: 'Tue', bookings: 18, revenue: 2900 },
            { name: 'Wed', bookings: 22, revenue: 3800 },
            { name: 'Thu', bookings: 19, revenue: 3100 },
            { name: 'Fri', bookings: 25, revenue: 4200 },
            { name: 'Sat', bookings: 8, revenue: 1400 },
            { name: 'Sun', bookings: 3, revenue: 450 },
        ];
    }, []);

    // Services distribution data
    const servicesDistribution = useMemo(() => {
        const categoryCounts: { [key: string]: number } = {};
        services.forEach((s) => {
            categoryCounts[s.name] = (categoryCounts[s.name] || 0) + 1;
        });

        const colors = [
            '#7c3aed',
            '#5b21b6',
            '#4c1d95',
            '#a78bfa',
            '#c084fc',
            '#e9d5ff',
        ];
        return Object.entries(categoryCounts).map(([name, value], idx) => ({
            name,
            value,
            color: colors[idx % colors.length],
        }));
    }, [services]);

    const COLORS = [
        '#7c3aed',
        '#6366f1',
        '#f59e0b',
        '#10b981',
        '#ec4899',
        '#14b8a6',
    ];

    // Upcoming Active schedule (filter on Pending or Confirmed and limit to 4 items)
    const upcomingQueue = useMemo(() => {
        return bookings
            .filter((b) => b.status === 'pending' || b.status === 'approved')
            .slice(0, 4);
    }, [bookings]);

    const styles = {
        pending:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
        approved:
            'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400',
        completed:
            'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400',
        cancelled:
            'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
        rejected:
            'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
    };

    const dotStyles = {
        pending: 'bg-emerald-500',
        approved: 'bg-purple-500',
        completed: 'bg-purple-500',
        cancelled: 'bg-rose-500',
        rejected: 'bg-rose-500',
    };

    // console.log('Bookings from backend: ', bookings);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            <Activity className="h-6 w-6 animate-pulse text-purple-600" />
                            Dashboard Insights
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Real-time analytics and operating health overview.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => console.log('Open Services Modal')}
                            className="cursor-pointer rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/10 transition-all hover:bg-purple-700 active:scale-95"
                        >
                            Create New Slot
                        </button>
                    </div>
                </div>

                {/* Bento Grid Statistics */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Bookings Card */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                                Total Bookings
                            </span>
                            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 transition-transform group-hover:scale-110 dark:bg-zinc-950 dark:text-purple-400">
                                <BookOpen className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                                {bookings.length}
                            </div>
                            <p className="mt-1 flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                                <TrendingUp className="h-3 w-3" />
                                +12% vs last month
                            </p>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                                Pending Tasks
                            </span>
                            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 transition-transform group-hover:scale-110 dark:bg-zinc-950 dark:text-amber-400">
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                                {pendingBookings.length}
                            </div>
                            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                                Requires coordinator approval
                            </p>
                        </div>
                    </div>

                    {/* Today Card */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                                Today's Load
                            </span>
                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-zinc-950 dark:text-indigo-400">
                                <CalendarDays className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                                {todayBookings.length}
                            </div>
                            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                                Active client meetings scheduled
                            </p>
                        </div>
                    </div>

                    {/* Completion Rate */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl bg-purple-600 p-5 text-white transition-shadow hover:shadow-md dark:bg-purple-900">
                        <div className="absolute -right-3 -bottom-3 opacity-10 transition-transform group-hover:scale-120">
                            <TrendingUp className="h-24 w-24" />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                                Completion Rate
                            </span>
                            <div className="rounded-xl bg-white/20 p-2 text-white dark:bg-black/20">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold select-all">
                                {completionRate}%
                            </div>
                            <p className="mt-1 text-[11px] opacity-80">
                                High standard quality benchmark
                            </p>
                        </div>
                    </div>
                </section>

                {/* Analytics Charts Grid */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Weekly load Line tracking */}
                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    Weekly Appointment Ingestion
                                </h3>
                                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                                    Average weekly volume & transaction metrics.
                                </p>
                            </div>
                            <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-zinc-950 dark:text-purple-400">
                                Live Feed
                            </span>
                        </div>
                        <div className="mt-2 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={weeklyLoadData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f3f4f6"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            borderRadius: '8px',
                                            border: 'none',
                                            color: '#fff',
                                            fontSize: '11px',
                                        }}
                                    />
                                    <Bar
                                        dataKey="bookings"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                        barSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Services Distribution Pie */}
                    <div className="flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                Category Popularity
                            </h3>
                            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                                Distribution of service requests.
                            </p>
                        </div>
                        <div className="relative my-2 flex h-44 items-center justify-center">
                            {servicesDistribution.length === 0 ? (
                                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                    No active bookings for breakdown.
                                </p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={servicesDistribution}
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {servicesDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [
                                                `${value} bookings`,
                                                'Volume',
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="space-y-1.5 overflow-hidden">
                            {servicesDistribution
                                .slice(0, 3)
                                .map((item, index) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <div className="flex max-w-[200px] items-center gap-1.5 truncate">
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ],
                                                }}
                                            />
                                            <span className="truncate text-zinc-600 dark:text-zinc-400">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-zinc-900 dark:text-zinc-200">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Recent Activity / Active Bookings Stream */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-zinc-800">
                        <div>
                            <h3 className="text-md font-bold text-slate-800 dark:text-zinc-100">
                                Upcoming Schedule Agenda
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
                                Quick lookup of the next scheduled bookings
                                within the system.
                            </p>
                        </div>

                        <div>
                            <Link
                                href={route('admin.bookings')}
                                className="flex cursor-pointer items-center gap-0.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400"
                            >
                                Manage List
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                            <span className="mt-4 flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 font-sans text-xs font-semibold text-purple-700 dark:bg-zinc-950 dark:text-purple-400">
                                <Clock className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                                Live schedule update
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-100 bg-slate-50 text-xs font-bold tracking-wider text-gray-400 uppercase dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4">Client Detail</th>
                                    <th className="px-6 py-4">
                                        Assigned Service
                                    </th>
                                    <th className="px-6 py-4">Date/Time</th>
                                    <th className="px-6 py-4">
                                        Booking Status
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50 text-sm dark:divide-zinc-800">
                                {bookings.slice(0, 4).map((b) => (
                                    <tr
                                        key={b.id}
                                        className="transition-colors hover:bg-slate-50/70 dark:hover:bg-zinc-800/40"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-zinc-100">
                                                    {b.client_name}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-zinc-500">
                                                    {b.client_email}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-700 dark:text-zinc-300">
                                                    {b?.service?.name ||
                                                        'No service available'}
                                                </p>
                                                <p className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                                                    $
                                                    {b?.service?.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                    {new Intl.DateTimeFormat(
                                                        'en-US',
                                                        {
                                                            weekday: 'long',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    ).format(new Date(b.date))}
                                                </span>
                                                <span className="font-mono text-xs text-gray-400 dark:text-zinc-500">
                                                    {formatTime(b.start_time)} —{' '}
                                                    {formatTime(b.end_time)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[b.status]}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${dotStyles[b.status]}`}
                                                />
                                                {b.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            {b.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            console.log(
                                                                'Approve Booking',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-950/60"
                                                    >
                                                        Approve Booking
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleUpdateBookingStatus(
                                                                b.id,
                                                                'rejected',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {b.status === 'approved' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateBookingStatus(
                                                                b.id,
                                                                'completed',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-950/60"
                                                    >
                                                        Mark Completed
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleUpdateBookingStatus(
                                                                b.id,
                                                                'rejected',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {b.status === 'rejected' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateBookingStatus(
                                                                b.id,
                                                                'rejected',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60"
                                                    >
                                                        Rejected
                                                    </button>
                                                </div>
                                            )}

                                            {b.status === 'completed' && (
                                                <span className="text-xs text-gray-400 dark:text-zinc-500">
                                                    No actions needed
                                                </span>
                                            )}

                                            {b.status === 'cancelled' && (
                                                <span className="text-xs text-gray-400 dark:text-zinc-500">
                                                    No actions needed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
