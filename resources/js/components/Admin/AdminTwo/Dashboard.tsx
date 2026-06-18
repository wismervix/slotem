import React, { useMemo } from 'react';
import {
    Users,
    CalendarCheck,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldCheck,
    Mail,
} from 'lucide-react';
import { UserThree, BookingThree } from '@/types';

interface DashboardProps {
    users: UserThree[];
    bookings: BookingThree[];
    onNavigateToTab: (tab: string) => void;
}

export default function Dashboard({
    users,
    bookings,
    onNavigateToTab,
}: DashboardProps) {
    // Compute analytics
    const activeUsersCount = useMemo(
        () => users.filter((u) => u.status === 'Active').length,
        [users],
    );
    const pendingUsersCount = useMemo(
        () => users.filter((u) => u.status === 'Pending').length,
        [users],
    );
    const confirmedBookingsCount = useMemo(
        () => bookings.filter((b) => b.status === 'Confirmed').length,
        [bookings],
    );
    const pendingBookingsCount = useMemo(
        () => bookings.filter((b) => b.status === 'Pending').length,
        [bookings],
    );

    // Registrations over last few months (mock timeline)
    const registrationTimeline = [
        { month: 'Oct', count: 180 },
        { month: 'Nov', count: 210 },
        { month: 'Dec', count: 195 },
        { month: 'Jan', count: 240 },
        { month: 'Feb', count: 228 },
        { month: 'Mar', count: 248 },
    ];

    // SVG Chart parameters
    const maxVal = Math.max(...registrationTimeline.map((t) => t.count)) * 1.1;
    const chartHeight = 140;
    const chartWidth = 500;
    const points = registrationTimeline.map((t, idx) => {
        const x = (idx / (registrationTimeline.length - 1)) * chartWidth;
        const y = chartHeight - (t.count / maxVal) * chartHeight;
        return { x, y, ...t };
    });

    const pathD =
        points.length > 0
            ? `M ${points[0].x} ${points[0].y} ` +
              points
                  .slice(1)
                  .map((p) => `L ${p.x} ${p.y}`)
                  .join(' ')
            : '';

    const areaD =
        points.length > 0
            ? `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
            : '';

    // Calculate service distribution
    const serviceDistribution = useMemo(() => {
        const counts: Record<string, number> = {};
        bookings.forEach((b) => {
            counts[b.service] = (counts[b.service] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [bookings]);

    const maxServiceCount = Math.max(
        ...serviceDistribution.map((s) => s.count),
        1,
    );

    return (
        <div className="animate-fade-in space-y-8">
            {/* Page header and premium welcome banner */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-on-surface">
                        Dashboard Overview
                    </h2>
                    <p className="mt-0.5 font-sans text-sm text-on-surface-variant">
                        Operational intelligence feeds, booking metrics, and
                        active client acquisition logs.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-low px-4 py-2 text-xs">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-on-surface-variant">
                        Automatic refresh Active
                    </span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                </div>
            </div>

            {/* Hero Stats bento box */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Metric 1 */}
                <div className="flex flex-col justify-between rounded-2xl border border-outline-variant/70 bg-surface-container-low p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Users className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+12.5%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase">
                            Total Active Users
                        </p>
                        <h4 className="text-2.5xl mt-1 font-sans font-bold text-on-surface">
                            {activeUsersCount}
                        </h4>
                        <div className="mt-2.5 flex items-center justify-between border-t border-outline-variant/30 pt-2.5 text-xs">
                            <span className="text-outline">
                                Active profiles today
                            </span>
                            <button
                                onClick={() => onNavigateToTab('users')}
                                className="flex items-center gap-0.5 font-medium text-primary hover:underline"
                            >
                                <span>View clients</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col justify-between rounded-2xl border border-outline-variant/70 bg-surface-container-low p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-800">
                            <AlertCircle className="h-5 w-5 text-yellow-700" />
                        </div>
                        {pendingUsersCount > 0 ? (
                            <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">
                                Needs Review
                            </span>
                        ) : (
                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                Fully Verified
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase">
                            Pending Approvals
                        </p>
                        <h4 className="text-2.5xl mt-1 font-sans font-bold text-on-surface">
                            {pendingUsersCount}
                        </h4>
                        <div className="mt-2.5 flex items-center justify-between border-t border-outline-variant/30 pt-2.5 text-xs">
                            <span className="text-outline">
                                Awaiting registration moderation
                            </span>
                            {pendingUsersCount > 0 ? (
                                <button
                                    onClick={() => onNavigateToTab('users')}
                                    className="flex items-center gap-0.5 font-medium text-primary hover:underline"
                                >
                                    <span>Moderate</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </button>
                            ) : (
                                <span className="font-medium text-outline">
                                    All clear!
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="flex flex-col justify-between rounded-2xl border border-outline-variant/70 bg-surface-container-low p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800">
                            <CalendarCheck className="h-5 w-5 text-indigo-700" />
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                            <span>94.8% SLA</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase">
                            Confirmed Bookings
                        </p>
                        <h4 className="text-2.5xl mt-1 font-sans font-bold text-on-surface">
                            {confirmedBookingsCount}
                        </h4>
                        <div className="mt-2.5 flex items-center justify-between border-t border-outline-variant/30 pt-2.5 text-xs">
                            <span className="text-outline">
                                {pendingBookingsCount} requests left pending
                            </span>
                            <button
                                onClick={() => onNavigateToTab('bookings')}
                                className="flex items-center gap-0.5 font-medium text-primary hover:underline"
                            >
                                <span>Schedules</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="flex flex-col justify-between rounded-2xl border border-outline-variant/70 bg-surface-container-low p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-800">
                            <ShieldCheck className="h-5 w-5 text-green-700" />
                        </div>
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            Online
                        </span>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold tracking-widest text-on-surface-variant/70 uppercase">
                            Platform Status
                        </p>
                        <h4 className="text-2.5xl mt-1 font-sans font-bold text-green-700 text-on-surface">
                            Healthy
                        </h4>
                        <div className="mt-2.5 flex items-center justify-between border-t border-outline-variant/30 pt-2.5 text-xs">
                            <span className="text-outline">
                                Secure API server link active
                            </span>
                            <span className="font-semibold text-outline">
                                C-Tier #49
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual analytics segment (Charts) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Line Chart */}
                <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-xs lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-on-surface">
                                Client Registrations Trend
                            </h3>
                            <p className="text-xs text-on-surface-variant">
                                Cumulative customer base over time
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs">
                                <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
                                <span className="text-on-surface-variant">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full">
                        {/* SVG custom graph */}
                        <svg
                            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                            className="w-full overflow-visible"
                        >
                            <defs>
                                <linearGradient
                                    id="gradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#630ed4"
                                        stopOpacity="0.25"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#630ed4"
                                        stopOpacity="0.0"
                                    />
                                </linearGradient>
                            </defs>

                            {/* Grid Lines */}
                            <line
                                x1="0"
                                y1={chartHeight * 0.25}
                                x2={chartWidth}
                                y2={chartHeight * 0.25}
                                stroke="#eae5f4"
                                strokeDasharray="3,3"
                            />
                            <line
                                x1="0"
                                y1={chartHeight * 0.5}
                                x2={chartWidth}
                                y2={chartHeight * 0.5}
                                stroke="#eae5f4"
                                strokeDasharray="3,3"
                            />
                            <line
                                x1="0"
                                y1={chartHeight * 0.75}
                                x2={chartWidth}
                                y2={chartHeight * 0.75}
                                stroke="#eae5f4"
                                strokeDasharray="3,3"
                            />

                            {/* Area */}
                            <path d={areaD} fill="url(#gradient)" />

                            {/* Line */}
                            <path
                                d={pathD}
                                fill="none"
                                stroke="#630ed4"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Point Circles */}
                            {points.map((p, idx) => (
                                <g
                                    key={idx}
                                    className="group/dot cursor-pointer"
                                >
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r="4"
                                        fill="#ffffff"
                                        stroke="#630ed4"
                                        strokeWidth="2.5"
                                        className="group-hover/dot:r-6 transition-all group-hover/dot:fill-[#630ed4]"
                                    />
                                    {/* Tooltip on hover */}
                                    <title>{`${p.month}: ${p.count} users`}</title>
                                </g>
                            ))}
                        </svg>

                        {/* X-axis labels */}
                        <div className="mt-3 flex justify-between px-1 font-mono text-[11px] font-semibold text-outline">
                            {registrationTimeline.map((t, idx) => (
                                <span key={idx}>{t.month}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dynamic Service Bookings Distribution */}
                <div className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-white p-6 shadow-xs lg:col-span-2">
                    <div>
                        <h3 className="mb-1 text-sm font-semibold text-on-surface">
                            Booked Services Popularity
                        </h3>
                        <p className="mb-6 text-xs text-on-surface-variant">
                            Reservation occurrences counted by business focus
                        </p>
                    </div>

                    <div className="space-y-4">
                        {serviceDistribution.length === 0 ? (
                            <div className="py-8 text-center text-xs text-outline">
                                No active bookings in catalog to display.
                            </div>
                        ) : (
                            serviceDistribution.map((serv, index) => {
                                const fraction = serv.count / maxServiceCount;
                                return (
                                    <div key={index} className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="max-w-[200px] truncate pr-2 font-medium text-on-surface-variant">
                                                {serv.name}
                                            </span>
                                            <span className="font-bold text-on-surface">
                                                {serv.count} bookings
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-surface-container-low">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all duration-500"
                                                style={{
                                                    width: `${Math.max(fraction * 100, 8)}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-6 border-t border-outline-variant/50 pt-4 text-center">
                        <button
                            onClick={() => onNavigateToTab('bookings')}
                            className="text-xs font-semibold text-primary hover:underline"
                        >
                            Configure Service Slots & Bookings →
                        </button>
                    </div>
                </div>
            </div>

            {/* Audit Trails / Urgent items */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* User Status Summary Card */}
                <div className="flex items-start gap-4 rounded-2xl border border-outline-variant/70 bg-surface-container-low p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold tracking-wider text-outline uppercase">
                            Account Retention
                        </h4>
                        <p className="mt-1 text-xl font-bold text-on-surface">
                            98.2% Active
                        </p>
                        <p className="mt-1 text-xs text-on-surface-variant">
                            Suspended:{' '}
                            {
                                users.filter((u) => u.status === 'Suspended')
                                    .length
                            }{' '}
                            profiles under block action keys.
                        </p>
                    </div>
                </div>

                {/* Quick action: Message Pending clients */}
                <div className="flex items-start gap-4 rounded-2xl border border-outline-variant/70 bg-surface-container-low p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold tracking-wider text-outline uppercase">
                            Quick Actions
                        </h4>
                        <p className="mt-1 text-xl font-bold text-on-surface">
                            Awaiting Users
                        </p>
                        <p className="mt-1.5 text-xs text-on-surface-variant">
                            Send verification requests to {pendingUsersCount}{' '}
                            unapproved accounts directly.
                        </p>
                    </div>
                </div>

                {/* Security Certificate Status */}
                <div className="flex items-start gap-4 rounded-2xl border border-outline-variant/70 bg-surface-container-low p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold tracking-wider text-outline uppercase">
                            Storage Integrity
                        </h4>
                        <p className="mt-1 text-xl font-bold text-on-surface">
                            Local Sandbox
                        </p>
                        <p className="mt-1 text-xs text-on-surface-variant">
                            Storage footprint healthy with standard browser
                            offline cache.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
