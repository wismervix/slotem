import { router } from '@inertiajs/react';
import UserLayout from '@/layouts/User/UserLayout';
import { Notification } from '@/types';
import React, { useState } from 'react';
import {
    Bell,
    Check,
    Trash2,
    Clock,
    CheckCircle,
    Bookmark,
    AlertCircle,
    Megaphone,
    CircleHelp,
    CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDateAndTime } from '@/lib/calendar-utils';

interface NotificationsProps {
    notifications: Notification[];
    unreadNotificationsCount: number;
}

export default function UserNotifications({
    notifications: backendNotifications,
    unreadNotificationsCount,
}: NotificationsProps) {
    const mappedNotifications = backendNotifications.map((notification) => ({
        id: notification.id,

        title: notification.data.title,

        message: notification.data.message,

        timestamp: notification.created_at,

        read: notification.read_at !== null,

        category: notification.data.category,

        url: notification.data.url,
    }));

    const [notifications, setNotifications] = useState(mappedNotifications);

    const [visibleCount, setVisibleCount] = useState(6);

    const markNotificationAsRead = (id: string) => {
        router.patch(
            route('notifications.read', id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNotifications((prev) =>
                        prev.map((n) =>
                            n.id === id ? { ...n, read: true } : n,
                        ),
                    );
                },
            },
        );
    };

    const handleOpenNotification = (notification: any) => {
        router.patch(
            route('notifications.read', notification.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(notification.url);
                },
            },
        );
    };

    const deleteNotification = (id: string) => {
        router.delete(route('notifications.delete', id), {
            preserveScroll: true,
            onSuccess: () => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            },
        });
    };

    const handleClearAllNotifications = () => {
        router.delete(route('notifications.clear-all'), {
            preserveScroll: true,
            onSuccess: () => {
                setNotifications([]);
            },
        });
    };

    const handleMarkAllReadNotifications = () => {
        router.patch(
            route('notifications.read-all'),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNotifications((prev) =>
                        prev.map((n) => ({
                            ...n,
                            read: true,
                        })),
                    );
                },
            },
        );
    };

    const [filter, setFilter] = React.useState<
        'all' | 'unread' | 'bookings' | 'reminders' | 'updates'
    >('all');

    const filtered = notifications.filter((item) => {
        if (filter === 'unread') return !item.read;
        if (filter === 'bookings') return item.category === 'Bookings';
        if (filter === 'reminders') return item.category === 'Reminders';
        if (filter === 'updates') return item.category === 'Updates';
        return true;
    });

    const visibleNotifications = filtered.slice(0, visibleCount);

    const getIcon = (category: string) => {
        switch (category) {
            case 'Bookings':
                return (
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                );

            case 'Reminders':
                return <Clock className="h-5 w-5 shrink-0 text-amber-500" />;

            case 'Updates':
                return <Megaphone className="h-5 w-5 shrink-0 text-blue-500" />;

            default:
                return <Bell className="h-5 w-5 shrink-0 text-gray-500" />;
        }
    };

    return (
        <UserLayout unreadNotificationsCount={unreadNotificationsCount}>
            <div className="max-w-4xl space-y-6 pb-10">
                {/* Top action header for filters */}
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-outline-variant bg-white p-4 shadow-xs sm:flex-row sm:items-center dark:bg-neutral-900">
                    <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                        <button
                            onClick={() => setFilter('all')}
                            className={`rounded-lg px-3 py-1.5 transition-all ${
                                filter === 'all'
                                    ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            All Alerts ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`rounded-lg px-3 py-1.5 transition-all ${
                                filter === 'unread'
                                    ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Unread (
                            {notifications.filter((n) => !n.read).length})
                        </button>
                        <button
                            onClick={() => setFilter('bookings')}
                            className={`rounded-lg px-3 py-1.5 transition-all ${
                                filter === 'bookings'
                                    ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Bookings (
                            {
                                notifications.filter(
                                    (n) => n.category === 'Bookings' && !n.read,
                                ).length
                            }
                            )
                        </button>
                        <button
                            onClick={() => setFilter('reminders')}
                            className={`rounded-lg px-3 py-1.5 transition-all ${
                                filter === 'reminders'
                                    ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Reminders (
                            {
                                notifications.filter(
                                    (n) =>
                                        n.category === 'Reminders' && !n.read,
                                ).length
                            }
                            )
                        </button>
                        <button
                            onClick={() => setFilter('updates')}
                            className={`rounded-lg px-3 py-1.5 transition-all ${
                                filter === 'updates'
                                    ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Broadcasts (
                            {
                                notifications.filter(
                                    (n) => n.category === 'Updates' && !n.read,
                                ).length
                            }
                            )
                        </button>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-xs font-bold">
                        <button
                            type="button"
                            onClick={handleMarkAllReadNotifications}
                            disabled={
                                notifications.filter((n) => !n.read).length ===
                                0
                            }
                            className="flex items-center gap-1 text-primary hover:underline disabled:no-underline disabled:opacity-50"
                        >
                            <Check className="h-4 w-4" />
                            Mark all read
                        </button>

                        <span className="text-gray-300">|</span>

                        <button
                            type="button"
                            onClick={handleClearAllNotifications}
                            disabled={notifications.length === 0}
                            className="flex items-center gap-1 text-red-600 hover:underline disabled:no-underline disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear all
                        </button>
                    </div>
                </div>

                {/* Notifications stack */}
                <div className="space-y-3">
                    {visibleNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-outline-variant bg-white p-12 text-center dark:bg-neutral-900">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-neutral-800">
                                <Bell className="h-6 w-6" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                Quiet as a whisper
                            </h4>
                            <p className="max-w-sm text-xs text-gray-500">
                                You are completely caught up! We will ping you
                                here when upcoming bookings are confirmed or
                                need action.
                            </p>
                        </div>
                    ) : (
                        visibleNotifications.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                key={item.id}
                                onClick={() => handleOpenNotification(item)}
                                className={`group relative flex cursor-pointer gap-4 overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                                    item.read
                                        ? 'border-outline-variant bg-white opacity-75 dark:bg-neutral-900'
                                        : 'border-primary bg-primary/5 ring-1 ring-primary/10'
                                }`}
                            >
                                {!item.read && (
                                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand-primary" />
                                )}
                                <div className="pt-0.5">
                                    {getIcon(item.category)}
                                </div>

                                <div className="flex-grow space-y-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <h4
                                            className={`text-xs font-bold text-gray-900 dark:text-white ${!item.read ? 'font-extrabold' : ''}`}
                                        >
                                            {item.title}
                                        </h4>
                                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-gray-400">
                                            <Clock className="h-3 w-3" />
                                            {formatDateAndTime(item.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-xs leading-normal text-gray-500 dark:text-neutral-300">
                                        {item.message}
                                    </p>
                                    {!item.read && (
                                        <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold text-white uppercase">
                                            NEW alert
                                        </span>
                                    )}
                                    <div className="mt-4 flex gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                                        {!item.read && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markNotificationAsRead(
                                                        item.id,
                                                    );
                                                }}
                                                className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand-primary active:scale-95"
                                            >
                                                <CheckCircle2 size={14} />
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(item.id);
                                            }}
                                            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand-error active:scale-95"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="flex justify-center gap-3 pt-4">
                    {filtered.length > visibleCount && (
                        <button
                            onClick={() => setVisibleCount((prev) => prev + 6)}
                            className="rounded-xl px-6 py-3 font-medium text-brand-primary transition-colors hover:bg-brand-primary-container/20"
                        >
                            Load older notifications
                        </button>
                    )}

                    {visibleCount > 6 && (
                        <button
                            onClick={() => setVisibleCount(6)}
                            className="rounded-xl px-6 py-3 font-medium text-gray-500 transition-colors hover:bg-gray-100"
                        >
                            Show Less
                        </button>
                    )}
                </div>

                <div className="flex">
                    <div className="group relative ml-auto w-2xs overflow-hidden rounded-2xl bg-brand-secondary-container p-6">
                        <div className="relative z-10">
                            <h4 className="text-lg font-semibold text-brand-on-secondary-container">
                                Need Help?
                            </h4>
                            <p className="mt-2 text-xs text-brand-on-secondary-container/80">
                                Our support team is available 24/7 for
                                scheduling assistance.
                            </p>
                            <button className="mt-4 text-xs font-bold text-brand-on-secondary-container underline transition-colors hover:text-brand-primary">
                                Contact Support
                            </button>
                        </div>
                        <CircleHelp
                            size={80}
                            className="absolute -right-4 -bottom-4 text-brand-on-secondary-container/10 transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
