import { NotificationItem } from '@/types';

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'notif-1',
        title: 'Dental Consultation Confirmed',
        message:
            'Your slot at Smile Clinic West with Dr. Sarah Jenkins is verified. Please bring your health policy credential.',
        timestamp: '2 hours ago',
        category: 'Bookings',
        read: false,
        type: 'success',
        dateGroup: 'Today',
    },
    {
        id: 'notif-2',
        title: 'Reminder: Deep Tissue Massage',
        message:
            'Upcoming session at Zen Wellness Center on Oct 28, 02:00 PM is coming up. Drink lots of water.',
        timestamp: '1 day ago',
        read: false,
        type: 'reminder',
        category: 'Reminders',
        dateGroup: 'Today',
    },
    {
        id: 'notif-3',
        title: 'Welcome to Slotem Management Suite',
        message:
            'Welcome! Organize your visits, search, and schedule appointments instantly.',
        timestamp: '3 days ago',
        read: true,
        category: 'Updates',
        type: 'info',
    },
    {
        id: 'notif-4',
        title: 'Booking Confirmed: Dental Cleaning',
        message:
            'Your appointment with Dr. Aris Thorne is confirmed for October 24, at 10:30 AM. Please arrive 10 minutes early.',
        timestamp: '2h ago',
        category: 'Bookings',
        type: 'booking',
        read: false,
        dateGroup: 'Today',
    },
    {
        id: 'notif-5',
        title: 'System Update: Version 2.4.0',
        message:
            "We've improved the calendar loading speeds and fixed minor bugs in the time-picker interface. Explore the new 'Quick Book' feature.",
        timestamp: '5h ago',
        category: 'Updates',
        type: 'update',
        read: false,
        dateGroup: 'Today',
    },
    {
        id: 'notif-6',
        title: 'Reminder: Haircut tomorrow',
        message:
            "Don't forget your 3:00 PM session at 'The Grooming Room' with stylist Sarah. See you then!",
        timestamp: '1d ago',
        category: 'Reminders',
        type: 'reminder',
        read: true,
        dateGroup: 'Yesterday',
    },
    {
        id: 'notif-7',
        title: 'Pro Tip: Sync your Calendar',
        message:
            'Integrate Slotem with Google or Outlook to never miss an appointment again. Setup takes less than a minute.',
        timestamp: '1d ago',
        category: 'Updates',
        type: 'tip',
        read: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsr3YTd83_V5nWJGolJ7N2_x5ZRO6nRXkK1vzmDyrofI0tcU-alzlOFw4h3dIeS-ZMSHHjBfpyk7v_p4Wwv2J1OzOjV7dmUGInPSN1GlQIrw867R3pZxuFqZq7SRty2TzXC8dZCkH63_ST0ZbjfYb1PEZDdOyXTDegEOqZgm8ipP6bXMtm5CEBwO8PrjdqM-deByD-_6M3Ou5Ec1aVJevoQ5O8YPUkUbaH6UVqlNJFpY4j0tOWVzcWIil3ltJi6ctXpXgH7b736Oo',
        dateGroup: 'Yesterday',
    },
];
