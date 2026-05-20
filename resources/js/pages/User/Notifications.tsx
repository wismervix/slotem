import UserLayout from '@/layouts/User/UserLayout';
import {
    CalendarCheck,
    History,
    BellRing,
    CircleHelp,
    CheckCircle2,
    Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

type NotificationCategory = 'All' | 'Bookings' | 'Reminders' | 'Updates';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    category: NotificationCategory;
    type: 'booking' | 'update' | 'reminder' | 'tip';
    read: boolean;
    image?: string;
    dateGroup: 'Today' | 'Yesterday';
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Booking Confirmed: Dental Cleaning',
        message:
            'Your appointment with Dr. Aris Thorne is confirmed for October 24, at 10:30 AM. Please arrive 10 minutes early.',
        time: '2h ago',
        category: 'Bookings',
        type: 'booking',
        read: false,
        dateGroup: 'Today',
    },
    {
        id: '2',
        title: 'System Update: Version 2.4.0',
        message:
            "We've improved the calendar loading speeds and fixed minor bugs in the time-picker interface. Explore the new 'Quick Book' feature.",
        time: '5h ago',
        category: 'Updates',
        type: 'update',
        read: false,
        dateGroup: 'Today',
    },
    {
        id: '3',
        title: 'Reminder: Haircut tomorrow',
        message:
            "Don't forget your 3:00 PM session at 'The Grooming Room' with stylist Sarah. See you then!",
        time: '1d ago',
        category: 'Reminders',
        type: 'reminder',
        read: true,
        dateGroup: 'Yesterday',
    },
    {
        id: '4',
        title: 'Pro Tip: Sync your Calendar',
        message:
            'Integrate Slotem with Google or Outlook to never miss an appointment again. Setup takes less than a minute.',
        time: '1d ago',
        category: 'Updates',
        type: 'tip',
        read: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsr3YTd83_V5nWJGolJ7N2_x5ZRO6nRXkK1vzmDyrofI0tcU-alzlOFw4h3dIeS-ZMSHHjBfpyk7v_p4Wwv2J1OzOjV7dmUGInPSN1GlQIrw867R3pZxuFqZq7SRty2TzXC8dZCkH63_ST0ZbjfYb1PEZDdOyXTDegEOqZgm8ipP6bXMtm5CEBwO8PrjdqM-deByD-_6M3Ou5Ec1aVJevoQ5O8YPUkUbaH6UVqlNJFpY4j0tOWVzcWIil3ltJi6ctXpXgH7b736Oo',
        dateGroup: 'Yesterday',
    },
];

