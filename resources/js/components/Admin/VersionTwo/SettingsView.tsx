/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    Check,
    Plus,
    Trash2,
    ShieldAlert,
    Award,
    MessageSquareQuote,
} from 'lucide-react';
import { BusinessSettings, AdminServiceTwo } from '@/types';

interface SettingsViewProps {
    settings: BusinessSettings;
    onUpdateSettings: (settings: BusinessSettings) => void;
    services: AdminServiceTwo[];
    onAddService: (service: Omit<AdminServiceTwo, 'id'>) => void;
    onDeleteService: (id: string) => void;
}

export default function SettingsView({
    settings,
    onUpdateSettings,
    services,
    onAddService,
    onDeleteService,
}: SettingsViewProps) {
    // Local form state
    const [name, setName] = useState(settings.name);
    const [managerName, setManagerName] = useState(settings.managerName);
    const [email, setEmail] = useState(settings.email);
    const [phone, setPhone] = useState(settings.phone);
    const [role, setRole] = useState(settings.role);

    // New service form state
    const [newServiceName, setNewServiceName] = useState('');
    const [newServicePrice, setNewServicePrice] = useState('150');
    const [newServiceDuration, setNewServiceDuration] = useState('60');
    const [newServiceCategory, setNewServiceCategory] = useState('Consulting');

    const [savingSettings, setSavingSettings] = useState(false);
    const [showAddSuccess, setShowAddSuccess] = useState(false);

    const handleUpdateContact = (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        onUpdateSettings({ name, managerName, email, phone, role });
        setTimeout(() => {
            setSavingSettings(false);
        }, 1500);
    };

    const handleCreateService = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newServiceName.trim()) return;

        onAddService({
            name: newServiceName,
            duration: Number(newServiceDuration),
            price: Number(newServicePrice),
            category: newServiceCategory,
        });

        setNewServiceName('');
        setNewServicePrice('150');
        setNewServiceDuration('60');
        setShowAddSuccess(true);
        setTimeout(() => setShowAddSuccess(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header Info */}
            <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    <SettingsIcon className="h-6 w-6 text-purple-600" />
                    Settings Console
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Adjust corporate profile variables and personalize
                    scheduling services.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Profile Card settings */}
                <section className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                        <Award className="h-5 w-5 shrink-0 text-purple-600" />
                        Corporate Information & Identity
                    </h3>

                    <form
                        onSubmit={handleUpdateContact}
                        className="space-y-3.5"
                    >
                        <div>
                            <label className="mb-1 block text-[10px] font-bold text-zinc-500 uppercase dark:text-zinc-400">
                                Company Brand Identifier
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs font-semibold transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-[10px] font-bold text-zinc-500 uppercase dark:text-zinc-400">
                                    Manager Signatory Name
                                </label>
                                <input
                                    type="text"
                                    value={managerName}
                                    onChange={(e) =>
                                        setManagerName(e.target.value)
                                    }
                                    className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-bold text-zinc-500 uppercase dark:text-zinc-400">
                                    Assigned Administrator Role
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block font-mono text-[10px] font-bold text-zinc-500 uppercase dark:text-zinc-400">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-mono text-[10px] font-bold text-zinc-500 uppercase dark:text-zinc-400">
                                    Hotline Telephone
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="flex cursor-pointer items-center gap-1 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-800 dark:hover:bg-zinc-700"
                            id="btn-submit-corporate-settings"
                        >
                            {savingSettings ? (
                                <>
                                    <Check className="animate-scale-up h-3.5 w-3.5" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Publish Updates</span>
                            )}
                        </button>
                    </form>
                </section>

                {/* Catalog Services Administration */}
                <section className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                        <MessageSquareQuote className="h-5 w-5 shrink-0 text-purple-600" />
                        Configured Service Catalogue
                    </h3>

                    {/* Add newly configured service schema */}
                    <form
                        onSubmit={handleCreateService}
                        className="dark:border-zinc-850 grid grid-cols-1 gap-3.5 rounded-xl border border-purple-100/30 bg-purple-50/20 p-4 sm:grid-cols-2 dark:bg-zinc-950/20"
                    >
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-[10px] font-bold text-purple-600 uppercase dark:text-purple-400">
                                New Service Title
                            </label>
                            <input
                                type="text"
                                value={newServiceName}
                                onChange={(e) =>
                                    setNewServiceName(e.target.value)
                                }
                                placeholder="Systems Strategy Audit"
                                className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] font-bold text-purple-600 uppercase dark:text-purple-400">
                                Valuation ($)
                            </label>
                            <input
                                type="number"
                                value={newServicePrice}
                                onChange={(e) =>
                                    setNewServicePrice(e.target.value)
                                }
                                placeholder="250"
                                min="10"
                                className="dark:bg-zinc-850 focus:ring-1.5 w-full rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[10px] font-bold text-purple-600 uppercase dark:text-purple-400">
                                Span minutes
                            </label>
                            <select
                                value={newServiceDuration}
                                onChange={(e) =>
                                    setNewServiceDuration(e.target.value)
                                }
                                className="dark:bg-zinc-850 focus:ring-1.5 w-full cursor-pointer rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs transition-all focus:ring-purple-500 focus:outline-none dark:border-zinc-800 dark:text-white"
                            >
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                                <option value="90">90 minutes</option>
                                <option value="120">120 minutes</option>
                            </select>
                        </div>

                        <div className="dark:border-zinc-850 flex items-center justify-between gap-2 border-t border-purple-100/50 pt-2 sm:col-span-2">
                            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                                Add to system registry
                            </span>
                            <button
                                type="submit"
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-purple-700 active:scale-95"
                                id="btn-add-service-catalogue"
                            >
                                {showAddSuccess ? (
                                    <>
                                        <Check className="h-3.5 w-3.5" />
                                        <span>Added!</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Deploy Service</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Current listing */}
                    <div className="space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                        <h4 className="mb-2 text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                            Registered Offerings
                        </h4>
                        <div className="scrollbar max-h-56 space-y-1.5 overflow-y-auto pr-1">
                            {services.map((srv) => (
                                <div
                                    key={srv.id}
                                    className="border-zinc-150 flex items-center justify-between rounded-xl border bg-zinc-50 px-3 py-2.5 text-xs transition-all hover:border-purple-200 dark:border-zinc-800/80 dark:bg-zinc-950/20 dark:hover:border-zinc-700"
                                >
                                    <div className="truncate pr-4">
                                        <span className="text-zinc-850 block truncate font-bold dark:text-zinc-300">
                                            {srv.name}
                                        </span>
                                        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                                            {srv.duration} mins • ${srv.price}
                                        </span>
                                    </div>
                                    {services.length > 1 ? (
                                        <button
                                            onClick={() =>
                                                onDeleteService(srv.id)
                                            }
                                            className="text-zinc-450 cursor-pointer rounded-lg border border-transparent p-1 transition-colors hover:border-zinc-200 hover:bg-white hover:text-red-500 dark:hover:border-zinc-800 dark:hover:bg-zinc-900"
                                            title="Delete Service"
                                            id={`btn-delete-service-${srv.id}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <span className="dark:bg-zinc-850 rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 select-none">
                                            Locked
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
