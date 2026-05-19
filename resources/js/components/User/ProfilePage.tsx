import {
    BadgeCheck,
    Camera,
    Clock,
    Lock,
    Mail,
    Phone,
    User,
    BellRing,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        product: true,
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="mx-auto max-w-[1000px] space-y-8 p-8 pb-20">
            {/* Page Header */}
            <section className="space-y-2">
                <h1 className="text-3xl font-bold text-primary">
                    User Profile
                </h1>
                <p className="text-lg text-on-surface-variant">
                    Manage your account settings and preferences to tailor your
                    scheduling experience.
                </p>
            </section>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Personal Info Card */}
                <div className="rounded-2xl border border-outline-variant bg-white p-8 shadow-sm lg:col-span-2">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <User className="text-primary" size={24} />
                            <h3 className="text-xl font-bold text-on-surface">
                                Personal Information
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="rounded-xl border border-primary px-6 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-container/20"
                        >
                            {isEditing ? 'Save' : 'Edit'}
                        </button>
                    </div>

                    <div className="flex flex-col items-start gap-8 md:flex-row">
                        <div className="relative">
                            <img
                                alt="Profile Avatar"
                                className="h-32 w-32 rounded-full border-4 border-primary-container object-cover shadow-md"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtVMphqG2HwCuaIrB4haHvMou6Onk-SPAyRxnDFm8WRuq5ME7KiRi3ytevgPfpkRRZxe3mLlpXSqnh9oU4L5XJ5RMFEEpCKN3lEgkhwQWqWkkKdMVdVL3Uf_r9PlEFISYU42RXZcT5Lr6mtqWSigRmtKqX02fCAUKnvCKti8ZhZcxgwbiiM1PTSM4mWNlfir_Otm85KpkRTyM9DVdxSvd--rCJ6wupTHptzEDMQXTMx_2wzbxGFT4-RPZ0GD8QrUSBc9vhh62tHE8"
                            />
                            <button className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <Camera size={16} />
                            </button>
                        </div>

                        <div className="grid w-full flex-grow grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Full Name
                                </label>
                                <input
                                    className={`w-full rounded-xl border border-outline-variant px-4 py-3 text-sm transition-all outline-none ${isEditing ? 'bg-white ring-2 ring-primary/20' : 'bg-surface-container-low'}`}
                                    readOnly={!isEditing}
                                    type="text"
                                    defaultValue="Alexander Slotem"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Email Address
                                </label>
                                <input
                                    className={`w-full rounded-xl border border-outline-variant px-4 py-3 text-sm transition-all outline-none ${isEditing ? 'bg-white ring-2 ring-primary/20' : 'bg-surface-container-low'}`}
                                    readOnly={!isEditing}
                                    type="email"
                                    defaultValue="alexander.s@slotem.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Phone Number
                                </label>
                                <input
                                    className={`w-full rounded-xl border border-outline-variant px-4 py-3 text-sm transition-all outline-none ${isEditing ? 'bg-white ring-2 ring-primary/20' : 'bg-surface-container-low'}`}
                                    readOnly={!isEditing}
                                    type="tel"
                                    defaultValue="+1 (555) 000-1234"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant">
                                    Timezone
                                </label>
                                <div className="flex w-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface">
                                    <span>UTC-05:00 Eastern Time</span>
                                    <Clock
                                        size={16}
                                        className="text-on-surface-variant"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Card */}
                <div className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-white p-8 shadow-sm">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <Lock className="text-primary" size={24} />
                            <h3 className="text-xl font-bold text-on-surface">
                                Security
                            </h3>
                        </div>
                        <p className="mb-6 text-sm text-on-surface-variant">
                            Update your password regularly to keep your account
                            secure.
                        </p>

                        <div className="space-y-4">
                            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                                <p className="text-xs font-semibold text-on-surface-variant">
                                    Last changed
                                </p>
                                <p className="text-sm font-bold text-on-surface">
                                    March 14, 2024
                                </p>
                            </div>
                            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                                <p className="text-xs font-semibold text-on-surface-variant">
                                    2FA Status
                                </p>
                                <div className="mt-0.5 flex items-center gap-2">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                                    <p className="text-sm font-bold text-on-surface">
                                        Enabled
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-on-primary-container mt-8 w-full rounded-xl bg-primary-container py-3.5 font-bold transition-all hover:bg-primary-container/80"
                    >
                        Change Password
                    </motion.button>
                </div>

                {/* Notification Preferences Card */}
                <div className="rounded-2xl border border-outline-variant bg-white p-8 shadow-sm lg:col-span-3">
                    <div className="mb-8 flex items-center gap-3">
                        <BellRing className="text-primary" size={24} />
                        <h3 className="text-xl font-bold text-on-surface">
                            Notification Preferences
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <NotificationToggle
                            title="Email Updates"
                            description="Receive booking confirmations and daily schedule summaries."
                            active={notifications.email}
                            onToggle={() => toggleNotification('email')}
                        />
                        <NotificationToggle
                            title="SMS Reminders"
                            description="Get instant text alerts for upcoming appointments 1 hour before."
                            active={notifications.sms}
                            onToggle={() => toggleNotification('sms')}
                        />
                        <NotificationToggle
                            title="Product Updates"
                            description="Stay informed about new Slotem features and improvements."
                            active={notifications.product}
                            onToggle={() => toggleNotification('product')}
                        />
                    </div>
                </div>

                {/* Subscription Status Card */}
                <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-outline-variant bg-surface-container-highest p-8 md:flex-row lg:col-span-3">
                    <div className="flex items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <BadgeCheck className="text-primary" size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-on-surface">
                                Slotem Premium Subscriber
                            </p>
                            <p className="text-sm font-medium text-on-surface-variant">
                                Your account is in good standing. Next billing
                                date: April 14, 2024.
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-4 md:w-auto">
                        <button className="flex-1 rounded-xl border border-outline-variant bg-white px-8 py-3 font-bold text-on-surface shadow-sm transition-colors hover:bg-surface-container-low md:flex-none">
                            Manage Billing
                        </button>
                        <button className="flex-1 rounded-xl bg-red-600 px-8 py-3 font-bold text-white shadow-sm transition-colors hover:bg-red-700 md:flex-none">
                            Deactivate Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationToggle({
    title,
    description,
    active,
    onToggle,
}: {
    title: string;
    description: string;
    active: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="group flex flex-col justify-between rounded-2xl border border-outline-variant/20 p-6 transition-colors hover:bg-surface-container-low">
            <div className="mb-2 flex items-start justify-between">
                <p className="text-base font-bold text-on-surface">{title}</p>
                <button
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                    <span
                        className={`${
                            active ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </button>
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
                {description}
            </p>
        </div>
    );
}
