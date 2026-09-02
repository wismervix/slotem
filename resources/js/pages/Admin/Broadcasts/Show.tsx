// resources/js/Pages/Admin/Broadcasts/Show.tsx
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Users,
    CheckCircle,
    Clock,
    Eye,
    Trash2,
    Info,
    AlertCircle,
    AlertTriangle,
    CheckCircle as CheckCircleIcon,
    ChevronDown,
    ChevronUp,
    Search,
    User,
    Mail,
} from 'lucide-react';
import { formatDateAndTime } from '@/lib/calendar-utils';
import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/components/Shared/ConfirmationModal';

interface BroadcastUser {
    id: number;
    name: string;
    email: string;
    pivot: {
        is_read: boolean;
        read_at: string | null;
    };
}

interface Broadcast {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    priority: 'normal' | 'high' | 'urgent';
    target_audience: string[];
    scheduled_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
    admin: {
        name: string;
        email: string;
    };
    users: BroadcastUser[];
}

interface BroadcastShowProps {
    broadcast: Broadcast;
}

export default function BroadcastShow({ broadcast }: BroadcastShowProps) {
    // ─── 1. STATE ──────────────────────────────────────────────────

    // Use the confirmation hook
    const confirmation = useConfirmation();

    const [showUsers, setShowUsers] = useState(false);
    const [searchUser, setSearchUser] = useState('');

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info':
                return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400';
            case 'success':
                return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400';
            case 'warning':
                return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400';
            case 'alert':
                return 'text-red-500 bg-red-50 dark:bg-red-950/30 dark:text-red-400';
            default:
                return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info':
                return Info;
            case 'success':
                return CheckCircleIcon;
            case 'warning':
                return AlertTriangle;
            case 'alert':
                return AlertCircle;
            default:
                return Info;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500 text-white';
            case 'high':
                return 'bg-amber-500 text-white';
            default:
                return 'bg-blue-500 text-white';
        }
    };

    const TypeIcon = getTypeIcon(broadcast.type);
    const totalUsers = broadcast.users.length;
    const readCount = broadcast.users.filter((u) => u.pivot.is_read).length;
    const readPercentage =
        totalUsers > 0 ? Math.round((readCount / totalUsers) * 100) : 0;

    const filteredUsers = broadcast.users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
            user.email.toLowerCase().includes(searchUser.toLowerCase()),
    );
    
        const performHandleDelete = () => {
            router.delete(route('admin.broadcasts.destroy', broadcast.id), {
                preserveScroll: true,
            });
        };
    
        const handleDelete = () => {
            confirmation.confirm({
                title: 'Delete this broadcast?',
                message: `You're about to delete the broadcast "${broadcast.title}". This action cannot be undone.`,
                confirmLabel: 'Yes, Delete Broadcast',
                variant: 'danger',
                onConfirm: performHandleDelete,
            });
        };

    return (
        <AdminLayout>
            <div className="space-y-6 py-6">
                {/* Navigation */}
                <button
                    onClick={() => router.visit(route('admin.broadcasts'))}
                    className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface dark:text-slate-400 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Broadcasts
                </button>

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant bg-surface p-6 md:flex-row md:items-center dark:bg-slate-900">
                    <div className="flex flex-wrap items-start gap-4">
                        <div
                            className={`rounded-lg p-2.5 ${getTypeColor(broadcast.type)}`}
                        >
                            <TypeIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold text-on-surface dark:text-white">
                                    {broadcast.title}
                                </h1>
                                <span
                                    className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase ${getPriorityColor(broadcast.priority)}`}
                                >
                                    {broadcast.priority}
                                </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant dark:text-slate-400">
                                <span>
                                    <Users className="mr-1 inline h-3.5 w-3.5" />
                                    {totalUsers} recipients
                                </span>
                                <span>
                                    <CheckCircle className="mr-1 inline h-3.5 w-3.5" />
                                    {readCount} read ({readPercentage}%)
                                </span>
                                <span>
                                    <Clock className="mr-1 inline h-3.5 w-3.5" />
                                    Sent{' '}
                                    {formatDateAndTime(broadcast.created_at)}
                                </span>
                                {broadcast.expires_at && (
                                    <span>
                                        <Clock className="mr-1 inline h-3.5 w-3.5" />
                                        Expires{' '}
                                        {formatDateAndTime(
                                            broadcast.expires_at,
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Message Content */}
                <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                    <h3 className="text-sm font-bold text-on-surface dark:text-white">
                        Message
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-on-surface-variant dark:text-slate-300">
                        {broadcast.message}
                    </p>
                </div>

                {/* Admin Info */}
                <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                    <h3 className="text-sm font-bold text-on-surface dark:text-white">
                        Sent By
                    </h3>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-on-surface dark:text-white">
                                {broadcast.admin.name}
                            </p>
                            <p className="text-xs text-on-surface-variant dark:text-slate-400">
                                {broadcast.admin.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="rounded-xl border border-outline-variant bg-surface dark:bg-slate-900">
                    <button
                        onClick={() => setShowUsers(!showUsers)}
                        className="flex w-full items-center justify-between p-6"
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Users className="h-5 w-5 text-primary" />
                            <h3 className="text-sm font-bold text-on-surface dark:text-white">
                                Recipients ({totalUsers})
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-on-surface-variant dark:text-slate-400">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                <span>{readCount} read</span>
                                <span className="mx-1">•</span>
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                <span>{totalUsers - readCount} unread</span>
                            </div>
                        </div>
                        {showUsers ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                    </button>

                    {showUsers && (
                        <div className="border-t border-outline-variant p-6 dark:border-slate-700">
                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search recipients..."
                                    value={searchUser}
                                    onChange={(e) =>
                                        setSearchUser(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-outline-variant px-10 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-outline-variant dark:border-slate-700">
                                            <th className="px-4 py-3 font-bold text-on-surface-variant dark:text-slate-400">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 font-bold text-on-surface-variant dark:text-slate-400">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 font-bold text-on-surface-variant dark:text-slate-400">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 font-bold text-on-surface-variant dark:text-slate-400">
                                                Read At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-8 text-center text-sm text-on-surface-variant dark:text-slate-400"
                                                >
                                                    No recipients found matching
                                                    your search.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-outline-variant/50 last:border-0 dark:border-slate-700/50"
                                                >
                                                    <td className="px-4 py-3 text-on-surface dark:text-white">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-on-surface-variant dark:text-slate-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {user.pivot.is_read ? (
                                                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                                <CheckCircle className="h-4 w-4" />
                                                                Read
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-slate-400">
                                                                <Clock className="h-4 w-4" />
                                                                Unread
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-on-surface-variant dark:text-slate-400">
                                                        {user.pivot.read_at
                                                            ? formatDateAndTime(
                                                                  user.pivot
                                                                      .read_at,
                                                              )
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-on-surface-variant uppercase dark:text-slate-400">
                                Total Recipients
                            </span>
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-on-surface dark:text-white">
                            {totalUsers}
                        </p>
                    </div>

                    <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-on-surface-variant uppercase dark:text-slate-400">
                                Read Rate
                            </span>
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {readPercentage}%
                        </p>
                        <p className="text-xs text-on-surface-variant dark:text-slate-400">
                            {readCount} out of {totalUsers} users have read this
                        </p>
                    </div>

                    <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-on-surface-variant uppercase dark:text-slate-400">
                                Unread
                            </span>
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {totalUsers - readCount}
                        </p>
                        <p className="text-xs text-on-surface-variant dark:text-slate-400">
                            Users who haven't seen this broadcast yet
                        </p>
                    </div>
                </div>

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
