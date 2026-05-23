import UserLayout from '@/layouts/User/UserLayout';
import { DEFAULT_APPOINTMENTS } from '@/data/appointments';
import { DEFAULT_NOTIFICATIONS } from '@/data/notifications';
import { DEFAULT_PROFILE } from '@/data/profile';
import { Appointment, NotificationItem, UserProfile } from '@/types';
import { useState } from 'react';
import DashboardView from '@/components/User/DashboardView';
import {
    Calendar,
    Users,
    Clock,
    ShieldCheck,
    ArrowUpRight,
    Sparkles,
    Stethoscope,
    Scissors,
    Smile,
    TrendingUp,
    CheckCircle,
    XCircle,
    Eye,
    Settings,
    Flame,
    ChevronRight,
    Bookmark,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '@inertiajs/react';

export default function UserDashboard() {
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

    const [isBookModalOpen, setIsBookModalOpen] = useState(false);

    // Direct quick schedule helper from Dashboard recommendations
    const handleScheduleQuickSlot = (presetIdx: number, forcedDate: string) => {
        setSelectedDate(forcedDate);
        setIsBookModalOpen(true);
    };

        const [chartSource, setChartSource] = useState<
                'all' | 'dental' | 'wellness'
            >('all');
            const [checkedGoals, setCheckedGoals] = useState<Record<string, boolean>>({
                'Tooth Scaling': true,
                'Muscles Relief': false,
                'Annual Physical': false,
            });
        
            const toggleGoal = (id: string) => {
                setCheckedGoals((prev) => ({ ...prev, [id]: !prev[id] }));
            };
        
            const activeAppts = appointments.filter((a) => a.status === 'Confirmed');
            const pendingAppts = appointments.filter((a) => a.status === 'Pending');
        
            // Interactive quick slots
            const QUICK_RECS = [
                {
                    title: 'Dental Assessment',
                    subtitle: 'Dr. Jenkins · Smile Clinic',
                    tag: 'Dental',
                    date: '2026-05-22',
                    time: '10:00 AM',
                    color: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900',
                    actionPreset: 0, // Dental preset
                },
                {
                    title: 'Deep Tissue Recovery',
                    subtitle: 'Mia Wright · Zen Room',
                    tag: 'Wellness',
                    date: '2026-05-24',
                    time: '04:15 PM',
                    color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900',
                    actionPreset: 1, // Massage preset
                },
                {
                    title: 'Skin Consultation',
                    subtitle: 'Dermatologist Specialist',
                    tag: 'Consultation',
                    date: '2026-05-25',
                    time: '11:00 AM',
                    color: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900',
                    actionPreset: 3, // Skin Care preset
                },
            ];
        
            // Calculated SVG chart points based on choice
            const getChartData = () => {
                switch (chartSource) {
                    case 'dental':
                        return [2, 1, 3, 2, 4, 3, 2, 5, 2, 3, 4, 4];
                    case 'wellness':
                        return [1, 2, 2, 1, 3, 4, 3, 2, 4, 3, 5, 6];
                    default: // all
                        return [3, 4, 6, 4, 7, 8, 5, 9, 7, 8, 10, 11];
                }
            };
        
            const chartPoints = getChartData();
            const maxVal = Math.max(...chartPoints, 12);
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
        
            const upcomingAppointments = [
                {
                    icon: Stethoscope,
                    service: 'Therapeutic Massage',
                    provider: 'Dr. Sarah Jenkins',
                    date: 'Oct 24, 2023',
                    time: '10:30 AM',
                    color: 'bg-surface-container-high',
                },
                {
                    icon: Scissors,
                    service: 'Premium Haircut',
                    provider: 'Michael Rossi',
                    date: 'Oct 28, 2023',
                    time: '02:15 PM',
                    color: 'bg-surface-container-high',
                },
            ];
        
            const history = [
                {
                    service: 'Dental Cleaning',
                    provider: 'Smile Dental Lab',
                    date: 'Oct 12, 2023',
                    status: 'Completed',
                    statusColor: 'bg-green-100 text-green-800',
                },
                {
                    service: 'Skin Consultation',
                    provider: 'Dermacare Studio',
                    date: 'Sep 28, 2023',
                    status: 'Cancelled',
                    statusColor: 'bg-red-100 text-red-800',
                },
                {
                    service: 'Yoga Session',
                    provider: 'Zen Flow Center',
                    date: 'Sep 15, 2023',
                    status: 'Completed',
                    statusColor: 'bg-green-100 text-green-800',
                },
                {
                    service: 'Car Service',
                    provider: 'AutoPro Garage',
                    date: 'Aug 30, 2023',
                    status: 'Completed',
                    statusColor: 'bg-green-100 text-green-800',
                },
            ];
        
            return (
                <UserLayout>
                    <div className="h-full space-y-6 overflow-y-auto pr-1 pb-10">
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
                                        {profile.name.split(' ')[0]}
                                    </span>
                                    , you currently have{' '}
                                    <strong className="text-white underline">
                                        {activeAppts.length}
                                    </strong>{' '}
                                    active consultations and wellness
                                    appointments scheduled for this cycle. Keep
                                    healthy!
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
                                        Confirmed
                                    </p>
                                    <h4 className="mt-0.5 text-xl font-extrabold text-gray-900 dark:text-white">
                                        {activeAppts.length}
                                    </h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4 transition-colors hover:border-tertiary dark:bg-neutral-900">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed/30 text-tertiary">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">
                                        Total Spent
                                    </p>
                                    <h4 className="mt-0.5 text-xl font-extrabold text-gray-900 dark:text-white">
                                        $
                                        {appointments.reduce(
                                            (sum, item) =>
                                                sum + (item.price || 0),
                                            0,
                                        )}
                                    </h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4 transition-colors hover:border-emerald-500 dark:bg-neutral-900">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">
                                        Account Rank
                                    </p>
                                    <h4 className="text-md mt-0.5 font-extrabold text-emerald-700 dark:text-emerald-400">
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

                                    <div className="flex rounded-lg bg-neutral-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                                        <button
                                            onClick={() =>
                                                setChartSource('all')
                                            }
                                            className={`rounded-md px-2.5 py-1 transition-all ${chartSource === 'all' ? 'bg-white text-primary shadow-xs dark:bg-neutral-900' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            All Slots
                                        </button>
                                        <button
                                            onClick={() =>
                                                setChartSource('dental')
                                            }
                                            className={`rounded-md px-2.5 py-1 transition-all ${chartSource === 'dental' ? 'bg-white text-primary shadow-xs dark:bg-neutral-900' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            Dental
                                        </button>
                                        <button
                                            onClick={() =>
                                                setChartSource('wellness')
                                            }
                                            className={`rounded-md px-2.5 py-1 transition-all ${chartSource === 'wellness' ? 'bg-white text-primary shadow-xs dark:bg-neutral-900' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            Wellness
                                        </button>
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
                                            d={
                                                `M 0,${chartHeight} L ` +
                                                svgAreaPath
                                            }
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
                                                (val / maxVal) *
                                                    (chartHeight - 15);
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
                                                <stop
                                                    offset="0%"
                                                    stopColor="#7c3aed"
                                                />
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

                            {/* Health Goal/Checklist section */}
                            <div className="space-y-4 rounded-xl border border-outline-variant bg-white p-5 dark:bg-neutral-900">
                                <div>
                                    <p className="text-xs font-semibold text-secondary">
                                        LIFESTYLE COMPLIANCE
                                    </p>
                                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                                        Active Treatment Goals
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        {
                                            id: 'Tooth Scaling',
                                            title: 'Dental Plaque Scaling & Clean',
                                            note: 'Every 6 months / SMILE CLINIC',
                                        },
                                        {
                                            id: 'Muscles Relief',
                                            title: 'Thoracic Deep Massage',
                                            note: 'Every month / ZEN WELLNESS',
                                        },
                                        {
                                            id: 'Annual Physical',
                                            title: 'Complete Health Screening',
                                            note: 'Annual physical / APEX CLINIC',
                                        },
                                    ].map((goal) => (
                                        <div
                                            key={goal.id}
                                            onClick={() => toggleGoal(goal.id)}
                                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                                                checkedGoals[goal.id]
                                                    ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/10'
                                                    : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                                            }`}
                                        >
                                            <div
                                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                                    checkedGoals[goal.id]
                                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                {checkedGoals[goal.id] && (
                                                    <CheckCircle className="h-4 w-4 shrink-0" />
                                                )}
                                            </div>
                                            <div>
                                                <h4
                                                    className={`text-xs font-bold ${checkedGoals[goal.id] ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}
                                                >
                                                    {goal.title}
                                                </h4>
                                                <p className="mt-0.5 text-[10px] font-medium text-gray-500">
                                                    {goal.note}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px bg-outline-variant" />
                                <div className="rounded-lg bg-gray-50 p-2.5 text-center text-[11px] leading-normal text-gray-400 dark:bg-neutral-800/80">
                                    Staying compliant with treatments extends
                                    policy rewards and lowers diagnostic
                                    margins.
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
                                    href={route('user.bookings')}
                                    className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline"
                                >
                                    All Availability
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {QUICK_RECS.map((rec, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col justify-between space-y-4 rounded-xl border p-4 shadow-xs transition-transform hover:-translate-y-0.5 ${rec.color}`}
                                    >
                                        <div className="space-y-1">
                                            <span className="rounded-full bg-white/60 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase dark:bg-neutral-900/60">
                                                {rec.tag}
                                            </span>
                                            <h4 className="pt-1 text-sm font-bold text-gray-900 dark:text-white">
                                                {rec.title}
                                            </h4>
                                            <p className="text-xs font-medium opacity-80">
                                                {rec.subtitle}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="text-[10px] font-bold">
                                                <p className="opacity-60">
                                                    DATE & TIME
                                                </p>
                                                <p className="text-gray-800 dark:text-white">
                                                    {rec.date} · {rec.time}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleScheduleQuickSlot(
                                                        rec.actionPreset,
                                                        rec.date,
                                                    )
                                                }
                                                className="flex shrink-0 items-center gap-1 rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-[11px] font-extrabold text-gray-900 shadow-xs hover:bg-gray-50 dark:bg-neutral-900 dark:text-white"
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
                            <section className="col-span-12 flex flex-col gap-4 lg:col-span-7">
                                <div className="flex items-center justify-between text-on-surface dark:text-on-surface-dark">
                                    <h2 className="text-2xl font-bold">
                                        Upcoming Appointments
                                    </h2>
                                    <button className="text-xs font-medium text-primary hover:underline">
                                        View All
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {upcomingAppointments.map((apt, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: idx * 0.1 + 0.4,
                                            }}
                                            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-outline-variant-dark dark:bg-surface-container-highest dark:shadow-black/20 dark:hover:bg-surface-container-high"
                                        >
                                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`flex h-14 w-14 items-center justify-center rounded-xl ${apt.color} text-primary dark:bg-surface-accent-dark dark:ring-1 dark:ring-white/5`}
                                                    >
                                                        <apt.icon size={28} />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-lg font-semibold text-on-surface">
                                                            {apt.service}
                                                        </h4>

                                                        <p className="text-sm text-on-surface-variant">
                                                            {apt.provider}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
                                                            Date
                                                        </span>

                                                        <span className="font-semibold text-on-surface">
                                                            {apt.date}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
                                                            Time
                                                        </span>

                                                        <span className="font-semibold text-on-surface">
                                                            {apt.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button className="rounded-xl border border-outline-variant bg-surface-container-low p-2 text-secondary transition-all hover:bg-surface-container-high hover:text-primary dark:border-outline-variant-dark dark:bg-surface-container-high dark:text-on-surface-variant dark:hover:bg-surface-accent-dark dark:hover:text-primary">
                                                        <Clock size={18} />
                                                    </button>

                                                    <button className="rounded-xl border border-error/20 bg-transparent p-2 text-error transition-all hover:bg-error-container dark:border-error/30 dark:hover:bg-red-500/10">
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* History */}
                            <section className="col-span-12 flex flex-col gap-4 lg:col-span-5">
                                <h2 className="text-2xl font-bold text-on-surface dark:text-on-surface-dark">
                                    Booking History
                                </h2>

                                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest dark:border-outline-variant dark:bg-surface-container-low">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-outline-variant bg-surface-container-low dark:border-outline-variant dark:bg-surface-container">
                                                <th className="px-4 py-3 text-xs font-medium text-on-surface-variant uppercase">
                                                    Service
                                                </th>
                                                <th className="px-4 py-3 text-xs font-medium text-on-surface-variant uppercase">
                                                    Date
                                                </th>
                                                <th className="px-4 py-3 text-xs font-medium text-on-surface-variant uppercase">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-outline-variant/30 dark:divide-outline-variant/50">
                                            {history.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="transition-colors hover:bg-surface-container dark:hover:bg-surface-container-high"
                                                >
                                                    <td className="px-4 py-4">
                                                        <span className="block text-sm font-semibold text-on-surface">
                                                            {row.service}
                                                        </span>

                                                        <span className="text-xs text-on-surface-variant">
                                                            {row.provider}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4 text-sm text-on-surface">
                                                        {row.date}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.statusColor}`}
                                                        >
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="bg-surface-container-low p-3 text-center dark:bg-surface-container">
                                        <button className="text-sm font-semibold text-primary hover:underline">
                                            Download Report
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </UserLayout>
            );
}
