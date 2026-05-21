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

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: 'success' | 'info' | 'reminder';
}

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    preferredClinic: string;
    memberSince: string;
    marketingConsent: boolean;
    productUpdates: boolean;
    smsReminders: boolean;
    soundEnabled: boolean;
}

export type ViewTab = 'dashboard' | 'bookings' | 'profile' | 'notifications';
