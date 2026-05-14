import type { Availability } from '@/types';

export const INITIAL_AVAILABILITY: Availability[] = [
    {
        date: '2026-05-20',

        time_slots: [
            {
                start_time: '09:00',
                end_time: '10:00',
            },
            {
                start_time: '10:00',
                end_time: '11:00',
            },
        ],
    },

    {
        date: '2026-05-21',

        time_slots: [
            {
                start_time: '10:00',
                end_time: '11:00',
            },
            {
                start_time: '14:00',
                end_time: '15:00',
            },
        ],
    },
    {
        date: '2026-05-22',

        time_slots: [
            {
                start_time: '09:00',
                end_time: '10:00',
            },
            {
                start_time: '10:00',
                end_time: '11:00',
            },
        ],
    },

    {
        date: '2026-05-23',

        time_slots: [
            {
                start_time: '10:00',
                end_time: '11:00',
            },
            {
                start_time: '14:00',
                end_time: '15:00',
            },
        ],
    },
];
