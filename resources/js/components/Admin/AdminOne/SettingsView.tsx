import React, { useState } from 'react';
import { AdminProfile } from '@/types';
import { Save, User, Bell, Shield, Coins, Globe, Key } from 'lucide-react';

interface SettingsViewProps {
    adminProfile: AdminProfile;
    onUpdateProfile: (newProfile: AdminProfile) => void;
}

export default function SettingsView({
    adminProfile,
    onUpdateProfile,
}: SettingsViewProps) {
    const [formData, setFormData] = useState({
        name: adminProfile.name,
        title: adminProfile.title,
        email: adminProfile.email,
        avatarUrl: adminProfile.avatarUrl,
        notificationsEnabled: adminProfile.notificationsEnabled,
        currency: adminProfile.currency,
    });

    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile({
            name: formData.name,
            title: formData.title,
            email: formData.email,
            avatarUrl: formData.avatarUrl,
            notificationsEnabled: formData.notificationsEnabled,
            currency: formData.currency,
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Title Header */}
            <div>
                <h2 className="font-sans text-3xl font-bold tracking-tight text-on-background">
                    System Settings
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                    Tune application defaults, administrative profiles, and
                    notification triggers.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Card Info */}
                <div className="space-y-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                        <User size={18} className="text-primary" />
                        <h3 className="text-sm font-bold text-on-surface">
                            Administrative Profile
                        </h3>
                    </div>

                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-container-low">
                            <img
                                src={formData.avatarUrl}
                                alt="Admin Avatar preview"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="w-full space-y-1">
                            <label className="block text-[11px] font-bold tracking-wider text-outline uppercase">
                                Profile Photo Link URL
                            </label>
                            <input
                                type="text"
                                value={formData.avatarUrl}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        avatarUrl: e.target.value,
                                    })
                                }
                                className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-1.5 font-mono text-xs text-on-surface-variant transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface-variant">
                                Admin Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface-variant">
                                Administrative Role Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface-variant">
                            Notification Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* System Settings Configurations */}
                <div className="space-y-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                        <Bell size={18} className="text-primary" />
                        <h3 className="text-sm font-bold text-on-surface">
                            Defaults & Preferences
                        </h3>
                    </div>

                    {/* Switch Alerts */}
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                Enable Email Digests Alert Reports
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-outline">
                                Forward daily bookings calendars directly to
                                administrative register.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={formData.notificationsEnabled}
                                onChange={() =>
                                    setFormData({
                                        ...formData,
                                        notificationsEnabled:
                                            !formData.notificationsEnabled,
                                    })
                                }
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-outline-variant/60 peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                    </div>

                    {/* Currency configuration */}
                    <div className="flex items-center justify-between border-t border-outline-variant/30 py-2">
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                System Base Pricing Format Unit
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-outline">
                                Default base currency mapped to service catalogs
                                prices.
                            </p>
                        </div>
                        <select
                            value={formData.currency}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    currency: e.target.value,
                                })
                            }
                            className="cursor-pointer rounded-lg border border-outline-variant bg-surface-container px-3 py-1.5 text-xs font-semibold text-on-surface-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="USD">USD ($ - US Dollar)</option>
                            <option value="EUR">EUR (€ - Euro Currency)</option>
                            <option value="GBP">
                                GBP (£ - Great Britain Pound)
                            </option>
                            <option value="JPY">JPY (¥ - Japanese Yen)</option>
                        </select>
                    </div>

                    {/* Timezone preference */}
                    <div className="flex items-center justify-between border-t border-outline-variant/30 py-2">
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                Calendar Default Zone Mapping
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-outline">
                                Auto-align schedule timeslots relative to
                                company physical location.
                            </p>
                        </div>
                        <span className="rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            GMT -07:00 (Pacific Coast, USA)
                        </span>
                    </div>
                </div>

                {/* Controls action */}
                <div className="flex items-center justify-between pt-2">
                    {saveSuccess ? (
                        <p className="animate-pulse text-xs font-semibold text-emerald-600">
                            ✓ Preferences synced with local databases
                            successfully!
                        </p>
                    ) : (
                        <div />
                    )}

                    <button
                        type="submit"
                        className="hover:bg-opacity-90 flex cursor-pointer items-center gap-2 self-end rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-all duration-200 active:scale-95"
                    >
                        <Save size={16} />
                        <span>Save Preferences</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
