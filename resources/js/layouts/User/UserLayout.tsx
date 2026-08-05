import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import Footer from '@/components/User/Footer';
import Sidebar from '@/components/User/Sidebar';
import BookModal from '@/components/User/BookingModal';
import {
    Plus,
    Search,
    CalendarDays,
    Info,
    AlertCircle,
    CheckCircle,
    Clock,
    Ban,
    XCircle,
    UserCheck,
    ShieldCheck,
    Paintbrush,
    Calendar,
} from 'lucide-react';
import { Booking, Service, Availability } from '@/types';
import { getServiceIcon, getServiceTheme } from '@/lib/service-icons';
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
    handleCancelAppointment?: (booking: Booking) => void;
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
    handleCancelAppointment = () => {},
    headerActions = null,
}: Props) {
    const { openModal } = useBookingModalContext();

    const { services } = usePage<{ services: Service[] }>().props;

    const { availabilities } = usePage<{ availabilities: Availability[] }>()
        .props;

    const mostPopularService =
        services.find((s) => s.badges?.includes('popular')) ?? services[0];

    const nowPlus24h = new Date();
    nowPlus24h.setHours(nowPlus24h.getHours() + 24);

    const getClosestAvailableSlot = () => {
        const sorted = [...availabilities].sort((a, b) =>
            a.date.localeCompare(b.date),
        );

        for (const day of sorted) {
            const dayDate = new Date(day.date);

            // must be at least 24h ahead
            if (dayDate < nowPlus24h) continue;

            const availableSlot = day.time_slots.find(
                (slot) => !slot.is_booked,
            );

            if (availableSlot) {
                return {
                    date: day.date,
                    slot: availableSlot,
                };
            }
        }

        return null;
    };

    const isBookingsPage = route().current('user.bookings');
    const isDashboardPage = route().current('user.dashboard');
    const isProfilePage = route().current('user.profile');
    // const isNotificationsPage = route().current('user.notifications');
    // const [isBookModalOpen, setIsBookModalOpen] = useState(false);

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Handler functions

    // Helper function to check if a booking can be cancelled
    const canCancelBooking = (booking: Booking): boolean => {
        // Can't cancel if already cancelled or completed
        if (
            booking.status === 'cancelled' ||
            booking.status === 'completed' ||
            booking.status === 'rejected'
        ) {
            return false;
        }

        // Check if the booking is at least 24 hours away
        const appointmentDateTime = new Date(
            `${booking.date}T${booking.start_time}`,
        );
        const now = new Date();
        const hoursDiff =
            (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        return hoursDiff >= 24;
    };

    // Helper to get booking status display info
    const getBookingStatusInfo = (booking: Booking) => {
        switch (booking.status) {
            case 'pending':
                return {
                    label: 'Pending Approval',
                    icon: <AlertCircle className="h-3 w-3" />,
                    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50',
                };
            case 'approved':
                return {
                    label: 'Confirmed',
                    icon: <CheckCircle className="h-3 w-3" />,
                    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50',
                };
            case 'completed':
                return {
                    label: 'Completed',
                    icon: <CheckCircle className="h-3 w-3" />,
                    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50',
                };
            case 'cancelled':
                return {
                    label: 'Cancelled',
                    icon: <XCircle className="h-3 w-3" />,
                    color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800/50',
                };
            case 'rejected':
                return {
                    label: 'Rejected',
                    icon: <XCircle className="h-3 w-3" />,
                    color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/50',
                };
            default:
                return {
                    label: booking.status,
                    icon: null,
                    color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800/50',
                };
        }
    };

    // Helper to render the appropriate CTA button for a booking
    const renderBookingAction = (booking: Booking) => {
        const statusInfo = getBookingStatusInfo(booking);
        const isCancellable = canCancelBooking(booking);

        // If booking is completed, show a "Completed" badge with no action
        if (booking.status === 'completed') {
            return (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-xs font-bold text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                    Booking Completed
                </div>
            );
        }

        // If booking is cancelled, show a "Cancelled" badge with no action
        if (booking.status === 'cancelled') {
            return (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 py-2 text-xs font-bold text-gray-700 dark:bg-gray-950/20 dark:text-gray-400">
                    <XCircle className="h-4 w-4" />
                    Booking Cancelled
                </div>
            );
        }

        // If booking is rejected, show a "Rejected" badge with no action
        if (booking.status === 'rejected') {
            return (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-xs font-bold text-red-700 dark:bg-red-950/20 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    Booking Rejected
                </div>
            );
        }

        // If booking is pending, show a "Pending Approval" badge with no action
        if (booking.status === 'pending') {
            return (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-50 py-2 text-xs font-bold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    Awaiting Approval
                </div>
            );
        }

        // If booking is approved but not cancellable (less than 24h away)
        if (booking.status === 'approved' && !isCancellable) {
            return (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-50 py-2 text-xs font-bold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                    <Clock className="h-4 w-4" />
                    Cannot Cancel (within 24h)
                </div>
            );
        }

        // If booking is approved and cancellable, show the cancel button
        if (booking.status === 'approved' && isCancellable) {
            return (
                <button
                    type="button"
                    onClick={() => handleCancelAppointment(booking)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200/40 bg-red-50 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-transparent dark:bg-red-950/20 dark:hover:bg-red-900/30"
                >
                    <Ban className="h-4 w-4" />
                    Cancel Booking
                </button>
            );
        }

        // Fallback: show the cancel button if somehow we get here
        return (
            <button
                type="button"
                onClick={() => handleCancelAppointment(booking)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200/40 bg-red-50 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-transparent dark:bg-red-950/20 dark:hover:bg-red-900/30"
            >
                <Ban className="h-4 w-4" />
                Cancel Booking
            </button>
        );
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
    const selectedDateBookings = bookings.filter(
        (booking) =>
            booking.date.split('T')[0] === selectedDate &&
            booking.status !== 'cancelled' &&
            booking.status !== 'rejected',
    );

    const bookingHistory = bookings
        .filter(
            (booking) =>
                booking.status === 'completed' &&
                booking.date <= new Date().toISOString().split('T')[0],
        )
        .sort((b, a) => b.date.localeCompare(a.date));

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
                        {isBookingsPage && (
                            <>
                                {/* Real Search Input bar */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search booking appointments..."
                                        className="w-full rounded-xl border border-outline-variant bg-white py-2.5 pr-4 pl-9 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
                                    />
                                </div>
                                {/* View Switcher is renderable only on the bookings tab */}
                                {headerActions}
                            </>
                        )}
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
                                        const statusInfo =
                                            getBookingStatusInfo(booking);

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

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">
                                                                {
                                                                    booking
                                                                        .service
                                                                        ?.name
                                                                }
                                                            </h4>
                                                            <span
                                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-bold ${statusInfo.color}`}
                                                            >
                                                                {
                                                                    statusInfo.icon
                                                                }
                                                                {
                                                                    statusInfo.label
                                                                }
                                                            </span>
                                                        </div>

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

                                                {/* Render the appropriate action button */}
                                                {renderBookingAction(booking)}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <hr className="border-outline-variant dark:border-neutral-800" />

                            {/* Upcoming Bookings matches the screenshot exactly */}
                            <div className="min-h-[300px] flex-grow space-y-3 overflow-y-auto pr-1">
                                <h3 className="text-xs font-black tracking-wider text-gray-500 uppercase">
                                    Booking History
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {bookingHistory.length === 0 ? (
                                        <p className="py-4 text-center text-[10px] font-bold text-gray-400 italic">
                                            No booking history available.
                                        </p>
                                    ) : (
                                        bookingHistory
                                            // .slice(0, 3)
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
                                            Need a dynamic appointment?
                                        </p>
                                        <p className="text-[9px] text-indigo-200">
                                            Instant slots available for this
                                            week
                                        </p>
                                        <button
                                            onClick={() => {
                                                onSelectDate(
                                                    selectedDate ??
                                                        '2026-10-27',
                                                );
                                                const result =
                                                    getClosestAvailableSlot();

                                                if (!result) return;

                                                const serviceId =
                                                    mostPopularService.id;

                                                onSelectDate(result.date);

                                                openModal(
                                                    result.date,
                                                    result.slot.id,
                                                    serviceId,
                                                );
                                            }}
                                            className="cursor-pointer rounded-xl bg-white px-4 py-2 text-[10px] font-black text-primary shadow-sm transition-all hover:bg-neutral-100"
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
