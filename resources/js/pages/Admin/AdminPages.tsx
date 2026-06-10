import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Calendar,
    Clock,
    Settings as SettingsIcon,
    Plus,
    Search,
    Bell,
    HelpCircle,
    Menu,
    X,
    Stethoscope,
    Maximize2,
    Minimize2,
    CalendarCheck,
} from 'lucide-react';
import { AdminBooking, ClinicService, Staff, ActivityLog } from '@/types';
import {
    INITIAL_BOOKINGS,
    INITIAL_SERVICES,
    INITIAL_STAFF,
    INITIAL_LOGS,
} from '@/data/initial-data';

// Screens
import DashboardScreen from '@/components/Admin/DashboardScreen';
import BookingsScreen from '@/components/Admin/BookingsScreen';
import AvailabilityScreen from '@/components/Admin/AvailabilityScreen';
import SettingsScreen from '@/components/Admin/SettingsScreen';

// Modals
import NewBookingModal from '@/components/Admin/NewBookingModal';
import BookingDetailsModal from '@/components/Admin/BookingDetailsModal';
import NotificationPopover from '@/components/Admin/NotificationPopover';

export default function App() {
    // Primary database state engines
    const [bookings, setBookings] = useState<AdminBooking[]>(() => {
        const local = localStorage.getItem('slotem_bookings');
        return local ? JSON.parse(local) : INITIAL_BOOKINGS;
    });

    const [services, setServices] = useState<ClinicService[]>(() => {
        const local = localStorage.getItem('slotem_services');
        return local ? JSON.parse(local) : INITIAL_SERVICES;
    });

    const [staff, setStaff] = useState<Staff[]>(() => {
        const local = localStorage.getItem('slotem_staff');
        return local ? JSON.parse(local) : INITIAL_STAFF;
    });

    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
        const local = localStorage.getItem('slotem_logs');
        return local ? JSON.parse(local) : INITIAL_LOGS;
    });

    // Navigation and UI elements state
    const [activeTab, setActiveTab] = useState<
        'dashboard' | 'bookings' | 'availability' | 'settings'
    >('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Modals view controllers
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
        null,
    );
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Save database states persistently to LocalStorage
    useEffect(() => {
        localStorage.setItem('slotem_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('slotem_services', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem('slotem_staff', JSON.stringify(staff));
    }, [staff]);

    useEffect(() => {
        localStorage.setItem('slotem_logs', JSON.stringify(activityLogs));
    }, [activityLogs]);

    // Handle building new bookings from Wizard
    const handleCreateBooking = (
        fields: Omit<AdminBooking, 'id' | 'createdTime'>,
    ) => {
        const srv = services.find((s) => s.id === fields.serviceId);
        const newBk: AdminBooking = {
            ...fields,
            id: `bk_${Date.now()}`,
            createdTime: Date.now(),
        };

        // Prepend system activity logs
        const newLog: ActivityLog = {
            id: `log_${Date.now()}`,
            type: 'booking_new',
            title: 'New Booking',
            description: `${fields.clientName} scheduled a ${srv?.name || 'Treatment'}.`,
            timestamp: 'Just now',
            createdTime: Date.now(),
        };

        setBookings((prev) => [newBk, ...prev]);
        setActivityLogs((prev) => [newLog, ...prev]);
        setIsNewBookingOpen(false);
    };

    // Update status changes on individual books
    const handleUpdateBookingStatus = (
        id: string,
        nextStatus: AdminBooking['status'],
    ) => {
        const target = bookings.find((b) => b.id === id);
        if (!target) return;

        const prevStatus = target.status;

        setBookings((prev) =>
            prev.map((bk) => {
                if (bk.id === id) {
                    return { ...bk, status: nextStatus };
                }
                return bk;
            }),
        );

        // Update active modal selected instance to keep state synced inside detail card
        setSelectedBooking((prev) =>
            prev && prev.id === id ? { ...prev, status: nextStatus } : prev,
        );

        // log event
        let type: ActivityLog['type'] = 'system';
        let titleStr = 'Status Changed';
        let desc = `${target.clientName}'s appointment changed to ${nextStatus}.`;

        if (nextStatus === 'Cancelled') {
            type = 'booking_cancelled';
            titleStr = 'Cancelled';
            desc = `${target.clientName} cancelled their ${services.find((s) => s.id === target.serviceId)?.name || 'Treatment'}.`;
        } else if (nextStatus === 'In Progress') {
            titleStr = 'Checked-in';
            desc = `${target.clientName} is now checked-in for treatment.`;
        }

        const newLog: ActivityLog = {
            id: `log_${Date.now()}`,
            type,
            title: titleStr,
            description: desc,
            timestamp: 'Just now',
            createdTime: Date.now(),
        };

        setActivityLogs((prev) => [newLog, ...prev]);
    };

    // Clinic treatment notes editor feedback
    const handleUpdateBookingNotes = (id: string, nextNotes: string) => {
        setBookings((prev) =>
            prev.map((bk) => {
                if (bk.id === id) {
                    return { ...bk, notes: nextNotes };
                }
                return bk;
            }),
        );

        setSelectedBooking((prev) =>
            prev && prev.id === id ? { ...prev, notes: nextNotes } : prev,
        );
    };

    // Clear notify histories
    const handleClearLogs = () => {
        setActivityLogs([]);
    };

    // Global simple search action triggers
    const handleSearchTrigger = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setActiveTab('bookings');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fef7ff] font-sans text-[#1d1a24] selection:bg-[#cbd5e1]">
            {/* 1. SIDEBAR NAVIGATION - DESKTOP VIEW */}
            <aside className="fixed top-0 left-0 z-30 hidden h-screen w-64 flex-col border-r border-[#e8dfee] bg-white py-8 md:flex">
                {/* Core Clinic brand logos */}
                <div className="mb-8 flex items-center justify-between px-6">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-[#630ed4]">
                            Slotem
                        </h1>
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                            Admin Suite
                        </p>
                    </div>
                    <span
                        className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"
                        title="Systems Active"
                    />
                </div>

                {/* Tab Switch list */}
                <nav className="flex-1 space-y-1">
                    <button
                        onClick={() => {
                            setActiveTab('dashboard');
                            setMobileMenuOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center border-r-4 px-6 py-3 text-left text-sm font-bold transition-all ${
                            activeTab === 'dashboard'
                                ? 'border-[#630ed4] bg-[#f9f1ff] text-[#630ed4]'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#630ed4]'
                        }`}
                    >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('bookings');
                            setMobileMenuOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center border-r-4 px-6 py-3 text-left text-sm font-bold transition-all ${
                            activeTab === 'bookings'
                                ? 'border-[#630ed4] bg-[#f9f1ff] text-[#630ed4]'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#630ed4]'
                        }`}
                    >
                        <Calendar className="mr-3 h-5 w-5" />
                        <span>Bookings</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('availability');
                            setMobileMenuOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center border-r-4 px-6 py-3 text-left text-sm font-bold transition-all ${
                            activeTab === 'availability'
                                ? 'border-[#630ed4] bg-[#f9f1ff] text-[#630ed4]'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#630ed4]'
                        }`}
                    >
                        <Clock className="mr-3 h-5 w-5" />
                        <span>Availability</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('settings');
                            setMobileMenuOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center border-r-4 px-6 py-3 text-left text-sm font-bold transition-all ${
                            activeTab === 'settings'
                                ? 'border-[#630ed4] bg-[#f9f1ff] text-[#630ed4]'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#630ed4]'
                        }`}
                    >
                        <SettingsIcon className="mr-3 h-5 w-5" />
                        <span>Settings</span>
                    </button>
                </nav>

                {/* Bottom Booking Button */}
                <div className="mt-auto px-6">
                    <button
                        onClick={() => setIsNewBookingOpen(true)}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#630ed4] px-4 py-3 font-bold text-white shadow-sm transition-all hover:bg-[#7c3aed] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        New Booking
                    </button>
                </div>
            </aside>

            {/* MOBILE HEADER & DRAWER NAV */}
            <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#e8dfee] bg-white px-4 md:hidden">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-lg leading-none font-black text-[#630ed4]">
                            Slotem
                        </h1>
                        <p className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                            Admin Suite
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsNewBookingOpen(true)}
                    className="rounded-lg bg-[#630ed4] p-2 text-white"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* MOBILE DRAWER */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex justify-start bg-black/40 md:hidden">
                    <div className="animate-fade-in relative flex h-full w-64 flex-col bg-white p-6">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-4 right-4 p-1 text-gray-400"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-8">
                            <h1 className="text-xl font-black tracking-tight text-[#630ed4]">
                                Slotem
                            </h1>
                            <p className="tracking-wild text-[10px] font-bold text-gray-400 uppercase">
                                Dental Clinic Suite
                            </p>
                        </div>

                        <nav className="flex-1 space-y-2">
                            <button
                                onClick={() => {
                                    setActiveTab('dashboard');
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex w-full items-center rounded-lg p-3 text-left text-sm font-bold ${activeTab === 'dashboard' ? 'bg-[#f9f1ff] text-[#630ed4]' : 'text-gray-500'}`}
                            >
                                <LayoutDashboard className="mr-3 h-5 w-5" />{' '}
                                Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('bookings');
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex w-full items-center rounded-lg p-3 text-left text-sm font-bold ${activeTab === 'bookings' ? 'bg-[#f9f1ff] text-[#630ed4]' : 'text-gray-500'}`}
                            >
                                <Calendar className="mr-3 h-5 w-5" /> Bookings
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('availability');
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex w-full items-center rounded-lg p-3 text-left text-sm font-bold ${activeTab === 'availability' ? 'bg-[#f9f1ff] text-[#630ed4]' : 'text-gray-500'}`}
                            >
                                <Clock className="mr-3 h-5 w-5" /> Availability
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('settings');
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex w-full items-center rounded-lg p-3 text-left text-sm font-bold ${activeTab === 'settings' ? 'bg-[#f9f1ff] text-[#630ed4]' : 'text-gray-500'}`}
                            >
                                <SettingsIcon className="mr-3 h-5 w-5" />{' '}
                                Settings
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* 2. MAIN CENTER CANVAS CONTENT */}
            <div className="flex min-h-screen flex-1 flex-col pt-16 md:ml-64 md:pt-0">
                {/* Core Top navigation and action bar */}
                <header className="sticky top-16 z-20 flex h-16 items-center justify-between border-b border-[#e8dfee] bg-white px-6 md:top-0">
                    {/* Quick clinical Search option */}
                    <form
                        onSubmit={handleSearchTrigger}
                        className="relative max-w-lg flex-1"
                    >
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                            <Search className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search appointments, patients, rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-transparent bg-gray-50 py-2 pr-4 pl-9 text-xs font-medium text-gray-800 transition-all outline-none placeholder:text-gray-400 focus:border-[#630ed4] focus:bg-white"
                        />
                    </form>

                    {/* Widgets bar */}
                    <div className="ml-4 flex items-center gap-5">
                        {/* Bell trigger displaying logs */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsNotificationsOpen(!isNotificationsOpen)
                                }
                                className="relative cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#630ed4]"
                            >
                                <Bell className="h-4 w-4" />
                                {activityLogs.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#630ed4]" />
                                )}
                            </button>

                            {/* Dynamic Notification lists drop down */}
                            <NotificationPopover
                                isOpen={isNotificationsOpen}
                                onClose={() => setIsNotificationsOpen(false)}
                                logs={activityLogs}
                                onClear={handleClearLogs}
                            />
                        </div>

                        {/* Support documentation block shortcut */}
                        <button
                            onClick={() =>
                                alert(
                                    'Slotem Help & Support Center:\n1. Use Bookings to view patients lists.\n2. Click Availability blocks to configure clinic rest times.',
                                )
                            }
                            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#630ed4]"
                        >
                            <HelpCircle className="h-4 w-4" />
                        </button>

                        {/* Admin User Header Metadata */}
                        <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                            <img
                                alt="Lead Admin Alex Rivera Avatar"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8bsT9yYeaulCPefDEgepD_1aIBrnscFsgKYQ_qbg1mppLuieWuRE8FY0FMLDutmlFBhM1GX1Vwbz-GEUHS_iDxmZ-koPuGFxtzsSUD_iQRfV8Y2zYzVdQq_i957kXghe1UciItei55IbjXa9EzM2eir96nrgbZ-CYidyDg12ubYIlfSDSiMxiO-I9wGYzxCNsYHt5ugRO4PshnXHzAiMaVRITuyEHDN4ULAh0jxJXf0kR2BuENOTLmI6c2nicgXww-aEKHTbQG0M"
                                className="h-9 w-9 rounded-full border border-[#e8dfee] object-cover"
                            />
                            <div className="hidden text-left text-xs leading-none lg:block">
                                <p className="font-extrabold text-gray-800">
                                    Alex Rivera
                                </p>
                                <p className="mt-0.5 text-[10px] font-bold text-gray-400">
                                    Lead Admin
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Outer content area component switcher */}
                <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8">
                    {activeTab === 'dashboard' && (
                        <DashboardScreen
                            bookings={bookings}
                            services={services}
                            staff={staff}
                            activityLogs={activityLogs}
                            onNavigate={setActiveTab}
                            onSelectBooking={setSelectedBooking}
                            onOpenNewBooking={() => setIsNewBookingOpen(true)}
                        />
                    )}

                    {activeTab === 'bookings' && (
                        <BookingsScreen
                            bookings={bookings}
                            services={services}
                            staff={staff}
                            onOpenNewBooking={() => setIsNewBookingOpen(true)}
                            onSelectBooking={setSelectedBooking}
                        />
                    )}

                    {activeTab === 'availability' && (
                        <AvailabilityScreen bookings={bookings} staff={staff} />
                    )}

                    {activeTab === 'settings' && (
                        <SettingsScreen
                            services={services}
                            staff={staff}
                            onUpdateServices={setServices}
                            onUpdateStaff={setStaff}
                        />
                    )}
                </main>
            </div>

            {/* 3. MODALS BLOCK ENGINES */}

            {/* Dynamic scheduler wizard modal */}
            <NewBookingModal
                isOpen={isNewBookingOpen}
                onClose={() => setIsNewBookingOpen(false)}
                onSubmit={handleCreateBooking}
                services={services}
                staff={staff}
                bookings={bookings}
            />

            {/* Medical ledger detail check status wizard modal */}
            <BookingDetailsModal
                booking={selectedBooking}
                isOpen={selectedBooking !== null}
                onClose={() => setSelectedBooking(null)}
                onUpdateStatus={handleUpdateBookingStatus}
                onUpdateNotes={handleUpdateBookingNotes}
                services={services}
                staff={staff}
            />
        </div>
    );
}
