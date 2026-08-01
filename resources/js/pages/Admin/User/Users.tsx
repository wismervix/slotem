import React, { useState, useMemo, useEffect } from 'react';
import {
    Download,
    UserPlus,
    Filter,
    Calendar,
    ArrowUpDown,
    RefreshCw,
    Eye,
    Edit,
    CheckCircle,
    X,
    Check,
    Mail,
    Phone,
    CalendarDays,
    BarChart,
    AlertTriangle,
    TrendingUp,
    Camera,
} from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';

// ─── Layouts & Components ───────────────────────────────────────────────
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/components/Shared/ConfirmationModal';

// ─── Types & Utilities ───────────────────────────────────────────────
import { User, UserStatus } from '@/types';
import {
    extractAndFormatDate,
    extractAndFormatTime,
    formatTime,
} from '@/lib/calendar-utils';

// ─── Types ────────────────────────────────────────────────────────────
interface AdminUsersProps {
    users: User[];
    flash?: {
        success?: string;
    };
}

// ─── Component ───────────────────────────────────────────────────────
export default function AdminUsers({ users, flash }: AdminUsersProps) {
    // ─── 1. STATE ──────────────────────────────────────────────────

    // Use the confirmation hook
    const confirmation = useConfirmation();

    // 📋 Table Filters & Sorting
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<
        'All Statuses' | 'Active' | 'Inactive' | 'Suspended' | 'Deleted'
    >('All Statuses');
    const [sortBy, setSortBy] = useState<
        'Registration Date' | 'Name (A-Z)' | 'Most Bookings'
    >('Registration Date');
    const [dateFilter, setDateFilter] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 📄 Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 👤 User Modals
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // 🖼️ Avatar Preview
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // 💬 Toast Notifications
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showExportSuccess, setShowExportSuccess] = useState(false);

    // ─── 2. INERTIA FORM ──────────────────────────────────────────

    // 📝 Edit User Form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        status: 'active' as UserStatus,
        avatar_url: null as File | null,
        _method: 'put',
    });

    // ─── 3. EFFECTS ────────────────────────────────────────────────

    // 💬 Toast: Auto-hide after 4 seconds
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // 👤 Edit Form: Populate when user is selected for editing
    useEffect(() => {
        if (editingUser) {
            console.log('📝 Edit form opened for user:', {
                id: editingUser.id,
                name: editingUser.name,
                email: editingUser.email,
                status: editingUser.status,
                phone: editingUser.phone,
                bookings: editingUser.bookings_count,
                avatar_url: editingUser.avatar_url,
                openedAt: new Date().toISOString(),
            });

            // Populate form with user data
            setData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                phone: editingUser.phone || '',
                status: editingUser.status || 'active',
                avatar_url: null as File | null,
                _method: 'put',
            });

            // Set avatar preview
            setAvatarPreview(editingUser.avatar_url || null);
        }
    }, [editingUser]);

    // 🖼️ Cleanup: Revoke blob URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    // 📄 Pagination: Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, sortBy, dateFilter, searchQuery]);

    // ─── 4. EVENT HANDLERS ────────────────────────────────────────

    // 🖼️ Handle avatar file selection
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setData('avatar_url', file);

        const preview = URL.createObjectURL(file);
        setAvatarPreview(preview);
    };

    // 🔄 Refresh filters
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setStatusFilter('All Statuses');
            setSortBy('Registration Date');
            setDateFilter('');
        }, 600);
    };

    // 📤 Export users to CSV
    const handleExportCSV = () => {
        const headers = [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Registered Date',
            'Registered Time',
            'Bookings',
            'Status',
        ].join(',');

        const rows = processedUsers
            .map(
                (u) =>
                    `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.created_at}","${u.registeredTime}",${u.bookingsCount},"${u.status}"`,
            )
            .join('\n');

        const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute(
            'download',
            `slotem-users-export-${new Date().toISOString().slice(0, 10)}.csv`,
        );
        a.click();

        setShowExportSuccess(true);
        setTimeout(() => setShowExportSuccess(false), 3000);
    };

    // 💾 Save edited user
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUser) {
            console.error('❌ No user being edited');
            return;
        }

        // Log form data for debugging
        console.log('📤 Submitting form data:', {
            id: editingUser.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            status: data.status,
            hasAvatar: !!data.avatar_url,
        });

        post(route('admin.users.update', editingUser.id), {
            forceFormData: true, // Required for file uploads
            preserveScroll: true,
            onSuccess: () => {
                console.log('✅ Update successful');
                reset();
                setEditingUser(null);
                setAvatarPreview(null);
            },
            onError: (errors) => {
                console.error('❌ Validation errors:', errors);
            },
        });
    };

    const performToggleStatus = (userId: number, nextStatus: string) => {
        inertiaRouter.patch(
            route('admin.users.status', userId),
            { status: nextStatus },
            {
                preserveScroll: true,
                onError: (errors) => {
                    console.error('❌ Failed to update status:', errors);
                },
            },
        );
    };

    // 🔄 Toggle user status (Active ↔ Suspended)
    const handleToggleStatus = (user: User) => {
        if (!user) return;

        const nextStatus = user.status === 'active' ? 'suspended' : 'active';
        const verb = nextStatus === 'suspended' ? 'suspend' : 'reactivate';

        confirmation.confirm({
            title: `Are you sure you want to ${verb} ${user.name}?`,
            message: `Are you absolutely sure you want to ${verb} ${user.name}? This cannot be undone.`,
            confirmLabel: `${verb.charAt(0).toUpperCase() + verb.slice(1)} User`,
            variant: 'danger',
            onConfirm: () => performToggleStatus(user.id, nextStatus),
        });
    };

    // 🗑️ Delete user
    const performDeleteUser = (userId: number) => {
        inertiaRouter.delete(route('admin.users.destroy', userId), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
                setViewingUser(null);
            },
        });
    };
    const handleDeleteUser = (user: User) => {
        if (!user) return;

        // Use the confirmation hook instead of setConfirmState
        confirmation.confirm({
            title: 'Are you sure you want to delete this user?',
            message: `Are you absolutely sure you want to delete this client? All history will be archived. 
                 Closing this day will remove all of  ${user.name}'s data. This cannot be undone.`,
            confirmLabel: 'Delete User',
            variant: 'danger',
            onConfirm: () => performDeleteUser(user.id),
        });
    };

    // ─── 5. HELPER FUNCTIONS ──────────────────────────────────────

    // ✅ Check if user status matches the current filter
    const doesStatusMatch = (
        statuses: UserStatus | null | undefined,
        filter:
            | 'All Statuses'
            | 'Active'
            | 'Inactive'
            | 'Suspended'
            | 'Deleted',
    ) => {
        if (filter === 'All Statuses') return true;
        if (!statuses?.length) return false;

        switch (filter) {
            case 'Active':
                return statuses.includes('active');
            case 'Inactive':
                return statuses.includes('inactive');
            case 'Suspended':
                return statuses.includes('suspended');
            case 'Deleted':
                return statuses.includes('deleted');
            default:
                return false;
        }
    };

    // ─── 6. COMPUTED VALUES ──────────────────────────────────────

    // 📊 Filtered & Sorted Users
    const processedUsers = useMemo(() => {
        return users
            .filter((user) => {
                // 🔍 Search query filter
                const query = searchQuery.toLowerCase().trim();
                const matchesSearch =
                    !query ||
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.id.toString().includes(query) ||
                    user.status.toLowerCase().includes(query);

                // 🏷️ Status filter
                const matchesStatus = doesStatusMatch(
                    user.status,
                    statusFilter,
                );

                // 📅 Date filter
                const matchesDate =
                    !dateFilter ||
                    user.created_at
                        .toLowerCase()
                        .includes(dateFilter.toLowerCase().trim());

                return matchesSearch && matchesStatus && matchesDate;
            })
            .sort((a, b) => {
                if (sortBy === 'Name (A-Z)') {
                    return a.name.localeCompare(b.name);
                }
                if (sortBy === 'Most Bookings') {
                    return (b.bookings_count ?? 0) - (a.bookings_count ?? 0);
                }
                // Default: Sort by registration date (newest first)
                return b.id - a.id;
            });
    }, [users, searchQuery, statusFilter, sortBy, dateFilter]);

    // 📄 Paginated Users
    const totalItems = processedUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;

    const paginatedUsers = useMemo(() => {
        return processedUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [processedUsers, startIndex]);

    // 📊 Stats
    const totalActiveCount = useMemo(
        () => users.filter((u) => u.status === 'active').length,
        [users],
    );

    const reportsPendingCount = useMemo(
        () =>
            users.filter(
                (u) => u.status === 'suspended' || u.status === 'inactive',
            ).length,
        [users],
    );

    // ─── 7. RENDER ─────────────────────────────────────────────────

    return (
        <AdminLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <div className="space-y-6">
                {/* ─── Toast Notification ────────────────────────── */}
                {showToast && toastMessage && (
                    <div className="animate-slide-in fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-600 px-5 py-3 text-white shadow-2xl">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-bold">{toastMessage}</p>
                    </div>
                )}

                {/* ─── Header ────────────────────────────────────── */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-on-surface dark:text-white">
                            User Management
                        </h2>
                        <p className="mt-1 font-sans text-sm text-on-surface-variant dark:text-slate-400">
                            Manage, monitor and moderate your customer base
                            efficiently.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-outline bg-surface px-4 py-2 text-sm text-on-surface-variant transition-all hover:bg-surface-container dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            <Download className="h-4 w-4 text-outline dark:text-slate-600" />
                            <span>Export CSV</span>
                        </button>
                        <button
                            onClick={() =>
                                console.log(
                                    "Add new user feature isn't available yet.",
                                )
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary shadow-sm shadow-primary/20 transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                {/* ─── Export Success Toast ──────────────────────── */}
                {showExportSuccess && (
                    <div className="animate-fade-in flex items-center gap-2 rounded-xl border border-green-200 bg-green-100 px-4 py-2 text-xs text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                        <Check className="h-4 w-4 text-green-700 dark:text-green-400" />
                        <span>
                            ✅ User roster successfully exported to local
                            download directory as CSV.
                        </span>
                    </div>
                )}

                {/* ─── Filter Toolbar ────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-outline-variant bg-surface p-4 dark:border-slate-700 dark:bg-slate-900">
                    {/* Status filter */}
                    <div className="flex min-w-[190px] flex-1 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                        <Filter className="h-4 w-4 text-outline dark:text-slate-600" />
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value as any)
                            }
                            className="w-full cursor-pointer border-none bg-transparent text-xs font-medium text-on-surface focus:ring-0 focus:outline-none dark:bg-transparent dark:text-white dark:focus:ring-purple-500"
                        >
                            <option value="All Statuses">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Pending">
                                Pending Verification
                            </option>
                        </select>
                    </div>

                    {/* Date filter */}
                    <div className="flex min-w-[190px] flex-1 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                        <Calendar className="h-4 w-4 text-outline dark:text-slate-600" />
                        <input
                            type="text"
                            placeholder="Filter Date (e.g. Jan 15, 2024)"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full border-none bg-transparent text-xs text-on-surface placeholder-outline/80 focus:outline-none dark:bg-transparent dark:text-white dark:placeholder-slate-600"
                        />
                    </div>

                    {/* Sort filter */}
                    <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                        <ArrowUpDown className="h-4 w-4 text-outline dark:text-slate-600" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full cursor-pointer border-none bg-transparent text-xs font-medium text-on-surface focus:ring-0 focus:outline-none dark:bg-transparent dark:text-white dark:focus:ring-purple-500"
                        >
                            <option value="Registration Date">
                                Sort by: Registration Date
                            </option>
                            <option value="Name (A-Z)">
                                Sort by: Name (A-Z)
                            </option>
                            <option value="Most Bookings">
                                Sort by: Most Bookings
                            </option>
                        </select>
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={handleRefresh}
                        className="cursor-pointer rounded-lg border border-outline-variant/60 bg-surface-container-low p-2.5 text-outline transition-colors hover:bg-surface-container-high dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600 dark:hover:bg-slate-700"
                        title="Reset filters"
                    >
                        <RefreshCw
                            className={`h-4 w-4 text-outline dark:text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`}
                        />
                    </button>
                </div>

                {/* ─── Users Table ────────────────────────────────── */}
                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-low dark:border-slate-700 dark:bg-slate-800">
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Contact Info
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Registered
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Bookings
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/60 dark:divide-slate-700">
                                {paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-sm text-on-surface-variant/80 dark:text-slate-500"
                                        >
                                            🔍 No users matching your filter
                                            inputs found. Try resetting filters.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((user) => {
                                        const relativeProgress = Math.min(
                                            ((user.bookings_count ?? 0) / 30) *
                                                100,
                                            100,
                                        );

                                        return (
                                            <tr
                                                key={user.id}
                                                className="group transition-colors hover:bg-surface-container/60 dark:hover:bg-slate-800/50"
                                            >
                                                {/* User Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            alt={user.name}
                                                            referrerPolicy="no-referrer"
                                                            className="h-10 w-10 rounded-full border border-outline-variant/40 object-cover dark:border-slate-700"
                                                            src={
                                                                user.avatar_url
                                                            }
                                                        />
                                                        <div>
                                                            <p className="text-xs font-bold text-on-surface dark:text-white">
                                                                {user.name}
                                                            </p>
                                                            <p className="font-mono text-[10px] tracking-wide text-on-surface-variant/80 dark:text-slate-500">
                                                                ID: {user.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Info */}
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-medium text-on-surface dark:text-white">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant dark:text-slate-500">
                                                        {user.phone}
                                                    </p>
                                                </td>

                                                {/* Registration Date */}
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-medium text-on-surface dark:text-white">
                                                        {extractAndFormatDate(
                                                            user.created_at,
                                                        )}
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant dark:text-slate-500">
                                                        {extractAndFormatTime(
                                                            user.created_at,
                                                        )}
                                                    </p>
                                                </td>

                                                {/* Bookings */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 text-xs font-bold text-on-surface dark:text-white">
                                                            {
                                                                user.bookings_count
                                                            }
                                                        </span>
                                                        <span className="block h-1.5 w-16 overflow-hidden rounded-full bg-surface-container-highest dark:bg-slate-700">
                                                            <span
                                                                className="block h-full rounded-full bg-primary dark:bg-purple-500"
                                                                style={{
                                                                    width: `${relativeProgress}%`,
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4">
                                                    {user.status ===
                                                    'active' ? (
                                                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400">
                                                            Active
                                                        </span>
                                                    ) : user.status ===
                                                      'suspended' ? (
                                                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                                                            Suspended
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-0.5 text-[10px] font-semibold text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/40 dark:text-yellow-400">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5 transition-opacity group-hover:opacity-100 md:opacity-0">
                                                        {/* View */}
                                                        <button
                                                            onClick={() =>
                                                                setViewingUser(
                                                                    user,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg p-1.5 text-outline transition-all hover:bg-primary/5 hover:text-primary dark:text-slate-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-400"
                                                            title="View Profile Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        {/* Edit */}
                                                        <button
                                                            onClick={() =>
                                                                setEditingUser(
                                                                    user,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg p-1.5 text-outline transition-all hover:bg-primary/5 hover:text-primary dark:text-slate-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-400"
                                                            title="Edit Credentials"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>

                                                        {/* Toggle Status */}
                                                        <button
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    user,
                                                                )
                                                            }
                                                            className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                                                                user.status ===
                                                                'active'
                                                                    ? 'text-outline hover:bg-red-50 hover:text-red-600 dark:text-slate-600 dark:hover:bg-red-950/20 dark:hover:text-red-400'
                                                                    : 'text-outline hover:bg-green-50 hover:text-green-600 dark:text-slate-600 dark:hover:bg-green-950/20 dark:hover:text-green-400'
                                                            }`}
                                                            title={
                                                                user.status ===
                                                                'active'
                                                                    ? 'Suspend User'
                                                                    : 'Activate User'
                                                            }
                                                        >
                                                            {user.status ===
                                                            'active' ? (
                                                                <X className="h-4 w-4" />
                                                            ) : (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ─── Pagination ────────────────────────────────── */}
                    <div className="flex items-center justify-between border-t border-outline-variant/60 bg-surface-container-low px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="flex gap-2 text-xs font-medium text-on-surface-variant dark:text-slate-500">
                            <span>Showing</span>
                            <span className="font-bold text-on-surface dark:text-white">
                                {Math.min(startIndex + 1, totalItems)}
                            </span>
                            <span>to</span>
                            <span className="font-bold text-on-surface dark:text-white">
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    totalItems,
                                )}
                            </span>
                            <span>of</span>
                            <span className="font-bold text-on-surface dark:text-white">
                                {totalItems}
                            </span>
                            <span>users</span>
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="cursor-pointer rounded-lg border border-outline-variant bg-surface p-2 text-on-surface-variant transition-all hover:bg-surface-container disabled:pointer-events-none disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
                            >
                                <span className="text-[11px] font-bold">
                                    Prev
                                </span>
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }).map(
                                    (_, idx) => {
                                        const pageNum = idx + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                className={`h-8 w-8 cursor-pointer rounded-lg text-xs font-bold transition-all ${
                                                    currentPage === pageNum
                                                        ? 'bg-primary text-on-primary dark:bg-purple-600'
                                                        : 'text-on-surface-variant hover:bg-surface-container dark:text-slate-500 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    },
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="cursor-pointer rounded-lg border border-outline-variant bg-surface p-2 text-on-surface-variant transition-all hover:bg-surface-container disabled:pointer-events-none disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
                            >
                                <span className="text-[11px] font-bold">
                                    Next
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Stats Cards ────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Active Users */}
                    <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-5 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-purple-950/30 dark:text-purple-400">
                            <CheckCircle className="h-6 w-6 text-primary dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                Total Active Clients
                            </p>
                            <h4 className="text-xl leading-tight font-bold text-on-surface dark:text-white">
                                {totalActiveCount}
                            </h4>
                        </div>
                    </div>

                    {/* New Registrations */}
                    <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-5 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container dark:bg-slate-700 dark:text-purple-400">
                            <TrendingUp className="h-6 w-6 text-primary dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                New Registrations
                            </p>
                            <h4 className="text-xl leading-tight font-bold text-on-surface dark:text-white">
                                +12.5% Month-over-Month
                            </h4>
                        </div>
                    </div>

                    {/* Pending Issues */}
                    <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-5 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-on-error-container dark:bg-red-950/30 dark:text-red-400">
                            <AlertTriangle className="h-6 w-6 text-red-700 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                Pending/Flags Raised
                            </p>
                            <h4 className="text-xl leading-tight font-bold text-on-surface dark:text-white">
                                {reportsPendingCount} accounts
                            </h4>
                        </div>
                    </div>
                </div>

                {/* ─── View User Modal ──────────────────────────────── */}
                {viewingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs dark:bg-black/60">
                        <div className="animate-scale-up w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-primary to-primary-container p-6 text-white dark:from-purple-600 dark:to-purple-700">
                                <button
                                    onClick={() => setViewingUser(null)}
                                    className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/10 p-1 text-xs text-white/80 transition-all hover:bg-black/25 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <img
                                        alt={viewingUser.name}
                                        className="h-16 w-16 rounded-full border-2 border-white/40 object-cover shadow-md"
                                        src={viewingUser.avatar_url}
                                    />
                                    <div>
                                        <h3 className="font-sans text-lg font-bold">
                                            {viewingUser.name}
                                        </h3>
                                        <p className="font-mono text-xs text-white/80">
                                            ID: {viewingUser.id}
                                        </p>
                                        <p className="mt-1">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                                    viewingUser.status ===
                                                    'active'
                                                        ? 'bg-green-500/20 text-green-200'
                                                        : 'bg-red-500/20 text-red-200'
                                                }`}
                                            >
                                                {viewingUser.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="space-y-5 p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2.5 text-xs">
                                        <Mail className="h-4 w-4 text-outline dark:text-slate-600" />
                                        <div>
                                            <p className="text-[10px] font-bold text-outline uppercase dark:text-slate-500">
                                                Email
                                            </p>
                                            <p className="font-medium text-on-surface dark:text-white">
                                                {viewingUser.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-xs">
                                        <Phone className="h-4 w-4 text-outline dark:text-slate-600" />
                                        <div>
                                            <p className="text-[10px] font-bold text-outline uppercase dark:text-slate-500">
                                                Phone
                                            </p>
                                            <p className="font-medium text-on-surface dark:text-white">
                                                {viewingUser.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-xs">
                                        <CalendarDays className="h-4 w-4 text-outline dark:text-slate-600" />
                                        <div>
                                            <p className="text-[10px] font-bold text-outline uppercase dark:text-slate-500">
                                                Registered
                                            </p>
                                            <p className="font-medium text-on-surface dark:text-white">
                                                {extractAndFormatDate(
                                                    viewingUser.created_at,
                                                )}{' '}
                                                @{' '}
                                                {extractAndFormatTime(
                                                    viewingUser.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-xs">
                                        <BarChart className="h-4 w-4 text-outline dark:text-slate-600" />
                                        <div>
                                            <p className="text-[10px] font-bold text-outline uppercase dark:text-slate-500">
                                                Total Reservations
                                            </p>
                                            <p className="font-bold text-on-surface dark:text-white">
                                                {viewingUser.bookings_count}{' '}
                                                slots filled
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bookings Feed */}
                                <div className="border-t border-outline-variant/60 pt-4 dark:border-slate-700">
                                    <h4 className="mb-2.5 text-xs font-bold tracking-wide text-on-surface uppercase dark:text-white">
                                        Schedule Feed (
                                        {viewingUser?.bookings?.length})
                                    </h4>
                                    <div className="max-h-40 space-y-2 overflow-y-auto">
                                        {viewingUser?.bookings?.length === 0 ? (
                                            <p className="text-[11px] text-on-surface-variant italic dark:text-slate-500">
                                                No current bookings under this
                                                profile.
                                            </p>
                                        ) : (
                                            viewingUser?.bookings?.map(
                                                (book) => (
                                                    <div
                                                        key={book.id}
                                                        className="flex items-center justify-between rounded-lg border border-outline-variant/50 bg-surface-container-low p-2 text-xs dark:border-slate-700 dark:bg-slate-800/50"
                                                    >
                                                        <div>
                                                            <p className="font-semibold text-on-surface dark:text-white">
                                                                {book?.service
                                                                    ?.name ??
                                                                    ''}
                                                            </p>
                                                            <p className="font-mono text-[10px] text-on-surface-variant dark:text-slate-500">
                                                                {new Intl.DateTimeFormat(
                                                                    'en-GB',
                                                                    {
                                                                        weekday:
                                                                            'short',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                    },
                                                                ).format(
                                                                    new Date(
                                                                        book.date,
                                                                    ),
                                                                )}{' '}
                                                                @{' '}
                                                                {formatTime(
                                                                    book.start_time,
                                                                )}{' '}
                                                                —{' '}
                                                                {formatTime(
                                                                    book.end_time,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase ${
                                                                book.status ===
                                                                'approved'
                                                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                                                                    : book.status ===
                                                                        'completed'
                                                                      ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                                                                      : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400'
                                                            }`}
                                                        >
                                                            {book.status}
                                                        </span>
                                                    </div>
                                                ),
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2.5 bg-surface-container p-4 dark:bg-slate-800">
                                <button
                                    onClick={() => setViewingUser(null)}
                                    className="cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-on-surface-variant transition-all hover:bg-surface-container-low dark:text-slate-500 dark:hover:bg-slate-700"
                                >
                                    Close Details
                                </button>
                                <Link
                                    href={route('admin.users.details', {
                                        user: viewingUser.id,
                                    })}
                                    className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                                >
                                    View Full Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        const toEdit = viewingUser;
                                        setViewingUser(null);
                                        setEditingUser(toEdit);
                                    }}
                                    className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Edit User Modal ────────────────────────────────── */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs dark:bg-black/60">
                        <form onSubmit={handleSaveEdit}>
                            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
                                    <h3 className="text-sm font-bold text-on-surface dark:text-white">
                                        ✏️ Edit User: {editingUser.name}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setEditingUser(null);
                                            if (
                                                avatarPreview &&
                                                avatarPreview.startsWith(
                                                    'blob:',
                                                )
                                            ) {
                                                URL.revokeObjectURL(
                                                    avatarPreview,
                                                );
                                            }
                                            setAvatarPreview(null);
                                        }}
                                        className="cursor-pointer text-on-surface-variant hover:text-on-surface dark:text-slate-500 dark:hover:text-slate-300"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="space-y-4 p-6 text-xs">
                                    {/* Avatar Upload */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <label
                                                htmlFor="avatar-upload"
                                                className="cursor-pointer"
                                            >
                                                <img
                                                    alt="Profile Avatar"
                                                    src={
                                                        avatarPreview ||
                                                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAtVMphqG2HwCuaIrB4haHvMou6Onk-SPAyRxnDFm8WRuq5ME7KiRi3ytevgPfpkRRZxe3mLlpXSqnh9oU4L5XJ5RMFEEpCKN3lEgkhwQWqWkkKdMVdVL3Uf_r9PlEFISYU42RXZcT5Lr6mtqWSigRmtKqX02fCAUKnvCKti8ZhZcxgwbiiM1PTSM4mWNlfir_Otm85KpkRTyM9DVdxSvd--rCJ6wupTHptzEDMQXTMx_2wzbxGFT4-RPZ0GD8QrUSBc9vhh62tHE8'
                                                    }
                                                    className="h-24 w-24 rounded-full border-4 border-primary-container object-cover shadow-md"
                                                />
                                                <div className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110">
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
                                        <p className="mt-2 text-[10px] text-on-surface-variant dark:text-slate-500">
                                            Click the camera to upload a new
                                            avatar
                                        </p>
                                    </div>

                                    {/* Form Fields */}
                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Operational Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    'status',
                                                    e.target
                                                        .value as UserStatus,
                                                )
                                            }
                                            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                            <option value="suspended">
                                                Suspended
                                            </option>
                                            <option value="deleted">
                                                Deleted
                                            </option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between bg-surface-container px-6 py-4 dark:bg-slate-800">
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => {
                                            handleDeleteUser(editingUser);
                                        }}
                                        className="cursor-pointer rounded-lg border border-red-200 px-3.5 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                                    >
                                        Delete Client
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => {
                                                reset();
                                                setEditingUser(null);
                                                if (
                                                    avatarPreview &&
                                                    avatarPreview.startsWith(
                                                        'blob:',
                                                    )
                                                ) {
                                                    URL.revokeObjectURL(
                                                        avatarPreview,
                                                    );
                                                }
                                                setAvatarPreview(null);
                                            }}
                                            className="cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low dark:text-slate-500 dark:hover:bg-slate-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm shadow-primary/20 transition-all hover:bg-primary-container disabled:opacity-50 dark:bg-purple-600 dark:hover:bg-purple-700"
                                        >
                                            {processing
                                                ? '💾 Saving...'
                                                : '💾 Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={confirmation.close}
                    onConfirm={confirmation.handleConfirm}
                    title={confirmation.options?.title || ''}
                    message={confirmation.options?.message || ''}
                    confirmLabel={confirmation.options?.confirmLabel}
                    cancelLabel={confirmation.options?.cancelLabel}
                    variant={confirmation.options?.variant}
                    isLoading={confirmation.isLoading}
                />
            </div>
        </AdminLayout>
    );
}
