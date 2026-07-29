import { router, usePage } from '@inertiajs/react';
import CalendarView from '@/components/User/CalendarView';
import ListView from '@/components/User/ListView';
import UserLayout from '@/layouts/User/UserLayout';
import type { Booking, Availability } from '@/types';
import { useState } from 'react';
import { CalendarDays, List } from 'lucide-react';
import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/components/Shared/ConfirmationModal';

type ViewBookingsProps = {
    bookings: Booking[];
    unreadNotificationsCount: number;
};

const ViewBookings = ({ bookings, unreadNotificationsCount }: ViewBookingsProps) => {
    // ─── 1. STATE ──────────────────────────────────────────────────

    // Use the confirmation hook
    const confirmation = useConfirmation();

    const { availabilities } = usePage<{ availabilities: Availability[] }>()
        .props;

    const [subView, setSubView] = useState<'calendar' | 'list'>('calendar');

    const [searchQuery, setSearchQuery] = useState('');

    const [selectedDate, setSelectedDate] = useState('2023-10-26');

    const performHandleCancelAppointment = (id: number) => {
        router.patch(
            route('booking.cancel', id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleCancelAppointment = (booking: Booking) => {
        confirmation.confirm({
            title: 'Cancel this booking?',
            message: `You're about to cancel ${booking.client_name}'s appointment${
                booking.service ? ` for ${booking.service.name}` : ''
            } on ${booking.date} from ${booking.start_time} to ${
                booking.end_time
            }. This cannot be undone.`,
            confirmLabel: 'Yes, Cancel Booking',
            variant: 'danger',
            onConfirm: () => performHandleCancelAppointment(booking.id),
        });
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
                        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
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
                        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
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
            
                            <ConfirmationModal
                                isOpen={confirmation.isOpen}
                                onClose={confirmation.close}
                                onConfirm={confirmation.handleConfirm}
                                title={confirmation.options?.title || ''}
                                message={confirmation.options?.message || ''}
                                confirmLabel={confirmation.options?.confirmLabel}
                                cancelLabel={confirmation.options?.cancelLabel}
                                variant={confirmation.options?.variant}
                                isLoading={confirmation.isLoading}
                            />
        </UserLayout>
    );
};;

export default ViewBookings;
