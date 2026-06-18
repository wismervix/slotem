import { UserThree, BookingThree, AvailabilityThree, AdminProfileThree } from '@/types';

export const INITIAL_USERS: UserThree[] = [
    {
        id: 'SL-49201',
        name: 'Marcus Thorne',
        email: 'm.thorne@example.com',
        phone: '+1 (555) 012-3456',
        registeredDate: 'Oct 12, 2023',
        registeredTime: '10:45 AM',
        bookingsCount: 24,
        status: 'Active',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaI003af57dMXZfAc5JLHBXqstN2nvBK6HpxGmEX_o60SWqgplV1YMx8O2qcoOIqLGTYSxUHuW5D69NTfC3Ab5Eyiz8XKNBO1BLTW09YQrx-jxElAqRONPfy7Qlaws69JwWyh5niR4pgdUL-htfZ8thWsW7kbPhPTOHG1mYnFwXE_ApFW0uuKY2FjlvI8jxDfYnO-3KvoAAMamQFuEpHdWj6jd4IGtGwv3tYxmCyXWC7qQcrbNTVMmgvTFo1R05bMfcsdfduc7JM4',
    },
    {
        id: 'SL-49202',
        name: 'Elena Rodriguez',
        email: 'elena.rod@webmail.com',
        phone: '+1 (555) 987-6543',
        registeredDate: 'Nov 05, 2023',
        registeredTime: '02:15 PM',
        bookingsCount: 12,
        status: 'Suspended',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRASTxjF02aHDj5cyv4v-1lZIB2oeuYPmV40QHRAjyVbGV4GDgkzMsyI838sGyhY-WsrxL86BDNfy1RuRAO2zO6Pl-LgquPIcAkmzdaJD_Eo6z3G-rLGf39RFq5-FSu21c0elxdbTbVnQpxUDgM8YoCRgE4Kw1QpcqOdNFKnS6X3FG98YPM2PFyGiB0NnSZY9pJqHwkpy7YY81tuSJ39C9MWpMETDoOrCxvhYVwRJczWcMdKSEnupeqwJAvZsC4vN3jTImspX7tkM',
    },
    {
        id: 'SL-49203',
        name: 'Jordan Smith',
        email: 'j.smith.dev@gmail.com',
        phone: '+1 (555) 234-5678',
        registeredDate: 'Dec 20, 2023',
        registeredTime: '09:30 AM',
        bookingsCount: 5,
        status: 'Active',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIXAQa-sm6HaPs64JQqKTKH0AWDel5nqlldOjXYZ9cA1v6ysDRlsKC8RLFWa_itmNyWAdr29DXwD_lgLJZqY58_IzlrxyZkCiaUuln3OYsU0s4FOgQxGxdhl-hM9H1NrYuJpI8kRXatd_mAc9-kFWEKlawrCGi2rBW0h7zji76lAS_px0cebMgdvRw6PaF1YHcy8kJi9HLRE__p8H5JPVYVAWK2-MyBlkfzOnrJsE55SUf8Vru60qvDaYOhrFvtObeYbZopK8AeLc',
    },
    {
        id: 'SL-49204',
        name: 'Aria Chen',
        email: 'aria.chen@design.co',
        phone: '+1 (555) 765-4321',
        registeredDate: 'Jan 04, 2024',
        registeredTime: '11:15 AM',
        bookingsCount: 18,
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'SL-49205',
        name: 'Devon Carter',
        email: 'd.carter@techcorp.com',
        phone: '+1 (555) 456-7890',
        registeredDate: 'Jan 15, 2024',
        registeredTime: '04:00 PM',
        bookingsCount: 8,
        status: 'Pending',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'SL-49206',
        name: 'Sonia Mehta',
        email: 'sonia.mehta@health.org',
        phone: '+1 (555) 890-1234',
        registeredDate: 'Feb 10, 2024',
        registeredTime: '10:00 AM',
        bookingsCount: 22,
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'SL-49207',
        name: 'Liam Peterson',
        email: 'liam.peterson@fintech.io',
        phone: '+1 (555) 345-6789',
        registeredDate: 'Feb 18, 2024',
        registeredTime: '01:30 PM',
        bookingsCount: 0,
        status: 'Pending',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'SL-49208',
        name: 'Chloe Dubois',
        email: 'c.dubois@academy.edu',
        phone: '+1 (555) 901-2345',
        registeredDate: 'Mar 01, 2024',
        registeredTime: '08:45 AM',
        bookingsCount: 3,
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'SL-49209',
        name: 'Mateo Silva',
        email: 'mateo.silva@creative.br',
        phone: '+1 (555) 567-8901',
        registeredDate: 'Mar 08, 2024',
        registeredTime: '05:45 PM',
        bookingsCount: 14,
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
];

export const INITIAL_BOOKINGS: BookingThree[] = [
    {
        id: 'BK-1001',
        userName: 'Marcus Thorne',
        userEmail: 'm.thorne@example.com',
        userId: 'SL-49201',
        service: 'VIP Strategy Consultation',
        date: '2024-03-12',
        timeSlot: '10:45 AM',
        status: 'Completed',
    },
    {
        id: 'BK-1002',
        userName: 'Elena Rodriguez',
        userEmail: 'elena.rod@webmail.com',
        userId: 'SL-49202',
        service: 'Technical Onboarding Session',
        date: '2024-03-18',
        timeSlot: '02:15 PM',
        status: 'Cancelled',
    },
    {
        id: 'BK-1003',
        userName: 'Jordan Smith',
        userEmail: 'j.smith.dev@gmail.com',
        userId: 'SL-49203',
        service: 'General Consultation',
        date: '2024-03-20',
        timeSlot: '09:30 AM',
        status: 'Confirmed',
    },
    {
        id: 'BK-1004',
        userName: 'Aria Chen',
        userEmail: 'aria.chen@design.co',
        userId: 'SL-49204',
        service: 'Design Review & Feedback',
        date: '2024-03-21',
        timeSlot: '11:15 AM',
        status: 'Confirmed',
    },
    {
        id: 'BK-1005',
        userName: 'Sonia Mehta',
        userEmail: 'sonia.mehta@health.org',
        userId: 'SL-49206',
        service: 'Health & Wellness Assessment',
        date: '2024-03-22',
        timeSlot: '10:00 AM',
        status: 'Pending',
    },
];

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];
const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
];

