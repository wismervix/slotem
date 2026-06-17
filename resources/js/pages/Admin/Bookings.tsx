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
    Calendar,
    CalendarDays,
    SlidersHorizontal,
    HelpCircle,
    BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useMemo, useState } from 'react';
import StatusBadge from '@/components/Admin/StatusBadge';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { formatTime } from '@/lib/calendar-utils';
import { usePage } from '@inertiajs/react';
import { Service, Booking } from '@/types';

interface BookingsProps {
    bookings: Booking[];
}

export default function AdminBookingIndex({ bookings }: BookingsProps) {
    const { services } = usePage<{ services: Service[] }>().props;

    const [searchTerm, setSearchTerm] = useState('');

    const [selectedStatusFilter, setSelectedStatusFilter] =
        useState<string>('All');

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // exact matching mockup shows 4 list entries

    const filteredBookings = useMemo(() => {
        return bookings
            .map((booking) => {
                const service = services.find(
                    (s) => s.id === booking.service_id,
                );

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
            .filter((b) => {
                const matchesSearch =
                    b.client_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    b.client_email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    b.service?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase());

                const matchesStatus =
                    selectedStatusFilter === 'All' ||
                    b.status === selectedStatusFilter;

                return matchesSearch && matchesStatus;
            });
    }, [bookings, services, searchTerm, selectedStatusFilter]);

    // Pagination criteria
    const totalPages = Math.max(
        1,
        Math.ceil(filteredBookings.length / itemsPerPage),
    );

    // Guard current page index
    const activePage = currentPage > totalPages ? totalPages : currentPage;

    const paginatedBookings = useMemo(() => {
        const startIndex = (activePage - 1) * itemsPerPage;
        return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBookings, activePage]);

    const handlePrevPage = () => {
        if (activePage > 1) setCurrentPage(activePage - 1);
    };

    const handleNextPage = () => {
        if (activePage < totalPages) setCurrentPage(activePage + 1);
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

    // console.log('Bookings from backend: ', bookings);

    return (
        <AdminLayout>
            {/* Header */}
            <header className="mb-8 flex flex-col items-end justify-between gap-3 pb-2 sm:flex-row">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 select-text dark:text-zinc-50">
                        Bookings Management
                    </h1>
                    <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Review and manage upcoming client appointments.
                    </p>
                </div>
                <div className="flex cursor-pointer items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 transition-colors select-none hover:bg-purple-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/50">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-[11px] leading-none font-bold tracking-widest text-purple-900 uppercase dark:text-purple-300">
                        October 24, 2024
                    </span>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Total Bookings Card */}
                <div className="flex h-32 flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-4 transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                            Total Bookings
                        </span>
                        <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-3xl leading-none font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                        {bookings.length}
                    </div>
                </div>

                {/* Pending Card */}
                <div className="flex h-32 flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-4 transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                            Pending
                        </span>
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-3xl leading-none font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                        {pendingBookings.length}
                    </div>
                </div>

                {/* Today Card */}
                <div className="flex h-32 flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-4 transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                            Today
                        </span>
                        <CalendarDays className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div className="text-3xl leading-none font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                        {todayBookings.length}
                    </div>
                </div>

                {/* Completion Rate */}
                <div className="flex h-32 flex-col justify-between rounded-2xl bg-purple-600 p-4 text-white shadow-sm shadow-purple-500/10 dark:bg-purple-900">
                    <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                            Completion Rate
                        </span>
                        <TrendingUp className="h-5 w-5 text-white/90" />
                    </div>
                    <div className="text-3xl leading-none font-extrabold select-all">
                        {completionRate}%
                    </div>
                </div>
            </section>

            {/* Table Container */}
            <section className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xs transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4.5 backdrop-blur-sm sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-950/25">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        All Bookings
                    </h3>

                    <div className="relative flex w-full items-center gap-2 sm:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-grow sm:flex-grow-0">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search client or service..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-10 text-xs transition-all focus:ring-purple-500 focus:outline-none sm:w-64 dark:border-zinc-800 dark:text-white"
                            />
                        </div>

                        {/* Filter Toggle Action */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowFilterDropdown(!showFilterDropdown)
                                }
                                className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                                    selectedStatusFilter !== 'All'
                                        ? 'border-purple-300 bg-purple-50/50 text-purple-700 dark:bg-purple-950/20'
                                        : 'dark:bg-zinc-850 border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:text-zinc-300'
                                }`}
                                id="btn-filter-toggle"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                <span>
                                    {selectedStatusFilter === 'All'
                                        ? 'Filter'
                                        : selectedStatusFilter}
                                </span>
                            </button>

                            {/* Popover Filter Selectors */}
                            <AnimatePresence>
                                {showFilterDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() =>
                                                setShowFilterDropdown(false)
                                            }
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 z-50 mt-2 w-48 space-y-1 rounded-xl border border-zinc-100 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                                        >
                                            {[
                                                'All',
                                                'pending',
                                                'approved',
                                                'completed',
                                                'cancelled',
                                                'rejected',
                                            ].map((item) => (
                                                <button
                                                    key={item}
                                                    onClick={() => {
                                                        setSelectedStatusFilter(
                                                            item,
                                                        );
                                                        setCurrentPage(1);
                                                        setShowFilterDropdown(
                                                            false,
                                                        );
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                                                        selectedStatusFilter ===
                                                        item
                                                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/30'
                                                            : 'text-zinc-600 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    <span>{item}</span>
                                                    {selectedStatusFilter ===
                                                        item && (
                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Scrollable Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/20">
                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                    Client Name
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                    Service
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                    Date & Time
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
                            <AnimatePresence mode="popLayout">
                                {paginatedBookings.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="bg-transparent px-6 py-12 text-center font-medium text-zinc-400 dark:text-zinc-500"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                                <HelpCircle className="text-zinc-350 h-7 w-7 dark:text-zinc-700" />
                                                <p>
                                                    No listings matching current
                                                    query rules.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedBookings.map((booking) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={booking.id}
                                            className="group dark:hover:bg-zinc-850/20 transition-colors hover:bg-surface-container-low/20"
                                        >
                                            {/* Client cell */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold tracking-tighter text-purple-700 select-none dark:bg-zinc-800 dark:text-purple-300">
                                                        {
                                                            booking.client_initials
                                                        }
                                                    </div>
                                                    <div className="max-w-[170px] truncate">
                                                        <div className="truncate text-sm leading-tight font-semibold text-zinc-950 dark:text-zinc-50">
                                                            {
                                                                booking.client_name
                                                            }
                                                        </div>
                                                        <div className="truncate text-xs text-[11px] text-zinc-400 dark:text-zinc-500">
                                                            {
                                                                booking.client_email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Service requested */}
                                            <td className="px-6 py-4 text-sm font-medium text-zinc-800 dark:text-zinc-300">
                                                {booking.service?.name ||
                                                    'Unknown Service'}
                                            </td>

                                            {/* Scheduled timings */}
                                            <td className="px-6 py-4">
                                                <div className="text-zinc-850 dark:text-zinc-350 text-sm font-semibold">
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
                                                <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                                                    {formatTime(
                                                        booking.start_time,
                                                    )}{' '}
                                                    —{' '}
                                                    {formatTime(
                                                        booking.end_time,
                                                    )}
                                                </div>
                                            </td>

                                            {/* Styled mockup chips */}
                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={booking.status}
                                                />
                                            </td>

                                            {/* Customized Action triggers */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    {booking.status ===
                                                        'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    console.log(
                                                                        'Approve Booking',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-purple-700 transition-colors hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-950"
                                                                title="Approve Booking"
                                                                id={`btn-approve-booking-${booking.id}`}
                                                            >
                                                                <CheckCircle2 className="h-4.5 w-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    console.log(
                                                                        'Reject Booking',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                                                title="Reject"
                                                                id={`btn-reject-booking-${booking.id}`}
                                                            >
                                                                <XCircle className="h-4.5 w-4.5" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {booking.status ===
                                                        'approved' && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    console.log(
                                                                        'Marked as completed',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                                                title="Mark Completed"
                                                                id={`btn-complete-booking-${booking.id}`}
                                                            >
                                                                <CheckSquare className="h-4.5 w-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    console.log(
                                                                        'Reject Bookin',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                                                title="More Options"
                                                                id={`btn-options-booking-${booking.id}`}
                                                            >
                                                                <MoreVertical className="h-4.5 w-4.5" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {booking.status ===
                                                        'completed' && (
                                                        <button
                                                            onClick={() =>
                                                                console.log(
                                                                    'Show notes!',
                                                                )
                                                            }
                                                            id={`btn-view-notes-booking-${booking.id}`}
                                                            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-50 hover:underline dark:text-purple-400 dark:hover:bg-purple-950/40"
                                                        >
                                                            View Notes
                                                        </button>
                                                    )}

                                                    {booking.status ===
                                                        'rejected' && (
                                                        <button
                                                            onClick={() =>
                                                                console.log(
                                                                    'Restored rejected Booking',
                                                                )
                                                            }
                                                            className="dark:border-zinc-850 flex cursor-pointer items-center gap-1 rounded border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                            id={`btn-restore-booking-${booking.id}`}
                                                        >
                                                            <RotateCcw className="h-3 w-3" />
                                                            <span>Restore</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pager & Count Info */}
                <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-6 py-4.5 text-xs dark:border-zinc-800 dark:bg-zinc-950/25">
                    <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                        Showing{' '}
                        {Math.min(
                            filteredBookings.length,
                            (activePage - 1) * itemsPerPage + 1,
                        )}{' '}
                        -{' '}
                        {Math.min(
                            filteredBookings.length,
                            activePage * itemsPerPage,
                        )}{' '}
                        of {filteredBookings.length}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={activePage === 1}
                            className="cursor-pointer rounded-xl border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            id="btn-page-prev"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={activePage === totalPages}
                            className="cursor-pointer rounded-xl border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            id="btn-page-next"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Action Grid */}
            <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Send Reminders Card */}
                <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container/40 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-primary shadow-sm shadow-primary/5 dark:bg-purple-950 dark:text-purple-400">
                        <Bell className="animate-swing h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-on-surface dark:text-zinc-100">
                            Send Reminders
                        </h4>
                        <p className="text-xs text-on-surface-variant dark:text-zinc-500">
                            Notify clients about tomorrow's bookings.
                        </p>
                    </div>
                    <button
                        onClick={() => console.log('sending reminders')}
                        id="btn-send-reminders"
                        className="whitespace-nowraptransition-all ml-auto rounded-xl border border-primary px-5 py-2.5 text-xs font-bold whitespace-nowrap text-primary hover:bg-primary hover:text-white active:scale-95 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/50"
                    >
                        Send All
                    </button>
                </div>

                {/* Export Data Card */}
                <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container/40 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-on-secondary-container shadow-sm shadow-black/5 dark:bg-zinc-800 dark:text-zinc-400">
                        <CloudDownload size={24} />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-on-surface dark:text-zinc-100">
                            Export Data
                        </h4>
                        <p className="text-xs text-on-surface-variant dark:text-zinc-500">
                            Download booking history in CSV format.
                        </p>
                    </div>
                    <button
                        onClick={()=>console.log("Export ts!")}
                        id="btn-export-csv"
                        className="ml-auto cursor-pointer rounded-xl border border-on-secondary-container px-5 py-2.5 text-xs font-bold text-on-secondary-container transition-all hover:bg-on-secondary-container hover:text-white active:scale-95 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        Export
                    </button>
                </div>
            </section>
        </AdminLayout>
    );
}
