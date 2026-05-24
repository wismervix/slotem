import React, { useState, useEffect } from 'react';
import { Appointment, NotificationItem, UserProfile, ViewTab } from '@/types';
import {
    LayoutDashboard,
    CalendarDays,
    User,
    Bell,
    Search,
    Plus,
    Menu,
    X,
    Stethoscope,
    Sparkles,
    Smile,
    ArrowUpRight,
    Info,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Clock,
    Ban,
    AlertCircle,
} from 'lucide-react';

// Sub components
import DashboardView from '@/components/User/DashboardView';
import CalendarView from '@/components/User/CalendarView';
import ListView from '@/components/User/ListView';
import ProfileView from '@/components/User/ProfileView';
import NotificationsView from '@/components/User/NotificationsView';
import BookModal from '@/components/User/BookModal';

const DEFAULT_APPOINTMENTS: Appointment[] = [
    {
        id: 'appt-1',
        title: 'Dental Consultation',
        provider: 'Smile Clinic West',
        date: '2023-10-24',
        time: '09:30 AM',
        duration: 45,
        category: 'dental',
        status: 'Confirmed',
        notes: 'Standard bi-annual checkup and deep cleaning.',
        price: 120,
    },
    {
        id: 'appt-2',
        title: 'Deep Tissue Massage',
        provider: 'Zen Wellness Center',
        date: '2023-10-28',
        time: '02:00 PM',
        duration: 60,
        category: 'wellness',
        status: 'Confirmed',
        notes: 'Focus on thoracic muscles and posture release.',
        price: 95,
    },
    {
        id: 'appt-3',
        title: 'Legal Consultation',
        provider: 'Smith & Associates Law Firm',
        date: '2023-11-02',
        time: '04:00 PM',
        duration: 60,
        category: 'general',
        status: 'Pending',
        notes: 'Discuss estate planning and will drafting.',
        price: 105,
    },
    {
        id: 'appt-4',
        title: 'Facial Rejuvenation Therapy',
        provider: 'Glow Aesthetics Clinic',
        date: '2023-11-09',
        time: '11:00 AM',
        duration: 60,
        category: 'wellness',
        status: 'Pending',
        notes: 'Non-invasive treatment for skin tightening and anti-aging.',
        price: 65,
    },
    {
        id: 'appt-5',
        title: 'Manicure & Pedicure',
        provider: 'Nail Artistry Studio',
        date: '2023-11-19',
        time: '9:00 AM',
        duration: 60,
        category: 'wellness',
        status: 'Cancelled',
        notes: 'Classic manicure and pedicure with gel polish.',
        price: 115,
    },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
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

const DEFAULT_PROFILE: UserProfile = {
    name: 'John Doe',
    email: 'etangdgm001@gmail.com',
    phone: '+1 (555) 019-2834',
    preferredClinic: 'Smile Clinic West',
    memberSince: 'October 2022',
    marketingConsent: true,
    productUpdates: true,
    smsReminders: true,
    soundEnabled: true,
};

export default function App() {
    const [activeTab, setActiveTab] = useState<ViewTab>('bookings');

    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        const saved = localStorage.getItem('slotem_appointments');

        if (!saved) return DEFAULT_APPOINTMENTS;

        try {
            return JSON.parse(saved);
        } catch {
            return DEFAULT_APPOINTMENTS;
        }
        // return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
    });

    const [notifications, setNotifications] = useState<NotificationItem[]>(
        () => {
            const saved = localStorage.getItem('slotem_notifications');

            if (!saved) return DEFAULT_NOTIFICATIONS;

            try {
                return JSON.parse(saved);
            } catch {
                return DEFAULT_NOTIFICATIONS;
            }
            // return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
        },
    );

    const [profile, setProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('slotem_profile');
        return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    });

    const [selectedDate, setSelectedDate] = useState<string>('2023-10-26');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [subView, setSubView] = useState<'calendar' | 'list'>('calendar');
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem(
            'slotem_appointments',
            JSON.stringify(appointments),
        );
    }, [appointments]);

    useEffect(() => {
        localStorage.setItem(
            'slotem_notifications',
            JSON.stringify(notifications),
        );
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('slotem_profile', JSON.stringify(profile));
    }, [profile]);

    // Handler functions
    const handleAddNewAppointment = (newAppt: {
        title: string;
        provider: string;
        date: string;
        time: string;
        duration: number;
        category: 'dental' | 'wellness' | 'consultation' | 'general';
        notes: string;
        price: number;
    }) => {
        const id = `appt-${Date.now()}`;
        const added: Appointment = {
            ...newAppt,
            id,
            status: 'Confirmed',
        };

        setAppointments((prev) => [added, ...prev]);

        // Push interactive notification
        const alert: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `Scheduled: ${added.title}`,
            message: `Your booking for ${added.title} with ${added.provider} on ${added.date} at ${added.time} was scheduled successfully.`,
            timestamp: 'Just now',
            category: 'Bookings',
            read: false,
            type: 'success',
            dateGroup: 'Today',
        };

        setNotifications((prev) => [alert, ...prev]);
    };

    const handleRescheduleAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: 'Confirmed' as const } : a,
            ),
        );

        const confirmed = appointments.find((a) => a.id === id);
        if (confirmed) {
            const alert: NotificationItem = {
                id: `notif-${Date.now()}`,
                title: `Confirmed: ${confirmed.title}`,
                message: `Your appointment for ${confirmed.title} on ${confirmed.date} has been successfully cancelled. Co-payments will be refunded.`,
                timestamp: 'Just now',
                read: false,
                type: 'reminder',
                category: 'Reminders',
                dateGroup: 'Today',
            };
            setNotifications((prev) => [alert, ...prev]);
        }
    };

    const handleCancelAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: 'Cancelled' as const } : a,
            ),
        );

        const cancelled = appointments.find((a) => a.id === id);
        if (cancelled) {
            const alert: NotificationItem = {
                id: `notif-${Date.now()}`,
                title: `Cancelled: ${cancelled.title}`,
                message: `Your appointment for ${cancelled.title} on ${cancelled.date} has been successfully cancelled. Co-payments will be refunded.`,
                timestamp: 'Just now',
                read: false,
                type: 'reminder',
                category: 'Reminders',
                dateGroup: 'Today',
            };
            setNotifications((prev) => [alert, ...prev]);
        }
    };

    const handleToggleReadNotification = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
        );
    };

    const handleClearAllNotifications = () => {
        setNotifications([]);
    };

    const handleMarkAllReadNotifications = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleSaveProfile = (updated: UserProfile) => {
        setProfile(updated);
    };

    // Direct quick schedule helper from Dashboard recommendations
    const handleScheduleQuickSlot = (presetIdx: number, forcedDate: string) => {
        setSelectedDate(forcedDate);
        setIsBookModalOpen(true);
    };

    // Quick helper to format selected date nicely, e.g. "Tuesday, Oct 24"
    const formatSelectedDateHeading = (dateStr: string) => {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const yearVal = parseInt(parts[0]);
            const monthVal = parseInt(parts[1]) - 1;
            const dayVal = parseInt(parts[2]);
            const d = new Date(yearVal, monthVal, dayVal);
            // Wait: To match the exact localized Thursday, Oct 26 mockup label
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
            };
            return d.toLocaleDateString('en-US', options);
        }
        return dateStr;
    };

    // Find active bookings on the selected calendar date to display on right Details Sidebar
    const selectedDateBookings = appointments.filter(
        (a) => a.date === selectedDate && a.status !== 'Cancelled',
    );

    // Future active appointments for upcoming right section (Oct 24, Oct 28 etc)
    const upcomingAppointments = appointments
        .filter((a) => a.status === 'Confirmed')
        .sort((a, b) => a.date.localeCompare(b.date));

    const unreadNotificationsCount = notifications.filter(
        (n) => !n.read,
    ).length;

    // console.log('Appointments: ', appointments);

    return (
        <div className="flex min-h-screen flex-col bg-[#fef7ff] font-sans text-gray-900 antialiased transition-colors duration-200 md:flex-row dark:bg-neutral-950 dark:text-neutral-100">
            {/* Mobile top navigation header bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-outline-variant bg-[#f9f1ff] p-4 md:hidden dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-white select-none">
                        S
                    </span>
                    <div>
                        <h1 className="text-base leading-tight font-black text-primary dark:text-primary-fixed">
                            Slotem
                        </h1>
                        <p className="text-[10px] leading-none text-gray-500">
                            Management Suite
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Notifications micro badge */}
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className="relative p-1 text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 scale-90 items-center justify-center rounded-full bg-red-600 text-[9px] font-extrabold text-white ring-2 ring-white">
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="rounded-lg bg-gray-100 p-1.5 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Sidebar navigation */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r border-outline-variant bg-[#f9f1ff] p-4 transition-transform duration-300 md:relative md:translate-x-0 dark:border-neutral-800 dark:bg-neutral-900 ${
                    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-black tracking-tight text-primary dark:text-primary-fixed">
                            Slotem
                        </h1>
                        <p className="text-xs font-medium tracking-wide text-secondary opacity-80 dark:text-secondary-fixed">
                            Management Suite
                        </p>
                    </div>

                    <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="rounded-lg bg-gray-100 p-1 md:hidden dark:bg-neutral-800"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Tab Buttons bar */}
                <nav className="flex flex-grow flex-col gap-1.5">
                    <button
                        onClick={() => {
                            setActiveTab('dashboard');
                            setMobileSidebarOpen(false);
                        }}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl p-3.5 text-sm font-bold transition-all ${
                            activeTab === 'dashboard'
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-secondary hover:bg-[#ede5f4] dark:text-secondary-fixed dark:hover:bg-neutral-800'
                        }`}
                    >
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('bookings');
                            setMobileSidebarOpen(false);
                        }}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl p-3.5 text-sm font-bold transition-all ${
                            activeTab === 'bookings'
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-secondary hover:bg-[#ede5f4] dark:text-secondary-fixed dark:hover:bg-neutral-800'
                        }`}
                    >
                        <CalendarDays className="h-5 w-5 shrink-0" />
                        <span>My Bookings</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('profile');
                            setMobileSidebarOpen(false);
                        }}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl p-3.5 text-sm font-bold transition-all ${
                            activeTab === 'profile'
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-secondary hover:bg-[#ede5f4] dark:text-secondary-fixed dark:hover:bg-neutral-800'
                        }`}
                    >
                        <User className="h-5 w-5 shrink-0" />
                        <span>Profile</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('notifications');
                            setMobileSidebarOpen(false);
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-xl p-3.5 text-sm font-bold transition-all ${
                            activeTab === 'notifications'
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-secondary hover:bg-[#ede5f4] dark:text-secondary-fixed dark:hover:bg-neutral-800'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 shrink-0" />
                            <span>Notifications</span>
                        </div>
                        {unreadNotificationsCount > 0 && (
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                    activeTab === 'notifications'
                                        ? 'bg-white text-primary'
                                        : 'bg-primary text-white'
                                }`}
                            >
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </button>
                </nav>

                {/* Action Button at bottom */}
                <button
                    onClick={() => {
                        setIsBookModalOpen(true);
                        setMobileSidebarOpen(false);
                    }}
                    className="mt-auto flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all hover:shadow-lg active:scale-95"
                >
                    <Plus className="h-4 w-4 shrink-0" />
                    Book New Appointment
                </button>
            </aside>

            {/* Backdrop for mobile navigation drawer */}
            {mobileSidebarOpen && (
                <div
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs md:hidden"
                />
            )}

            {/* Main Container screen area */}
            <main className="flex h-screen flex-grow flex-col overflow-hidden">
                {/* Main top header bar with search and title matching the layout */}
                <header className="flex shrink-0 flex-col items-start justify-between gap-4 border-b border-outline-variant bg-white/40 p-6 backdrop-blur-md lg:flex-row lg:items-center dark:border-neutral-800 dark:bg-neutral-900/40">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-black tracking-tight text-gray-900 capitalize dark:text-white">
                            {activeTab === 'bookings'
                                ? 'My Bookings'
                                : activeTab}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                            {activeTab === 'bookings' ? (
                                <span>October 2023</span>
                            ) : activeTab === 'dashboard' ? (
                                <span>Overview Analytics</span>
                            ) : activeTab === 'profile' ? (
                                <span>Demographics and Preferences</span>
                            ) : (
                                <span>
                                    Activity Broadcast alerts - Stay updated
                                    with your latest schedule and system alerts.
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center gap-4 sm:flex-row lg:w-auto">
                        {/* Real Search Input bar */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search appointments..."
                                className="w-full rounded-xl border border-outline-variant bg-white py-2.5 pr-4 pl-9 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
                            />
                        </div>

                        {/* View Switcher is renderable only on the bookings tab */}
                        {activeTab === 'bookings' && (
                            <div className="flex shrink-0 rounded-xl bg-gray-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setSubView('list')}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
                                        subView === 'list'
                                            ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    List View
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSubView('calendar')}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
                                        subView === 'calendar'
                                            ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <CalendarDays className="h-4 w-4" />
                                    Calendar View
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Central screen content viewport */}
                <div className="flex flex-grow overflow-hidden">
                    <section className="flex-grow overflow-y-auto bg-[#fcf8ff] p-6 dark:bg-neutral-950/20">
                        {activeTab === 'bookings' &&
                            (subView === 'calendar' ? (
                                <CalendarView
                                    appointments={appointments}
                                    selectedDate={selectedDate}
                                    searchQuery={searchQuery}
                                    onSelectDate={setSelectedDate}
                                    onOpenBookingModal={() =>
                                        setIsBookModalOpen(true)
                                    }
                                />
                            ) : (
                                <ListView
                                    appointments={appointments}
                                    searchQuery={searchQuery}
                                    onCancelAppointment={
                                        handleCancelAppointment
                                    }
                                    onRescheduleAppointment={
                                        handleRescheduleAppointment
                                    }
                                />
                            ))}

                        {activeTab === 'dashboard' && (
                            <DashboardView
                                appointments={appointments}
                                userName={profile.name}
                                onScheduleQuickSlot={handleScheduleQuickSlot}
                            />
                        )}

                        {activeTab === 'profile' && (
                            <ProfileView
                                profile={profile}
                                onSaveProfile={handleSaveProfile}
                            />
                        )}

                        {activeTab === 'notifications' && (
                            <NotificationsView
                                notifications={notifications}
                                onToggleRead={handleToggleReadNotification}
                                onClearAll={handleClearAllNotifications}
                                onMarkAllAsRead={handleMarkAllReadNotifications}
                                onDelete={deleteNotification}
                                onMarkAsRead={markNotificationAsRead}
                            />
                        )}
                    </section>

                    {/* Right Sidebar Details panel (Shown on 'bookings' tab to match the screenshot layout exactly) */}
                    {activeTab === 'bookings' && (
                        <aside className="hidden w-90 shrink-0 flex-col gap-6 overflow-y-auto border-l border-outline-variant bg-white p-6 xl:flex dark:border-neutral-800 dark:bg-neutral-900">
                            <div>
                                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                                    Details
                                </h3>
                                <p className="mt-1 text-xs font-bold tracking-wider text-secondary uppercase">
                                    {formatSelectedDateHeading(selectedDate)}
                                </p>
                            </div>

                            {/* Day selection bookings/empty states panel */}
                            <div className="space-y-3">
                                {selectedDateBookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-[#f9f1ff] p-5 py-8 text-center dark:border-transparent dark:bg-neutral-800/50">
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-xs dark:bg-neutral-900">
                                            <Info className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-800 dark:text-neutral-200">
                                            No bookings today
                                        </p>
                                        <p className="mt-1 max-w-[150px] text-[10px] leading-relaxed text-gray-400">
                                            Enjoy your free time or schedule
                                            something new.
                                        </p>
                                    </div>
                                ) : (
                                    selectedDateBookings.map((appt) => (
                                        <div
                                            key={appt.id}
                                            className="space-y-3 rounded-xl border border-outline-variant bg-gray-50/50 p-4 dark:bg-neutral-800/30"
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary select-none">
                                                    {appt.category ===
                                                    'dental' ? (
                                                        <Smile className="h-4 w-4" />
                                                    ) : (
                                                        <Sparkles className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">
                                                        {appt.title}
                                                    </h4>
                                                    <p className="text-[10px] font-medium text-gray-500">
                                                        {appt.provider}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-[10px] leading-normal font-semibold text-secondary">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>
                                                        {appt.time} (
                                                        {appt.duration} mins)
                                                    </span>
                                                </div>

                                                {appt.notes && (
                                                    <p className="mt-1 border-l border-outline-variant pl-1 text-gray-400 italic dark:text-neutral-400">
                                                        "{appt.notes}"
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCancelAppointment(
                                                        appt.id,
                                                    )
                                                }
                                                className="flex w-full items-center justify-center gap-1 rounded-lg border border-red-200/40 bg-red-50 py-1.5 text-[10px] font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-transparent dark:bg-red-950/20 dark:hover:bg-red-900/30"
                                            >
                                                <Ban className="h-3 w-3" />
                                                Cancel Appointment
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <hr className="border-outline-variant dark:border-neutral-800" />

                            {/* Upcoming Appointments matches the screenshot exactly */}
                            <div className="min-h-[300px] flex-grow space-y-3 overflow-y-auto pr-1">
                                <h3 className="text-xs font-black tracking-wider text-gray-500 uppercase">
                                    Upcoming Appointments
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {upcomingAppointments.length === 0 ? (
                                        <p className="py-4 text-center text-[10px] font-bold text-gray-400 italic">
                                            No future sessions scheduled.
                                        </p>
                                    ) : (
                                        upcomingAppointments
                                            .slice(0, 3)
                                            .map((appt) => (
                                                <div
                                                    key={appt.id}
                                                    onClick={() =>
                                                        setSelectedDate(
                                                            appt.date,
                                                        )
                                                    }
                                                    className="group flex cursor-pointer flex-col justify-between rounded-xl border border-outline-variant bg-white p-3.5 shadow-xs transition-all hover:border-primary hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                                                >
                                                    <div className="mb-2 flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-2.5">
                                                            <div
                                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                                    appt.category ===
                                                                    'dental'
                                                                        ? 'bg-primary/10 text-primary'
                                                                        : 'bg-tertiary-fixed text-tertiary'
                                                                }`}
                                                            >
                                                                {appt.category ===
                                                                'dental' ? (
                                                                    <Smile className="h-4 w-4" />
                                                                ) : (
                                                                    <Sparkles className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="max-w-[130px] truncate text-xs font-extrabold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                                                                    {appt.title}
                                                                </p>
                                                                <p className="max-w-[130px] truncate text-[9px] font-semibold text-gray-500">
                                                                    {
                                                                        appt.provider
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span className="rounded-full border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 text-[8px] font-extrabold tracking-wider text-emerald-700 uppercase dark:bg-emerald-950/20 dark:text-emerald-400">
                                                            Confirmed
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-secondary">
                                                        <div className="flex items-center gap-1 text-[9px]">
                                                            <Clock className="h-3.5 w-3.5 text-primary" />
                                                            {appt.date},{' '}
                                                            {appt.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>

                            {/* View Availability Checkup Promotion Matches the card at the bottom of the screenshot */}
                            <div className="mt-auto">
                                <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-primary-container p-4 text-on-primary-container">
                                    <div className="relative z-10 space-y-1.5 text-center">
                                        <p className="text-xs font-extrabold text-white">
                                            Need a dynamic checkup?
                                        </p>
                                        <p className="text-[9px] text-indigo-200">
                                            Instant slots available for this
                                            week
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedDate('2023-10-27');
                                                setIsBookModalOpen(true);
                                            }}
                                            className="rounded-xl bg-white px-4 py-2 text-[10px] font-black text-primary shadow-sm transition-all hover:bg-neutral-100"
                                        >
                                            View Availability
                                        </button>
                                    </div>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </main>

            {/* Floating Action Button for mobile screens */}
            <button
                onClick={() => setIsBookModalOpen(true)}
                className="fixed right-6 bottom-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-105 hover:bg-primary-container active:scale-95 md:hidden"
                title="Schedule appointment popup"
            >
                <Plus className="h-6 w-6 shrink-0" />
            </button>

            {/* Multi-step appointment wizard modal */}
            <BookModal
                isOpen={isBookModalOpen}
                onClose={() => setIsBookModalOpen(false)}
                onSave={handleAddNewAppointment}
                preselectedDate={selectedDate}
            />
        </div>
    );
}