export const INITIAL_AVAILABILITY: AvailabilityThree[] = DAYS_OF_WEEK.map((day) => ({
    day,
    slots: TIME_SLOTS.map((time) => {
        // Weekends have fewer available slots by default
        const isWeekend = day === 'Saturday' || day === 'Sunday';
        const hour = parseInt(time.split(':')[0]);
        const isLunchTime = hour === 12 || hour === 1;
        return {
            time,
            isAvailable: isWeekend
                ? false
                : !isLunchTime && Math.random() > 0.15,
        };
    }),
}));

export const INITIAL_ADMIN: AdminProfileThree = {
    name: 'Admin Alex',
    role: 'Super Admin',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiQJyOC3pfF6mYhLFTbfht0rhk5Olliqlx0Z9pkphIE1xJNFpbLXA4GPicvw3onlswXMXJj760Ao94sDGq82D1kOKD1k8B7uE4GsbkjHaauGkdECUVKkRi0pg_DbniuaaZU1crOmMf8NzE0qTrwPLn8x1tDx0v-nsDIb_yU77Lzg2SWiM5Eh2EJhOnj1DlRLPzCYl2qwoetyFGYPvpdsKalD0b-75iFXCqfq4BiFdoQx6xFeAQk5b8DQ9LeayTleKClWe0mzdtR98',
    notificationsCount: 4,
};

// Local storage management helpers
export function loadState<T>(key: string, defaultValue: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to load storage for key:', key, e);
    }
    return defaultValue;
}

export function saveState<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Failed to save state for key:', key, e);
    }
}
