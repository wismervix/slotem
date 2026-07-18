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
export interface NewNotification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        url: string;
        category: NewNotificationCategory;
        priority: 'normal' | 'high' | 'urgent';
        type: 'info' | 'warning' | 'error' | 'alert' | 'success';
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

export interface NewMappedNotification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    category: NewNotificationCategory;
    priority: 'normal' | 'high' | 'urgent';
    type: 'info' | 'warning' | 'error' | 'alert' | 'success'; // info, warning, success, alert
    url: string;
};
type NewNotificationCategory =
    | 'all'
    | 'unread'
    | 'bookings'
    | 'reminders'
    | 'updates'
    | 'broadcasts'
    | 'admin-actions';
