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
    service_id: string;
    date: string;
    // example: "2026-05-14"
    start_time: string;
    // example: "10:00 AM"
    end_time: string;
    // example: "11:00 AM"
    status: BookingStatus;
    created_at: string;
}

export interface BookingDraft {
    serviceId?: string;

    date?: string;

    startTime?: string;
    endTime?: string;
}

export interface Stat {
    label: string;
    value: string;
    icon: string; // lucide icon name
    color: string;
}
