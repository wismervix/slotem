import AdminLayout from '@/layouts/Admin/AdminLayout';
import React, { useMemo, useState } from 'react';
// import type { Html2PdfOptions } from 'html2pdf.js';
import {
    TrendingUp,
    BookOpen,
    Clock,
    CalendarDays,
    CheckCircle2,
    AlertCircle,
    Activity,
    ArrowUpRight,
    UserCheck,
    AlertTriangle,
    Download,
} from 'lucide-react';
import {
    ComposedChart,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Line,
    Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Service, Booking, BookingStatus } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { formatTime } from '@/lib/calendar-utils';

interface AdminDashboardProps {
    bookings: Booking[];
}

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
}

export default function AdminDashboard({ bookings }: AdminDashboardProps) {
    const { services } = usePage<{ services: Service[] }>().props;

    const [searchQuery, setSearchQuery] = useState('');

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Confirmation modal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        booking: Booking;
        action: BookingStatus;
    } | null>(null);

    // Handle action button clicks
    const handleActionClick = (booking: Booking, action: BookingStatus) => {
        setSelectedBooking(booking);
        setConfirmAction({ booking, action });
        setConfirmModal(true);
    };

    // Confirm and execute action
    const confirmAndExecuteAction = async () => {
        if (!confirmAction) return;

        setIsProcessing(true);
        const { booking, action } = confirmAction;

        try {
            const actionRoutes: Record<string, string> = {
                approved: `admin.bookings.approve`,
                rejected: `admin.bookings.reject`,
                completed: `admin.bookings.complete`,
                cancelled: `admin.bookings.cancel`,
                pending: `admin.bookings.restore`, // For restoring rejected bookings
            };

            const routeName = actionRoutes[action];

            if (action === 'pending') {
                // Restore action
                inertiaRouter.put(
                    route(routeName, booking.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setConfirmModal(false);
                            setConfirmAction(null);
                            setSelectedBooking(null);
                            setNotes('');
                        },
                        onError: (errors) => {
                            console.error('Action failed:', errors);
                        },
                        onFinish: () => {
                            setIsProcessing(false);
                        },
                    },
                );
            } else if (action === 'completed') {
                // Complete action with optional notes
                inertiaRouter.put(
                    route(routeName, booking.id),
                    { notes },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setConfirmModal(false);
                            setConfirmAction(null);
                            setSelectedBooking(null);
                            setNotes('');
                        },
                        onError: (errors) => {
                            console.error('Action failed:', errors);
                        },
                        onFinish: () => {
                            setIsProcessing(false);
                        },
                    },
                );
            } else {
                // Approve, Reject, Cancel actions
                inertiaRouter.put(
                    route(routeName, booking.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setConfirmModal(false);
                            setConfirmAction(null);
                            setSelectedBooking(null);
                            setNotes('');
                        },
                        onError: (errors) => {
                            console.error('Action failed:', errors);
                        },
                        onFinish: () => {
                            setIsProcessing(false);
                        },
                    },
                );
            }
        } catch (error) {
            console.error('Error executing action:', error);
            setIsProcessing(false);
        }
    };

    // Get action button label
    const getActionLabel = (action: BookingStatus): string => {
        const labels: Record<BookingStatus, string> = {
            approved: 'Approve this booking?',
            rejected: 'Reject this booking?',
            completed: 'Mark as completed?',
            cancelled: 'Cancel this booking?',
            pending: 'Restore to pending?',
        };
        return labels[action] || 'Confirm action?';
    };

    const handleUpdateBookingStatus = (id: number, status: BookingStatus) => {
        console.log('Handle Update Booking Status!');
    };

    const today = new Date().toISOString().split('T')[0];

    const todayBookings = bookings.filter((a) => a.date === today);
    const pendingBookings = bookings.filter((a) => a.status === 'pending');
    const completedBookings = bookings.filter((a) => a.status === 'completed');
    const cancelledBookings = bookings.filter((a) => a.status === 'cancelled');

    // completion rate math
    // let completionRate: number;
    let completionRate = 0;
    if (bookings.length > 0) {
        completionRate = Math.round(
            (completedBookings.length /
                (completedBookings.length + cancelledBookings.length || 1)) *
                100,
        );
        if (isNaN(completionRate) || completionRate === 0) completionRate = 0;
        // completionRate = 'No completed bookings yet!';
    }

    // 2. Charts Data
    // Weekly Load Analysis
    const weeklyLoadData = useMemo(() => {
        const result = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const dateString = date.toISOString().split('T')[0];

            const dayBookings = bookings.filter((b) => b.date === dateString);

            result.push({
                name: date.toLocaleDateString('en-US', {
                    weekday: 'short',
                }),
                date: dateString,
                bookings: dayBookings.length,
                revenue: dayBookings.reduce(
                    (total, booking) =>
                        total + Number(booking.service?.price ?? 0),
                    0,
                ),
            });
        }

        return result;
    }, [bookings]);

    // const weeklyLoadData = useMemo(() => {
    //     const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    //     // Aggregate bookings by day or distribute them realistically
    //     return [
    //         { name: 'Mon', bookings: 14, revenue: 2100 },
    //         { name: 'Tue', bookings: 18, revenue: 2900 },
    //         { name: 'Wed', bookings: 22, revenue: 3800 },
    //         { name: 'Thu', bookings: 19, revenue: 3100 },
    //         { name: 'Fri', bookings: 25, revenue: 4200 },
    //         { name: 'Sat', bookings: 8, revenue: 1400 },
    //         { name: 'Sun', bookings: 3, revenue: 450 },
    //     ];
    // }, []);

    // Services distribution data
    const COLORS = [
        '#7c3aed',
        '#6366f1',
        '#f59e0b',
        '#10b981',
        '#ec4899',
        '#14b8a6',
    ];

    const servicesDistribution = useMemo(() => {
        const counts: Record<number, { name: string; value: number }> = {};

        bookings.forEach((booking) => {
            const service = booking.service;
            if (!service) return;

            if (!counts[service.id]) {
                counts[service.id] = {
                    name: service.name,
                    value: 0,
                };
            }

            counts[service.id].value++;
        });

        return Object.values(counts)
            .map((item, index) => ({
                ...item,
                color: COLORS[index % COLORS.length],
            }))
            .sort((a, b) => b.value - a.value);
    }, [bookings]);

    // Upcoming Active schedule (filter on Pending or Confirmed and limit to 4 items)
    const upcomingQueue = useMemo(() => {
        return bookings
            .filter((b) => b.status === 'pending' || b.status === 'approved')
            .slice(0, 4);
    }, [bookings]);

    const styles = {
        pending:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
        approved:
            'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400',
        completed:
            'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400',
        cancelled:
            'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
        rejected:
            'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
    };

    const dotStyles = {
        pending: 'bg-emerald-500',
        approved: 'bg-purple-500',
        completed: 'bg-purple-500',
        cancelled: 'bg-rose-500',
        rejected: 'bg-rose-500',
    };

    // PDF Export Handler
    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            // Dynamically import html2pdf
            const html2pdf = (await import('html2pdf.js')).default;

            // Create a temporary container with the content
            const element = document.createElement('div');
            element.style.padding = '20px';
            element.style.backgroundColor = '#ffffff';
            element.style.fontFamily = 'Arial, sans-serif';

            // Title
            element.innerHTML = `
                <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 20px; color: #1f2937;">Dashboard Analytics Report</h1>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 30px;">Generated on ${new Date().toLocaleString()}</p>
 
                <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #1f2937; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">Key Metrics</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                    <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">Total Bookings</p>
                        <p style="font-size: 24px; font-weight: bold; color: #7c3aed;">${bookings.length}</p>
                        <p style="font-size: 11px; color: #10b981; margin-top: 5px;">+12% vs last month</p>
                    </div>
                    <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">Pending Tasks</p>
                        <p style="font-size: 24px; font-weight: bold; color: #f59e0b;">${pendingBookings.length}</p>
                        <p style="font-size: 11px; color: #6b7280; margin-top: 5px;">Requires approval</p>
                    </div>
                    <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; background-color: #f9fafb;">
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">Today's Load</p>
                        <p style="font-size: 24px; font-weight: bold; color: #4f46e5;">${todayBookings.length}</p>
                        <p style="font-size: 11px; color: #6b7280; margin-top: 5px;">Active meetings</p>
                    </div>
                    <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; background-color: #7c3aed;">
                        <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 10px;">Completion Rate</p>
                        <p style="font-size: 24px; font-weight: bold; color: white;">${completionRate}%</p>
                        <p style="font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 5px;">Quality benchmark</p>
                    </div>
                </div>
 
                <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #1f2937; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">Weekly Breakdown</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Day</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Bookings</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${weeklyLoadData
                            .map(
                                (day) => `
                            <tr>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">${day.name}</td>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">${day.bookings}</td>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">$${day.revenue.toLocaleString()}</td>
                            </tr>
                        `,
                            )
                            .join('')}
                    </tbody>
                </table>
 
                <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #1f2937; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">Service Distribution</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Service</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicesDistribution
                            .map(
                                (service) => `
                            <tr>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">${service.name}</td>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">${service.value}</td>
                            </tr>
                        `,
                            )
                            .join('')}
                    </tbody>
                </table>
 
                <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #1f2937; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">Recent Bookings</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Client</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Service</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Date</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; font-weight: bold;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings
                            .slice(0, 10)
                            .map(
                                (b) => `
                            <tr>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">${b.client_name}</td>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">${b.service?.name || 'N/A'}</td>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px;">${new Date(b.date).toLocaleDateString()}</td>
                                <td style="border: 1px solid #e5e7eb; padding: 10px; font-size: 12px; text-transform: capitalize;">${b.status}</td>
                            </tr>
                        `,
                            )
                            .join('')}
                    </tbody>
                </table>
            `;

            // Generate PDF
            const options = {
                margin: 10,
                filename: `dashboard-analytics-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
            } as const;

            html2pdf().set(options).from(element).save();
        } catch (error) {
            console.error('Error exporting PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const filtered = bookings.slice(0, 4).filter((booking) => {
        // Search match
        const matchesSearch =
            booking.service?.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (booking.service?.description ?? '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (booking.client_name ?? '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (booking.client_email ?? '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (booking.status ?? '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    // console.log('Bookings from backend: ', bookings);

    return (
        <AdminLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            <Activity className="h-6 w-6 animate-pulse text-purple-600" />
                            Dashboard Insights
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Real-time analytics and operating health overview.
                        </p>
                    </div>

                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/10 transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50 dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                        <Download className="h-4 w-4" />
                        {isExporting ? 'Exporting...' : 'Export Analytics'}
                    </button>

                    {/* <div className="flex gap-2">
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="cursor-pointer rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/10 transition-all hover:bg-purple-700 active:scale-95"
                        >
                            Create New Slot
                        </button>
                    </div> */}
                </div>

                {/* Bento Grid Statistics */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Bookings Card */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                                Total Bookings
                            </span>
                            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 transition-transform group-hover:scale-110 dark:bg-zinc-950 dark:text-purple-400">
                                <BookOpen className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                                {bookings.length}
                            </div>
                            <p className="mt-1 flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                                <TrendingUp className="h-3 w-3" />
                                +12% vs last month
                            </p>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                                Pending Tasks
                            </span>
                            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 transition-transform group-hover:scale-110 dark:bg-zinc-950 dark:text-amber-400">
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                                {pendingBookings.length}
                            </div>
                            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                                Requires coordinator approval
                            </p>
                        </div>
                    </div>

                    {/* Today Card */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                                Today's Load
                            </span>
                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-zinc-950 dark:text-indigo-400">
                                <CalendarDays className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-zinc-900 select-all dark:text-zinc-50">
                                {todayBookings.length}
                            </div>
                            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                                Active client meetings scheduled
                            </p>
                        </div>
                    </div>

                    {/* Completion Rate */}
                    <div className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl bg-purple-600 p-5 text-white transition-shadow hover:shadow-md dark:bg-purple-900">
                        <div className="absolute -right-3 -bottom-3 opacity-10 transition-transform group-hover:scale-120">
                            <TrendingUp className="h-24 w-24" />
                        </div>
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                                Completion Rate
                            </span>
                            <div className="rounded-xl bg-white/20 p-2 text-white dark:bg-black/20">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold select-all">
                                {completionRate}%
                            </div>
                            <p className="mt-1 text-[11px] opacity-80">
                                High standard quality benchmark
                            </p>
                        </div>
                    </div>
                </section>

                {/* Analytics Charts Grid */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Weekly load Line tracking */}
                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-0 items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    Weekly Appointment Ingestion
                                </h3>
                                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                                    Average weekly volume & transaction metrics.
                                </p>
                            </div>
                            <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-zinc-950 dark:text-purple-400">
                                Live Feed
                            </span>
                        </div>
                        <div className="mt-2 h-70">
                            {/* <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={weeklyLoadData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f3f4f6"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            borderRadius: '8px',
                                            border: 'none',
                                            color: '#fff',
                                            fontSize: '11px',
                                        }}
                                    />
                                    <Bar
                                        dataKey="bookings"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                        barSize={24}
                                    />

                                    <Bar
                                        dataKey="revenue"
                                        fill="#10b981"
                                        radius={[6, 6, 0, 0]}
                                        barSize={18}
                                        name="Revenue"
                                    />
                                </BarChart>
                            </ResponsiveContainer> */}

                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={weeklyLoadData}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 0,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="name" />

                                    <YAxis
                                        yAxisId="left"
                                        tick={{ fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={false}
                                        // label={{
                                        //     value: 'Bookings',
                                        //     angle: -90,
                                        // }}
                                    />

                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tick={{ fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                        // label={{
                                        //     value: 'Revenue ($)',
                                        //     angle: 90,
                                        // }}
                                        />

                                    <Tooltip />

                                    <Bar
                                        yAxisId="left"
                                        dataKey="bookings"
                                        fill="#8b5cf6"
                                    />

                                    <Line
                                        yAxisId="right"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Services Distribution Pie */}
                    <div className="flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                Category Popularity
                            </h3>
                            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                                Distribution of service requests.
                            </p>
                        </div>
                        <div className="relative my-2 flex h-44 items-center justify-center">
                            {servicesDistribution.length === 0 ? (
                                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                    No active bookings for breakdown.
                                </p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={servicesDistribution}
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {servicesDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [
                                                `${value} bookings`,
                                                'Volume',
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="space-y-1.5 overflow-hidden">
                            {servicesDistribution
                                .slice(0, 3)
                                .map((item, index) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <div className="flex max-w-[200px] items-center gap-1.5 truncate">
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ],
                                                }}
                                            />
                                            <span className="truncate text-zinc-600 dark:text-zinc-400">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-zinc-900 dark:text-zinc-200">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Recent Activity / Active Bookings Stream */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-0 items-center justify-between border-b border-slate-100 p-6 dark:border-zinc-800">
                        <div>
                            <h3 className="text-md font-bold text-slate-800 dark:text-zinc-100">
                                Upcoming Schedule Agenda
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
                                Quick lookup of the next scheduled bookings
                                within the system.
                            </p>
                        </div>

                        <div>
                            <Link
                                href={route('admin.bookings')}
                                className="flex cursor-pointer items-center gap-0.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400"
                            >
                                Manage List
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                            <span className="mt-4 flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 font-sans text-xs font-semibold text-purple-700 dark:bg-zinc-950 dark:text-purple-400">
                                <Clock className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                                Live schedule update
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-100 bg-slate-50 text-xs font-bold tracking-wider text-gray-400 uppercase dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4">Client Detail</th>
                                    <th className="px-6 py-4">
                                        Assigned Service
                                    </th>
                                    <th className="px-6 py-4">Date/Time</th>
                                    <th className="px-6 py-4">
                                        Booking Status
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50 text-sm dark:divide-zinc-800">
                                {filtered.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="transition-colors hover:bg-slate-50/70 dark:hover:bg-zinc-800/40"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-zinc-100">
                                                    {b.client_name}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-zinc-500">
                                                    {b.client_email}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-700 dark:text-zinc-300">
                                                    {b?.service?.name ||
                                                        'No service available'}
                                                </p>
                                                <p className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                                                    $
                                                    {b?.service?.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                    {new Intl.DateTimeFormat(
                                                        'en-US',
                                                        {
                                                            weekday: 'long',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    ).format(new Date(b.date))}
                                                </span>
                                                <span className="font-mono text-xs text-gray-400 dark:text-zinc-500">
                                                    {formatTime(b.start_time)} —{' '}
                                                    {formatTime(b.end_time)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[b.status]}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${dotStyles[b.status]}`}
                                                />
                                                {b.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            {b.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleActionClick(
                                                                b,
                                                                'approved',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-950/60"
                                                    >
                                                        Approve Booking
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleActionClick(
                                                                b,
                                                                'rejected',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {b.status === 'approved' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleActionClick(
                                                                b,
                                                                'completed',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-950/60"
                                                    >
                                                        Mark Completed
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleActionClick(
                                                                b,
                                                                'rejected',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {b.status === 'rejected' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleActionClick(
                                                                b,
                                                                'pending',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-md bg-zinc-50 px-2.5 py-1 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:bg-zinc-950/60"
                                                    >
                                                        Restore
                                                    </button>
                                                </div>
                                            )}

                                            {b.status === 'completed' && (
                                                <span className="text-xs text-gray-400 dark:text-zinc-500">
                                                    No actions needed
                                                </span>
                                            )}

                                            {b.status === 'cancelled' && (
                                                <span className="text-xs text-gray-400 dark:text-zinc-500">
                                                    No actions needed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal && confirmAction && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal(false)}
                            className="absolute inset-0 bg-on-background/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative z-20 w-full max-w-md overflow-hidden rounded-2xl bg-surface p-6 shadow-2xl dark:bg-slate-900"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-purple-950/40 dark:text-purple-400">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-center text-lg font-bold text-on-surface dark:text-white">
                                {getActionLabel(confirmAction.action)}
                            </h3>
                            <p className="mt-2 text-center text-sm text-on-surface-variant dark:text-slate-400">
                                Booking ID:{' '}
                                <span className="font-bold">
                                    #{confirmAction.booking.id}
                                </span>{' '}
                                for{' '}
                                <span className="font-bold">
                                    {confirmAction.booking.client_name}
                                </span>
                            </p>

                            {confirmAction.action === 'completed' && (
                                <div className="mt-4">
                                    <label className="mb-2 block text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                        Add Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        placeholder="Add any notes about the completed booking..."
                                        rows={3}
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface placeholder-outline/60 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                                    />
                                </div>
                            )}

                            <div className="mt-6 flex flex-col gap-2">
                                <button
                                    disabled={isProcessing}
                                    onClick={confirmAndExecuteAction}
                                    className="w-full cursor-pointer rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary shadow-md shadow-primary/20 transition-all hover:bg-primary-container disabled:opacity-50 dark:bg-purple-600 dark:shadow-purple-600/20 dark:hover:bg-purple-700"
                                >
                                    {isProcessing
                                        ? 'Processing...'
                                        : 'Confirm Action'}
                                </button>
                                <button
                                    disabled={isProcessing}
                                    onClick={() => setConfirmModal(false)}
                                    className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
