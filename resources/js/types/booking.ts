export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
    id: string;
    clientName: string;
    clientEmail: string;
    clientInitials: string;
    service: string;
    date: string;
    time: string;
    status: BookingStatus;
}

export interface Stat {
    label: string;
    value: string;
    icon: string; // lucide icon name
    color: string;
}
