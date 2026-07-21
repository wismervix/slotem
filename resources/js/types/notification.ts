export interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        url: string;
        category: NotificationCategory;
        data?: {
            type?: string;
            priority?: string;
        };
    };
    read_at: string | null;
    created_at: string;
}

type NotificationCategory = 'All' | 'bookings' | 'reminders' | 'broadcasts';

export interface AdminNotification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        url: string;
        category: string;
        priority: 'normal' | 'high' | 'urgent';
        type: AdminNotificationType;
    };
    read_at: string | null;
    created_at: string;
}

type AdminNotificationType =
    | 'All'
    | 'bookings'
    | 'user_booking_actions'
    | 'admin_actions';

type AdminNotificationCategory =
    | 'all'
    | 'unread'
    | 'bookings'
    | 'reminders'
    | 'updates'
    | 'broadcasts'
    | 'admin_actions'
    | 'user_booking_actions';
    
export interface OldNotification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        url: string;
        category: OldNotificationCategory;
        priority: 'normal' | 'high' | 'urgent';
        type: 'info' | 'warning' | 'error' | 'alert' | 'success';
    };
    read_at: string | null;
    created_at: string;
}

type OldNotificationCategory =
    | 'all'
    | 'unread'
    | 'bookings'
    | 'reminders'
    | 'updates'
    | 'broadcasts'
    | 'admin_actions'
    | 'user_booking_actions';
