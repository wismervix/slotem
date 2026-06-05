export interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        url: string;
        category: NotificationCategory;
    };
    read_at: string | null;
    created_at: string;
}

export interface MappedNotification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    category: NotificationCategory;
    url: string;
};

type NotificationCategory = 'All' | 'Bookings' | 'Reminders' | 'Updates';


export interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    password: string;
    avatar_url: string;
    memberSince: string;
    marketing_consent: boolean;
    product_updates: boolean;
    sms_reminders: boolean;
    sound_enabled: boolean;
}


export interface Appointment {
    id: string;
    title: string;
    provider: string;
    date: string; // YYYY-MM-DD
    time: string; // e.g. "09:30 AM"
    duration: number; // in minutes
    category: 'dental' | 'wellness' | 'consultation' | 'general';
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    notes?: string;
    price?: number;
}
