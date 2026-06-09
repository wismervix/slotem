import { useForm, usePage } from '@inertiajs/react';
import UserLayout from '@/layouts/User/UserLayout';
import { UserProfile } from '@/types';
import { useEffect, useState } from 'react';
import {
    User,
    Mail,
    Phone,
    BadgeCheck,
    Save,
    ShieldAlert,
    CheckCircle,
    Moon,
    Sun,
    Activity,
    Camera,
    Lock,
    Loader2,
    Headset,
    CircleHelp,
} from 'lucide-react';

type ProfileProps = {
    profile: UserProfile;
    unreadNotificationsCount: number;
};

export default function Profile({
    profile: initialProfile,
    unreadNotificationsCount,
}: ProfileProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: initialProfile.name ?? '',
        email: initialProfile.email ?? '',
        phone: initialProfile.phone ?? '',
        password: '',
        marketing_consent: initialProfile.marketing_consent ?? false,
        product_updates: initialProfile.product_updates ?? false,
        sms_reminders: initialProfile.sms_reminders ?? false,
        sound_enabled: initialProfile.sound_enabled ?? false,
        avatar_url: null as File | null,
        _method: 'put',
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        initialProfile.avatar_url ?? null,
    );

    const [isDarkMode, setIsDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark'),
    );

    const props = usePage().props as unknown as {
        flash?: {
            success?: string;
        };
    };

    const [showToast, setShowToast] = useState(!!props.flash?.success);

    // Auto-hide toast after 4 seconds
    useEffect(() => {
        if (props.flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [props.flash?.success]); // Re-run when flash.success changes

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setData('avatar_url', file);

        const preview = URL.createObjectURL(file);

        setAvatarPreview(preview);
    };

    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // console.log('Form data: ', data);

        post(route('user.profile.update'), {
            forceFormData: true,

            onSuccess: () => {
                reset('password');
            },
        });
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
        <UserLayout unreadNotificationsCount={unreadNotificationsCount}>
            <div className="max-w-4xl space-y-6 pb-10">
                {/* Toast Feedback */}
                {props.flash?.success && showToast && (
                    <div className="animate-slide-in fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-600 px-5 py-3 text-white shadow-2xl">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-bold">
                            {props.flash?.success}
                        </p>
                    </div>
                )}

                <div className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-white shadow-lg">
                    {processing ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Camera size={16} />
                    )}
                </div>

                {/* Profile summary banner */}
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-outline-variant bg-white p-6 shadow-xs md:flex-row dark:bg-neutral-900">
                    <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary-fixed text-2xl font-extrabold text-primary">
                            {avatarPreview ? (
                                <img
                                    alt="Profile Avatar"
                                    src={avatarPreview}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                data.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="absolute -right-1 -bottom-1 rounded-full border border-white bg-emerald-500 p-1.5 text-white dark:border-neutral-900">
                            <BadgeCheck className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="flex-grow space-y-1.5 text-center md:text-left">
                        <div className="flex flex-col items-center gap-2 sm:flex-row">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                                {data.name || 'Unnamed Slotem User'}
                            </h2>
                            <span className="rounded-full bg-primary-container/10 px-2.5 py-0.5 text-[10px] font-extrabold text-primary uppercase">
                                Loyal Subscriber
                            </span>
                        </div>
                        <p className="text-xs font-medium text-secondary">
                            Preferred phone number:{' '}
                            {initialProfile.phone ||
                                'No phone number specified.'}
                        </p>
                        <p className="text-[11px] text-gray-400">
                            Owner of {data.email} · Member since{' '}
                            {initialProfile.memberSince}
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
                            Account Information
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-8 flex">
                                {/* <div className="relative">
                                    <img
                                        alt="Profile Avatar"
                                        className="h-32 w-32 rounded-full border-4 border-primary-container object-cover shadow-md"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtVMphqG2HwCuaIrB4haHvMou6Onk-SPAyRxnDFm8WRuq5ME7KiRi3ytevgPfpkRRZxe3mLlpXSqnh9oU4L5XJ5RMFEEpCKN3lEgkhwQWqWkkKdMVdVL3Uf_r9PlEFISYU42RXZcT5Lr6mtqWSigRmtKqX02fCAUKnvCKti8ZhZcxgwbiiM1PTSM4mWNlfir_Otm85KpkRTyM9DVdxSvd--rCJ6wupTHptzEDMQXTMx_2wzbxGFT4-RPZ0GD8QrUSBc9vhh62tHE8"
                                    />
                                    <button className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95">
                                        <Camera size={16} />
                                    </button>
                                </div> */}

                                <div className="relative">
                                    <label
                                        htmlFor="avatar-upload"
                                        className="cursor-pointer"
                                    >
                                        <img
                                            alt="Profile Avatar"
                                            src={
                                                avatarPreview ??
                                                'https://lh3.googleusercontent.com/aida-public/AB6AXuAtVMphqG2HwCuaIrB4haHvMou6Onk-SPAyRxnDFm8WRuq5ME7KiRi3ytevgPfpkRRZxe3mLlpXSqnh9oU4L5XJ5RMFEEpCKN3lEgkhwQWqWkkKdMVdVL3Uf_r9PlEFISYU42RXZcT5Lr6mtqWSigRmtKqX02fCAUKnvCKti8ZhZcxgwbiiM1PTSM4mWNlfir_Otm85KpkRTyM9DVdxSvd--rCJ6wupTHptzEDMQXTMx_2wzbxGFT4-RPZ0GD8QrUSBc9vhh62tHE8'
                                            }
                                            className="h-32 w-32 rounded-full border-4 border-primary-container object-cover shadow-md"
                                        />

                                        <div className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-white shadow-lg">
                                            <Camera size={16} />
                                        </div>
                                    </label>

                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                                {errors.avatar_url && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.avatar_url}
                                    </p>
                                )}
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
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                        />
                                    </div>

                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                        Contact Phone
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                        />
                                    </div>

                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Leave blank to keep current password"
                                            className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-4 pl-10 text-xs font-medium focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none dark:bg-neutral-900"
                                        />
                                    </div>

                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* <div className="space-y-1.5">
                                    <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                                        Preferred Clinic
                                    </label>
                                    <div className="relative">
                                        <Hospital className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <select
                                            value={preferredClinic}
                                            onChange={(e) =>
                                                setPreferredClinic(
                                                    e.target.value,
                                                )
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
                                </div> */}
                            </div>

                            <div className="my-4 h-px bg-outline-variant" />

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Notification Channels
                                </h4>

                                <label className="group flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.sms_reminders}
                                        onChange={(e) =>
                                            setData(
                                                'sms_reminders',
                                                e.target.checked,
                                            )
                                        }
                                        className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                            Instant SMS notifications & phone
                                            reminders
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            Sends text alerts 2 hours before
                                            slotted timings.
                                        </p>
                                    </div>
                                </label>

                                <label className="group flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.sound_enabled}
                                        onChange={(e) =>
                                            setData(
                                                'sound_enabled',
                                                e.target.checked,
                                            )
                                        }
                                        className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                            Audible sound feedback alerts
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            Play pleasant click feedback and
                                            task completions sounds.
                                        </p>
                                    </div>
                                </label>

                                <label className="group flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.marketing_consent}
                                        onChange={(e) =>
                                            setData(
                                                'marketing_consent',
                                                e.target.checked,
                                            )
                                        }
                                        className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                            Receive diagnostic recommendations &
                                            tips
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            Periodic emails about dental
                                            wellness, skin hygiene and
                                            cardiology notes.
                                        </p>
                                    </div>
                                </label>

                                <label className="group flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.product_updates}
                                        onChange={(e) =>
                                            setData(
                                                'product_updates',
                                                e.target.checked,
                                            )
                                        }
                                        className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 group-hover:text-primary dark:text-neutral-200">
                                            Product Updates
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            Stay informed about new Slotem
                                            features and improvements.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-98"
                            >
                                {!processing && <Save className="h-4 w-4" />}
                                {processing ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Insurance and Medical Card details */}
                    <div className="space-y-6">
                        <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-white p-6 shadow-xs dark:bg-neutral-900">
                            <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-primary/5" />

                            <h3 className="mb-4 flex items-center gap-1.5 border-b border-outline-variant pb-2 text-base font-extrabold text-gray-900 dark:text-white">
                                <Activity className="h-5 w-5 text-indigo-500" />
                                Account Status
                            </h3>

                            <div className="space-y-3 text-xs leading-relaxed">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Member Since:
                                    </span>
                                    <span className="text-right font-bold text-gray-800 dark:text-white">
                                        {initialProfile.memberSince}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Email Verified:
                                    </span>
                                    <span className="text-right font-mono font-bold text-gray-800 dark:text-white">
                                        {initialProfile.email && 'Yes'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Notifications:
                                    </span>
                                    <span className="text-right font-extrabold text-emerald-600">
                                        {(initialProfile.sms_reminders &&
                                            'Enabled') ||
                                            'Disabled'}
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

                        <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:bg-amber-950/10">
                            <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 dark:text-amber-300">
                                <Headset className="h-4 w-4 shrink-0 text-amber-600" />
                                Need Assistance?
                            </h4>
                            <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                                Having trouble with a booking? Contact support
                                and we'll help you reschedule or resolve issues.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-950/10">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-blue-800 dark:text-blue-300">
                                <CircleHelp className="h-4 w-4 shrink-0 text-blue-600" />
                                Booking Tips
                            </h4>

                            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span>
                                        Arrive 10 minutes before your
                                        appointment.
                                    </span>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span>
                                        Check notifications regularly for
                                        booking updates.
                                    </span>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span>
                                        Cancel or reschedule at least 24 hours
                                        in advance.
                                    </span>
                                </li>
                            </ul>
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
                            <p className="text-xl font-bold text-on-surface dark:text-surface">
                                Slotem Premium Subscriber
                            </p>

                            <p className="text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">
                                Your account is in good standing. Next billing
                                date: April 14, 2024.
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
        </UserLayout>
    );
}

function MobileNavItem({
    id,
    label,
    icon: Icon,
    active,
    onClick,
}: {
    id: string;
    label: string;
    icon: any;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-on-surface-variant'}`}
        >
            <Icon size={20} className={active ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    );
}
