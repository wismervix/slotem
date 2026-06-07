import { router, usePage } from '@inertiajs/react';
import CalendarView from '@/components/User/CalendarView';
import ListView from '@/components/User/ListView';
import UserLayout from '@/layouts/User/UserLayout';
import type { Booking, Availability, MappedNotification } from '@/types';
import { useState } from 'react';
import { CalendarDays, List } from 'lucide-react';

type ViewBookingsProps = {
    bookings: Booking[];
    unreadNotificationsCount: number;
};

const ViewBookings = ({
    bookings,
    unreadNotificationsCount,
}: ViewBookingsProps) => {

    const { availabilities } = usePage<{ availabilities: Availability[] }>()
        .props;

    const [subView, setSubView] = useState<'calendar' | 'list'>('calendar');

    const [searchQuery, setSearchQuery] = useState('');

    const [selectedDate, setSelectedDate] = useState('2023-10-26');

    const handleCancelAppointment = (id: number) => {
        router.patch(
            route('', id),
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    const cancelled = bookings.find((a) => a.id === id);

                    if (cancelled) {
                        const alert: MappedNotification = {
                            id: `notif-${Date.now()}`,
                            // title: `Scheduled: ${newBooking.service?.name}`,
                            // message: `Your booking for ${newBooking.service?.name} on ${newBooking.date} was scheduled successfully.`,
                            title: `Scheduled: ServiceName`,
                            message: `Your booking for ServiceName on BookingDate was scheduled successfully.`,
                            url: '',
                            read: false,
                            category: 'Bookings',
                            timestamp: 'Just now',
                        };

                    }
                },
            },
        );
    };

    return (
        <UserLayout
            bookings={bookings}
            unreadNotificationsCount={unreadNotificationsCount}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleCancelAppointment={handleCancelAppointment}
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
                        <List className="h-4 w-4" />
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
                    bookings={bookings}
                    availabilities={availabilities}
                    selectedDate={selectedDate}
                    searchQuery={searchQuery}
                    onSelectDate={setSelectedDate}
                />
            ) : (
                <ListView
                    bookings={bookings}
                    searchQuery={searchQuery}
                    onCancelAppointment={handleCancelAppointment}
                />
            )}
        </UserLayout>
    );
};

export default ViewBookings;
