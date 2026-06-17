import React, { useState, useEffect } from 'react';
import { ServiceTwo, BookingTwo, AdminProfile } from '@/types';
import {
    INITIAL_SERVICES,
    INITIAL_BOOKINGS,
    INITIAL_ADMIN_PROFILE,
} from '@/data/initial-data-two';
import ServicesView from '@/components/Admin/AdminOne/ServicesView';
import BookingsView from '@/components/Admin/AdminOne/BookingsView';
import DashboardView from '@/components/Admin/AdminOne/DashboardView';
import SettingsView from '@/components/Admin/AdminOne/SettingsView';
import NewBookingModal from '@/components/Admin/AdminOne/NewBookingModal';
import {
    LayoutDashboard,
    Calendar,
    CalendarCheck,
    Settings,
    Plus,
    Search,
    Bell,
    HelpCircle,
    Menu,
    X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
    // Navigation active tab State ('dashboard', 'bookings', 'availability', 'settings')
    const [activeTab, setActiveTab] = useState<
        'dashboard' | 'bookings' | 'availability' | 'settings'
    >('availability');

    // Load from local storage or defaults
    const [services, setServices] = useState<ServiceTwo[]>(() => {
        const saved = localStorage.getItem('slotem_services');
        return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    });

    const [bookings, setBookings] = useState<BookingTwo[]>(() => {
        const saved = localStorage.getItem('slotem_bookings');
        return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    });

    const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
        const saved = localStorage.getItem('slotem_profile');
        return saved ? JSON.parse(saved) : INITIAL_ADMIN_PROFILE;
    });

    // Global adaptive search string
    const [searchQuery, setSearchQuery] = useState('');

    // Schedulers dialog state
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Responsive sidebar toggle for smaller viewports
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Sync state with local storage
    useEffect(() => {
        localStorage.setItem('slotem_services', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem('slotem_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('slotem_profile', JSON.stringify(adminProfile));
    }, [adminProfile]);

    // Clean search on tab shift
    useEffect(() => {
        setSearchQuery('');
    }, [activeTab]);

    // Service Handlers
    const handleAddService = (
        newServiceData: Omit<ServiceTwo, 'id' | 'createdAt' | 'bookingsCount'>,
    ) => {
        const freshService: ServiceTwo = {
            ...newServiceData,
            id: `s_${Date.now()}`,
            bookingsCount: 0,
            createdAt: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            }),
        };
        setServices((prev) => [freshService, ...prev]);
    };

    const handleUpdateService = (updatedService: ServiceTwo) => {
        setServices((prev) =>
            prev.map((s) => (s.id === updatedService.id ? updatedService : s)),
        );
    };

    const handleDeleteService = (id: string) => {
        setServices((prev) => prev.filter((s) => s.id !== id));
    };

    // Booking Handlers
    const handleAddBooking = (
        newBookingData: Omit<BookingTwo, 'id' | 'createdAt'>,
    ) => {
        const freshBooking: BookingTwo = {
            ...newBookingData,
            id: `b_${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setBookings((prev) => [freshBooking, ...prev]);

        // Automatically increment bookingsCount for the scheduled service!
        setServices((prev) =>
            prev.map((s) => {
                if (s.id === newBookingData.serviceId) {
                    return {
                        ...s,
                        bookingsCount: s.bookingsCount + 1,
                    };
                }
                return s;
            }),
        );
    };

    const handleUpdateBookingStatus = (
        id: string,
        status: BookingTwo['status'],
    ) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status } : b)),
        );
    };

    const handleDeleteBooking = (id: string) => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
    };

    const handleUpdateProfile = (updatedProfile: AdminProfile) => {
        setAdminProfile(updatedProfile);
    };

    // Determine header search input placeholder adaptively
    const getSearchPlaceholder = () => {
        switch (activeTab) {
            case 'dashboard':
                return 'Search global operations...';
            case 'bookings':
                return 'Search bookings client registry...';
            case 'availability':
                return 'Search services...';
            case 'settings':
                return 'Search system parameters...';
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background text-on-surface">
            {/* 1. Desktop Sidebar */}
            <aside className="z-40 hidden w-64 shrink-0 flex-col border-r border-outline-variant bg-surface py-8 md:flex">
                {/* Title Brand Header */}
                <div className="mb-8 px-6">
                    <h1 className="font-sans text-2xl font-bold text-primary">
                        Slotem
                    </h1>
                    <p className="mt-0.5 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
                        Admin Suite
                    </p>
                </div>

                {/* Navigation list */}
                <nav className="flex-1 space-y-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex w-full cursor-pointer items-center px-6 py-3.5 text-sm font-medium transition-all ${
                            activeTab === 'dashboard'
                                ? 'border-r-4 border-primary bg-surface-container-low font-bold text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                        <LayoutDashboard className="mr-3" size={18} />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`flex w-full cursor-pointer items-center px-6 py-3.5 text-sm font-medium transition-all ${
                            activeTab === 'bookings'
                                ? 'border-r-4 border-primary bg-surface-container-low font-bold text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                        <Calendar className="mr-3" size={18} />
                        <span>Bookings</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('availability')}
                        className={`flex w-full cursor-pointer items-center px-6 py-3.5 text-sm font-medium transition-all ${
                            activeTab === 'availability'
                                ? 'border-r-4 border-primary bg-surface-container-low font-bold text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                        <CalendarCheck className="mr-3" size={18} />
                        <span>Availability</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex w-full cursor-pointer items-center px-6 py-3.5 text-sm font-medium transition-all ${
                            activeTab === 'settings'
                                ? 'border-r-4 border-primary bg-surface-container-low font-bold text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                        <Settings className="mr-3" size={18} />
                        <span>Settings</span>
                    </button>
                </nav>

                {/* + NEW BOOKING Action Button */}
                <div className="mt-auto px-6">
                    <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="hover:bg-opacity-95 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-on-primary shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span className="text-[11px] tracking-wider uppercase">
                            New Booking
                        </span>
                    </button>
                </div>
            </aside>

            {/* 2. Mobile Responsive Sidebar drawer */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <>
                        {/* Dark overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-[2px] md:hidden"
                        />
                        {/* Sidebar flyout */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 220,
                            }}
                            className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-surface py-8 shadow-2xl md:hidden"
                        >
                            <div className="mb-8 flex items-center justify-between px-6">
                                <div>
                                    <h1 className="font-sans text-2xl font-bold text-primary">
                                        Slotem
                                    </h1>
                                    <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                                        Admin Suite
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setIsMobileSidebarOpen(false)
                                    }
                                    className="rounded-full p-1.5 text-outline hover:bg-surface-container"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {(
                                    [
                                        'dashboard',
                                        'bookings',
                                        'availability',
                                        'settings',
                                    ] as const
                                ).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setIsMobileSidebarOpen(false);
                                        }}
                                        className={`flex w-full items-center px-6 py-3 text-sm font-medium transition-all ${
                                            activeTab === tab
                                                ? 'border-r-4 border-primary bg-surface-container-low font-bold text-primary'
                                                : 'text-on-surface-variant hover:bg-surface-container'
                                        }`}
                                    >
                                        {tab === 'dashboard' && (
                                            <LayoutDashboard
                                                className="mr-3"
                                                size={18}
                                            />
                                        )}
                                        {tab === 'bookings' && (
                                            <Calendar
                                                className="mr-3"
                                                size={18}
                                            />
                                        )}
                                        {tab === 'availability' && (
                                            <CalendarCheck
                                                className="mr-3"
                                                size={18}
                                            />
                                        )}
                                        {tab === 'settings' && (
                                            <Settings
                                                className="mr-3"
                                                size={18}
                                            />
                                        )}
                                        <span className="capitalize">
                                            {tab === 'availability'
                                                ? 'Availability'
                                                : tab}
                                        </span>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-auto px-6">
                                <button
                                    onClick={() => {
                                        setIsMobileSidebarOpen(false);
                                        setIsBookingModalOpen(true);
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-on-primary"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    <span className="text-xs tracking-wider uppercase">
                                        New Booking
                                    </span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Scaffold Container */}
            <main className="flex h-screen flex-1 flex-col overflow-hidden">
                {/* Top Header Bar */}
                <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-6 select-none">
                    {/* Logo toggle on mobile */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="cursor-pointer rounded-lg p-2 text-on-surface-variant hover:bg-surface-container md:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Active search bar */}
                        <div className="flex w-44 items-center rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 sm:w-80 md:w-96">
                            <Search
                                className="shrink-0 animate-pulse text-outline"
                                size={16}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="ml-2 w-full border-none bg-transparent text-xs font-medium text-on-surface outline-none placeholder:text-outline focus:ring-0"
                                placeholder={getSearchPlaceholder()}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-outline hover:text-on-surface"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Header Navigation Panel tools */}
                    <div className="flex items-center gap-4">
                        <button className="relative cursor-pointer rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary">
                            <Bell size={18} />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
                        </button>

                        <button className="hidden cursor-pointer rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary sm:inline-block">
                            <HelpCircle size={18} />
                        </button>

                        {/* Avatar block */}
                        <div className="flex items-center gap-3 border-l border-outline-variant pl-4 select-none">
                            <div className="hidden text-right sm:block">
                                <p className="text-xs font-bold text-on-surface">
                                    {adminProfile.name}
                                </p>
                                <p className="mt-0.5 text-[9px] leading-none tracking-tighter text-outline uppercase">
                                    {adminProfile.title}
                                </p>
                            </div>
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest">
                                <img
                                    className="h-full w-full object-cover"
                                    src={adminProfile.avatarUrl}
                                    alt={adminProfile.name}
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Core Screen Display Scrollable Page Body */}
                <div className="custom-scrollbar flex-1 overflow-y-auto bg-background p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                {activeTab === 'dashboard' && (
                                    <DashboardView
                                        services={services}
                                        bookings={bookings}
                                        onCreateBookingClick={() =>
                                            setIsBookingModalOpen(true)
                                        }
                                        onCreateServiceClick={() => {
                                            setActiveTab('availability');
                                        }}
                                        onNavigateToTab={(tab) =>
                                            setActiveTab(tab)
                                        }
                                    />
                                )}

                                {activeTab === 'bookings' && (
                                    <BookingsView
                                        bookings={bookings}
                                        onUpdateBookingStatus={
                                            handleUpdateBookingStatus
                                        }
                                        onDeleteBooking={handleDeleteBooking}
                                        searchQuery={searchQuery}
                                    />
                                )}

                                {activeTab === 'availability' && (
                                    <ServicesView
                                        services={services}
                                        onAddService={handleAddService}
                                        onUpdateService={handleUpdateService}
                                        onDeleteService={handleDeleteService}
                                        searchQuery={searchQuery}
                                    />
                                )}

                                {activeTab === 'settings' && (
                                    <SettingsView
                                        adminProfile={adminProfile}
                                        onUpdateProfile={handleUpdateProfile}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* New Booking Dialog Modal */}
            <NewBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                services={services}
                onAddBooking={handleAddBooking}
            />
        </div>
    );
}
