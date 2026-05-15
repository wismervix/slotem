import type { Availability, TimeSlot } from '@/types';

export function getSlotsForDate(
    availability: Availability[],
    slots: TimeSlot[],
    date: string,
): TimeSlot[] {
    const dayAvailability = availability.find((item) => item.date === date);

    if (!dayAvailability) {
        return [];
    }

    return slots.filter((slot) => slot.availability_id === dayAvailability.id);
}

export function isDateAvailable(
    availability: Availability[],
    date: string,
): boolean {
    return availability.some((item) => item.date === date);
}
