import type { Booking } from '@/types';

export const INITIAL_BOOKINGS: Booking[] = [
    {
        id: '1',
        service_id: 'service-1',

        date: '2026-05-20',
        start_time: '10:00',
        end_time: '11:00',

        client_name: 'John Doe',
        client_email: 'john@example.com',

        status: 'approved',

        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        service_id: 'service-2',

        date: '2026-05-21',
        start_time: '14:00',
        end_time: '15:00',

        client_name: 'Jane Smith',
        client_email: 'jane@example.com',

        status: 'completed',

        created_at: new Date().toISOString(),
    },
    {
        id: '3',
        service_id: 'service-3',

        date: '2026-05-22',
        start_time: '10:00',
        end_time: '11:00',

        client_name: 'Elena Lopez',
        client_email: 'elena.l@design.co',

        status: 'pending',

        created_at: new Date().toISOString(),
    },
    {
        id: '4',
        service_id: 'service-4',

        date: '2026-05-23',
        start_time: '14:30',
        end_time: '15:30',

        client_name: 'Thomas H.',
        client_email: 'th@startup.biz',

        status: 'cancelled',

        created_at: new Date().toISOString(),
    },
];
