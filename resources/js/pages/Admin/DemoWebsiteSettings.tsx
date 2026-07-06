import React, { useState } from 'react';
import {
    Upload,
    Info,
    HeartHandshake,
    Shield,
    UserPlus,
    Trash2,
    Edit,
    Check,
    Settings,
    Mail,
    Phone,
    Globe,
    ExternalLink,
} from 'lucide-react';
import {
    WebsiteSettings,
    BookingRules,
    TeamMember,
    WEBSITE_SETTINGS,
    defaultTeamMembers,
    defaultBookingRules,
} from '@/data/initial-data';
import AdminLayout from '@/layouts/Admin/AdminLayout';

export default function AdminSettings() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
        return defaultTeamMembers;
    });

    // Local state for Business Profile Form
    const [profile, setProfile] = useState<WebsiteSettings>({
        ...WEBSITE_SETTINGS,
    });
    // Local state for Booking Rules Form
    const [rules, setRules] = useState<BookingRules>({
        ...defaultBookingRules,
    });

    // Dialog/Form configurations
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'Admin' | 'Staff'>('Staff');

    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState<'Admin' | 'Staff'>('Staff');

    // Integrations/Security Modals
    const [activeInfoModal, setActiveInfoModal] = useState<
        'integrations' | 'security' | null
    >(null);

    const handleProfileChange = (key: keyof WebsiteSettings, value: string) => {
        setProfile((p) => ({ ...p, [key]: value }));
    };

    const handleRulesChange = (key: keyof BookingRules, value: any) => {
        setRules((r) => ({ ...r, [key]: value }));
    };

    // State modification handlers
    const handleSaveSettings = (
        profile: WebsiteSettings,
        rules: BookingRules,
    ) => {
        setProfile(profile);
        setRules(rules);
        //   triggerToast('Settings applied & synchronized successfully!');
    };

    const handleSaveAll = () => {
        handleSaveSettings(profile, rules);
    };

    const handleAddTeamMember = (
        newMember: Omit<TeamMember, 'id' | 'avatarInitials'>,
    ) => {
        const initials = newMember.name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const created: TeamMember = {
            ...newMember,
            id: 't_' + Math.random().toString(36).substring(2, 9),
            avatarInitials: initials,
        };

        setTeamMembers((prev) => [...prev, created]);
        //   triggerToast(`Invited ${newMember.name} to the team!`);
    };

    const handleRemoveTeamMember = (id: string) => {
        const found = teamMembers.find((m) => m.id === id);
        if (found) {
            setTeamMembers((prev) => prev.filter((m) => m.id !== id));
            //   triggerToast(`Removed team handler: ${found.name}`, 'info');
        }
    };

    const handleUpdateTeamMember = (updated: TeamMember) => {
        setTeamMembers((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m)),
        );
        //   triggerToast(`Updated handler settings for ${updated.name}`);
    };

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteName.trim() || !inviteEmail.trim()) return;
        handleAddTeamMember({
            name: inviteName,
            email: inviteEmail,
            role: inviteRole,
            status: 'Pending Invite',
        });
        setInviteName('');
        setInviteEmail('');
        setIsInviteOpen(false);
    };

    const handleStartEdit = (m: TeamMember) => {
        setEditingMemberId(m.id);
        setEditName(m.name);
        setEditEmail(m.email);
        setEditRole(m.role);
    };

    const handleSaveEdit = (m: TeamMember) => {
        handleUpdateTeamMember({
            ...m,
            name: editName,
            email: editEmail,
            role: editRole,
        });
        setEditingMemberId(null);
    };

    // Preset logo helper
    const handleUpdateLogoURL = () => {
        const url = prompt(
            'Enter custom brand logo URL or leave empty:',
            profile.logoUrl,
        );
        if (url !== null) {
            handleProfileChange('logoUrl', url);
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
                            setProfile({ ...profile });
                            setRules({ ...rules });
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
                            <div className="md:col-span-4">
                                <div
                                    onClick={handleUpdateLogoURL}
                                    className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-neutral-50 p-6 text-center transition-all hover:border-purple-600 hover:bg-purple-50/25 md:aspect-square dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500 dark:hover:bg-purple-950/25"
                                >
                                    {/* Logo Picture Overlay */}
                                    {profile.logoUrl && (
                                        <img
                                            className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-15 transition-opacity group-hover:opacity-25"
                                            alt="Slotem brand logo background"
                                            src={profile.logoUrl}
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

                            {/* Profile Inputs */}
                            <div className="space-y-4 md:col-span-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                        Business Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) =>
                                            handleProfileChange(
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
                                        value={profile.name}
                                        onChange={(e) =>
                                            handleProfileChange(
                                                'name',
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
                                                value={profile.email}
                                                onChange={(e) =>
                                                    handleProfileChange(
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
                                                value={profile.phone}
                                                onChange={(e) =>
                                                    handleProfileChange(
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
                                            value={profile.websiteUrl}
                                            onChange={(e) =>
                                                handleProfileChange(
                                                    'websiteUrl',
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
                                            value={profile.websiteUrl}
                                            onChange={(e) =>
                                                handleProfileChange(
                                                    'websiteUrl',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 font-mono text-sm text-slate-800 transition-all outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
</div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Booking Rules */}
                    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-900">
                        <div className="border-b border-gray-50 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                            <h3 className="text-md font-bold text-slate-800 dark:text-white">
                                Booking Rules
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
                                Control how and when clients can interact with
                                your schedule.
                            </p>
                        </div>

                        <div className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                        Minimum Lead Time
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={rules.minimumLeadTime}
                                            onChange={(e) =>
                                                handleRulesChange(
                                                    'minimumLeadTime',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-purple-500"
                                        >
                                            <option value="12 Hours">
                                                12 Hours
                                            </option>
                                            <option value="24 Hours">
                                                24 Hours
                                            </option>
                                            <option value="48 Hours">
                                                48 Hours
                                            </option>
                                            <option value="1 Week">
                                                1 Week
                                            </option>
                                        </select>
                                        <span
                                            className="cursor-help text-gray-400 transition-colors hover:text-purple-700 dark:hover:text-purple-400"
                                            title="Minimum time before a booking starts"
                                        >
                                            <Info className="h-4.5 w-4.5" />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-slate-400">
                                        Booking Window
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={rules.bookingWindow}
                                            onChange={(e) =>
                                                handleRulesChange(
                                                    'bookingWindow',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-purple-500"
                                        >
                                            <option value="15 Days">
                                                15 Days
                                            </option>
                                            <option value="30 Days">
                                                30 Days
                                            </option>
                                            <option value="60 Days">
                                                60 Days
                                            </option>
                                            <option value="90 Days">
                                                90 Days
                                            </option>
                                        </select>
                                        <span
                                            className="cursor-help text-gray-400 transition-colors hover:text-purple-700 dark:hover:text-purple-400"
                                            title="How far in advance clients can book"
                                        >
                                            <Info className="h-4.5 w-4.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Cancellation block container */}
                            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-xl bg-purple-50 p-2 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                                            <HeartHandshake className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                                                Cancellation Policy
                                            </h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                Apply a standard fee for late
                                                cancellations.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Custom toggle slider */}
                                    <button
                                        onClick={() =>
                                            handleRulesChange(
                                                'cancellationPolicyEnabled',
                                                !rules.cancellationPolicyEnabled,
                                            )
                                        }
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                            rules.cancellationPolicyEnabled
                                                ? 'bg-purple-700 dark:bg-purple-600'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                                rules.cancellationPolicyEnabled
                                                    ? 'translate-x-5'
                                                    : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {rules.cancellationPolicyEnabled && (
                                    <div className="pt-2">
                                        <textarea
                                            rows={3}
                                            value={rules.cancellationPolicyText}
                                            onChange={(e) =>
                                                handleRulesChange(
                                                    'cancellationPolicyText',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section: Team Management */}
                    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex flex-col justify-between gap-4 border-b border-gray-50 bg-slate-50/50 p-6 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50">
                            <div>
                                <h3 className="text-md font-bold text-slate-800 dark:text-white">
                                    Team Management
                                </h3>
                                <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
                                    Add staff members and define their access
                                    levels.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsInviteOpen(true)}
                                className="flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-purple-600 px-4 py-2 font-sans text-xs font-bold text-purple-700 transition-all hover:bg-purple-50 sm:self-center dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-950/30"
                            >
                                <UserPlus className="h-4 w-4" />
                                Invite Member
                            </button>
                        </div>

                        {/* Inline invite fields */}
                        {isInviteOpen && (
                            <form
                                onSubmit={handleInviteSubmit}
                                className="space-y-4 border-b border-purple-50 bg-purple-50/10 p-6 dark:border-purple-950/30 dark:bg-purple-950/10"
                            >
                                <div className="flex items-center gap-1 text-purple-700 dark:text-purple-400">
                                    <UserPlus className="h-4 w-4" />
                                    <h4 className="text-xs font-bold tracking-wider uppercase">
                                        Configure New Invitation
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full Name (e.g. Sarah White)"
                                        value={inviteName}
                                        onChange={(e) =>
                                            setInviteName(e.target.value)
                                        }
                                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Email (e.g. sarah@slotem.design)"
                                        value={inviteEmail}
                                        onChange={(e) =>
                                            setInviteEmail(e.target.value)
                                        }
                                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                    <select
                                        value={inviteRole}
                                        onChange={(e) =>
                                            setInviteRole(
                                                e.target.value as
                                                    | 'Admin'
                                                    | 'Staff',
                                            )
                                        }
                                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    >
                                        <option value="Staff">
                                            Staff role
                                        </option>
                                        <option value="Admin">
                                            Admin role
                                        </option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setIsInviteOpen(false)}
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-purple-700 px-4 py-1.5 font-bold text-white shadow-sm transition-all hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700"
                                    >
                                        Send Invite Token
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-100 bg-slate-50 text-xs font-bold tracking-wider text-gray-400 uppercase dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">Member</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm dark:divide-slate-700">
                                    {teamMembers.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="px-6 py-4">
                                                {editingMemberId ===
                                                member.id ? (
                                                    <div className="flex flex-col gap-1.5">
                                                        <input
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) =>
                                                                setEditName(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-md border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                        />
                                                        <input
                                                            type="email"
                                                            value={editEmail}
                                                            onChange={(e) =>
                                                                setEditEmail(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-md border border-slate-200 bg-white p-1.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                                                                member.role ===
                                                                'Admin'
                                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                            }`}
                                                        >
                                                            {
                                                                member.avatarInitials
                                                            }
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800 dark:text-white">
                                                                {member.name}
                                                            </p>
                                                            <p className="font-mono text-xs text-gray-400 dark:text-slate-500">
                                                                {member.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingMemberId ===
                                                member.id ? (
                                                    <select
                                                        value={editRole}
                                                        onChange={(e) =>
                                                            setEditRole(
                                                                e.target
                                                                    .value as
                                                                    | 'Admin'
                                                                    | 'Staff',
                                                            )
                                                        }
                                                        className="rounded-md border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                    >
                                                        <option value="Admin">
                                                            Admin
                                                        </option>
                                                        <option value="Staff">
                                                            Staff
                                                        </option>
                                                    </select>
                                                ) : (
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                            member.role ===
                                                            'Admin'
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        {member.role}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            member.status ===
                                                            'Active'
                                                                ? 'bg-emerald-500'
                                                                : 'bg-amber-500'
                                                        }`}
                                                    />
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">
                                                        {member.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    {editingMemberId ===
                                                    member.id ? (
                                                        <button
                                                            onClick={() =>
                                                                handleSaveEdit(
                                                                    member,
                                                                )
                                                            }
                                                            className="rounded-lg bg-green-50 p-1.5 text-green-700 transition-colors hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleStartEdit(
                                                                    member,
                                                                )
                                                            }
                                                            className="rounded-lg bg-slate-50 p-1.5 text-gray-500 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveTeamMember(
                                                                member.id,
                                                            )
                                                        }
                                                        className="rounded-lg bg-slate-50 p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
