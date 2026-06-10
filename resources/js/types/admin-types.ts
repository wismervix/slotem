export interface ClinicService {
    id: string;
    name: string;
    price: number;
    durationMinutes: number; // e.g. 45
    color: string; // e.g. 'primary' | 'tertiary' | 'muted' | 'error'
    colorHex: string; // e.g. '#630ed4'
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    avatar: string;
    isActive: boolean;
    onLeave: boolean;
    colorHex: string;
}

export interface AdminBooking {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    serviceId: string;
    staffId: string;
    room: string;
    date: string; // YYYY-MM-DD
    time: string; // e.g. "09:00 AM" or "11:30 AM" or "14:15"
    status:
        | 'Confirmed'
        | 'In Progress'
        | 'Upcoming'
        | 'Cancelled'
        | 'Completed';
    notes?: string;
    createdTime: number; // timestamp
}

export interface ActivityLog {
    id: string;
    type:
        | 'booking_new'
        | 'booking_rescheduled'
        | 'booking_cancelled'
        | 'staff_new'
        | 'system';
    title: string;
    description: string;
    timestamp: string; // e.g. "2 minutes ago", "5 hours ago"
    createdTime: number; // timestamp for sorting
}

export interface RoomState {
    name: string;
    capacity: number;
    type: string;
}
