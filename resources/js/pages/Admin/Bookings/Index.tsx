import {
    Clock,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    CheckSquare,
    MoreVertical,
    Bell,
    CloudDownload,
    Book,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    CalendarDays,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import StatCard from '@/components/Admin/StatCard';
import StatusBadge from '@/components/Admin/StatusBadge';
import { services } from '@/data/services';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { formatTime } from '@/pages/Guest/Booking/Create';
import type { Booking } from '@/types/booking';

interface BookingsProps {
    bookings: Booking[];
}

export default function AdminBookingIndex({ bookings }: BookingsProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const stats = [
        {
            label: 'Total Bookings',
            value: '1,284',
            icon: Book,
            color: 'text-primary',
        },
        {
            label: 'Pending',
            value: '12',
            icon: Clock,
            color: 'text-orange-600',
        },
        {
            label: 'Today',
            value: '8',
            icon: CalendarDays,
            color: 'text-blue-600',
        },
        {
            label: 'Completion Rate',
            value: '94%',
            icon: TrendingUp,
            color: 'text-white',
            isAccent: true,
        },
    ];

    const filteredBookings = bookings
        .map((booking) => {
            const service = services.find((s) => s.id === booking.service_id);

            return {
                ...booking,
                service,
                client_initials: booking.client_name
                    .split(' ')
                    .map((name) => name[0])
                    .join('')
                    .toUpperCase(),
            };
        })
        .filter(
            (b) =>
                b.client_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                b.service?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        );

    // console.log('Bookings from backend: ', bookings);

    return (
        <AdminLayout>
            {/* Header */}
            <header className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-on-surface">
                        Bookings Management
                    </h1>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        Review and manage upcoming client appointments
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-4 py-2">
                    <CalendarDays
                        size={18}
                        className="text-on-surface-variant"
                    />
                    <span className="text-[11px] font-bold tracking-widest text-on-surface uppercase">
                        October 24, 2024
                    </span>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </section>

            {/* Table Container */}
            <section className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm shadow-black/5">
                <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low/50 px-6 py-4 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-on-surface">
                        All Bookings
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
                            />
                            <input
                                type="text"
                                placeholder="Search client or service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 rounded-xl border border-outline-variant bg-white py-2 pr-4 pl-10 text-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <button className="flex items-center gap-2 rounded-xl border border-outline-variant px-3 py-2 text-xs font-semibold transition-colors hover:bg-surface-container-high">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low/30">
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                                    Client Name
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                                    Service
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                                    Date & Time
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            <AnimatePresence mode="popLayout">
                                {filteredBookings.map((booking) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={booking.id}
                                        className="group transition-colors hover:bg-surface-container-low/20"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-xs font-bold tracking-tighter text-primary">
                                                    {booking.client_initials}
                                                </div>
                                                <div>
                                                    <div className="text-sm leading-tight font-semibold text-on-surface">
                                                        {booking.client_name}
                                                    </div>
                                                    <div className="text-[11px] text-on-surface-variant">
                                                        {booking.client_email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface">
                                            {booking.service?.name ||
                                                'Unknown Service'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-on-surface">
                                                {new Intl.DateTimeFormat(
                                                    'en-US',
                                                    {
                                                        weekday: 'long',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    },
                                                ).format(
                                                    new Date(booking.date),
                                                )}
                                            </div>
                                            <div className="text-[11px] text-on-surface-variant">
                                                {formatTime(booking.start_time)}{' '}
                                                — {formatTime(booking.end_time)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                status={booking.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                {booking.status ===
                                                    'pending' && (
                                                    <>
                                                        <button
                                                            className="rounded-xl p-2 text-primary transition-colors hover:bg-primary/10"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle2
                                                                size={18}
                                                            />
                                                        </button>
                                                        <button
                                                            className="rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50"
                                                            title="Reject"
                                                        >
                                                            <XCircle
                                                                size={18}
                                                            />
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status !==
                                                    'cancelled' &&
                                                    booking.status !==
                                                        'completed' && (
                                                        <button
                                                            className="rounded-xl p-2 text-on-secondary-container transition-colors hover:bg-secondary-container/50"
                                                            title="Mark Completed"
                                                        >
                                                            <CheckSquare
                                                                size={18}
                                                            />
                                                        </button>
                                                    )}
                                                {booking.status ===
                                                    'completed' && (
                                                    <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/5">
                                                        View Notes
                                                    </button>
                                                )}
                                                {booking.status ===
                                                    'cancelled' && (
                                                    <button className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-[11px] font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high">
                                                        <RotateCcw size={12} />
                                                        Restore
                                                    </button>
                                                )}
                                                <button className="ml-1 rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low/30 px-6 py-4">
                    <span className="text-[11px] font-medium text-on-surface-variant">
                        Showing {filteredBookings.length} of 1,284 bookings
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled
                            className="rounded-xl border border-outline-variant p-2 transition-all hover:bg-surface-container-highest disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button className="rounded-xl border border-outline-variant p-2 transition-all hover:bg-surface-container-highest active:scale-95">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Action Grid */}
            <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container/40 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-primary shadow-sm shadow-primary/5">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-on-surface">
                            Send Reminders
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                            Notify clients about tomorrow's bookings.
                        </p>
                    </div>
                    <button className="ml-auto rounded-xl border border-primary px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white active:scale-95">
                        Send All
                    </button>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container/40 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-on-secondary-container shadow-sm shadow-black/5">
                        <CloudDownload size={24} />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-on-surface">
                            Export Data
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                            Download booking history in CSV format.
                        </p>
                    </div>
                    <button className="ml-auto rounded-xl border border-on-secondary-container px-5 py-2.5 text-xs font-bold text-on-secondary-container transition-all hover:bg-on-secondary-container hover:text-white active:scale-95">
                        Export
                    </button>
                </div>
            </section>
        </AdminLayout>
    );
}
