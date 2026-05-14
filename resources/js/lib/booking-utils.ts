import { INITIAL_BOOKINGS } from '@/data/bookings';

export function isSlotBooked(date: string, timeSlot: string) {
    return INITIAL_BOOKINGS.some(
        (booking) =>
            booking.date === date &&
            booking.timeSlot === timeSlot &&
            booking.status !== 'rejected' &&
            booking.status !== 'cancelled',
    );
}
