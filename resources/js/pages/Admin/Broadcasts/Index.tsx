import AdminLayout from '@/layouts/Admin/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Megaphone,
    Plus,
    Eye,
    Trash2,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    AlertTriangle,
    Send,
    Calendar,
    Filter,
    Search,
    RefreshCw,
} from 'lucide-react';
import { formatDateAndTime } from '@/lib/calendar-utils';
import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/components/Shared/ConfirmationModal';

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
    read_count: number;
    users_count?: number;
}

interface BroadcastsIndexProps {
    broadcasts: Broadcast[];
}

export default function BroadcastsIndex({ broadcasts }: BroadcastsIndexProps) {
    // ─── 1. STATE ──────────────────────────────────────────────────

    // Use the confirmation hook
    const confirmation = useConfirmation();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<
        'all' | 'info' | 'warning' | 'success' | 'alert'
    >('all');
    const [filterPriority, setFilterPriority] = useState<
        'all' | 'normal' | 'high' | 'urgent'
    >('all');

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info':
                return Info;
            case 'success':
                return CheckCircle;
            case 'warning':
                return AlertTriangle;
            case 'alert':
                return AlertCircle;
            default:
                return Info;
        }
    };

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

    const filteredBroadcasts = broadcasts.filter((broadcast) => {
        const matchesSearch =
            broadcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            broadcast.message
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            broadcast.priority
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            broadcast.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType =
            filterType === 'all' || broadcast.type === filterType;
        const matchesPriority =
            filterPriority === 'all' || broadcast.priority === filterPriority;
        return matchesSearch && matchesType && matchesPriority;
    });

    const performHandleDelete = (id: number) => {
        router.delete(route('admin.broadcasts.destroy', id), {
            preserveScroll: true,
        });
    };

    const handleDelete = (broadcast: Broadcast) => {
        confirmation.confirm({
            title: 'Delete this broadcast?',
            message: `You're about to delete the broadcast "${broadcast.title}". This action cannot be undone.`,
            confirmLabel: 'Yes, Delete Broadcast',
            variant: 'danger',
            onConfirm: () => performHandleDelete(broadcast.id),
        });
    };

    const handleView = (id: number) => {
        router.post(route('admin.broadcasts.show', id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <div className="space-y-6 py-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
                            📢 Broadcasts
                        </h1>
                        <p className="mt-1 text-xs text-on-surface-variant dark:text-slate-400">
                            Send announcements and updates to your users.
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            router.visit(route('admin.broadcasts.create'))
                        }
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-sm shadow-primary/20 transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                        <Plus className="h-4 w-4" />
                        New Broadcast
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-outline-variant bg-surface p-4 dark:bg-slate-900">
                    <div className="relative min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search broadcasts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-10 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:bg-slate-800 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="info">Information</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="alert">Alert</option>
                    </select>

                    <select
                        value={filterPriority}
                        onChange={(e) =>
                            setFilterPriority(e.target.value as any)
                        }
                        className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:bg-slate-800 dark:text-white"
                    >
                        <option value="all">All Priorities</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>

                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setFilterType('all');
                            setFilterPriority('all');
                        }}
                        className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-sm hover:bg-surface-container"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reset
                    </button>
                </div>

                {/* Broadcasts Grid */}
                {filteredBroadcasts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface p-12 dark:bg-slate-900">
                        <Megaphone className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                        <h3 className="mt-4 text-lg font-bold text-on-surface dark:text-white">
                            No Broadcasts Yet
                        </h3>
                        <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                            Create your first broadcast to communicate with your
                            users.
                        </p>
                        <button
                            onClick={() =>
                                router.visit(route('admin.broadcasts.create'))
                            }
                            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary-container"
                        >
                            Create Broadcast
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBroadcasts.map((broadcast) => {
                            const TypeIcon = getTypeIcon(broadcast.type);
                            const totalUsers = broadcast.users_count || 0;
                            const readPercentage =
                                totalUsers > 0
                                    ? Math.round(
                                          (broadcast.read_count / totalUsers) *
                                              100,
                                      )
                                    : 0;

                            return (
                                <div
                                    key={broadcast.id}
                                    className="group rounded-xl border border-outline-variant bg-surface p-6 transition-all hover:shadow-md dark:bg-slate-900"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`rounded-lg p-1.5 ${getTypeColor(broadcast.type)}`}
                                            >
                                                <TypeIcon className="h-4 w-4" />
                                            </div>
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${getPriorityColor(broadcast.priority)}`}
                                            >
                                                {broadcast.priority}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-400">
                                            {formatDateAndTime(
                                                broadcast.created_at,
                                            )}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="mt-3 line-clamp-1 font-bold text-on-surface dark:text-white">
                                        {broadcast.title}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant dark:text-slate-400">
                                        {broadcast.message}
                                    </p>

                                    {/* Stats */}
                                    <div className="mt-4 flex items-center gap-4 border-t border-outline-variant pt-4 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>{totalUsers} users</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            <span>
                                                {broadcast.read_count} read
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                            <span className="font-bold text-primary">
                                                {readPercentage}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() =>
                                                handleView(broadcast.id)
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(broadcast)
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
