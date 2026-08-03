/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useMemo } from 'react';
import {
    AlertTriangle,
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
    // User,
    Info,
    Phone,
} from 'lucide-react';

import EditProfileModal from '@/components/Admin/EditProfileModal';
import { Booking, User, Notification, BookingStatus } from '@/types';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { formatDateAndTime, formatTime } from '@/lib/calendar-utils';
import { serviceIcons } from '@/lib/service-icons';
import { Link } from '@inertiajs/react';

interface UserDetailsProps {
    user: User;
    notifications: Notification[];
}

export default function DashboardView({
    user,
    notifications,
}: UserDetailsProps) {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [selectedBookingForDetails, setSelectedBookingForDetails] =
        useState<Booking | null>(null);

    // Derive stats dynamically from current master list for responsive updates!
    const bookings = user?.bookings ?? [];

    // ─── 6. COMPUTED VALUES ──────────────────────────────────────
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
        );
        const lastMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1,
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Current stats
        const completedCount = bookings.filter(
            (b) => b.status === 'completed',
        ).length;
        const cancelledCount = bookings.filter(
            (b) => b.status === 'cancelled',
        ).length;
        const pendingCount = bookings.filter(
            (b) => b.status === 'pending' || b.status === 'approved',
        ).length;

        // This month's bookings
        const thisMonthCompleted = bookings.filter((b) => {
            const createdAt = new Date(b.created_at);
            return b.status === 'completed' && createdAt >= currentMonthStart;
        }).length;

        const thisMonthCancelled = bookings.filter((b) => {
            const createdAt = new Date(b.created_at);
            return b.status === 'cancelled' && createdAt >= currentMonthStart;
        }).length;

        // Last month's bookings
        const lastMonthCompleted = bookings.filter((b) => {
            const createdAt = new Date(b.created_at);
            return (
                b.status === 'completed' &&
                createdAt >= lastMonthStart &&
                createdAt <= lastMonthEnd
            );
        }).length;

        const lastMonthCancelled = bookings.filter((b) => {
            const createdAt = new Date(b.created_at);
            return (
                b.status === 'cancelled' &&
                createdAt >= lastMonthStart &&
                createdAt <= lastMonthEnd
            );
        }).length;

        // Calculate percentage changes
        let completedChange = 0;
        let completedTrend: 'up' | 'down' | 'neutral' = 'neutral';
        let cancelledChange = 0;
        let cancelledTrend: 'up' | 'down' | 'neutral' = 'neutral';

        // Completed bookings change
        if (lastMonthCompleted > 0) {
            completedChange =
                ((thisMonthCompleted - lastMonthCompleted) /
                    lastMonthCompleted) *
                100;
            completedTrend =
                completedChange > 0
                    ? 'up'
                    : completedChange < 0
                      ? 'down'
                      : 'neutral';
        } else if (thisMonthCompleted > 0) {
            completedChange = 100;
            completedTrend = 'up';
        }

        // Cancelled bookings change
        if (lastMonthCancelled > 0) {
            cancelledChange =
                ((thisMonthCancelled - lastMonthCancelled) /
                    lastMonthCancelled) *
                100;
            cancelledTrend =
                cancelledChange > 0
                    ? 'up'
                    : cancelledChange < 0
                      ? 'down'
                      : 'neutral';
        } else if (thisMonthCancelled > 0) {
            cancelledChange = 100;
            cancelledTrend = 'up';
        }

        // Upcoming bookings (pending + approved)
        const upcomingCount = pendingCount;

        return {
            completedCount,
            cancelledCount,
            upcomingCount,
            completedChange: Math.round(completedChange),
            completedTrend,
            cancelledChange: Math.round(cancelledChange),
            cancelledTrend,
            thisMonthCompleted,
            lastMonthCompleted,
            thisMonthCancelled,
            lastMonthCancelled,
        };
    }, [bookings]);

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

    const handleToggleMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleStatusChange = (
        id: number,
        status: 'completed' | 'pending' | 'cancelled',
        serviceName: string,
    ) => {
        // handleUpdateBookingStatus(id, status);
        setActiveMenuId(null);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'Bookings':
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

    const getNotificationBg = (type: string) => {
        switch (type) {
            case 'Bookings':
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

    // console.log('User Prop: ', user);
    // console.log('Notifications Prop: ', notifications);

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
                            src={user.avatar_url}
                        />
                        {user.status === 'active' && (
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
                                {user.name}
                            </h2>
                            <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold tracking-wide text-on-primary-container uppercase dark:bg-purple-950/50 dark:text-purple-400">
                                Client Profile
                            </span>
                        </div>

                        <p className="mb-1 flex items-center justify-center gap-1.5 text-sm text-on-surface-variant selection:bg-primary-container md:justify-start dark:text-slate-400">
                            <Mail className="h-4 w-4 text-primary dark:text-purple-400" />
                            <span>{user.email}</span>
                        </p>

                        <p className="mb-4 flex items-center justify-center gap-1.5 text-sm text-on-surface-variant selection:bg-primary-container md:justify-start dark:text-slate-400">
                            <Phone className="h-4 w-4 text-primary dark:text-purple-400" />
                            <span>{user.phone}</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                            <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/20 bg-primary-container px-3 py-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800/50">
                                <CalendarIcon className="h-4 w-4 text-on-primary-container dark:text-purple-400" />
                                <span className="text-xs font-semibold text-on-primary-container dark:text-slate-500">
                                    Joined{' '}
                                    {new Intl.DateTimeFormat('en-GB', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    }).format(new Date(user.created_at))}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/20 bg-primary-container px-3 py-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800/50">
                                <Award className="h-4 w-4 text-on-primary-container dark:text-purple-400" />
                                <span className="text-xs font-semibold text-on-primary-container dark:text-slate-500">
                                    Premium Member
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/20 bg-primary-container px-3 py-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800/50">
                                <MapPin className="h-4 w-4 text-on-primary-container dark:text-purple-400" />
                                <span className="text-xs font-semibold text-on-primary-container dark:text-slate-500">
                                    Chicago, IL
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
                            <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    stats.completedTrend === 'up'
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                                        : stats.completedTrend === 'down'
                                          ? 'bg-red-500/10 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                                          : 'bg-gray-500/10 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400'
                                }`}
                            >
                                {stats.completedTrend === 'up' ? '+' : ''}
                                {stats.completedChange}%
                                {stats.completedTrend === 'up'
                                    ? ' ↑'
                                    : stats.completedTrend === 'down'
                                      ? ' ↓'
                                      : ' →'}
                            </span>
                        </div>
                        <p className="mb-0.5 text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase dark:text-slate-500">
                            Completed Bookings
                        </p>
                        <h3 className="text-3xl font-extrabold text-on-surface dark:text-white">
                            {stats.completedCount}
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
                            <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    stats.cancelledTrend === 'down'
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                                        : stats.cancelledTrend === 'up'
                                          ? 'bg-red-500/10 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                                          : 'bg-gray-500/10 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400'
                                }`}
                            >
                                {stats.cancelledTrend === 'up' ? '+' : ''}
                                {stats.cancelledChange}%
                                {stats.cancelledTrend === 'down'
                                    ? ' ↓'
                                    : stats.cancelledTrend === 'up'
                                      ? ' ↑'
                                      : ' →'}
                            </span>
                        </div>
                        <p className="mb-0.5 text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase dark:text-slate-500">
                            Cancelled
                        </p>
                        <h3 className="text-3xl font-extrabold text-on-surface dark:text-white">
                            {stats.cancelledCount}
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
                                    +{Math.max(0, stats.upcomingCount - 1)}
                                </div>
                            </div>
                        </div>
                        <p className="mb-0.5 text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase dark:text-slate-500">
                            Upcoming Bookings
                        </p>
                        <h3 className="text-3xl font-extrabold text-on-surface dark:text-white">
                            {stats.upcomingCount}
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
                                <Link
                                    href={route('admin.bookings')}
                                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline dark:text-purple-400"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
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
                                        {user?.bookings
                                            ?.slice(0, 5)
                                            .map((bk) => {
                                                const Icon =
                                                    serviceIcons[
                                                        bk?.service?.icon ??
                                                            'scissors'
                                                    ];
                                                return (
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
                                                            <p className="flex gap-2 text-sm font-bold text-on-surface dark:text-white">
                                                                <Icon className="h-5 w-5" />

                                                                {
                                                                    bk?.service
                                                                        ?.name
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-on-surface/90 dark:text-slate-300">
                                                            {new Intl.DateTimeFormat(
                                                                'en-GB',
                                                                {
                                                                    weekday:
                                                                        'long',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                },
                                                            ).format(
                                                                new Date(
                                                                    bk.date,
                                                                ),
                                                            )}
                                                            <span className="mt-0.5 block text-[9px] text-on-surface-variant/60 dark:text-slate-500">
                                                                {formatTime(
                                                                    bk.start_time,
                                                                )}{' '}
                                                                —{' '}
                                                                {formatTime(
                                                                    bk.end_time,
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-on-surface dark:text-white">
                                                            $
                                                            {bk?.service?.price}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                                    bk.status ===
                                                                    'completed'
                                                                        ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                                        : bk.status ===
                                                                            'pending'
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
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
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
                                                                                    handleActionClick(
                                                                                        bk,
                                                                                        'approved',
                                                                                    )
                                                                                }
                                                                                className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700"
                                                                            >
                                                                                <Check className="h-3.5 w-3.5" />{' '}
                                                                                Approve
                                                                                Booking
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleActionClick(
                                                                                        bk,
                                                                                        'completed',
                                                                                    )
                                                                                }
                                                                                className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2 text-left text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-700"
                                                                            >
                                                                                <Check className="h-3.5 w-3.5" />{' '}
                                                                                Confirm
                                                                                Booking
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleStatusChange(
                                                                                        bk.id,
                                                                                        'pending',
                                                                                        bk
                                                                                            ?.service
                                                                                            ?.name ??
                                                                                            '',
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
                                                                                    handleActionClick(
                                                                                        bk,
                                                                                        'rejected',
                                                                                    )
                                                                                }
                                                                                className="flex w-full cursor-pointer items-center gap-1.5 border-t border-gray-100 px-3 py-2 text-left text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-slate-700"
                                                                            >
                                                                                <X className="h-3.5 w-3.5" />{' '}
                                                                                Reject
                                                                                Booking
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
                                {notifications.length === 0 ? (
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
                                    notifications.map((n, index) => (
                                        <div
                                            key={n.id}
                                            className="relative flex gap-3.5"
                                        >
                                            {/* Line connection */}
                                            {index <
                                                notifications.length - 1 && (
                                                <div className="absolute top-[30px] bottom-[-20px] left-[15px] w-0.5 bg-gray-100 dark:bg-slate-700"></div>
                                            )}

                                            {/* Log action icon badge */}
                                            <div
                                                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-1.5 ${getNotificationBg(n.data.category ?? 'email')}`}
                                            >
                                                {getNotificationIcon(
                                                    n.data.category ?? 'email',
                                                )}
                                            </div>

                                            <div className="pt-0.5 text-left">
                                                <p className="text-xs font-bold text-on-surface dark:text-white">
                                                    {n.data.title}
                                                </p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant/85 dark:text-slate-400">
                                                    {n.data.message}
                                                </p>
                                                <p className="mt-1 text-[9px] font-bold tracking-wider text-on-surface-variant/50 uppercase dark:text-slate-500">
                                                    {formatDateAndTime(
                                                        n.created_at,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="border-t border-outline-variant/20 bg-surface-container-low p-4 dark:border-slate-700 dark:bg-slate-800/30">
                            <button className="w-full cursor-pointer rounded-xl border border-outline-variant py-2 text-xs font-semibold text-on-surface-variant transition-all hover:border-primary hover:bg-neutral-50 hover:text-primary active:scale-98 dark:border-slate-700 dark:text-slate-400 dark:hover:border-purple-500 dark:hover:bg-slate-800 dark:hover:text-purple-400">
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
                                {selectedBookingForDetails.service?.name}
                            </h3>
                            <p className="mt-0.5 mb-4 font-mono text-xs text-on-surface-variant/70 dark:text-slate-500">
                                Reference: {selectedBookingForDetails.id}
                            </p>

                            <div className="space-y-3 border-t border-outline-variant pt-3 dark:border-slate-700">
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Client Name
                                    </span>
                                    <span className="font-bold text-on-surface dark:text-white">
                                        {selectedBookingForDetails.client_name}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Email
                                    </span>
                                    <span
                                        className="truncate font-medium text-on-surface dark:text-white"
                                        title={
                                            selectedBookingForDetails.client_email
                                        }
                                    >
                                        {selectedBookingForDetails.client_email}
                                    </span>
                                </div>
                                {user.phone && (
                                    <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                        <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                            Phone Number
                                        </span>
                                        <span className="font-medium text-on-surface dark:text-white">
                                            {user.phone}
                                        </span>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Target Date
                                    </span>
                                    <span className="font-semibold text-on-surface dark:text-white">
                                        {new Intl.DateTimeFormat('en-US', {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        }).format(
                                            new Date(
                                                selectedBookingForDetails.date,
                                            ),
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Time Slot
                                    </span>
                                    <span className="font-semibold text-on-surface dark:text-white">
                                        {formatTime(
                                            selectedBookingForDetails.start_time,
                                        )}{' '}
                                        —{' '}
                                        {formatTime(
                                            selectedBookingForDetails.end_time,
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-50 py-1.5 dark:border-slate-700">
                                    <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase dark:text-slate-500">
                                        Subtotal Value
                                    </span>
                                    <span className="text-sm font-bold text-primary dark:text-purple-400">
                                        $
                                        {
                                            selectedBookingForDetails.service
                                                ?.price
                                        }
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
                                                'completed'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                    : selectedBookingForDetails.status ===
                                                        'pending'
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
                                        {selectedBookingForDetails.service
                                            ?.description ||
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
                    user={user}
                />

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
            </div>
        </AdminLayout>
    );
}
