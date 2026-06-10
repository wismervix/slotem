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
