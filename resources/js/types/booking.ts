export type BookingStatus =
    | 'pending'
    | 'approved'
    | 'completed'
    | 'rejected'
    | 'cancelled';

export interface Booking {
    id: string;
    client_name: string;
    client_email: string;
    serviceId: string;
    date: string;
    // example: "2026-05-14"
    startTime: string;
    // example: "10:00 AM"
    endTime: string;
    // example: "11:00 AM"
    status: BookingStatus;
    created_at: string;
}

export interface Stat {
    label: string;
    value: string;
    icon: string; // lucide icon name
    color: string;
}
