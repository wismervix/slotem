import { DEFAULT_APPOINTMENTS } from '@/data/appointments';
import CalendarView from '@/components/User/CalendarView';
import ListView from '@/components/User/ListView';
import UserLayout from '@/layouts/User/UserLayout';
import type { Appointment, Booking, NotificationItem } from '@/types';
import { useEffect, useState } from 'react';
import { DEFAULT_NOTIFICATIONS } from '@/data/notifications';
import { CalendarDays } from 'lucide-react';

type ViewBookingsProps = {
    bookings: Booking[];
};

const ViewBookings = ({ bookings }: ViewBookingsProps) => {
    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        const saved = localStorage.getItem('slotem_appointments');

        if (!saved) return DEFAULT_APPOINTMENTS;

        try {
            return JSON.parse(saved);
        } catch {
            return DEFAULT_APPOINTMENTS;
        }
        // return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
    });

    const [notifications, setNotifications] = useState<NotificationItem[]>(
        () => {
            const saved = localStorage.getItem('slotem_notifications');

            if (!saved) return DEFAULT_NOTIFICATIONS;

            try {
                return JSON.parse(saved);
            } catch {
                return DEFAULT_NOTIFICATIONS;
            }
            // return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
        },
    );

    const [subView, setSubView] = useState<'calendar' | 'list'>('calendar');

    const [searchQuery, setSearchQuery] = useState('');

    const [selectedDate, setSelectedDate] = useState('2023-10-26');

    const [isBookModalOpen, setIsBookModalOpen] = useState(false);

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem(
            'slotem_appointments',
            JSON.stringify(appointments),
        );
    }, [appointments]);

    useEffect(() => {
        localStorage.setItem(
            'slotem_notifications',
            JSON.stringify(notifications),
        );
    }, [notifications]);

    const handleRescheduleAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: 'Confirmed' as const } : a,
            ),
        );

        const confirmed = appointments.find((a) => a.id === id);
        if (confirmed) {
            const alert: NotificationItem = {
                id: `notif-${Date.now()}`,
                title: `Confirmed: ${confirmed.title}`,
                message: `Your appointment for ${confirmed.title} on ${confirmed.date} has been successfully cancelled. Co-payments will be refunded.`,
                timestamp: 'Just now',
                read: false,
                type: 'reminder',
                category: 'Reminders',
                dateGroup: 'Today',
            };
            setNotifications((prev) => [alert, ...prev]);
        }
    };

    const handleCancelAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: 'Cancelled' as const } : a,
            ),
        );

        const cancelled = appointments.find((a) => a.id === id);
        if (cancelled) {
            const alert: NotificationItem = {
                id: `notif-${Date.now()}`,
                title: `Cancelled: ${cancelled.title}`,
                message: `Your appointment for ${cancelled.title} on ${cancelled.date} has been successfully cancelled. Co-payments will be refunded.`,
                timestamp: 'Just now',
                read: false,
                type: 'reminder',
                category: 'Reminders',
                dateGroup: 'Today',
            };
            setNotifications((prev) => [alert, ...prev]);
        }
    };

    // Handler functions
    const handleAddNewAppointment = (newAppt: {
        title: string;
        provider: string;
        date: string;
        time: string;
        duration: number;
        category: 'dental' | 'wellness' | 'consultation' | 'general';
        notes: string;
        price: number;
    }) => {
        const id = `appt-${Date.now()}`;
        const added: Appointment = {
            ...newAppt,
            id,
            status: 'Confirmed',
        };

        setAppointments((prev) => [added, ...prev]);

        // Push interactive notification
        const alert: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `Scheduled: ${added.title}`,
            message: `Your booking for ${added.title} with ${added.provider} on ${added.date} at ${added.time} was scheduled successfully.`,
            timestamp: 'Just now',
            category: 'Bookings',
            read: false,
            type: 'success',
            dateGroup: 'Today',
        };

        setNotifications((prev) => [alert, ...prev]);
    };
    return (
        <UserLayout
            appointments={appointments}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectDate={setSelectedDate}
            handleRescheduleAppointment={handleRescheduleAppointment}
            handleCancelAppointment={handleCancelAppointment}
            handleAddNewAppointment={handleAddNewAppointment}
            headerActions={
                <div className="flex shrink-0 rounded-xl bg-gray-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                    <button
                        type="button"
                        onClick={() => setSubView('list')}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
                            subView === 'list'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        List View
                    </button>
                    <button
                        type="button"
                        onClick={() => setSubView('calendar')}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
                            subView === 'calendar'
                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <CalendarDays className="h-4 w-4" />
                        Calendar View
                    </button>
                </div>
            }
        >
            {subView === 'calendar' ? (
                <CalendarView
                    appointments={appointments}
                    selectedDate={selectedDate}
                    searchQuery={searchQuery}
                    onSelectDate={setSelectedDate}
                    onOpenBookingModal={() => setIsBookModalOpen(true)}
                />
            ) : (
                <ListView
                    appointments={appointments}
                    searchQuery={searchQuery}
                    onCancelAppointment={handleCancelAppointment}
                    onRescheduleAppointment={handleRescheduleAppointment}
                />
            )}
        </UserLayout>
    );
};;

export default ViewBookings;
