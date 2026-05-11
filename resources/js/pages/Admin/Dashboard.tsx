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
import { INITIAL_BOOKINGS } from '@/data/bookings';
import AdminLayout from '@/layouts/Admin/AdminLayout';

export default function AdminDashboard() {
    // const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
    const [bookings] = useState(INITIAL_BOOKINGS);
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

    const filteredBookings = bookings.filter(
        (b) =>
            b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.service.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AdminLayout>
            {/* Header */}
            <header className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-on-surface text-3xl font-bold">
                        Bookings Management
                    </h1>
                    <p className="text-on-surface-variant mt-1 text-sm">
                        Review and manage upcoming client appointments
                    </p>
                </div>
                <div className="bg-surface-container border-outline-variant flex items-center gap-2 rounded-full border px-4 py-2">
                    <CalendarDays
                        size={18}
                        className="text-on-surface-variant"
                    />
                    <span className="text-on-surface text-[11px] font-bold tracking-widest uppercase">
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
            <section className="border-outline-variant overflow-hidden rounded-2xl border bg-white shadow-sm shadow-black/5">
                <div className="border-outline-variant bg-surface-container-low/50 flex items-center justify-between border-b px-6 py-4 backdrop-blur-sm">
                    <h3 className="text-on-surface text-lg font-semibold">
                        All Bookings
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search
                                size={18}
                                className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2"
                            />
                            <input
                                type="text"
                                placeholder="Search client or service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-outline-variant focus:ring-primary w-64 rounded-xl border bg-white py-2 pr-4 pl-10 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
                            />
                        </div>
                        <button className="border-outline-variant hover:bg-surface-container-high flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-surface-container-low/30 border-outline-variant border-b">
                                <th className="text-on-surface-variant px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Client Name
                                </th>
                                <th className="text-on-surface-variant px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Service
                                </th>
                                <th className="text-on-surface-variant px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Date & Time
                                </th>
                                <th className="text-on-surface-variant px-6 py-4 text-[10px] font-bold tracking-wider uppercase">
                                    Status
                                </th>
                                <th className="text-on-surface-variant px-6 py-4 text-right text-[10px] font-bold tracking-wider uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-outline-variant divide-y">
                            <AnimatePresence mode="popLayout">
                                {filteredBookings.map((booking) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={booking.id}
                                        className="hover:bg-surface-container-low/20 group transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-secondary-container text-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold tracking-tighter">
                                                    {booking.clientInitials}
                                                </div>
                                                <div>
                                                    <div className="text-on-surface text-sm leading-tight font-semibold">
                                                        {booking.clientName}
                                                    </div>
                                                    <div className="text-on-surface-variant text-[11px]">
                                                        {booking.clientEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-on-surface px-6 py-4 text-sm">
                                            {booking.service}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-on-surface text-sm font-medium">
                                                {booking.date}
                                            </div>
                                            <div className="text-on-surface-variant text-[11px]">
                                                {booking.time}
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
                                                    'Pending' && (
                                                    <>
                                                        <button
                                                            className="text-primary hover:bg-primary/10 rounded-xl p-2 transition-colors"
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
                                                    'Cancelled' &&
                                                    booking.status !==
                                                        'Completed' && (
                                                        <button
                                                            className="text-on-secondary-container hover:bg-secondary-container/50 rounded-xl p-2 transition-colors"
                                                            title="Mark Completed"
                                                        >
                                                            <CheckSquare
                                                                size={18}
                                                            />
                                                        </button>
                                                    )}
                                                {booking.status ===
                                                    'Completed' && (
                                                    <button className="text-primary hover:bg-primary/5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors">
                                                        View Notes
                                                    </button>
                                                )}
                                                {booking.status ===
                                                    'Cancelled' && (
                                                    <button className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-colors">
                                                        <RotateCcw size={12} />
                                                        Restore
                                                    </button>
                                                )}
                                                <button className="text-on-surface-variant hover:bg-surface-container-high ml-1 rounded-xl p-2 transition-colors">
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

                <div className="bg-surface-container-low/30 border-outline-variant flex items-center justify-between border-t px-6 py-4">
                    <span className="text-on-surface-variant text-[11px] font-medium">
                        Showing {filteredBookings.length} of 1,284 bookings
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled
                            className="border-outline-variant hover:bg-surface-container-highest rounded-xl border p-2 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button className="border-outline-variant hover:bg-surface-container-highest rounded-xl border p-2 transition-all active:scale-95">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Action Grid */}
            <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-surface-container/40 border-outline-variant flex items-center gap-4 rounded-2xl border p-6">
                    <div className="bg-secondary-container text-primary shadow-primary/5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h4 className="text-on-surface text-base font-bold">
                            Send Reminders
                        </h4>
                        <p className="text-on-surface-variant text-xs">
                            Notify clients about tomorrow's bookings.
                        </p>
                    </div>
                    <button className="border-primary text-primary hover:bg-primary ml-auto rounded-xl border px-5 py-2.5 text-xs font-bold transition-all hover:text-white active:scale-95">
                        Send All
                    </button>
                </div>

                <div className="bg-surface-container/40 border-outline-variant flex items-center gap-4 rounded-2xl border p-6">
                    <div className="bg-surface-container-high text-on-secondary-container flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm shadow-black/5">
                        <CloudDownload size={24} />
                    </div>
                    <div>
                        <h4 className="text-on-surface text-base font-bold">
                            Export Data
                        </h4>
                        <p className="text-on-surface-variant text-xs">
                            Download booking history in CSV format.
                        </p>
                    </div>
                    <button className="border-on-secondary-container text-on-secondary-container hover:bg-on-secondary-container ml-auto rounded-xl border px-5 py-2.5 text-xs font-bold transition-all hover:text-white active:scale-95">
                        Export
                    </button>
                </div>
            </section>
        </AdminLayout>
    );
}
