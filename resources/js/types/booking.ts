export type BookingStatus =
    | 'pending'
    | 'approved'
    | 'completed'
    | 'rejected'
    | 'cancelled';

export interface Booking {
    id: number;
    client_name: string;
    client_email: string;
    service_id: number;
    availability_id: number;
    time_slot_id: number;
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
    serviceId?: number;
    date?: string;
    slotId?: number;
}

export interface Stat {
    label: string;
    value: string;
    icon: string; // lucide icon name
    color: string;
}
