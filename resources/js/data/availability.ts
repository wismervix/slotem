import { formatDate } from '@/lib/calendar-utils';

import type { Availability } from '@/types';

const generateAvailability = (): Availability[] => {
    const availability: Availability[] = [];

    const startDate = new Date('2026-04-15');
    const endDate = new Date('2026-12-31');

    let id = 1;

    for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
    ) {
        if (date.getDay() === 0) {
            continue;
        }

        availability.push({
            id: id++,
            date: formatDate(date),
            created_at: new Date().toISOString(),
        });
    }

    return availability;
};

export const INITIAL_AVAILABILITY: Availability[] = generateAvailability();
