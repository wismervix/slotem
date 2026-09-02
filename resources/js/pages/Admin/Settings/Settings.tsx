import React, { useEffect, useState } from 'react';
import {
    Upload,
    HeartHandshake,
    Shield,
    Mail,
    Phone,
    ExternalLink,
    Check,
} from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { usePage, useForm } from '@inertiajs/react';
import { AdminProfile, SharedPageProps } from '@/types';

interface AdminPageProps extends SharedPageProps {
    admin: AdminProfile & { id: number };
}

export default function AdminSettings() {
    const { admin, flash } = usePage<AdminPageProps>().props;

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    // Integrations/Security Modals
    const [activeInfoModal, setActiveInfoModal] = useState<
        'integrations' | 'security' | null
    >(null);

    // Avatar preview
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Inertia form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        avatar_url: null as File | null,
        _method: 'put',
    });

    // Watch for flash messages
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Handle avatar file change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setData('avatar_url', file);
        const preview = URL.createObjectURL(file);
        setAvatarPreview(preview);
    };

    // Handle avatar URL update
    const handleUpdateAvatarURL = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                handleAvatarChange(e as any);
            }
        };
        fileInput.click();
    };

    // Handle form submission
    const handleSaveAll = (e: React.FormEvent) => {
        e.preventDefault();

        const hasAvatarFile = data.avatar_url instanceof File;

        post(route('admin.settings.update'), {
            forceFormData: hasAvatarFile,
            preserveScroll: true,
            onSuccess: () => {
                reset('avatar_url');
                setAvatarPreview(null);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    // Handle discard
    const handleDiscard = () => {
        reset();
        setAvatarPreview(null);
    };

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    return (
        <AdminLayout>
            <div className="space-y-8 pb-12">
                {/* Toast Notification */}
                {showToast && toastMessage && (
                    <div
                        className={`animate-slide-in fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 text-white shadow-2xl ${
                            toastType === 'success'
                                ? 'border-emerald-500/30 bg-emerald-600'
                                : 'border-red-500/30 bg-red-600'
                        }`}
                    >
                        <Check className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-bold">{toastMessage}</p>
                    </div>
                )}

                {/* Header */}
                <header className="mb-8">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 select-text dark:text-zinc-50">
                            Admin Settings Management
                        </h1>
                        <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            Manage your organization's identity, operational
                            logic, and team access.
                        </p>
                    </div>
                </header>

                {/* Header bar within tab containing Discard / Save changes */}
                <div className="flex justify-end gap-3 pb-2">
                    <button
                        onClick={handleDiscard}
                        className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSaveAll}
                        disabled={processing}
                        className="cursor-pointer rounded-xl bg-purple-700 px-5 py-2.5 text-xs font-bold text-on-primary shadow-sm transition-all hover:bg-purple-800 hover:brightness-110 active:scale-95 dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Grid of panels */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Section: Admin Profile */}
                    <form
                        onSubmit={handleSaveAll}
                        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-900"
                    >
                        <div className="border-b border-gray-50 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                            <h3 className="text-md font-bold text-slate-800 dark:text-white">
                                Admin Profile
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
                                Update your public identity and contact
                                information.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                            {/* Logo Handler */}
                            <div className="md:col-span-4">
                                <div
                                    onClick={handleUpdateAvatarURL}
                                    className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-neutral-50 p-6 text-center transition-all hover:border-purple-600 hover:bg-purple-50/25 md:aspect-square dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500 dark:hover:bg-purple-950/25"
                                >
                                    {/* Logo Picture Overlay */}
                                    {(avatarPreview || admin.avatar_url) && (
                                        <img
                                            className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-15 transition-opacity group-hover:opacity-25"
                                            alt="Slotem Admin avatar background"
                                            src={
                                                avatarPreview ||
                                                admin.avatar_url
                                            }
                                            referrerPolicy="no-referrer"
                                        />
                                    )}

                                    <Upload className="mb-2 h-8 w-8 text-purple-700 transition-transform group-hover:scale-110 dark:text-purple-400" />
                                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                                        Upload Avatar
                                    </p>
                                    <p className="mt-1 max-w-[150px] text-[10px] font-semibold text-gray-400 uppercase dark:text-slate-400">
                                        SVG, PNG or JPG (max. 5MB)
                                    </p>

                                    <div className="absolute bottom-2 rounded-md bg-slate-900/10 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-700 transition-colors hover:bg-purple-700 hover:text-white dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-purple-600">
                                        Change Avatar
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>

                                {errors.avatar_url && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.avatar_url}
                                    </p>
                                )}
                            </div>

                            {/* Profile Inputs */}
                            <div className="space-y-4 md:col-span-8">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                        Admin Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Section: Advanced */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Card 1: Integrations */}
                        <div
                            onClick={() => setActiveInfoModal('integrations')}
                            className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all hover:border-purple-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-purple-500"
                        >
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="rounded-xl bg-purple-50 p-2.5 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                                        <HeartHandshake className="h-5 w-5" />
                                    </span>
                                    <span className="flex items-center gap-0.5 text-xs font-bold text-purple-700 duration-200 group-hover:translate-x-1 dark:text-purple-400">
                                        Configure{' '}
                                        <ExternalLink className="h-3 w-3" />
                                    </span>
                                </div>
                                <h4 className="text-md mb-1 font-bold text-slate-800 dark:text-white">
                                    Integrations
                                </h4>
                                <p className="text-xs text-gray-400 dark:text-slate-400">
                                    Connect with Google Calendar, Zoom, and
                                    payment gateways.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Security & Privacy */}
                        <div
                            onClick={() => setActiveInfoModal('security')}
                            className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all hover:border-purple-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-purple-500"
                        >
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="rounded-xl bg-purple-50 p-2.5 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                                        <Shield className="h-5 w-5" />
                                    </span>
                                    <span className="flex items-center gap-0.5 text-xs font-bold text-purple-700 duration-200 group-hover:translate-x-1 dark:text-purple-400">
                                        Configure{' '}
                                        <ExternalLink className="h-3 w-3" />
                                    </span>
                                </div>
                                <h4 className="text-md mb-1 font-bold text-slate-800 dark:text-white">
                                    Security & Privacy
                                </h4>
                                <p className="text-xs text-gray-400 dark:text-slate-400">
                                    Manage 2FA, data exports, and client privacy
                                    settings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced configuration modal alerts */}
                {activeInfoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                            onClick={() => setActiveInfoModal(null)}
                        />
                        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                            <h4 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">
                                {activeInfoModal === 'integrations'
                                    ? 'Integrations Hub'
                                    : 'Security Enforcement'}
                            </h4>
                            <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                                {activeInfoModal === 'integrations'
                                    ? 'Hook Slotem up with OAuth 2.0 credentials to synchronize with external schedulers like Google Workspace Calendar and Zoom Rooms. Also handles stripe invoice gateways directly. Run dev mode keys inside .env.example to start!'
                                    : 'Enforce two-factor passcode authentication (2FA) for team members, configure privacy logs, and export database tables globally. Contact Slotem enterprise security admin at etangdgm001@gmail.com for bulk permissions.'}
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setActiveInfoModal(null)}
                                    className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
