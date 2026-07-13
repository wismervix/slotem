/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LandingPageProps {
    onNavigate: (view: 'landing' | 'client' | 'admin') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-brand-bg text-brand-dark selection:bg-brand-container-low selection:text-brand-primary">
            {/* Top Banner indicating interactive mode */}
            <div className="flex items-center justify-center gap-2 bg-brand-primary px-4 py-2 text-center text-xs text-white">
                <span className="inline-block h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400"></span>
                <span>
                    <strong>Interactive Prototype:</strong> Click{' '}
                    <strong>"Start Free"</strong> or{' '}
                    <strong>"Launch App Portal"</strong> to test the real
                    calendar booking system and admin dashboard!
                </span>
            </div>

            {/* TopNavBar */}
            <header className="sticky top-0 z-50 w-full border-b border-brand-outline/40 bg-white/85 backdrop-blur-md transition-all duration-200">
                <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-8">
                    <div className="flex items-center gap-6">
                        <span
                            className="cursor-pointer font-sans text-2xl font-extrabold tracking-tight text-brand-primary"
                            onClick={() => onNavigate('landing')}
                        >
                            Slotem
                        </span>
                        <nav className="ml-8 hidden items-center gap-8 md:flex">
                            <span className="cursor-pointer border-b-2 border-brand-primary pb-1 text-sm font-semibold text-brand-primary transition-all duration-200">
                                Features
                            </span>
                            <span
                                className="cursor-pointer text-sm text-brand-gray transition-colors hover:text-brand-primary"
                                onClick={() => onNavigate('client')}
                            >
                                Booking Demo
                            </span>
                            <span
                                className="cursor-pointer text-sm text-brand-gray transition-colors hover:text-brand-primary"
                                onClick={() => onNavigate('admin')}
                            >
                                Admin Dashboard
                            </span>
                            <span className="cursor-pointer text-sm text-brand-gray transition-colors hover:text-brand-primary">
                                Pricing
                            </span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-brand-primary transition-all hover:bg-brand-container-low"
                            onClick={() => onNavigate('admin')}
                            id="btn-login"
                        >
                            Login
                        </button>
                        <button
                            className="flex cursor-pointer items-center gap-1 rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-primary/15 transition-all hover:brightness-110 active:scale-95"
                            onClick={() => onNavigate('client')}
                            id="btn-contact"
                        >
                            Launch App Portal
                            <span className="material-symbols-outlined text-sm">
                                rocket_launch
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden px-6 pt-20 pb-24 md:px-8">
                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <span className="mb-6 inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-brand-primary uppercase">
                            New: v2.0 Release
                        </span>
                        <h1 className="mb-6 font-sans text-5xl leading-none font-extrabold tracking-tight text-brand-dark md:text-7xl">
                            Everything you need to{' '}
                            <span className="text-brand-primary">
                                manage appointments
                            </span>
                            .
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl font-sans text-lg leading-relaxed text-brand-gray md:text-xl">
                            Eliminate scheduling friction with a modern,
                            minimalist interface designed for professional
                            efficiency and calm customer experiences.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-brand-primary/20 active:scale-95 sm:w-auto"
                                onClick={() => onNavigate('client')}
                            >
                                Start Free Booking
                                <span className="material-symbols-outlined">
                                    arrow_forward
                                </span>
                            </button>
                            <button
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-outline px-8 py-4 text-base font-semibold text-brand-dark transition-all hover:bg-brand-container-low active:scale-95 sm:w-auto"
                                onClick={() => onNavigate('admin')}
                            >
                                Book a Demo (Admin)
                                <span className="material-symbols-outlined">
                                    dashboard
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Feature 1: Smart Scheduling (Text/Image) */}
                <section className="border-y border-brand-outline/30 bg-white py-20">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2">
                        <div className="order-2 lg:order-1">
                            <div className="mb-4 flex items-center gap-2 text-brand-primary">
                                <span className="material-symbols-filled text-brand-primary">
                                    calendar_month
                                </span>
                                <span className="text-xs font-semibold tracking-widest uppercase">
                                    Automation
                                </span>
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl">
                                Smart Scheduling
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-brand-gray md:text-lg">
                                Say goodbye to manual entry. Create recurring
                                schedules that repeat weekly or monthly, and
                                define custom slots with surgical precision.
                                Manage holidays and block dates with a single
                                click to ensure your personal time stays
                                protected.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-filled text-xl text-brand-primary">
                                        check_circle
                                    </span>
                                    <span className="text-sm text-brand-dark md:text-base">
                                        Dynamic recurring event logic
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-filled text-xl text-brand-primary">
                                        check_circle
                                    </span>
                                    <span className="text-sm text-brand-dark md:text-base">
                                        Global holiday synchronization
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-filled text-xl text-brand-primary">
                                        check_circle
                                    </span>
                                    <span className="text-sm text-brand-dark md:text-base">
                                        Buffer time and preparation slots
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div
                            className="group relative order-1 cursor-pointer lg:order-2"
                            onClick={() => onNavigate('admin')}
                        >
                            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-brand-primary to-blue-500 opacity-15 blur transition duration-300 group-hover:opacity-25"></div>
                            <div className="glass-card relative rounded-2xl p-4 transition-all duration-300 group-hover:translate-y-[-4px]">
                                <div className="absolute top-6 right-6 z-10 flex animate-pulse items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-md">
                                    <span>Interactive Dashboard Demo</span>
                                    <span className="material-symbols-outlined text-[10px]">
                                        open_in_new
                                    </span>
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
                <section className="py-20">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2">
                        <div
                            className="group relative cursor-pointer"
                            onClick={() => onNavigate('client')}
                        >
                            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-blue-500 to-brand-primary opacity-15 blur transition duration-300 group-hover:opacity-25"></div>
                            <div className="glass-card relative rounded-2xl p-4 transition-all duration-300 group-hover:translate-y-[-4px]">
                                <div className="absolute top-6 left-6 z-10 flex animate-pulse items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-md">
                                    <span>Interactive Booking Portal</span>
                                    <span className="material-symbols-outlined text-[10px]">
                                        open_in_new
                                    </span>
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
                            <div className="mb-4 flex items-center gap-2 text-brand-primary">
                                <span className="material-symbols-filled text-brand-primary">
                                    touch_app
                                </span>
                                <span className="text-xs font-semibold tracking-widest uppercase">
                                    Experience
                                </span>
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl">
                                Calendar &amp; Booking
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-brand-gray md:text-lg">
                                An interactive, lightning-fast calendar that
                                delights your customers. Instant booking allows
                                clients to find and confirm appointments in
                                under 30 seconds. Real-time availability updates
                                prevent double-bookings across all your devices.
                            </p>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div
                                    className="cursor-pointer rounded-xl border border-brand-outline/40 p-4 transition-all hover:border-brand-primary hover:bg-white"
                                    onClick={() => onNavigate('client')}
                                >
                                    <span className="material-symbols-outlined mb-2 text-3xl text-brand-primary">
                                        bolt
                                    </span>
                                    <h4 className="mb-1 text-base font-bold text-brand-dark">
                                        Instant Sync
                                    </h4>
                                    <p className="text-xs text-brand-gray">
                                        Update slots in real-time across the
                                        web.
                                    </p>
                                </div>
                                <div
                                    className="cursor-pointer rounded-xl border border-brand-outline/40 p-4 transition-all hover:border-brand-primary hover:bg-white"
                                    onClick={() => onNavigate('client')}
                                >
                                    <span className="material-symbols-outlined mb-2 text-3xl text-brand-primary">
                                        devices
                                    </span>
                                    <h4 className="mb-1 text-base font-bold text-brand-dark">
                                        Mobile First
                                    </h4>
                                    <p className="text-xs text-brand-gray">
                                        Optimized for booking on the go.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Booking Management (Bento Grid) */}
                <section className="border-y border-brand-outline/20 bg-brand-container-low/50 py-20">
                    <div className="mx-auto max-w-[1200px] px-6 md:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl">
                                Total Control
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-brand-gray md:text-lg">
                                Full lifecycle management for every appointment
                                from request to completion.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Larger Card */}
                            <div
                                className="glass-card group flex cursor-pointer flex-col justify-between rounded-2xl p-8 transition-all duration-300 hover:shadow-md lg:col-span-2"
                                onClick={() => onNavigate('admin')}
                            >
                                <div>
                                    <div className="mb-4 flex items-start justify-between">
                                        <h3 className="text-2xl font-bold text-brand-primary group-hover:underline">
                                            Booking Management
                                        </h3>
                                        <span className="flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                                            Manage{' '}
                                            <span className="material-symbols-outlined text-[10px]">
                                                arrow_forward
                                            </span>
                                        </span>
                                    </div>
                                    <p className="mb-6 text-sm text-brand-gray md:text-base">
                                        View, edit, approve, or reschedule any
                                        booking with a unified interface. No
                                        more jumping between tools.
                                    </p>
                                </div>
                                <div
                                    className="h-64 rounded-xl border border-brand-outline/20 bg-cover bg-center shadow-inner transition-transform duration-500 group-hover:scale-[1.01]"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLznul-r8FEgRnwd-3Pj5MQF1HjtpALsaPDfiTvfel5i5s--ntl0Atcjb6lUmhgwWGNS-DL6vWcj__Dj8RYwYFqpeO64_MnD7-8VB1cZ2_3zoP0yIdPe56lqFNo8gZ3agKlftZx9N8F4VH_kUZwRy3zJod_-JVegpFc4y9HI7lC7pjvRvE8qvPQNbxKv00-QgE14ra4JGDzRxszLCIHkyVw9H8-9HPpo8gZYBfJPJIlrd41VWn0kbLQBkKRozdyxIbGrd5ieuGI3Y')",
                                    }}
                                ></div>
                            </div>

                            {/* Right Small Card */}
                            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-md">
                                <span
                                    className="material-symbols-outlined mb-4 text-[64px] text-brand-primary"
                                    style={{
                                        fontVariationSettings: "'wght' 200",
                                    }}
                                >
                                    event_repeat
                                </span>
                                <h4 className="mb-2 text-xl font-bold text-brand-dark">
                                    Rescheduling
                                </h4>
                                <p className="mb-6 text-sm text-brand-gray">
                                    Effortless drag-and-drop or click
                                    rescheduling for both admins and clients.
                                </p>
                                <button
                                    className="flex cursor-pointer items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
                                    onClick={() => onNavigate('admin')}
                                >
                                    Launch Admin Board
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 4: Notifications & Analytics (Alternating) */}
                <section className="bg-white py-20">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2">
                        <div className="order-2 lg:order-1">
                            <div className="mb-4 flex items-center gap-2 text-brand-primary">
                                <span className="material-symbols-filled text-brand-primary">
                                    insights
                                </span>
                                <span className="text-xs font-semibold tracking-widest uppercase">
                                    Growth
                                </span>
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl">
                                Notifications &amp; Analytics
                            </h2>
                            <p className="mb-8 text-base leading-relaxed text-brand-gray md:text-lg">
                                Keep everyone in the loop with automated email
                                confirmations and reminders. Track your business
                                growth with an admin dashboard featuring revenue
                                reports, customer retention stats, and peak
                                booking times.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-sec-bg/50">
                                        <span className="material-symbols-outlined text-brand-primary">
                                            mail
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-brand-dark">
                                            Smart Reminders
                                        </h4>
                                        <p className="text-sm text-brand-gray">
                                            Reduce no-shows by up to 40% with
                                            SMS & email alerts.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="group flex cursor-pointer items-start gap-4"
                                    onClick={() => onNavigate('admin')}
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-sec-bg/50 transition-colors group-hover:bg-brand-primary/10">
                                        <span className="material-symbols-outlined text-brand-primary">
                                            bar_chart
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-brand-dark transition-colors group-hover:text-brand-primary">
                                            Revenue Dashboard
                                        </h4>
                                        <p className="text-sm text-brand-gray">
                                            See exactly where your income is
                                            coming from in real time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group relative order-1 cursor-pointer lg:order-2"
                            onClick={() => onNavigate('admin')}
                        >
                            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-brand-primary/10 opacity-20 blur-3xl"></div>
                            <div className="glass-card relative rounded-2xl p-4 shadow-xl transition-all duration-300 group-hover:translate-y-[-4px]">
                                <div className="absolute top-6 right-6 z-10 flex animate-pulse items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-md">
                                    <span>View Active Graphs</span>
                                    <span className="material-symbols-outlined text-[10px]">
                                        open_in_new
                                    </span>
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
                <section className="border-t border-brand-outline/20 bg-brand-container-low/30 py-20">
                    <div className="mx-auto max-w-[1200px] px-6 md:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Team Management */}
                            <div className="rounded-2xl border border-brand-outline/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-10">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10">
                                    <span className="material-symbols-outlined text-3xl text-brand-primary">
                                        group
                                    </span>
                                </div>
                                <h3 className="mb-4 text-2xl font-bold text-brand-dark">
                                    Team Management
                                </h3>
                                <p className="mb-6 text-sm text-brand-gray md:text-base">
                                    Manage multiple staff members with
                                    individual calendars and specific role
                                    permissions. Assign customers to specific
                                    team members based on expertise.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>{' '}
                                        Multiple Staff Calendars
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>{' '}
                                        Granular Permission Roles
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>{' '}
                                        Individual Availability
                                    </li>
                                </ul>
                            </div>

                            {/* Enterprise Security */}
                            <div className="rounded-2xl border border-brand-outline/40 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-10">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10">
                                    <span className="material-symbols-outlined text-3xl text-brand-primary">
                                        verified_user
                                    </span>
                                </div>
                                <h3 className="mb-4 text-2xl font-bold text-brand-dark">
                                    Enterprise Security
                                </h3>
                                <p className="mb-6 text-sm text-brand-gray md:text-base">
                                    Your data is safe with us. We utilize
                                    bank-grade encryption and regular security
                                    audits to ensure your business and client
                                    information remains private.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>{' '}
                                        End-to-End Encryption
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>{' '}
                                        GDPR &amp; HIPAA Compliance Ready
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>{' '}
                                        Automatic Daily Backups
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="relative overflow-hidden bg-brand-primary px-6 py-20 text-center text-white md:px-8">
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
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-primary shadow-lg transition-all hover:bg-brand-bg active:scale-95 sm:w-auto"
                                onClick={() => onNavigate('client')}
                            >
                                Get Started Now
                                <span className="material-symbols-outlined text-sm">
                                    rocket
                                </span>
                            </button>
                            <button
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/60 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-95 sm:w-auto"
                                onClick={() => onNavigate('admin')}
                            >
                                View Enterprise Plans
                                <span className="material-symbols-outlined text-sm">
                                    business_center
                                </span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-auto w-full border-t border-brand-outline/30 bg-white py-8">
                <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-8">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <span className="text-xl font-extrabold tracking-tight text-brand-dark">
                            Slotem
                        </span>
                        <p className="text-xs text-brand-gray">
                            © 2026 Slotem Inc. All rights reserved.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <span className="cursor-pointer text-xs text-brand-gray transition-colors hover:text-brand-primary">
                            Privacy Policy
                        </span>
                        <span className="cursor-pointer text-xs text-brand-gray transition-colors hover:text-brand-primary">
                            Terms of Service
                        </span>
                        <span className="cursor-pointer text-xs text-brand-gray transition-colors hover:text-brand-primary">
                            Cookies
                        </span>
                        <span className="cursor-pointer text-xs text-brand-gray transition-colors hover:text-brand-primary">
                            Status
                        </span>
                        <span className="cursor-pointer text-xs text-brand-gray transition-colors hover:text-brand-primary">
                            Twitter
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
