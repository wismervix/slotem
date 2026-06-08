import React, { useState } from 'react';
import { Booking } from '@/types';
import {
    Smile,
    Sparkles,
    Activity,
    Clock,
    MapPin,
    MoreVertical,
    Search,
    AlertCircle,
    Trash2,
    CheckCircle,
    HelpCircle,
    Ban,
    CalendarDays,
    CalendarClock,
    Scissors,
    UserCheck,
    ShieldCheck,
    Paintbrush,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { formatTime } from '@/lib/calendar-utils';
import { useBookingModalContext } from '@/contexts/BookingModalContext';

interface ListViewProps {
    bookings: Booking[];
    searchQuery: string;
    onCancelAppointment: (id: number) => void;
}

type BookingStatusGroup = 'all' | 'pending' | 'confirmed' | 'failed';

export default function ListView({
    bookings,
    searchQuery,
    onCancelAppointment,
}: ListViewProps) {
    const { openModal } = useBookingModalContext();

    const [statusFilter, setStatusFilter] = useState<
        'all' | 'pending' | 'failed' | 'confirmed'
    >('all');

    const getStatusGroup = (status: Booking['status']): BookingStatusGroup => {
        switch (status) {
            case 'approved':
            case 'completed':
                return 'confirmed';

            case 'rejected':
            case 'cancelled':
                return 'failed';

            case 'pending':
                return 'pending';

            default:
                return 'pending';
        }
    };

    const filtered = bookings.filter((booking) => {
        // Search match
        const matchesSearch =
            booking.service?.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (booking.service?.description ?? '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            getStatusGroup(booking.status) === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const confirmedCount = bookings.filter(
        (b) => getStatusGroup(b.status) === 'confirmed',
    ).length;

    const failedCount = bookings.filter(
        (b) => getStatusGroup(b.status) === 'failed',
    ).length;

    const getServiceIcon = (serviceIcon: string) => {
        switch (serviceIcon) {
            case 'scissors':
                return <Scissors className="h-4 w-4 text-primary" />;
            case 'user-check':
                return <UserCheck className="h-4 w-4 text-secondary" />;
            case 'sparkles':
                return <Sparkles className="h-4 w-4 text-tertiary" />;
            case 'paintbrush':
                return (
                    <Paintbrush className="h-4 w-4 text-blue-800 dark:text-blue-300" />
                );
            case 'shield-check':
                return (
                    <ShieldCheck className="h-4 w-4 text-teal-800 dark:text-teal-300" />
                );
            default:
                return (
                    <Activity className="h-4 w-4 text-purple-800 dark:text-purple-300" />
                );
        }
    };

    const getStatusPill = (status: Booking['status']) => {
        const group = getStatusGroup(status);

        if (group === 'confirmed') {
            return (
                <span className="shrink-0 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase dark:bg-emerald-950/20 dark:text-emerald-400">
                    Confirmed
                </span>
            );
        }

        if (group === 'failed') {
            return (
                <span className="shrink-0 rounded-full border border-red-200/50 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 uppercase dark:bg-red-950/20 dark:text-red-400">
                    Failed
                </span>
            );
        }

        return (
            <span className="shrink-0 rounded-full border border-amber-200/50 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase dark:bg-amber-950/20 dark:text-amber-400">
                Pending
            </span>
        );
    };

    // console.log('Appointments: ', bookings);

    return (
        <div className="space-y-4 pb-10">
            {/* Search and filter toolbar */}
            <div className="flex flex-col flex-wrap items-start justify-between gap-4 rounded-2xl border border-outline-variant bg-white p-4 shadow-xs sm:flex-row sm:items-center dark:bg-neutral-900">
                <div className="flex flex-wrap rounded-xl bg-gray-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'all'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        All Bookings ({bookings.length})
                    </button>
                    {/* <button
                        onClick={() => setStatusFilter('completed')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'completed'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Completed (
                        {
                            bookings.filter((a) => a.status === 'completed')
                                .length
                        }
                        )
                    </button> */}
                    <button
                        onClick={() => setStatusFilter('confirmed')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'confirmed'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Confirmed ({confirmedCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'pending'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Pending (
                        {bookings.filter((a) => a.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('failed')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'failed'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Failed ({failedCount})
                    </button>
                    {/* <button
                        onClick={() => setStatusFilter('cancelled')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'cancelled'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Cancelled (
                        {
                            bookings.filter((a) => a.status === 'cancelled')
                                .length
                        }
                        )
                    </button> */}
                </div>

                <p className="text-[11px] font-bold tracking-widest text-gray-400 sm:text-right">
                    SHOWING {filtered.length} OF {bookings.length} RESULTS
                </p>
            </div>

            {/* Main Results Table/Card stack */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-outline-variant bg-white p-12 text-center dark:bg-neutral-900">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-neutral-800">
                            <Search className="h-6 w-6" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            No matching booking appointments
                        </h4>
                        <p className="max-w-xs text-xs leading-normal text-secondary">
                            Try adjusting your filters or search keywords, or
                            create a brand new appointment!
                        </p>
                        <Link
                            href={route('user.bookings')}
                            className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white"
                        >
                            Start New Appointment
                        </Link>
                    </div>
                ) : (
                    filtered.map((booking) => (
                        <div
                            key={booking.id}
                            className={`group flex flex-col justify-between gap-4 rounded-2xl border bg-white p-4 transition-all duration-300 hover:shadow-xs md:flex-row dark:bg-neutral-900 ${
                                getStatusGroup(booking.status) === 'failed'
                                    ? // booking.status === 'cancelled'
                                      'opacity-65'
                                    : ''
                            }`}
                        >
                            {/* Left Column: Icon and demographic Details */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-gray-50 dark:bg-neutral-800">
                                    {getServiceIcon(
                                        booking.service?.icon || '',
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                                            {booking.service?.name}
                                        </h4>
                                        {getStatusPill(booking.status)}
                                        {booking.service?.price && (
                                            <span className="text-xs font-extrabold text-primary">
                                                ${booking.service?.price}
                                            </span>
                                        )}
                                    </div>

                                    <p className="flex items-center gap-1 text-xs font-medium text-secondary">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {booking.service?.description?.slice(
                                            0,
                                            20,
                                        )}
                                    </p>

                                    {booking.service?.description && (
                                        <p className="text-[11px] leading-normal text-gray-400 italic">
                                            "{booking.service?.description}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Time and cancellation actions */}
                            <div className="flex shrink-0 flex-row items-end justify-between gap-3 border-t border-dashed border-outline-variant pt-3 md:flex-col md:border-0 md:pt-0">
                                <div className="space-y-0.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                        {new Intl.DateTimeFormat('en-US', {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        }).format(new Date(booking.date))}
                                    </div>
                                    <div className="flex items-center justify-end gap-1 text-[10px] font-semibold text-secondary">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatTime(booking.start_time)} —{' '}
                                        {formatTime(booking.end_time)} (
                                        {booking.service?.duration} mins)
                                    </div>
                                </div>

                                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    {/* {booking.status === 'completed' ? ( */}
                                    {getStatusGroup(booking.status) ===
                                    'confirmed' ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openModal(
                                                        booking.date,
                                                        booking.time_slot_id,
                                                        booking.service?.id,
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-1 rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container-dark dark:text-on-surface-dark"
                                                title="Reschedule this appointment"
                                            >
                                                <CalendarClock className="h-3.5 w-3.5" />
                                                Reschedule
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Are you sure you want to cancel this appointment? This action cannot be undone.',
                                                        )
                                                    ) {
                                                        onCancelAppointment(
                                                            booking.id,
                                                        );
                                                    }
                                                }}
                                                className="flex cursor-pointer items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30"
                                                title="Cancel this appointment"
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                                Cancel
                                            </button>
                                        </>
                                    ) : booking.status !== 'cancelled' ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onCancelAppointment(booking.id)
                                            }
                                            className="flex cursor-pointer items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30"
                                            title="Cancel this appointment"
                                        >
                                            <Ban className="h-3.5 w-3.5" />
                                            Cancel
                                        </button>
                                    ) : (
                                        <span className="py-1 text-[11px] font-bold text-gray-400 italic">
                                            No actions available
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
