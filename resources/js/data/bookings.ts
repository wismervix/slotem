import type { Booking } from '@/types/booking';

export const INITIAL_BOOKINGS: Booking[] = [
    {
        id: '1',
        clientName: 'Jane Doe',
        clientEmail: 'jane.doe@email.com',
        clientInitials: 'JD',
        service: 'Professional Consultation',
        date: 'Oct 28, 2024',
        time: '10:00 AM - 11:00 AM',
        status: 'Pending',
    },
    {
        id: '2',
        clientName: 'Marcus Smith',
        clientEmail: 'm.smith@webnet.io',
        clientInitials: 'MS',
        service: 'Annual Review',
        date: 'Oct 29, 2024',
        time: '02:30 PM - 03:30 PM',
        status: 'Confirmed',
    },
    {
        id: '3',
        clientName: 'Elena Lopez',
        clientEmail: 'elena.l@design.co',
        clientInitials: 'EL',
        service: 'Strategy Workshop',
        date: 'Oct 28, 2024',
        time: '09:00 AM - 10:30 AM',
        status: 'Completed',
    },
    {
        id: '4',
        clientName: 'Thomas H.',
        clientEmail: 'th@startup.biz',
        clientInitials: 'TH',
        service: 'Technical Audit',
        date: 'Oct 30, 2024',
        time: '04:00 PM - 05:00 PM',
        status: 'Cancelled',
    },
];
