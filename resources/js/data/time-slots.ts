import type { TimeSlot } from '@/types';

import { INITIAL_AVAILABILITY } from './availability';

const generateTimeSlots = (
    availabilityId: string,
    startHour: number,
    endHour: number,
): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
        slots.push({
            id: `${availabilityId}-${hour}`,
            availability_id: availabilityId,
            start_time: `${String(hour).padStart(2, '0')}:00`,
            end_time: `${String(hour + 1).padStart(2, '0')}:00`,
            created_at: new Date().toISOString(),
        });
    }

    return slots;
};

const generateAllTimeSlots = (): TimeSlot[] => {
    return INITIAL_AVAILABILITY.flatMap((availability) => {
        const [year, month, dayOfMonth] = availability.date
            .split('-')
            .map(Number);

        const day = new Date(year, month - 1, dayOfMonth).getDay();

        if (day === 6) {
            return generateTimeSlots(availability.id, 10, 16);
        }

        return generateTimeSlots(availability.id, 9, 17);
    });
};

export const INITIAL_TIME_SLOTS = generateAllTimeSlots();
