import { router } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import Footer from '@/components/User/Footer';
import Sidebar from '@/components/User/Sidebar';
import BookModal from '@/components/User/BookingModal';
import {
    Plus,
    Search,
    CalendarDays,
    Info,
    Smile,
    Sparkles,
    Clock,
    Ban,
    Scissors,
    UserCheck,
    ShieldCheck,
    Paintbrush,
    Calendar,
} from 'lucide-react';
import { Booking, ServiceIcon } from '@/types';
import {
    getServiceIcon,
    getServiceTheme,
    serviceIcons,
} from '@/lib/service-icons';
import { formatTime } from '@/lib/calendar-utils';
import { useBookingModalContext } from '@/contexts/BookingModalContext';

interface Props {
    children: ReactNode;
    bookings?: Booking[];
    unreadNotificationsCount?: number;
    selectedDate?: string; // YYYY-MM-DD
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    onSelectDate?: (date: string) => void;
    handleRescheduleAppointment?: (id: number) => void;
    handleCancelAppointment?: (id: number) => void;
    handleAddNewAppointment?: (newAppt: {}) => void;
    headerActions?: ReactNode;
}

export default function UserLayout({
    children,
    bookings = [],
    unreadNotificationsCount = 0,
    selectedDate = '',
    searchQuery = '',
    setSearchQuery = () => {},
    onSelectDate = () => {},
    handleRescheduleAppointment = () => {},
    handleCancelAppointment = () => {},
    handleAddNewAppointment = () => {},
    headerActions = null,
}: Props) {
    const isBookingsPage = route().current('user.bookings');
    const isDashboardPage = route().current('user.dashboard');
    const isProfilePage = route().current('user.profile');
    // const isNotificationsPage = route().current('user.notifications');
    // const [isBookModalOpen, setIsBookModalOpen] = useState(false);

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Handler functions
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
    const selectedDateBookings = bookings.filter(
        (booking) =>
            booking.date.split('T')[0] === selectedDate &&
            booking.status !== 'cancelled' &&
            booking.status !== 'rejected',
    );

    const upcomingBookings = bookings
        .filter(
            (booking) =>
                booking.status !== 'cancelled' &&
                booking.status !== 'rejected' &&
                booking.date >= new Date().toISOString().split('T')[0],
        )
        .sort((a, b) => a.date.localeCompare(b.date));

    const { isOpen, slotId, serviceId, date, closeModal, openModal } =
        useBookingModalContext();

    return (
        <div className="flex min-h-screen flex-col bg-[#fef7ff] font-sans text-gray-900 antialiased transition-colors duration-200 md:flex-row dark:bg-neutral-950 dark:text-neutral-100">
            <Sidebar
                mobileSidebarOpen={mobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
                unreadNotificationsCount={unreadNotificationsCount}
            />

            <main className="motion-safe:animate-in motion-safe:fade-in flex h-screen flex-grow flex-col overflow-hidden duration-500">
                {/* Main top header bar with search and title matching the layout */}
                <header className="flex shrink-0 flex-col items-start justify-between gap-4 border-b border-outline-variant bg-white/40 p-6 backdrop-blur-md lg:flex-row lg:items-center dark:border-neutral-800 dark:bg-neutral-900/40">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-black tracking-tight text-gray-900 capitalize dark:text-white">
                            {isBookingsPage
                                ? 'My Bookings'
                                : isDashboardPage
                                  ? 'Dashboard Overview'
                                  : isProfilePage
                                    ? 'Profile Settings'
                                    : 'Notifications'}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                            {isBookingsPage ? (
                                <span>October 2023</span>
                            ) : isDashboardPage ? (
                                <span>Overview Analytics</span>
                            ) : isProfilePage ? (
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
                                placeholder="Search booking appointments..."
                                className="w-full rounded-xl border border-outline-variant bg-white py-2.5 pr-4 pl-9 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
                            />
                        </div>

                        {/* View Switcher is renderable only on the bookings tab */}
                        {isBookingsPage && headerActions}
                    </div>
                </header>
                {/* Central screen content viewport */}
                <div className="flex flex-grow overflow-hidden">
                    <section className="flex-grow overflow-y-auto bg-[#fcf8ff] p-6 dark:bg-neutral-950/20">
                        {children}

                        <Footer />
                    </section>

                    {/* Right Sidebar Details panel (Shown on 'bookings' tab to match the screenshot layout exactly) */}
                    {isBookingsPage && (
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
                                    selectedDateBookings.map((booking) => {
                                        const IconComponent = getServiceIcon(
                                            booking.service?.icon,
                                        );

                                        return (
                                            <div
                                                key={booking.id}
                                                className="space-y-3 rounded-xl border border-outline-variant bg-gray-50/50 p-4 dark:bg-neutral-800/30"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary select-none">
                                                        {
                                                            <IconComponent className="h-4 w-4" />
                                                        }
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">
                                                            {
                                                                booking.service
                                                                    ?.name
                                                            }
                                                        </h4>

                                                        <p className="max-w-[160px] truncate text-[10px] font-medium text-gray-500">
                                                            {
                                                                booking.service
                                                                    ?.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-1 text-[10px] leading-normal font-semibold text-secondary">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />

                                                        <span>
                                                            {formatTime(
                                                                booking.start_time,
                                                            )}{' '}
                                                            -{' '}
                                                            {formatTime(
                                                                booking.end_time,
                                                            )}{' '}
                                                            (
                                                            {
                                                                booking.service
                                                                    ?.duration
                                                            }{' '}
                                                            mins)
                                                        </span>
                                                    </div>

                                                    <p className="text-[9px] text-gray-400">
                                                        Client:{' '}
                                                        {booking.client_name}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelAppointment(
                                                            booking.id,
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-red-200/40 bg-red-50 py-1.5 text-[10px] font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-transparent dark:bg-red-950/20 dark:hover:bg-red-900/30"
                                                >
                                                    <Ban className="h-3 w-3" />
                                                    Cancel Booking
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <hr className="border-outline-variant dark:border-neutral-800" />

                            {/* Upcoming Bookings matches the screenshot exactly */}
                            <div className="min-h-[300px] flex-grow space-y-3 overflow-y-auto pr-1">
                                <h3 className="text-xs font-black tracking-wider text-gray-500 uppercase">
                                    Upcoming Bookings
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {upcomingBookings.length === 0 ? (
                                        <p className="py-4 text-center text-[10px] font-bold text-gray-400 italic">
                                            No future sessions scheduled.
                                        </p>
                                    ) : (
                                        upcomingBookings
                                            .slice(0, 3)
                                            .map((booking) => {
                                                const IconComponent =
                                                    getServiceIcon(
                                                        booking.service?.icon,
                                                    );

                                                return (
                                                    <div
                                                        key={booking.id}
                                                        onClick={() =>
                                                            onSelectDate(
                                                                booking.date,
                                                            )
                                                        }
                                                        className="group flex cursor-pointer flex-col justify-between rounded-xl border border-outline-variant bg-white p-3.5 shadow-xs transition-all hover:border-primary hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                                                    >
                                                        <div className="mb-2 flex items-start justify-between gap-2">
                                                            <div className="flex items-center gap-2.5">
                                                                <div
                                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getServiceTheme(
                                                                        booking
                                                                            .service
                                                                            ?.icon ??
                                                                            '',
                                                                    )}`}
                                                                >
                                                                    {
                                                                        <IconComponent className="h-4 w-4" />
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <p className="max-w-[130px] truncate text-xs font-extrabold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                                                                        {
                                                                            booking
                                                                                .service
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                    <p className="max-w-[130px] truncate text-[9px] font-semibold text-gray-500">
                                                                        {
                                                                            booking
                                                                                .service
                                                                                ?.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <span className="rounded-full border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 text-[8px] font-extrabold tracking-wider text-emerald-700 uppercase dark:bg-emerald-950/20 dark:text-emerald-400">
                                                                Confirmed
                                                            </span>
                                                        </div>

                                                        <div className="mt-1 flex flex-col items-start justify-between gap-3 text-[10px] font-semibold text-secondary">
                                                            <div className="flex items-center gap-1 text-[9px]">
                                                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                                                {new Intl.DateTimeFormat(
                                                                    'en-US',
                                                                    {
                                                                        weekday:
                                                                            'long',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                    },
                                                                ).format(
                                                                    new Date(
                                                                        booking.date,
                                                                    ),
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[9px]">
                                                                <Clock className="h-3.5 w-3.5 text-primary" />
                                                                {formatTime(
                                                                    booking.start_time,
                                                                )}{' '}
                                                                -{' '}
                                                                {formatTime(
                                                                    booking.end_time,
                                                                )}{' '}
                                                                (
                                                                {
                                                                    booking
                                                                        .service
                                                                        ?.duration
                                                                }{' '}
                                                                mins)
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
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
                                                onSelectDate(selectedDate ?? '2026-10-27');
                                                openModal(selectedDate ?? '2026-10-27');
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
                onClick={() => openModal()}
                className="fixed right-6 bottom-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all hover:scale-105 hover:bg-primary-container active:scale-95 md:hidden"
                title="Schedule appointment popup"
            >
                <Plus className="h-6 w-6 shrink-0" />
            </button>

            {/* Multi-step appointment wizard modal */}
            <BookModal />
        </div>
    );
}
