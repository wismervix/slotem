import { motion } from 'motion/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight,
    Plus,
    Users,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import { BookingTwo, HolidayOverride, DailySlots, SidebarTab } from '@/types';

interface DashboardViewProps {
    bookings: BookingTwo[];
    holidays: HolidayOverride[];
    dailySlots: DailySlots;
    setCurrentTab: (tab: SidebarTab) => void;
    onNewBookingClick: () => void;
}

export default function DashboardView({
    bookings,
    holidays,
    dailySlots,
    setCurrentTab,
    onNewBookingClick,
}: DashboardViewProps) {
    // Compute metrics dynamically from shared state
    const activeBookings = bookings.filter((b) => b.status === 'Confirmed');
    const pendingBookings = bookings.filter((b) => b.status === 'Pending');
    const totalSlotsDefined = Object.values(dailySlots).reduce(
        (sum, slots) => sum + slots.length,
        0,
    );
    const occupancyPercentage =
        totalSlotsDefined > 0
            ? Math.round((activeBookings.length / totalSlotsDefined) * 100)
            : 0;

    // Next 4 upcoming bookings chronological listing
    const sortedUpcoming = [...bookings]
        .filter((b) => b.status !== 'Cancelled')
        .sort((a, b) => {
            // Simple date + time sort approximation
            const valA = `${a.date} ${a.time}`;
            const valB = `${b.date} ${b.time}`;
            return valA.localeCompare(valB);
        })
        .slice(0, 4);

    // Distribution of weekdays simulated data for beautifully stylized SVG bar chart
    const weekDistribution = [
        { day: 'Mon', count: 14, percent: 70 },
        { day: 'Tue', count: 18, percent: 90 },
        { day: 'Wed', count: 16, percent: 80 },
        { day: 'Thu', count: 12, percent: 60 },
        { day: 'Fri', count: 20, percent: 100 },
    ];

    return (
        <div id="dashboard-view" className="space-y-gutter">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6">
                <div className="pointer-events-none absolute top-0 right-0 flex h-full w-1/3 items-center justify-center opacity-10">
                    <Sparkles className="h-40 w-40 text-primary" />
                </div>
                <div className="max-w-2xl">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-primary uppercase">
                        Suite Active
                    </span>
                    <h2 className="text-h2 mt-2 font-heading font-bold text-on-surface">
                        Welcome back, Slotem Administrator
                    </h2>
                    <p className="text-body-md mt-1 text-on-surface-variant">
                        Your booking systems are live and synchronizing. You
                        have {pendingBookings.length} pending appointment
                        requests that require attention.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            onClick={onNewBookingClick}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition-all hover:bg-primary-container active:scale-95"
                        >
                            <Plus className="h-4 w-4" /> Add Quick Appointment
                        </button>
                        <button
                            onClick={() => setCurrentTab('Availability')}
                            className="flex items-center gap-1.5 rounded-lg border border-outline-variant bg-white px-4 py-2 text-xs font-semibold text-on-surface-variant transition-all hover:bg-surface-container"
                        >
                            Configure Schedule{' '}
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid of 4 Key Metric Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Active Appts */}
                <div className="flex items-start justify-between rounded-xl border border-outline-variant bg-white p-5 shadow-xs">
                    <div>
                        <p className="text-xs font-medium tracking-wider text-on-surface-variant/80 uppercase">
                            Confirmed Bookings
                        </p>
                        <h3 className="mt-1.5 text-3xl font-bold text-on-surface">
                            {activeBookings.length}
                        </h3>
                        <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" /> +12% vs last
                            week
                        </span>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                        <CheckCircle className="h-5 w-5" />
                    </div>
                </div>

                {/* Card 2: Occupancy Rate */}
                <div className="flex items-start justify-between rounded-xl border border-outline-variant bg-white p-5 shadow-xs">
                    <div>
                        <p className="text-xs font-medium tracking-wider text-on-surface-variant/80 uppercase">
                            Occupancy Rate
                        </p>
                        <h3 className="mt-1.5 text-3xl font-bold text-on-surface">
                            {occupancyPercentage}%
                        </h3>
                        <div className="bg-gray-150 mt-3 h-1.5 w-24 overflow-hidden rounded-full">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{
                                    width: `${Math.min(occupancyPercentage, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-3 text-primary">
                        <Users className="h-5 w-5" />
                    </div>
                </div>

                {/* Card 3: Total Available Slots */}
                <div className="flex items-start justify-between rounded-xl border border-outline-variant bg-white p-5 shadow-xs">
                    <div>
                        <p className="text-xs font-medium tracking-wider text-on-surface-variant/80 uppercase">
                            Total Slots Active
                        </p>
                        <h3 className="mt-1.5 text-3xl font-bold text-on-surface">
                            {totalSlotsDefined}
                        </h3>
                        <span className="mt-2 block font-mono text-[11px] text-on-surface-variant">
                            Configured dynamically
                        </span>
                    </div>
                    <div className="rounded-lg bg-indigo-50 p-3 text-indigo-700">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>

                {/* Card 4: Holiday Overrides Active */}
                <div className="flex items-start justify-between rounded-xl border border-outline-variant bg-white p-5 shadow-xs">
                    <div>
                        <p className="text-xs font-medium tracking-wider text-on-surface-variant/80 uppercase">
                            Holiday Restrictions
                        </p>
                        <h3 className="mt-1.5 text-3xl font-bold text-on-surface">
                            {holidays.length}
                        </h3>
                        <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                            <AlertTriangle
                                className="h-3.5 w-3.5"
                                strokeWidth={2.5}
                            />{' '}
                            Prevents double book
                        </span>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Bento Layout: Main content area */}
            <div className="gap-gutter grid grid-cols-1 lg:grid-cols-12">
                {/* Left Side: Weekly Traffic Graph & Quick schedule overview */}
                <div className="space-y-6 lg:col-span-7">
                    <div className="rounded-xl border border-outline-variant bg-white p-5 shadow-xs">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h4 className="text-base font-semibold text-on-surface">
                                    Weekly Slot Load Distribution
                                </h4>
                                <p className="mt-0.5 text-xs text-on-surface-variant">
                                    Capacity allocated by week day routinely
                                </p>
                            </div>
                            <span className="rounded bg-primary/5 px-2 py-1 font-mono text-xs font-semibold text-primary">
                                MON - FRI
                            </span>
                        </div>

                        {/* SVG Interactive Chart */}
                        <div className="flex h-44 items-end justify-between border-b border-outline-variant/30 px-2 pt-4">
                            {weekDistribution.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group flex flex-1 flex-col items-center"
                                >
                                    <div className="relative flex h-32 w-full max-w-[40px] items-end rounded-t-md bg-indigo-50 transition-all hover:bg-primary/15">
                                        {/* Hover state pill */}
                                        <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-on-surface px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                                            {item.count} slots
                                        </div>
                                        {/* Filled bar */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{
                                                height: `${item.percent}%`,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                delay: idx * 0.1,
                                            }}
                                            className="w-full rounded-t-md bg-primary transition-colors hover:bg-primary-container"
                                        />
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-on-surface-variant">
                                        {item.day}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4 pt-1 text-xs text-on-surface-variant">
                            <span>
                                * Automated by time-slot allocation engine (30 /
                                60 min increments)
                            </span>
                            <button
                                onClick={() => setCurrentTab('Availability')}
                                className="flex items-center gap-1 font-semibold text-primary hover:underline"
                            >
                                Go to settings{' '}
                                <ArrowUpRight className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Upcoming Bookings Chronological Timeline */}
                <div className="lg:col-span-5">
                    <div className="flex h-full flex-col justify-between rounded-xl border border-outline-variant bg-white p-5 shadow-xs">
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-base font-semibold text-on-surface">
                                    Next Upcoming Appointments
                                </h4>
                                <button
                                    onClick={() => setCurrentTab('Bookings')}
                                    className="text-xs font-semibold text-primary hover:underline"
                                >
                                    View All
                                </button>
                            </div>

                            {sortedUpcoming.length === 0 ? (
                                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant p-4 text-center">
                                    <Calendar className="mb-2 h-8 w-8 text-on-surface-variant/40" />
                                    <p className="text-sm font-medium text-on-surface-variant">
                                        No upcoming slots booked
                                    </p>
                                    <p className="mt-1 text-xs text-on-surface-variant/70">
                                        Check settings or manually make a new
                                        booking
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3.5">
                                    {sortedUpcoming.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-start justify-between rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 transition-colors hover:border-primary/35"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-semibold text-on-surface">
                                                        {booking.clientName}
                                                    </p>
                                                    <span
                                                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                                                            booking.status ===
                                                            'Confirmed'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <p className="line-clamp-1 text-[11px] text-on-surface-variant">
                                                    {booking.serviceName}
                                                </p>
                                                <div className="mt-1 flex items-center gap-1 font-mono text-[11px] font-medium text-on-surface-variant/80">
                                                    <Calendar className="h-3 w-3" />{' '}
                                                    {booking.date}
                                                    <span className="mx-1">
                                                        •
                                                    </span>
                                                    <Clock className="h-3 w-3" />{' '}
                                                    {booking.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-5 border-t border-outline-variant/30 pt-3">
                            <div className="flex items-center gap-3 rounded-lg border border-tertiary-container/40 bg-tertiary-container/30 p-3">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                                <span className="text-xs font-semibold text-on-tertiary-container">
                                    Next block out is Labor Day Holiday
                                    overrides on Sep 2nd.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
