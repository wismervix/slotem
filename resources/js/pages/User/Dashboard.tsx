import UserLayout from '@/layouts/User/UserLayout';
import {
    Stethoscope,
    Calendar,
    Scissors,
    Clock,
    XCircle,
    Star,
    Bell,
} from 'lucide-react';
import { motion } from 'motion/react';
import './dashboard.css';

const stats = [
    {
        label: 'Total Bookings',
        value: '24',
        trend: '+2 this month',
        trendColor: 'text-tertiary',
    },
    {
        label: 'Points Earned',
        value: '1,250',
        icon: Star,
        iconColor: 'text-tertiary',
    },
    { label: 'Next Session', value: 'In 2d', subtitle: 'Thursday' },
];

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

export default function UserDashboard() {
    return (
        <UserLayout>
            <div className="bg-surface-bright min-h-screen flex-grow p-8">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-on-surface">
                            Welcome back, Alex
                        </h1>
                        <p className="text-lg text-on-surface-variant">
                            Here's what's happening with your schedule today.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button className="rounded-full p-2 transition-colors hover:bg-surface-container">
                                <Bell size={24} />
                                <span className="bg-error absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-surface"></span>
                            </button>
                        </div>
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIqR5j3HkgsRsWCC8kW3FBMess1TdUhS4HhOcFVaaekZSljfHrzT0wAKb4gLAbzyM6sIEHZb0EuCKZL3cEwsE6hqdCX4FvkBZemHUdbXKq1Leu8TFfK33wshgsyPl0K-_4ckDoRwc-vctKhdRD3mfcFF_xmUdhkkrSoHXwx1hWfXbE4Iib6VIjRhAXMHENTJozagxCbpd0dqGrNZm0j5nzlJU2MEiOWyNQupE9HBVRCtAKN1u1xvwcQIIRz8M9YSMYpiM9JmY6jRY"
                            alt="Alex"
                            className="h-10 w-10 rounded-full border border-outline-variant shadow-sm"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-6">
                    {/* Stats */}
                    <section className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-surface-container-lowest flex flex-col gap-2 rounded-xl border border-outline-variant p-4"
                            >
                                <span className="text-xs font-medium tracking-wider text-on-surface-variant uppercase">
                                    {stat.label}
                                </span>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        {stat.value}
                                    </span>
                                    {stat.trend && (
                                        <span
                                            className={`${stat.trendColor} mb-1 text-xs font-medium`}
                                        >
                                            {stat.trend}
                                        </span>
                                    )}
                                    {stat.icon && (
                                        <stat.icon
                                            size={18}
                                            className={`${stat.iconColor} mb-1 fill-current`}
                                        />
                                    )}
                                    {stat.subtitle && (
                                        <span className="mb-1 text-xs text-on-surface-variant">
                                            {stat.subtitle}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </section>

                    {/* Quick Action */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-on-primary-container relative col-span-12 flex flex-col justify-between overflow-hidden rounded-xl bg-primary-container p-6 shadow-lg lg:col-span-4"
                    >
                        <div className="z-10">
                            <h3 className="mb-2 text-2xl font-bold">
                                Need a service?
                            </h3>
                            <p className="mb-6 text-sm opacity-90">
                                Book your next appointment in seconds with our
                                verified specialists.
                            </p>
                        </div>
                        <button className="bg-surface-container-lowest z-10 flex w-fit items-center gap-2 rounded-lg px-6 py-3 font-bold text-primary transition-all hover:scale-105 active:scale-95">
                            <Calendar size={18} />
                            Book New Appointment
                        </button>
                        <div className="absolute -right-8 -bottom-8 rotate-12 transform opacity-20">
                            <Calendar size={120} />
                        </div>
                    </motion.section>

                    {/* Upcoming */}
                    <section className="col-span-12 flex flex-col gap-4 lg:col-span-7">
                        <div className="flex items-center justify-between text-on-surface">
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
                                    transition={{ delay: idx * 0.1 + 0.4 }}
                                    className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 transition-shadow hover:shadow-md"
                                >
                                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`h-14 w-14 rounded-lg ${apt.color} flex items-center justify-center text-primary`}
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
                                                <span className="text-xs font-medium text-on-surface-variant uppercase">
                                                    Date
                                                </span>
                                                <span className="font-semibold text-on-surface">
                                                    {apt.date}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-on-surface-variant uppercase">
                                                    Time
                                                </span>
                                                <span className="font-semibold text-on-surface">
                                                    {apt.time}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-secondary rounded-lg border border-outline-variant p-2 transition-colors hover:bg-surface-container-high">
                                                <Clock size={18} />
                                            </button>
                                            <button className="text-error border-error/20 rounded-lg border p-2 transition-colors hover:bg-error-container">
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
                        <h2 className="text-2xl font-bold text-on-surface">
                            Booking History
                        </h2>
                        <div className="bg-surface-container-lowest overflow-hidden rounded-xl border border-outline-variant">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-outline-variant bg-surface-container-low">
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
                                <tbody className="divide-y divide-outline-variant/30">
                                    {history.map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className="transition-colors hover:bg-surface-container"
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
                            <div className="bg-surface-container-low p-3 text-center">
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
