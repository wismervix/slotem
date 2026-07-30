import { motion, AnimatePresence } from 'motion/react';
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
    Check,
    AlertTriangle,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Service, Booking, BookingStatus } from '@/types';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { formatTime } from '@/lib/calendar-utils';
import { usePage } from '@inertiajs/react';

interface BookingsProps {
    bookings: Booking[];
}

export default function AdminBookingIndex({ bookings }: BookingsProps) {
    const { services, flash } = usePage<{
        services: Service[];
        flash?: { success?: string; error?: string };
    }>().props;

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    // Watch for flash messages
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Toast helper
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Modal states
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );
    const [actionType, setActionType] = useState<BookingStatus | null>(null);
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Confirmation modal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        booking: Booking;
        action: BookingStatus;
    } | null>(null);

    // Handle action button clicks
    const handleActionClick = (booking: Booking, action: BookingStatus) => {
        setSelectedBooking(booking);
        setActionType(action);
        setConfirmAction({ booking, action });
        setConfirmModal(true);
    };

    // Confirm and execute action
    const confirmAndExecuteAction = async () => {
        if (!confirmAction) return;

        setIsProcessing(true);
        const { booking, action } = confirmAction;

        try {
            const actionRoutes: Record<string, string> = {
                approved: `admin.bookings.approve`,
                rejected: `admin.bookings.reject`,
                completed: `admin.bookings.complete`,
                cancelled: `admin.bookings.cancel`,
                pending: `admin.bookings.restore`, // For restoring rejected bookings
            };

            const routeName = actionRoutes[action];

            if (action === 'pending') {
                // Restore action
                inertiaRouter.put(
                    route(routeName, booking.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setConfirmModal(false);
                            setConfirmAction(null);
                            setSelectedBooking(null);
                            setNotes('');
                        },
                        onError: (errors) => {
                            console.error('Action failed:', errors);
                        },
                        onFinish: () => {
                            setIsProcessing(false);
                        },
                    },
                );
            } else if (action === 'completed') {
                // Complete action with optional notes
                inertiaRouter.put(
                    route(routeName, booking.id),
                    { notes },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setConfirmModal(false);
                            setConfirmAction(null);
                            setSelectedBooking(null);
                            setNotes('');
                        },
                        onError: (errors) => {
                            console.error('Action failed:', errors);
                        },
                        onFinish: () => {
                            setIsProcessing(false);
                        },
                    },
                );
            } else {
                // Approve, Reject, Cancel actions
                inertiaRouter.put(
                    route(routeName, booking.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setConfirmModal(false);
                            setConfirmAction(null);
                            setSelectedBooking(null);
                            setNotes('');
                        },
                        onError: (errors) => {
                            console.error('Action failed:', errors);
                        },
                        onFinish: () => {
                            setIsProcessing(false);
                        },
                    },
                );
            }
        } catch (error) {
            console.error('Error executing action:', error);
            setIsProcessing(false);
        }
    };

    //Handle Export Rules

    const handleExportRules = () => {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(bookings, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'bookings.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        triggerToast('Bookings exported!');
    };

    // Get status badge color
    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900/50';
            case 'approved':
                return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50';
            case 'completed':
                return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/50';
            case 'rejected':
                return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50';
            case 'cancelled':
                return 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-950/40 dark:text-gray-400 dark:border-gray-900/50';
            default:
                return 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-950/40 dark:text-gray-400 dark:border-gray-900/50';
        }
    };

    // Get action button label
    const getActionLabel = (action: BookingStatus): string => {
        const labels: Record<BookingStatus, string> = {
            approved: 'Approve this booking?',
            rejected: 'Reject this booking?',
            completed: 'Mark as completed?',
            cancelled: 'Cancel this booking?',
            pending: 'Restore to pending?',
        };
        return labels[action] || 'Confirm action?';
    };

    const [searchQuery, setSearchQuery] = useState('');

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
                        .includes(searchQuery.toLowerCase()) ||
                    b.client_email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    b.status
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    b.service?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());

                const matchesStatus =
                    selectedStatusFilter === 'All' ||
                    b.status === selectedStatusFilter;

                return matchesSearch && matchesStatus;
            });
    }, [bookings, services, searchQuery, selectedStatusFilter]);

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
        <AdminLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            {/* Toast Notification */}
            {showToast && toastMessage && (
                <div
                    className={`animate-slide-in fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 text-white shadow-2xl ${
                        toastType === 'success'
                            ? 'border-emerald-500/30 bg-emerald-600'
                            : 'border-red-500/30 bg-red-600'
                    }`}
                >
                    <Check className="h-5 w-5 shrink-0" />
                    <p className="text-xs font-bold">{toastMessage}</p>
                </div>
            )}

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
                <div className="flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 transition-colors select-none hover:bg-purple-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/50">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="pt-1 text-[11px] leading-none font-bold tracking-widest text-purple-900 uppercase dark:text-purple-300">
                        {new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
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
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="focus:ring-1.5 w-full rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-10 text-xs transition-all focus:ring-purple-500 focus:outline-none sm:w-64 dark:border-zinc-800 dark:bg-transparent dark:text-white"
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
                                        : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-300'
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

                                            {/* Styled Status chips */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusColor(booking.status)}`}
                                                >
                                                    {booking.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        booking.status.slice(1)}
                                                </span>
                                            </td>

                                            {/* Customized Action triggers */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5 transition-opacity group-hover:opacity-100 md:opacity-0">
                                                    {booking.status ===
                                                        'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleActionClick(
                                                                        booking,
                                                                        'approved',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-purple-700 transition-colors hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-950"
                                                                title="Approve Booking"
                                                            >
                                                                <CheckCircle2 className="h-4.5 w-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleActionClick(
                                                                        booking,
                                                                        'rejected',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                                                title="Reject"
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
                                                                    handleActionClick(
                                                                        booking,
                                                                        'completed',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                                                title="Mark Completed"
                                                            >
                                                                <CheckSquare className="h-4.5 w-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleActionClick(
                                                                        booking,
                                                                        'cancelled',
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                                                title="Cancel Booking"
                                                            >
                                                                <XCircle className="h-4.5 w-4.5" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {booking.status ===
                                                        'rejected' && (
                                                        <button
                                                            onClick={() =>
                                                                handleActionClick(
                                                                    booking,
                                                                    'pending',
                                                                )
                                                            }
                                                            className="flex cursor-pointer items-center gap-1 rounded border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                        onClick={handleExportRules}
                        // onClick={() => console.log('Export ts!')}
                        id="btn-export-csv"
                        className="ml-auto cursor-pointer rounded-xl border border-on-secondary-container px-5 py-2.5 text-xs font-bold text-on-secondary-container transition-all hover:bg-on-secondary-container hover:text-white active:scale-95 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        Export
                    </button>
                </div>
            </section>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal && confirmAction && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal(false)}
                            className="absolute inset-0 bg-on-background/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative z-20 w-full max-w-md overflow-hidden rounded-2xl bg-surface p-6 shadow-2xl dark:bg-slate-900"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-purple-950/40 dark:text-purple-400">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-center text-lg font-bold text-on-surface dark:text-white">
                                {getActionLabel(confirmAction.action)}
                            </h3>
                            <p className="mt-2 text-center text-sm text-on-surface-variant dark:text-slate-400">
                                Booking ID:{' '}
                                <span className="font-bold">
                                    #{confirmAction.booking.id}
                                </span>{' '}
                                for{' '}
                                <span className="font-bold">
                                    {confirmAction.booking.client_name}
                                </span>
                            </p>

                            {confirmAction.action === 'completed' && (
                                <div className="mt-4">
                                    <label className="mb-2 block text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                        Add Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        placeholder="Add any notes about the completed booking..."
                                        rows={3}
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface placeholder-outline/60 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                                    />
                                </div>
                            )}

                            <div className="mt-6 flex flex-col gap-2">
                                <button
                                    disabled={isProcessing}
                                    onClick={confirmAndExecuteAction}
                                    className="w-full cursor-pointer rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary shadow-md shadow-primary/20 transition-all hover:bg-primary-container disabled:opacity-50 dark:bg-purple-600 dark:shadow-purple-600/20 dark:hover:bg-purple-700"
                                >
                                    {isProcessing
                                        ? 'Processing...'
                                        : 'Confirm Action'}
                                </button>
                                <button
                                    disabled={isProcessing}
                                    onClick={() => setConfirmModal(false)}
                                    className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
