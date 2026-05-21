import React, { useState } from 'react';
import { UserProfile } from '@/types';
import {
    User,
    Mail,
    Phone,
    Hospital,
    BadgeCheck,
    Save,
    BellRing,
    ShieldAlert,
    CheckCircle,
    Eye,
    EyeOff,
    Moon,
    Sun,
    Activity,
    Camera,
} from 'lucide-react';

interface ProfileViewProps {
    profile: UserProfile;
    onSaveProfile: (updated: UserProfile) => void;
}

export default function ProfileView({
    profile,
    onSaveProfile,
}: ProfileViewProps) {
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [phone, setPhone] = useState(profile.phone);
    const [preferredClinic, setPreferredClinic] = useState(
        profile.preferredClinic,
    );
    const [marketingConsent, setMarketingConsent] = useState(
        profile.marketingConsent,
    );

    // Extra settings for richness
    const [productUpdates, setProductUpdates] = useState(true);
    const [smsReminders, setSmsReminders] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark'),
    );
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveProfile({
            name,
            email,
            phone,
            preferredClinic,
            memberSince: profile.memberSince,
            marketingConsent,
            productUpdates,
            smsReminders,
            soundEnabled,
        });

        setToastMessage('Profile settings updated successfully!');
        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    const handleToggleDarkMode = () => {
        const isDarkNow = !isDarkMode;
        setIsDarkMode(isDarkNow);
        if (isDarkNow) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="max-w-4xl space-y-6 pb-10">
            {/* Toast Feedback */}
            {toastMessage && (
                <div className="animate-slide-in fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-600 px-5 py-3 text-white shadow-2xl">
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <p className="text-xs font-bold">{toastMessage}</p>
                </div>
            )}

            {/* Profile summary banner */}
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-outline-variant bg-white p-6 shadow-xs md:flex-row dark:bg-neutral-900">
                <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary-fixed text-2xl font-extrabold text-primary">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="absolute -right-1 -bottom-1 rounded-full border border-white bg-emerald-500 p-1.5 text-white dark:border-neutral-900">
                        <BadgeCheck className="h-4 w-4" />
                    </div>
                </div>

                <div className="flex-grow space-y-1.5 text-center md:text-left">
                    <div className="flex flex-col items-center gap-2 sm:flex-row">
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                            {name || 'Unnamed Slotem User'}
                        </h2>
                        <span className="rounded-full bg-primary-container/10 px-2.5 py-0.5 text-[10px] font-extrabold text-primary uppercase">
                            Loyal Subscriber
                        </span>
                    </div>
                    <p className="text-xs font-medium text-secondary">
                        Preferred facility: {preferredClinic}
                    </p>
                    <p className="text-[11px] text-gray-400">
                        Owner of {email} · Member since {profile.memberSince}
                    </p>
                </div>

                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={handleToggleDarkMode}
                        className="rounded-xl bg-gray-100 p-2.5 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        title="Toggle dark theme"
                    >
                        {isDarkMode ? (
                            <Sun className="h-5 w-5 text-amber-500" />
                        ) : (
                            <Moon className="h-5 w-5 text-indigo-700" />
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Main profile form */}
                <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-xs md:col-span-2 dark:bg-neutral-900">
                    <h3 className="mb-5 flex items-center gap-1.5 text-base font-extrabold text-gray-900 dark:text-white">
                        <User className="h-5 w-5 text-primary" />
                        Personal Demographics
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-8 flex">
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
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                    Contact Phone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                    Preferred Clinic
                                </label>
                                <div className="relative">
                                    <Hospital className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={preferredClinic}
                                        onChange={(e) =>
                                            setPreferredClinic(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                    >
                                        <option value="Smile Clinic West">
                                            Smile Clinic West
                                        </option>
                                        <option value="Zen Wellness Center">
                                            Zen Wellness Center
                                        </option>
                                        <option value="Apex Medical Suite">
                                            Apex Medical Suite
                                        </option>
                                        <option value="Radiant Skin Spa">
                                            Radiant Skin Spa
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="my-4 h-px bg-outline-variant" />

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                Notification Channels
                            </h4>

                            <label className="group flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={smsReminders}
                                    onChange={(e) =>
                                        setSmsReminders(e.target.checked)
                                    }
                                    className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                        Instant SMS notifications & phone
                                        reminders
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        Sends text alerts 2 hours before slotted
                                        timings.
                                    </p>
                                </div>
                            </label>

                            <label className="group flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={soundEnabled}
                                    onChange={(e) =>
                                        setSoundEnabled(e.target.checked)
                                    }
                                    className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                        Audible sound feedback alerts
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        Play pleasant click feedback and task
                                        completions sounds.
                                    </p>
                                </div>
                            </label>

                            <label className="group flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={marketingConsent}
                                    onChange={(e) =>
                                        setMarketingConsent(e.target.checked)
                                    }
                                    className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                        Receive diagnostic recommendations &
                                        tips
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        Periodic emails about dental wellness,
                                        skin hygiene and cardiology notes.
                                    </p>
                                </div>
                            </label>

                            <label className="group flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={productUpdates}
                                    onChange={(e) =>
                                        setProductUpdates(e.target.checked)
                                    }
                                    className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                        Product Updates
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        Stay informed about new Slotem features
                                        and improvements.
                                    </p>
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-98"
                        >
                            <Save className="h-4 w-4" />
                            Save Demographic Profile
                        </button>
                    </form>
                </div>

                {/* Insurance and Medical Card details */}
                <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-white p-6 shadow-xs dark:bg-neutral-900">
                        <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-primary/5" />

                        <h3 className="mb-4 flex items-center gap-1.5 border-b border-outline-variant pb-2 text-base font-extrabold text-gray-900 dark:text-white">
                            <Activity className="h-5 w-5 text-indigo-500" />
                            Insurance Status
                        </h3>

                        <div className="space-y-3 text-xs leading-relaxed">
                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Policy Provider:
                                </span>
                                <span className="text-right font-bold text-gray-800 dark:text-white">
                                    Alliance Shield Med
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Group Number:
                                </span>
                                <span className="text-right font-mono font-bold text-gray-800 dark:text-white">
                                    ASM-92180A
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Co-Pay Rate:
                                </span>
                                <span className="text-right font-extrabold text-emerald-600">
                                    $15.00 flat
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-dashed border-outline-variant pt-2">
                                <span className="text-gray-400">
                                    Verification State:
                                </span>
                                <span className="rounded-full bg-emerald-100/50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/20">
                                    Verified Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:bg-red-950/10">
                        <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-red-800 dark:text-red-300">
                            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
                            Medical Alert notes
                        </h4>
                        <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                            Allergies recorded: Penicillin, Sulfites. Please
                            inform the dental surgeon or therapeutic masseuse
                            immediately upon reception.
                        </p>
                    </div>
                </div>
            </div>

            {/* Subscription Status Card */}
            <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-outline-variant bg-surface-container-highest p-8 transition-colors md:flex-row lg:col-span-3 dark:border-outline-variant-dark dark:bg-neutral-900">
                <div className="flex items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/15">
                        <BadgeCheck className="text-primary" size={40} />
                    </div>

                    <div>
                        <p className="text-xl font-bold text-on-surface dark:text-on-surface-dark">
                            Slotem Premium Subscriber
                        </p>

                        <p className="text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">
                            Your account is in good standing. Next billing date:
                            April 14, 2024.
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-wrap gap-4 md:w-auto">
                    <button className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-8 py-3 font-bold text-on-surface shadow-sm transition-colors hover:bg-surface-container md:flex-none dark:border-outline-variant-dark dark:bg-surface-container-dark dark:text-on-surface-dark dark:hover:bg-surface-container-dark-hover">
                        Manage Billing
                    </button>

                    <button className="flex-1 rounded-xl bg-red-600 px-8 py-3 font-bold text-white shadow-sm transition-colors hover:bg-red-700 md:flex-none dark:bg-red-700 dark:hover:bg-red-600">
                        Deactivate Account
                    </button>
                </div>
            </div>
        </div>
    );
}
