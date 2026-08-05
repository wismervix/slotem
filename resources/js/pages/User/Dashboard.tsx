import { router, usePage } from '@inertiajs/react';
import UserLayout from '@/layouts/User/UserLayout';
import { Availability, Booking, Service, ServiceBadge } from '@/types';
import { useState } from 'react';
import {
    Calendar,
    Clock,
    ShieldCheck,
    ArrowUpRight,
    Sparkles,
    TrendingUp,
    CheckCircle,
    XCircle,
    HelpCircle,
    Eye,
    Flame,
    ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '@inertiajs/react';
import { getServiceIcon, getServiceIconTheme } from '@/lib/service-icons';
import { formatDateAndTime, formatTime } from '@/lib/calendar-utils';
import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/components/Shared/ConfirmationModal';
import { useBookingModalContext } from '@/contexts/BookingModalContext';

interface UserDashboardProps {
    name: String;
    bookings: Booking[];
    unreadNotificationsCount: number;
}

export default function UserDashboard({
    name,
    bookings,
    unreadNotificationsCount,
}: UserDashboardProps) {
    // ─── 1. STATE ──────────────────────────────────────────────────

    // Use the confirmation hook
    const confirmation = useConfirmation();

    const { services } = usePage<{ services: Service[] }>().props;

    const { availabilities } = usePage<{ availabilities: Availability[] }>()
        .props;

    // console.log('General Services: ', services);

    const [selectedDate, setSelectedDate] = useState<string>('2023-10-26');

    const { openModal } = useBookingModalContext();

    const performHandleCancelAppointment = (id: number) => {
        router.patch(
            route('booking.cancel', id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleCancelAppointment = (booking: Booking) => {
        confirmation.confirm({
            title: 'Cancel this booking?',
            message: `You're about to cancel ${booking.client_name}'s appointment${
                booking.service ? ` for ${booking.service.name}` : ''
            } on ${booking.date} from ${booking.start_time} to ${
                booking.end_time
            }. This cannot be undone.`,
            confirmLabel: 'Yes, Cancel Booking',
            variant: 'danger',
            onConfirm: () => performHandleCancelAppointment(booking.id),
        });
    };

    const downloadReport = () => {
        try {
            const reportUrl = route('user.bookings.report');
            const link = document.createElement('a');

            link.href = reportUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Unable to generate the booking report.', error);
            window.alert(
                'We could not start the report download right now. Please try again.',
            );
        }
    };

    const [chartSource, setChartSource] = useState<'all' | Service['id']>(
        'all',
    );

    const monthLabels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const chartPoints = monthLabels.map((_, monthIndex) => {
        return bookings.filter((booking) => {
            const bookingDate = new Date(booking.date);

            const sameMonth = bookingDate.getMonth() === monthIndex;

            const sameService =
                chartSource === 'all'
                    ? true
                    : booking.service_id === chartSource;

            return sameMonth && sameService;
        }).length;
    });
    const maxVal = Math.max(...chartPoints, 1);
    const chartHeight = 120;
    const chartWidth = 500;

    // Create beautiful spline points path for the SVG
    const svgPoints = chartPoints
        .map((val, idx) => {
            const x = (idx / 11) * chartWidth;
            const y = chartHeight - (val / maxVal) * (chartHeight - 15);
            return `${x},${y}`;
        })
        .join(' ');

    const svgAreaPath =
        chartPoints
            .map((val, idx) => {
                const x = (idx / 11) * chartWidth;
                const y = chartHeight - (val / maxVal) * (chartHeight - 15);
                return `${x},${y}`;
            })
            .join(' L ') +
        ` L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

    const recentActivity = bookings
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        )
        .slice(0, 3);

    const completedBookings = bookings.filter((a) => a.status === 'completed');
    const activeBookings = bookings.filter((a) => a.status === 'approved');
    const pendingBookings = bookings.filter((a) => a.status === 'pending');

    const totalSpent = bookings.reduce((sum, booking) => {
        return sum + (Number(booking.service?.price) ?? 0);
    }, 0);

    // Interactive quick slots
    const slotColors = [
        'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900',
        'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900',
        'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900',
    ];

    const featuredServices = [...services]
        .filter((s) => s.active !== false)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    const nowPlus24Hours = Date.now() + 24 * 60 * 60 * 1000;

    const hotSlots = availabilities
        .flatMap((a) =>
            a.time_slots
                .filter((slot) => {
                    if (slot.is_booked) return false;

                    const slotTime = new Date(
                        `${a.date}T${slot.start_time}`,
                    ).getTime();

                    return slotTime >= nowPlus24Hours;
                })
                .map((slot) => ({
                    id: slot.id,
                    date: a.date,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    availability_id: a.id,
                })),
        )
        .sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.start_time}`).getTime();
            const dateB = new Date(`${b.date} ${b.start_time}`).getTime();
            return dateA - dateB;
        })
        .slice(0, 3)
        .map((slot, idx) => ({
            ...slot,
            service: featuredServices[idx % featuredServices.length],
            color: slotColors[idx % slotColors.length],
        }));

    const upcomingBookings = bookings
        .filter(
            (booking) =>
                booking.status !== 'cancelled' &&
                booking.status !== 'rejected' &&
                booking.status !== 'completed' &&
                booking.date >= new Date().toISOString().split('T')[0],
        )
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

    // console.log('Upcoming Bookings', upcomingBookings);

    const bookingHistory = bookings
        .filter(
            (booking) =>
                booking.status === 'completed' &&
                booking.date <= new Date().toISOString().split('T')[0],
        )
        .sort((b, a) => b.date.localeCompare(a.date))
        .slice(0, 3);

    const getStatusColor = (status: string) => {
        const base =
            'shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors';

        switch (status) {
            case 'approved':
                return `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/15 dark:text-emerald-300`;

            case 'completed':
                return `${base} border-green-500/20 bg-green-500/10 text-green-600 dark:border-green-400/20 dark:bg-green-400/15 dark:text-green-300`;

            case 'rejected':
                return `${base} border-red-500/20 bg-red-500/10 text-red-600 dark:border-red-400/20 dark:bg-red-400/15 dark:text-red-300`;

            case 'cancelled':
                return `${base} border-rose-500/20 bg-rose-500/10 text-rose-600 dark:border-rose-400/20 dark:bg-rose-400/15 dark:text-rose-300`;

            case 'pending':
                return `${base} border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/15 dark:text-amber-300`;

            default:
                return `${base} border-violet-500/20 bg-violet-500/10 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/15 dark:text-violet-300`;
        }
    };

    const getEngagementIcon = (status: Booking['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-white" />;

            case 'approved':
                return <Clock className="h-4 w-4 text-white" />;

            case 'pending':
                return <Eye className="h-4 w-4 text-white" />;

            case 'cancelled':
            case 'rejected':
                return <XCircle className="h-4 w-4 text-white" />;

            default:
                return <CheckCircle className="h-4 w-4 text-white" />;
        }
    };

    return (
        <UserLayout
            unreadNotificationsCount={unreadNotificationsCount}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            handleCancelAppointment={handleCancelAppointment}
        >
            <div className="space-y-6 pr-1 pb-10">
                {/* Banner Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-container p-6 text-white shadow-md md:p-8">
                    <div className="relative z-10 max-w-xl space-y-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md">
                            Welcome to Slotem Management
                        </span>
                        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                            Active Booking Suite
                        </h2>
                        <p className="text-sm leading-relaxed text-primary-fixed opacity-90">
                            Hey{' '}
                            <span className="font-semibold text-white">
                                {name.split(' ')[0]} {name.split(' ')[1]}
                            </span>
                            , you currently have{' '}
                            <strong className="text-white underline">
                                {activeBookings.length}
                            </strong>{' '}
                            active consultations and wellness appointments
                            scheduled for this cycle. Keep healthy!
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Link
                                href={route('user.bookings')}
                                className="rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-primary shadow-sm transition-all hover:shadow-md active:scale-95"
                            >
                                Open Booking Calendar
                            </Link>
                            <Link
                                href={route('user.profile')}
                                className="rounded-lg border border-white/20 bg-primary-container/30 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10"
                            >
                                Update Preferences
                            </Link>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-1/3 opacity-15 select-none md:block">
                        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full border-4 border-white" />
                        <div className="absolute -top-5 right-10 h-32 w-32 rounded-full border-4 border-white" />
                        <div className="absolute top-1/2 left-1/3 h-24 w-24 rounded-full bg-white" />
                    </div>
                </div>

                {/* Grid statistics highlights */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4 transition-colors hover:border-primary dark:bg-neutral-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                Completed
                            </p>
                            <h4 className="mt-0.5 text-xl font-extrabold text-gray-900 dark:text-white">
                                {completedBookings.length}
                            </h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4 transition-colors hover:border-emerald-500 dark:bg-neutral-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                Total Spent
                            </p>
                            <h4 className="mt-0.5 text-xl font-extrabold text-gray-900 dark:text-emerald-400">
                                ${totalSpent}
                            </h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4 transition-colors hover:border-amber-500 dark:bg-neutral-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/20">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                Account Rank
                            </p>
                            <h4 className="text-md mt-0.5 font-extrabold text-amber-700 dark:text-amber-400">
                                Premium Gold
                            </h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4 transition-colors hover:border-blue-500 dark:bg-neutral-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/20">
                            <Flame className="h-5 w-5 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                Monthly Attendance
                            </p>
                            <h4 className="mt-0.5 text-xl font-extrabold text-gray-900 dark:text-white">
                                94.8%
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Main split: Analytics Trend vs Health Checklist */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Analytics SVG Spline chart */}
                    <div className="space-y-4 rounded-xl border border-outline-variant bg-white p-5 shadow-xs lg:col-span-2 dark:bg-neutral-900">
                        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-xs font-semibold text-secondary">
                                    SUITE INTENSITY TRENDS
                                </p>
                                <h3 className="flex items-center gap-1.5 text-base font-extrabold text-gray-900 dark:text-white">
                                    <TrendingUp className="h-4 w-4 animate-bounce text-primary" />
                                    Monthly Visit Intensifications
                                </h3>
                            </div>

                            <div className="flex flex-wrap rounded-lg bg-neutral-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                                <button
                                    onClick={() => setChartSource('all')}
                                    className={`rounded-md px-2.5 py-1 transition-all ${
                                        chartSource === 'all'
                                            ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    All
                                </button>

                                {services.slice(0, 3).map((service) => (
                                    <button
                                        key={service.id}
                                        title={service.name}
                                        onClick={() =>
                                            setChartSource(service.id)
                                        }
                                        className={`max-w-[80px] truncate rounded-md px-2.5 py-1 transition-all ${
                                            chartSource === service.id
                                                ? 'bg-white text-primary shadow-xs dark:bg-neutral-900'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {service.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full">
                            <svg
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                className="h-44 w-full overflow-visible"
                            >
                                {/* Grid Lines */}
                                <line
                                    x1="0"
                                    y1="20"
                                    x2={chartWidth}
                                    y2="20"
                                    stroke="#f0f0f0"
                                    strokeDasharray="3,3"
                                />
                                <line
                                    x1="0"
                                    y1="53"
                                    x2={chartWidth}
                                    y2="53"
                                    stroke="#f0f0f0"
                                    strokeDasharray="3,3"
                                />
                                <line
                                    x1="0"
                                    y1="86"
                                    x2={chartWidth}
                                    y2="86"
                                    stroke="#f0f0f0"
                                    strokeDasharray="3,3"
                                />
                                <line
                                    x1="0"
                                    y1={chartHeight}
                                    x2={chartWidth}
                                    y2={chartHeight}
                                    stroke="#e5e5e5"
                                />

                                {/* Area path */}
                                <path
                                    d={`M 0,${chartHeight} L ` + svgAreaPath}
                                    fill="url(#chart-gradient)"
                                    opacity="0.15"
                                />

                                {/* Spline Path */}
                                <polyline
                                    fill="none"
                                    stroke="#630ed4"
                                    strokeWidth="3.5"
                                    points={svgPoints}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Active Nodes/Interactive Tooltips */}
                                {chartPoints.map((val, idx) => {
                                    const x = (idx / 11) * chartWidth;
                                    const y =
                                        chartHeight -
                                        (val / maxVal) * (chartHeight - 15);
                                    return (
                                        <g
                                            key={idx}
                                            className="group cursor-pointer"
                                        >
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r="4.5"
                                                fill="#ffffff"
                                                stroke="#630ed4"
                                                strokeWidth="2.5"
                                            />
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r="12"
                                                fill="#630ed4"
                                                opacity="0"
                                                className="transition-all hover:opacity-10"
                                            />
                                            {/* Tooltip content that pops on point hovered */}
                                            <title>{`Month ${idx + 1}: ${val} target bookings`}</title>
                                        </g>
                                    );
                                })}

                                {/* Gradients definitions */}
                                <defs>
                                    <linearGradient
                                        id="chart-gradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop offset="0%" stopColor="#7c3aed" />
                                        <stop
                                            offset="100%"
                                            stopColor="#7c3aed"
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Months Label Row */}
                            <div className="mt-2 flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                                <span>Aug</span>
                                <span>Sep</span>
                                <span>Oct</span>
                                <span>Nov</span>
                                <span>Dec</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-outline-variant bg-white p-5 dark:bg-neutral-900">
                        <div>
                            <p className="text-xs font-semibold text-secondary">
                                BOOKING ACTIVITY
                            </p>

                            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                                Recent Engagement
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-start gap-3 rounded-lg border bg-neutral-50 p-3 dark:bg-neutral-900"
                                >
                                    <div
                                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                            booking.status === 'completed'
                                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                                : booking.status === 'approved'
                                                  ? 'border-blue-500 bg-blue-500 text-white'
                                                  : 'border-amber-500 bg-amber-500 text-white'
                                        }`}
                                    >
                                        {getEngagementIcon(booking.status)}
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="truncate text-xs font-bold text-gray-900 dark:text-white">
                                            {booking.service?.name}
                                        </h4>

                                        <p className="mt-0.5 text-[10px] font-medium text-gray-500">
                                            {formatDateAndTime(booking.date)} ·{' '}
                                            {booking.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-outline-variant" />

                        <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-neutral-800/80">
                            <p className="text-xs font-bold text-primary">
                                {completedBookings.length} completed
                            </p>

                            <p className="mt-1 text-[11px] text-gray-500">
                                {pendingBookings.length} pending ·{' '}
                                {activeBookings.length} active bookings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommended Doctors/Slots Near Thee */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-base font-extrabold text-gray-900 dark:text-white">
                            <Sparkles className="h-4 w-4 fill-amber-500 text-amber-500" />
                            1-Click Available Hot-Slots Today
                        </h3>

                        <Link
                            href={route('services')}
                            className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline"
                        >
                            All Availability
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {hotSlots.map((slot) => (
                            <div
                                key={slot.id}
                                className={`group relative flex flex-col justify-between space-y-4 rounded-xl border p-4 shadow-xs transition-transform hover:-translate-y-0.5 ${slot.color}`}
                                // className="group relative flex flex-col justify-between space-y-4 rounded-xl border border-outline-variant bg-white p-4 shadow-xs transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900/60"
                            >
                                {/* TAG */}
                                <div className="space-y-1">
                                    <ServiceBadges
                                        badges={
                                            slot.service?.badges ?? ['popular']
                                        }
                                    />
                                    {/* <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-emerald-600 uppercase dark:text-emerald-300">
                                        Available
                                    </span> */}

                                    <h4 className="pt-1 text-sm font-bold text-gray-900 dark:text-white">
                                        {slot.service?.name ?? 'Open Slot'}
                                    </h4>

                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {slot.service?.description ??
                                            'Book instantly before someone else takes it'}
                                    </p>
                                </div>

                                {/* TIME */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-[10px] font-bold">
                                        <p className="opacity-60">
                                            DATE & TIME
                                        </p>
                                        <p className="flex flex-wrap items-center gap-2 text-gray-800 dark:text-white">
                                            <span>{slot.date}</span>
                                            <span aria-hidden="true">·</span>
                                            <span>
                                                {formatTime(slot.start_time)} -{' '}
                                                {formatTime(slot.end_time)}
                                            </span>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            openModal(
                                                slot.date,
                                                slot.id,
                                                slot.service?.id,
                                            )
                                        }
                                        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-[11px] font-extrabold text-gray-900 shadow-xs hover:bg-on-surface-variant dark:bg-neutral-900 dark:text-white dark:hover:bg-on-surface-variant-dark"
                                    >
                                        Book
                                        <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Upcoming */}
                    <section className="col-span-12 flex flex-col gap-5 lg:col-span-7">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight text-on-surface dark:text-zinc-100">
                                Upcoming Appointments
                            </h2>

                            <Link
                                href={route('user.bookings')}
                                className="dark:primary text-xs font-medium text-primary transition hover:underline hover:opacity-80"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            {upcomingBookings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-outline-variant bg-white p-12 text-center dark:bg-neutral-900">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-neutral-800">
                                        <HelpCircle className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                        No upcoming booking appointments
                                    </h4>
                                    <p className="max-w-xs text-xs leading-normal text-secondary">
                                        Try creating a brand new appointment!
                                    </p>
                                    <button
                                        onClick={() => {
                                            openModal();
                                        }}
                                        className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white"
                                    >
                                        Start New Appointment
                                    </button>
                                </div>
                            ) : (
                                upcomingBookings.map((booking, idx) => {
                                    const IconComponent = getServiceIcon(
                                        booking.service?.icon,
                                    );

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                            className="group rounded-2xl border border-zinc-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-black/30 dark:hover:bg-zinc-900/80"
                                        >
                                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                                {/* LEFT */}
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={getServiceIconTheme(
                                                            booking.service
                                                                ?.icon ?? '',
                                                        )}
                                                    >
                                                        <IconComponent
                                                            size={26}
                                                        />
                                                    </div>

                                                    <div className="max-w-[120px] min-w-0">
                                                        <h4
                                                            title={
                                                                booking.service
                                                                    ?.name ??
                                                                'No service name'
                                                            }
                                                            className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                                                        >
                                                            {booking.service
                                                                ?.name ??
                                                                'No service name'}
                                                        </h4>

                                                        <p
                                                            title={
                                                                booking.service
                                                                    ?.description ??
                                                                'No description'
                                                            }
                                                            className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400"
                                                        >
                                                            {booking.service
                                                                ?.description ??
                                                                'No description'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* MIDDLE */}
                                                <div className="flex items-center gap-10">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                                            Date
                                                        </span>

                                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {new Intl.DateTimeFormat(
                                                                'en-US',
                                                                {
                                                                    weekday:
                                                                        'short',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                },
                                                            ).format(
                                                                new Date(
                                                                    booking.date,
                                                                ),
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                                            Time
                                                        </span>

                                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
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
                                                </div>

                                                {/* ACTIONS */}
                                                <div className="flex gap-2 opacity-80 transition group-hover:opacity-100">
                                                    <button
                                                        onClick={() =>
                                                            openModal(
                                                                booking.date,
                                                                booking.time_slot_id,
                                                                booking.service
                                                                    ?.id,
                                                            )
                                                        }
                                                        title="Reschedule Booking"
                                                        className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                                                    >
                                                        <Clock size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            handleCancelAppointment(
                                                                booking,
                                                            );
                                                        }}
                                                        title="Cancel Booking"
                                                        className="cursor-pointer rounded-xl border border-red-500/20 bg-transparent p-2 text-red-500 transition hover:bg-red-500/10 dark:border-red-400/20 dark:text-red-400 dark:hover:bg-red-500/10"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* History */}
                    <section className="col-span-12 flex flex-col gap-4 lg:col-span-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
                                Booking History
                            </h2>

                            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-outline-variant/40 to-transparent dark:from-white/10" />
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-black/30">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-outline-variant/40 bg-surface-container-low/80 dark:border-white/10 dark:bg-white/[0.03]">
                                        <th className="px-4 py-4 text-[11px] font-semibold tracking-widest text-on-surface-variant uppercase dark:text-zinc-400">
                                            Service
                                        </th>

                                        <th className="px-4 py-4 text-[11px] font-semibold tracking-widest text-on-surface-variant uppercase dark:text-zinc-400">
                                            Date
                                        </th>

                                        <th className="px-4 py-4 text-[11px] font-semibold tracking-widest text-on-surface-variant uppercase dark:text-zinc-400">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-outline-variant/20 dark:divide-white/5">
                                    {bookingHistory.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-4 text-center text-sm text-on-surface-variant dark:text-zinc-400">
                                                No booking history available.
                                            </td>
                                        </tr>
                                    ) : (
                                        bookingHistory.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className="group transition-all duration-200 hover:bg-surface-container-low dark:hover:bg-white/[0.03]"
                                            >
                                                <td className="max-w-[220px] px-4 py-4">
                                                    <div className="min-w-0">
                                                        <span
                                                            title={
                                                                row.service
                                                                    ?.name
                                                            }
                                                            className="block truncate text-sm font-semibold text-on-surface dark:text-zinc-100"
                                                        >
                                                            {row.service?.name}
                                                        </span>

                                                        <span
                                                            title={
                                                                row.service
                                                                    ?.description ??
                                                                'No description'
                                                            }
                                                            className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant dark:text-zinc-400"
                                                        >
                                                            {
                                                                row.service
                                                                    ?.description
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-on-surface dark:text-zinc-300">
                                                        {new Intl.DateTimeFormat(
                                                            'en-US',
                                                            {
                                                                weekday:
                                                                    'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            },
                                                        ).format(
                                                            new Date(row.date),
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center ${getStatusColor(
                                                            row.status,
                                                        )}`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            <div className="border-t border-outline-variant/30 bg-surface-container-low/60 p-4 text-center dark:border-white/10 dark:bg-white/[0.02]">
                                <button
                                    onClick={downloadReport}
                                    className="cursor-pointer text-sm font-semibold text-primary transition-all hover:underline hover:opacity-80"
                                >
                                    Download Report
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={confirmation.close}
                    onConfirm={confirmation.handleConfirm}
                    title={confirmation.options?.title || ''}
                    message={confirmation.options?.message || ''}
                    confirmLabel={confirmation.options?.confirmLabel}
                    cancelLabel={confirmation.options?.cancelLabel}
                    variant={confirmation.options?.variant}
                    isLoading={confirmation.isLoading}
                />
            </div>
        </UserLayout>
    );
}

export function ServiceBadges({ badges }: { badges?: ServiceBadge[] }) {
    if (!badges?.length) {
        return null;
    }

    const styles = {
        popular:
            'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
        recommended:
            'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
        'best-value':
            'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    };

    const labels = {
        popular: 'Popular',
        recommended: 'Recommended',
        'best-value': 'Best Value',
    };

    const [first, ...rest] = badges;

    return (
        <div className="inline-flex flex-col items-start">
            {/* Always visible badge */}
            <span
                className={`z-10 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold transition ${
                    styles[first]
                }`}
            >
                {labels[first]}
            </span>

            {/* Hidden badges (shown on hover) */}
            {rest.length > 0 && (
                <div className="pointer-events-none absolute top-[1%] right-[2%] z-20 mt-2 flex translate-y-1 flex-col gap-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    {rest.map((badge) => (
                        <span
                            key={badge}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide ${
                                styles[badge]
                            }`}
                        >
                            {labels[badge]}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