export default function UserNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>(
        INITIAL_NOTIFICATIONS,
    );
    const [activeCategory, setActiveCategory] =
        useState<NotificationCategory>('All');
    const [activeNav, setActiveNav] = useState('Notifications');

    const filteredNotifications = notifications.filter(
        (n) => activeCategory === 'All' || n.category === activeCategory,
    );

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const counts = {
        All: notifications.length,
        Bookings: notifications.filter((n) => n.category === 'Bookings').length,
        Reminders: notifications.filter((n) => n.category === 'Reminders')
            .length,
        Updates: notifications.filter((n) => n.category === 'Updates').length,
    };

    return (
        <UserLayout>
            <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="text-brand-on-surface text-3xl font-bold">
                        Notifications
                    </h1>
                    <p className="text-brand-on-surface-variant mt-2">
                        Stay updated with your latest schedule and system
                        alerts.
                    </p>
                </div>
                <button
                    onClick={markAllRead}
                    className="border-brand-outline-variant text-brand-on-surface-variant hover:bg-brand-surface-container self-start rounded-lg border px-4 py-2 text-sm font-medium transition-colors active:scale-95 md:self-auto"
                >
                    Mark all as read
                </button>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Filters & Help */}
                <div className="flex flex-col gap-6 lg:col-span-3">
                    <div className="border-brand-outline-variant rounded-2xl border bg-white p-4 shadow-sm">
                        <h3 className="text-brand-on-surface mb-4 text-lg font-semibold">
                            Categories
                        </h3>
                        <ul className="space-y-1">
                            {(
                                Object.keys(counts) as NotificationCategory[]
                            ).map((cat) => (
                                <li
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors ${
                                        activeCategory === cat
                                            ? 'bg-brand-surface-container-high font-medium'
                                            : 'hover:bg-brand-surface-container'
                                    }`}
                                >
                                    <span className="text-sm">
                                        {cat === 'All' ? 'All Alerts' : cat}
                                    </span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                                            activeCategory === cat
                                                ? 'bg-brand-primary text-white'
                                                : 'text-brand-on-surface-variant font-medium'
                                        }`}
                                    >
                                        {counts[cat]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-brand-secondary-container group relative overflow-hidden rounded-2xl p-6">
                        <div className="relative z-10">
                            <h4 className="text-brand-on-secondary-container text-lg font-semibold">
                                Need Help?
                            </h4>
                            <p className="text-brand-on-secondary-container/80 mt-2 text-xs">
                                Our support team is available 24/7 for
                                scheduling assistance.
                            </p>
                            <button className="text-brand-on-secondary-container hover:text-brand-primary mt-4 text-xs font-bold underline transition-colors">
                                Contact Support
                            </button>
                        </div>
                        <CircleHelp
                            size={80}
                            className="text-brand-on-secondary-container/10 absolute -right-4 -bottom-4 transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-8 lg:col-span-9">
                    {['Today', 'Yesterday'].map((group) => {
                        const groupNotes = filteredNotifications.filter(
                            (n) => n.dateGroup === group,
                        );
                        if (groupNotes.length === 0) return null;

                        return (group === 'Yesterday' &&
                            groupNotes.length > 0) ||
                            group === 'Today' ? (
                            <div key={group} className="space-y-4">
                                <h3 className="text-brand-outline px-1 text-xs font-semibold tracking-widest uppercase">
                                    {group}
                                </h3>
                                <div className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {groupNotes.map((note) => (
                                            <NotificationRow
                                                key={note.id}
                                                note={note}
                                                onMarkRead={markAsRead}
                                                onDelete={deleteNotification}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : null;
                    })}

                    <div className="flex justify-center pt-4">
                        <button className="text-brand-primary hover:bg-brand-primary-container/20 rounded-xl px-6 py-3 font-medium transition-colors">
                            Load older notifications
                        </button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

interface NotificationRowProps {
    note: Notification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const NotificationRow: React.FC<NotificationRowProps> = ({
    note,
    onMarkRead,
    onDelete,
}) => {
    const isTip = note.type === 'tip';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`group border-brand-outline-variant relative flex items-stretch overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md ${
                note.read
                    ? 'bg-brand-surface-container-low opacity-90'
                    : 'bg-white'
            }`}
        >
            {!note.read && (
                <div className="bg-brand-primary absolute top-0 bottom-0 left-0 w-1" />
            )}

            {note.image && (
                <div className="hidden w-32 min-w-[128px] md:block">
                    <img
                        src={note.image}
                        alt={note.title}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
            )}

            <div className="flex flex-grow gap-4 p-5">
                {!note.image && (
                    <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            note.type === 'booking'
                                ? 'bg-brand-primary-container text-brand-on-primary-container'
                                : note.type === 'update'
                                  ? 'bg-brand-tertiary-container text-brand-on-tertiary-container'
                                  : 'bg-brand-secondary-container text-brand-on-secondary-container'
                        }`}
                    >
                        {note.type === 'booking' ? (
                            <CalendarCheck size={20} />
                        ) : note.type === 'update' ? (
                            <History size={20} />
                        ) : (
                            <BellRing size={20} />
                        )}
                    </div>
                )}

                <div className="flex-grow">
                    <div className="flex items-start justify-between gap-4">
                        <h4 className="text-brand-on-surface leading-snug font-semibold">
                            {note.title}
                        </h4>
                        <span className="text-brand-outline text-[12px] font-medium whitespace-nowrap">
                            {note.time}
                        </span>
                    </div>
                    <p className="text-brand-on-surface-variant mt-2 line-clamp-2 text-sm md:line-clamp-none">
                        {note.message}
                    </p>

                    {isTip ? (
                        <div className="mt-4 flex gap-4">
                            <button className="bg-brand-primary rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:opacity-90 active:scale-95">
                                Enable Sync
                            </button>
                            <button
                                onClick={() => onDelete(note.id)}
                                className="text-brand-on-surface-variant text-xs font-medium hover:underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 flex gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                            {!note.read && (
                                <button
                                    onClick={() => onMarkRead(note.id)}
                                    className="text-brand-primary flex items-center gap-1.5 text-sm font-semibold active:scale-95"
                                >
                                    <CheckCircle2 size={14} />
                                    Mark as read
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(note.id)}
                                className="text-brand-error flex items-center gap-1.5 text-sm font-semibold active:scale-95"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
