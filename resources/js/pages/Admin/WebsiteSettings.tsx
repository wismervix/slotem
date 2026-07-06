import React, { useState } from 'react';
import {
    Upload,
    HeartHandshake,
    Shield,
    Mail,
    Phone,
    Globe,
    ExternalLink,
} from 'lucide-react';
import { WebsiteSettings, WEBSITE_SETTINGS } from '@/data/initial-data';
import AdminLayout from '@/layouts/Admin/AdminLayout';

export default function AdminSettings() {
    // Local state for Business Profile Form
    const [setting, setSetting] = useState<WebsiteSettings>({
        ...WEBSITE_SETTINGS,
    });

    // Integrations/Security Modals
    const [activeInfoModal, setActiveInfoModal] = useState<
        'integrations' | 'security' | null
    >(null);

    const handleSettingChange = (key: keyof WebsiteSettings, value: string) => {
        setSetting((p) => ({ ...p, [key]: value }));
    };

    // State modification handlers
    const handleSaveSettings = (setting: WebsiteSettings) => {
        setSetting(setting);
        //   triggerToast('Settings applied & synchronized successfully!');
    };

    const handleSaveAll = () => {
        handleSaveSettings(setting);
    };

    // Preset logo helper
    const handleUpdateLogoURL = () => {
        const url = prompt(
            'Enter custom brand logo URL or leave empty:',
            setting.logoUrl,
        );
        if (url !== null) {
            handleSettingChange('logoUrl', url);
        }
    };

    // Preset logo helper
    const handleUpdateFaviconURL = () => {
        const url = prompt(
            'Enter custom favicon URL or leave empty:',
            setting.faviconUrl,
        );
        if (url !== null) {
            handleSettingChange('faviconUrl', url);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-12">
                {/* Header */}
                <header className="mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 select-text dark:text-zinc-50">
                            Admin Website Settings Management
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
                        onClick={() => {
                            setSetting({ ...setting });
                        }}
                        className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSaveAll}
                        className="cursor-pointer rounded-xl bg-purple-700 px-5 py-2.5 text-xs font-bold text-on-primary shadow-sm transition-all hover:bg-purple-800 hover:brightness-110 active:scale-95 dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                        Save Changes
                    </button>
                </div>

                {/* Grid of panels */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Section: Business Profile */}
                    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-900">
                        <div className="border-b border-gray-50 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                            <h3 className="text-md font-bold text-slate-800 dark:text-white">
                                Business Profile
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
                                Update your public identity and contact
                                information.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                            {/* Logo Handler */}
                            <div className="md:col-span-2">
                                <div
                                    onClick={handleUpdateLogoURL}
                                    className="group relative mb-8 flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-neutral-50 p-6 text-center transition-all hover:border-purple-600 hover:bg-purple-50/25 md:aspect-square dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500 dark:hover:bg-purple-950/25"
                                >
                                    {/* Logo Picture Overlay */}
                                    {setting.logoUrl && (
                                        <img
                                            className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-15 transition-opacity group-hover:opacity-25"
                                            alt="Slotem brand logo background"
                                            src={setting.logoUrl}
                                        />
                                    )}

                                    <Upload className="mb-2 h-8 w-8 text-purple-700 transition-transform group-hover:scale-110 dark:text-purple-400" />
                                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                                        Upload Logo
                                    </p>
                                    <p className="mt-1 max-w-[150px] text-[10px] font-semibold text-gray-400 uppercase dark:text-slate-400">
                                        SVG, PNG or JPG (max. 800x400px)
                                    </p>

                                    <div className="absolute bottom-2 rounded-md bg-slate-900/10 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-700 transition-colors hover:bg-purple-700 hover:text-white dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-purple-600">
                                        Change URL
                                    </div>
                                </div>
                            </div>
                            {/* Favicon Handler */}
                            <div className="md:col-span-2">
                                <div
                                    onClick={handleUpdateFaviconURL}
                                    className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-neutral-50 p-6 text-center transition-all hover:border-purple-600 hover:bg-purple-50/25 md:aspect-square dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500 dark:hover:bg-purple-950/25"
                                >
                                    {/* Favicon Picture Overlay */}
                                    {setting.faviconUrl && (
                                        <img
                                            className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-15 transition-opacity group-hover:opacity-25"
                                            alt="Slotem favicon background"
                                            src={setting.faviconUrl}
                                        />
                                    )}

                                    <Upload className="mb-2 h-8 w-8 text-purple-700 transition-transform group-hover:scale-110 dark:text-purple-400" />
                                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                                        Upload Favicon
                                    </p>
                                    <p className="mt-1 max-w-[150px] text-[10px] font-semibold text-gray-400 uppercase dark:text-slate-400">
                                        SVG, PNG or JPG (max. 800x400px)
                                    </p>

                                    <div className="absolute bottom-2 rounded-md bg-slate-900/10 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-700 transition-colors hover:bg-purple-700 hover:text-white dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-purple-600">
                                        Change URL
                                    </div>
                                </div>
                            </div>

                            {/* Profile Inputs */}
                            <div className="space-y-4 md:col-span-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                            Business Name
                                        </label>
                                        <input
                                            type="text"
                                            value={setting.name}
                                            onChange={(e) =>
                                                handleSettingChange(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                            Business Manager's Name
                                        </label>
                                        <input
                                            type="text"
                                            value={setting.managerName}
                                            onChange={(e) =>
                                                handleSettingChange(
                                                    'managerName',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        />
                                    </div>
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
                                                value={setting.email}
                                                onChange={(e) =>
                                                    handleSettingChange(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                            <input
                                                type="tel"
                                                value={setting.phone}
                                                onChange={(e) =>
                                                    handleSettingChange(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                            <input
                                                type="url"
                                                placeholder="https://slotem.design"
                                                value={setting.address}
                                                onChange={(e) =>
                                                    handleSettingChange(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 font-mono text-sm text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                            Website URL
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                            <input
                                                type="url"
                                                placeholder="https://slotem.design"
                                                value={setting.websiteUrl}
                                                onChange={(e) =>
                                                    handleSettingChange(
                                                        'websiteUrl',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 font-mono text-sm text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                        Business Description
                                    </label>
                                    <textarea
                                        value={setting.description}
                                        onChange={(e) =>
                                            handleSettingChange(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </section>

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
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
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
