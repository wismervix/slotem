
import GuestLayout from '@/layouts/Guest/GuestLayout';

import React from 'react';
import {
    Rocket,
    ArrowRight,
    LayoutDashboard,
    Calendar,
    CheckCircle,
    ExternalLink,
    MousePointerClick,
    Zap,
    Smartphone,
    Repeat,
    LineChart,
    Mail,
    BarChart3,
    Users,
    ShieldCheck,
    Briefcase,
} from 'lucide-react';

export default function FeaturesPage() {

    return (
        <GuestLayout>
            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden px-6 pt-26 pb-24 md:px-8">
                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <span className="mb-6 inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-brand-primary uppercase dark:bg-purple-500/10 dark:text-purple-400">
                            New: v2.0 Release
                        </span>
                        <h1 className="mb-6 font-sans text-5xl leading-none font-extrabold tracking-tight text-brand-dark md:text-7xl dark:text-white">
                            Everything you need to{' '}
                            <span className="text-brand-primary dark:text-purple-400">
                                manage appointments
                            </span>
                            .
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl font-sans text-lg leading-relaxed text-brand-gray md:text-xl dark:text-slate-400">
                            Eliminate scheduling friction with a modern,
                            minimalist interface designed for professional
                            efficiency and calm customer experiences.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-brand-primary/20 active:scale-95 sm:w-auto dark:bg-purple-600 dark:hover:shadow-purple-950/30"
                                onClick={() => console.log("Go To Client")}
                            >
                                Start Free Booking
                                <ArrowRight className="h-5 w-5" />
                            </button>
                            <button
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-outline px-8 py-4 text-base font-semibold text-brand-dark transition-all hover:bg-brand-container-low active:scale-95 sm:w-auto dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                                onClick={() => console.log("Go To Admin")}
                            >
                                Book a Demo (Admin)
                                <LayoutDashboard className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Feature 1: Smart Scheduling (Text/Image) */}
                <section className="border-y border-brand-outline/30 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2">
                        <div className="order-2 lg:order-1">
                            <div className="mb-4 flex items-center gap-2 text-brand-primary dark:text-purple-400">
                                <Calendar className="h-4 w-4 text-brand-primary" />
                                <span className="text-xs font-semibold tracking-widest uppercase">
                                    Automation
                                </span>
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl dark:text-white">
                                Smart Scheduling
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-brand-gray md:text-lg dark:text-slate-400">
                                Say goodbye to manual entry. Create recurring
                                schedules that repeat weekly or monthly, and
                                define custom slots with surgical precision.
                                Manage holidays and block dates with a single
                                click to ensure your personal time stays
                                protected.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 shrink-0 text-brand-primary dark:text-purple-400" />
                                    <span className="text-sm text-brand-dark md:text-base dark:text-white">
                                        Dynamic recurring event logic
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 shrink-0 text-brand-primary dark:text-purple-400" />
                                    <span className="text-sm text-brand-dark md:text-base dark:text-white">
                                        Global holiday synchronization
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 shrink-0 text-brand-primary dark:text-purple-400" />
                                    <span className="text-sm text-brand-dark md:text-base dark:text-white">
                                        Buffer time and preparation slots
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div
                            className="group relative order-1 cursor-pointer lg:order-2"
                            onClick={() => console.log("Go To Admin")}
                        >
                            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-brand-primary to-blue-500 opacity-15 blur transition duration-300 group-hover:opacity-25 dark:from-purple-600 dark:to-blue-600 dark:opacity-20 dark:group-hover:opacity-30"></div>
                            <div className="glass-card relative rounded-2xl p-4 transition-all duration-300 group-hover:translate-y-[-4px] dark:border dark:border-slate-700 dark:bg-slate-900/70">
                                <div className="absolute top-6 right-6 z-10 flex animate-pulse items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-md dark:bg-purple-600">
                                    <span>Interactive Dashboard Demo</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                </div>
                                <div
                                    className="aspect-video rounded-xl bg-cover bg-center shadow-sm"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAC1NfT1hV9Po2-E4RxYzYMnHkWkoMQD30bxx266yaNTGHF5bZMydkBMWaL3syazCjbSO4CnGxVPCW6PDLCYY1XbngKXG-Rq5K4oiMuP-IfpCPkWQE7qk_9UoZd-4h-cQGwhh2hcGgu8pQjEOvkS71faKFkg7ldkykM9N8DOf2h3KUztK3IA-ulVOcAhK-P3xDc8eGVee5tr1Nex3SKjOZDro5FqbtLhz8Vf242amNLDuhJbMaNd-G2FSBywOC39-0ddzDPS63jtQQ')",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 2: Calendar & Booking (Image/Text) */}
                <section className="py-20 dark:bg-slate-950">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2">
                        <div
                            className="group relative cursor-pointer"
                            onClick={() => console.log("Go To Client")}
                        >
                            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-blue-500 to-brand-primary opacity-15 blur transition duration-300 group-hover:opacity-25  dark:from-purple-600 dark:to-blue-600 dark:opacity-20 dark:group-hover:opacity-30"></div>
                            <div className="glass-card relative rounded-2xl p-4 transition-all duration-300 group-hover:translate-y-[-4px] dark:border dark:border-slate-700 dark:bg-slate-900/70">
                                <div className="absolute top-6 left-6 z-10 flex animate-pulse items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-md dark:bg-purple-600">
                                    <span>Interactive Booking Portal</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                </div>
                                <div
                                    className="aspect-[4/5] max-h-[500px] rounded-xl bg-cover bg-center shadow-sm"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOmuHzQywYnMhyVBXd3kBI0fH_7SLe57EmGhgo-HSdSbtiHa21iwmlAqtlcxC_mGysu0qQTikg2Le5VBGyEfbq3o891dKranNEXh5YsFLaQT04D1jzoQqkGSefEHxyuePWI7T3MeK1_CtGs6I2dW7b-cGbP5zxqpgmqyMesLt75Rzvq4mIZyOwtSLRNizMocm6g2AfZPvvwcaWtvQEBrduSg9WLTHJoXaNu_AETkGL5tbaBUxYpIWsPPnz3KaLIWcjexjxwAJZXuo')",
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 flex items-center gap-2 text-brand-primary dark:text-purple-400">
                                <MousePointerClick className="h-4 w-4 text-brand-primary dark:text-purple-400" />
                                <span className="text-xs font-semibold tracking-widest uppercase">
                                    Experience
                                </span>
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl dark:text-white">
                                Calendar &amp; Booking
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-brand-gray md:text-lg dark:text-slate-400">
                                An interactive, lightning-fast calendar that
                                delights your customers. Instant booking allows
                                clients to find and confirm appointments in
                                under 30 seconds. Real-time availability updates
                                prevent double-bookings across all your devices.
                            </p>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div
                                    className="cursor-pointer rounded-xl border border-brand-outline/40 p-4 transition-all hover:border-brand-primary hover:bg-white dark:border-slate-700 dark:hover:border-purple-500 dark:hover:bg-slate-800"
                                    onClick={() => console.log("Go To Client")}
                                >
                                    <Zap className="mb-2 h-8 w-8 text-brand-primary dark:text-purple-400" />
                                    <h4 className="mb-1 text-base font-bold text-brand-dark dark:text-white">
                                        Instant Sync
                                    </h4>
                                    <p className="text-xs text-brand-gray dark:text-slate-400">
                                        Update slots in real-time across the
                                        web.
                                    </p>
                                </div>
                                <div
                                    className="cursor-pointer rounded-xl border border-brand-outline/40 p-4 transition-all hover:border-brand-primary hover:bg-white dark:border-slate-700 dark:hover:border-purple-500 dark:hover:bg-slate-800"
                                    onClick={() => console.log("Go To Client")}
                                >
                                    <Smartphone className="mb-2 h-8 w-8 text-brand-primary dark:text-purple-400" />
                                    <h4 className="mb-1 text-base font-bold text-brand-dark dark:text-white">
                                        Mobile First
                                    </h4>
                                    <p className="text-xs text-brand-gray dark:text-slate-400">
                                        Optimized for booking on the go.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Booking Management (Bento Grid) */}
                <section className="border-y border-brand-outline/20 bg-brand-container-low/50 py-20 dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="mx-auto max-w-[1200px] px-6 md:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl dark:text-white">
                                Total Control
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-brand-gray md:text-lg dark:text-slate-400">
                                Full lifecycle management for every appointment
                                from request to completion.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Larger Card */}
                            <div
                                className="glass-card group flex cursor-pointer flex-col justify-between rounded-2xl p-8 transition-all duration-300 hover:shadow-md lg:col-span-2 dark:border dark:border-slate-700 dark:bg-slate-900/70 dark:hover:shadow-slate-950/40"
                                onClick={() => console.log("Go To Admin")}
                            >
                                <div>
                                    <div className="mb-4 flex items-start justify-between">
                                        <h3 className="text-2xl font-bold text-brand-primary group-hover:underline dark:text-purple-400">
                                            Booking Management
                                        </h3>
                                        <span className="flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-purple-600">
                                            Manage
                                            <ArrowRight className="h-2.5 w-2.5" />
                                        </span>
                                    </div>
                                    <p className="mb-6 text-sm text-brand-gray md:text-base dark:text-slate-400">
                                        View, edit, approve, or reschedule any
                                        booking with a unified interface. No
                                        more jumping between tools.
                                    </p>
                                </div>
                                <div
                                    className="h-64 rounded-xl border border-brand-outline/20 bg-cover bg-center shadow-inner transition-transform duration-500 group-hover:scale-[1.01] dark:border-slate-700"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLznul-r8FEgRnwd-3Pj5MQF1HjtpALsaPDfiTvfel5i5s--ntl0Atcjb6lUmhgwWGNS-DL6vWcj__Dj8RYwYFqpeO64_MnD7-8VB1cZ2_3zoP0yIdPe56lqFNo8gZ3agKlftZx9N8F4VH_kUZwRy3zJod_-JVegpFc4y9HI7lC7pjvRvE8qvPQNbxKv00-QgE14ra4JGDzRxszLCIHkyVw9H8-9HPpo8gZYBfJPJIlrd41VWn0kbLQBkKRozdyxIbGrd5ieuGI3Y')",
                                    }}
                                ></div>
                            </div>

                            {/* Right Small Card */}
                            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-md dark:border dark:border-slate-700 dark:bg-slate-900/70 dark:hover:shadow-slate-950/40">
                                <Repeat
                                    strokeWidth={1.5}
                                    className="mb-4 h-16 w-16 text-brand-primary dark:text-purple-400"
                                />
                                <h4 className="mb-2 text-xl font-bold text-brand-dark dark:text-white">
                                    Rescheduling
                                </h4>
                                <p className="mb-6 text-sm text-brand-gray dark:text-slate-400">
                                    Effortless drag-and-drop or click
                                    rescheduling for both admins and clients.
                                </p>
                                <button
                                    className="flex cursor-pointer items-center gap-1 text-sm font-bold text-brand-primary hover:underline dark:text-purple-400"
                                    onClick={() => console.log("Go To Admin")}
                                >
                                    Launch Admin Board
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 4: Notifications & Analytics (Alternating) */}
                <section className="bg-white py-20 dark:bg-slate-950">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2">
                        <div className="order-2 lg:order-1">
                            <div className="mb-4 flex items-center gap-2 text-brand-primary dark:text-purple-400">
                                <LineChart className="h-4 w-4 text-brand-primary dark:text-purple-400" />
                                <span className="text-xs font-semibold tracking-widest uppercase">
                                    Growth
                                </span>
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl dark:text-white">
                                Notifications &amp; Analytics
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-brand-gray md:text-lg dark:text-slate-400">
                                Keep everyone in the loop with automated email
                                confirmations and reminders. Track your business
                                growth with an admin dashboard featuring revenue
                                reports, customer retention stats, and peak
                                booking times.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-sec-bg/50 dark:bg-purple-950/40">
                                        <Mail className="h-5 w-5 text-brand-primary dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-brand-dark dark:text-white">
                                            Smart Reminders
                                        </h4>
                                        <p className="text-sm text-brand-gray dark:text-slate-400">
                                            Reduce no-shows by up to 40% with
                                            SMS & email alerts.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="group flex cursor-pointer items-start gap-4"
                                    onClick={() => console.log("Go To Admin")}
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-sec-bg/50 transition-colors group-hover:bg-brand-primary/10 dark:bg-purple-950/40 dark:group-hover:bg-purple-900/50">
                                        <BarChart3 className="h-5 w-5 text-brand-primary dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-brand-dark transition-colors group-hover:text-brand-primary dark:text-white dark:group-hover:text-purple-400">
                                            Revenue Dashboard
                                        </h4>
                                        <p className="text-sm text-brand-gray dark:text-slate-400">
                                            See exactly where your income is
                                            coming from in real time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group relative order-1 cursor-pointer lg:order-2"
                            onClick={() => console.log("Go To Admin")}
                        >
                            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-brand-primary/10 opacity-20 blur-3xl dark:bg-purple-600/20"></div>
                            <div className="glass-card relative rounded-2xl p-4 shadow-xl transition-all duration-300 group-hover:translate-y-[-4px] dark:border dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-950/40">
                                <div className="absolute top-6 right-6 z-10 flex animate-pulse items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-md dark:bg-purple-600">
                                    <span>View Active Graphs</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                </div>
                                <div
                                    className="aspect-square rounded-xl bg-cover bg-center shadow-sm"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmeqDt1ZaEuVvif81DJs1Vffb4aZMP-VDi-mITiuWdQZKuTQurjJ9t4wEoanlJJm25GCeWQg8l9OUbbWB10_bKyTjxViU4EMM9S2xE24qC5ifDAjChLZ98h6QoadMkhvlETr3QwUAPZ37-KfUK9rXawf3gt0-HCALo0ykHvzHFmM-OjDKNvRvo-rsh2BTahRU-RDuK29T8XJTZjRd118j1Y4Hy9CD4G3sM35ZaPwH7QgKhgmHhj84Kytpd4MaOPKk3WWuVk-I9VLk')",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 5: Team & Security (Full Width Cards) */}
                <section className="border-t border-brand-outline/20 bg-brand-container-low/30 py-20 dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="mx-auto max-w-[1200px] px-6 md:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Team Management */}
                            <div className="rounded-2xl border border-brand-outline/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-10 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-slaate-950/40">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 dark:bg-purple-500/10">
                                    <Users className="h-7 w-7 text-brand-primary dark:text-purple-400" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold text-brand-dark dark:text-white">
                                    Team Management
                                </h3>
                                <p className="mb-6 text-sm text-brand-gray md:text-base dark:text-slate-400">
                                    Manage multiple staff members with
                                    individual calendars and specific role
                                    permissions. Assign customers to specific
                                    team members based on expertise.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-purple-400"></span>{' '}
                                        Multiple Staff Calendars
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-purple-400"></span>{' '}
                                        Granular Permission Roles
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-purple-400"></span>{' '}
                                        Individual Availability
                                    </li>
                                </ul>
                            </div>

                            {/* Enterprise Security */}
                            <div className="rounded-2xl border border-brand-outline/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-10 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-slate-950/40">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 dark:bg-purple-500/10">
                                    <ShieldCheck className="h-7 w-7 text-brand-primary dark:text-purple-400" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold text-brand-dark dark:text-white">
                                    Enterprise Security
                                </h3>
                                <p className="mb-6 text-sm text-brand-gray md:text-base dark:text-slate-400">
                                    Your data is safe with us. We utilize
                                    bank-grade encryption and regular security
                                    audits to ensure your business and client
                                    information remains private.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-purple-400"></span>{' '}
                                        End-to-End Encryption
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-purple-400"></span>{' '}
                                        GDPR &amp; HIPAA Compliance Ready
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark dark:text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-purple-400"></span>{' '}
                                        Automatic Daily Backups
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="relative overflow-hidden bg-brand-primary px-6 py-20 text-center text-white md:px-8 dark:bg-purple-700">
                    <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h2 className="mb-6 text-3xl leading-tight font-extrabold md:text-5xl">
                            Ready to streamline your scheduling?
                        </h2>
                        <p className="mx-auto mb-10 max-w-lg text-sm opacity-90 md:text-base">
                            Join thousands of businesses already scaling with
                            Slotem. No credit card required to start.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-primary shadow-lg transition-all hover:bg-brand-bg active:scale-95 sm:w-auto dark:bg-slate-100 dark-text-purple-700 dark:hover:bg-white"
                                onClick={() =>
                                    console.log('Get Started Clicked!')
                                }
                            >
                                Get Started Now
                                <Rocket className="h-4 w-4" />
                            </button>
                            <button
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/60 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-95 sm:w-auto"
                                onClick={() =>
                                    console.log('View Enterprise Plans!')
                                }
                            >
                                View Enterprise Plans
                                <Briefcase className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
