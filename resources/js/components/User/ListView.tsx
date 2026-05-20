import React, { useState } from 'react';
import { Appointment } from '@/types';
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
} from 'lucide-react';

interface ListViewProps {
    appointments: Appointment[];
    searchQuery: string;
    onCancelAppointment: (id: string) => void;
    onNavigateToTab: (tab: any) => void;
}

export default function ListView({
    appointments,
    searchQuery,
    onCancelAppointment,
    onNavigateToTab,
}: ListViewProps) {
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'Confirmed' | 'Pending' | 'Cancelled'
    >('all');

    const filtered = appointments.filter((appt) => {
        // Search match
        const matchesSearch =
            appt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appt.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (appt.notes &&
                appt.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        // Status match
        const matchesStatus =
            statusFilter === 'all' || appt.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'dental':
                return <Smile className="h-4 w-4 text-primary" />;
            case 'wellness':
                return <Sparkles className="h-4 w-4 text-tertiary" />;
            case 'general':
                return <Activity className="h-4 w-4 text-blue-600" />;
            default:
                return <CalendarDays className="h-4 w-4 text-secondary" />;
        }
    };

    const getStatusPill = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return (
                    <span className="shrink-0 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase dark:bg-emerald-950/20 dark:text-emerald-400">
                        Confirmed
                    </span>
                );
            case 'Cancelled':
                return (
                    <span className="shrink-0 rounded-full border border-red-200/50 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 uppercase dark:bg-red-950/20 dark:text-red-400">
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="shrink-0 rounded-full border border-amber-200/50 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase dark:bg-amber-950/20 dark:text-amber-400">
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-4 pb-10">
            {/* Search and filter toolbar */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-outline-variant bg-white p-4 shadow-xs sm:flex-row sm:items-center dark:bg-neutral-900">
                <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'all'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        All Bookings ({appointments.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('Confirmed')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'Confirmed'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Confirmed (
                        {
                            appointments.filter((a) => a.status === 'Confirmed')
                                .length
                        }
                        )
                    </button>
                    <button
                        onClick={() => setStatusFilter('Pending')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'Pending'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setStatusFilter('Cancelled')}
                        className={`rounded-lg px-3 py-1.5 transition-all ${
                            statusFilter === 'Cancelled'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Cancelled
                    </button>
                </div>

                <p className="text-[11px] font-bold tracking-widest text-gray-400 sm:text-right">
                    SHOWING {filtered.length} OF {appointments.length} RESULTS
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
                            No matching appointments
                        </h4>
                        <p className="max-w-xs text-xs leading-normal text-secondary">
                            Try adjusting your filters or search keywords, or
                            create a brand new appointment!
                        </p>
                        <button
                            onClick={() => onNavigateToTab('bookings')}
                            className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white"
                        >
                            Start New Appointment
                        </button>
                    </div>
                ) : (
                    filtered.map((appt) => (
                        <div
                            key={appt.id}
                            className={`flex flex-col justify-between gap-4 rounded-2xl border bg-white p-4 transition-all hover:shadow-xs md:flex-row dark:bg-neutral-900 ${
                                appt.status === 'Cancelled' ? 'opacity-65' : ''
                            }`}
                        >
                            {/* Left Column: Icon and demographic Details */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-gray-50 dark:bg-neutral-800">
                                    {getCategoryIcon(appt.category)}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                                            {appt.title}
                                        </h4>
                                        {getStatusPill(appt.status)}
                                        {appt.price && (
                                            <span className="text-xs font-extrabold text-primary">
                                                ${appt.price}
                                            </span>
                                        )}
                                    </div>

                                    <p className="flex items-center gap-1 text-xs font-medium text-secondary">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {appt.provider}
                                    </p>

                                    {appt.notes && (
                                        <p className="text-[11px] leading-normal text-gray-400 italic">
                                            "{appt.notes}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Time and cancellation actions */}
                            <div className="flex shrink-0 flex-row items-end justify-between gap-3 border-t border-dashed border-outline-variant pt-3 md:flex-col md:border-0 md:pt-0">
                                <div className="space-y-0.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                        {appt.date}
                                    </div>
                                    <div className="flex items-center justify-end gap-1 text-[10px] font-semibold text-secondary">
                                        <Clock className="h-3.5 w-3.5" />
                                        {appt.time} ({appt.duration} mins)
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {appt.status !== 'Cancelled' ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onCancelAppointment(appt.id)
                                            }
                                            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30"
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
