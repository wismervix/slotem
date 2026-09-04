// resources/js/Pages/Admin/Broadcasts/Create.tsx
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Megaphone,
    Search,
    Send,
    Users,
    Clock,
    Check,
    AlertCircle,
    Info,
    CheckCircle,
    AlertTriangle,
    X,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    users: User[];
}

export default function CreateBroadcast({ users }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        message: '',
        type: 'info',
        priority: 'normal',
        target_audience: ['all'],
        target_users: [] as number[],
        scheduled_at: '',
        expires_at: '',
    });

    const [userSearch, setUserSearch] = useState('');

    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase()),
    );

    const audienceOptions = [
        { value: 'all', label: 'All Users' },
        { value: 'admins', label: 'Admins Only' },
        { value: 'custom', label: 'Custom Users' },
    ];

    const typeOptions = [
        {
            value: 'info',
            label: 'Information',
            icon: Info,
            color: 'text-blue-500',
        },
        {
            value: 'success',
            label: 'Success',
            icon: CheckCircle,
            color: 'text-emerald-500',
        },
        {
            value: 'warning',
            label: 'Warning',
            icon: AlertTriangle,
            color: 'text-amber-500',
        },
        {
            value: 'alert',
            label: 'Alert',
            icon: AlertCircle,
            color: 'text-red-500',
        },
    ];

    const priorityOptions = [
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate custom audience
        if (
            data.target_audience.includes('custom') &&
            selectedUsers.length === 0
        ) {
            alert('Please select at least one user for custom audience.');
            return;
        }

        // Make sure target_users is set
        if (data.target_audience.includes('custom')) {
            setData(
                'target_users',
                selectedUsers.map((u) => u.id),
            );
        } else {
            setData('target_users', []);
        }

        // Submit the form
        post(route('admin.broadcasts.store'));
    };

    return (
        <AdminLayout>
            <div className="mx-auto max-w-4xl space-y-6 py-6">
                {/* Header */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
                            Create Broadcast
                        </h1>
                        <p className="mt-1 text-xs text-on-surface-variant dark:text-slate-400">
                            Send announcements, updates, or alerts to your
                            users.
                        </p>
                    </div>
                    <button
                        onClick={() => router.visit(route('admin.broadcasts'))}
                        className="flex items-center gap-2 rounded-lg border border-outline px-4 py-2 text-xs font-semibold hover:bg-surface-container-dark/90"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                    Broadcast Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="e.g., System Maintenance Notice"
                                    className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                    Message
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    rows={5}
                                    placeholder="Enter your broadcast message here..."
                                    className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    required
                                />
                                {errors.message && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                        <h3 className="mb-4 text-sm font-bold text-on-surface dark:text-white">
                            Broadcast Settings
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Type */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                    Type
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    {typeOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                    Priority
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={(e) =>
                                        setData('priority', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    {priorityOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Target Audience */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                    Target Audience
                                </label>
                                <select
                                    value={
                                        data.target_audience.includes('custom')
                                            ? 'custom'
                                            : data.target_audience[0]
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'custom') {
                                            setData('target_audience', [
                                                'custom',
                                            ]);
                                        } else {
                                            setData('target_audience', [value]);
                                        }
                                    }}
                                    className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    {audienceOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {data.target_audience.includes('custom') && (
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                        Select Users
                                    </label>

                                    {/* User search */}
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search users by name or email..."
                                            value={userSearch}
                                            onChange={(e) =>
                                                setUserSearch(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-outline-variant py-2 pr-4 pl-10 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    {/* Selected users tags */}
                                    {selectedUsers.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUsers.map((user) => (
                                                <span
                                                    key={user.id}
                                                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                                                >
                                                    {user.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const exists =
                                                                selectedUsers.some(
                                                                    (u) =>
                                                                        u.id ===
                                                                        user.id,
                                                                );

                                                            let updatedUsers;

                                                            if (exists) {
                                                                updatedUsers =
                                                                    selectedUsers.filter(
                                                                        (u) =>
                                                                            u.id !==
                                                                            user.id,
                                                                    );
                                                            } else {
                                                                updatedUsers = [
                                                                    ...selectedUsers,
                                                                    user,
                                                                ];
                                                            }

                                                            setSelectedUsers(
                                                                updatedUsers,
                                                            );

                                                            setData(
                                                                'target_users',
                                                                updatedUsers.map(
                                                                    (u) => u.id,
                                                                ),
                                                            );
                                                        }}
                                                        className="text-primary hover:text-primary/70"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* User list */}
                                    <div className="max-h-48 overflow-y-auto rounded-lg border border-outline-variant dark:border-slate-700">
                                        {filteredUsers
                                            .filter(
                                                (user) =>
                                                    user.name
                                                        .toLowerCase()
                                                        .includes(
                                                            userSearch.toLowerCase(),
                                                        ) ||
                                                    user.email
                                                        .toLowerCase()
                                                        .includes(
                                                            userSearch.toLowerCase(),
                                                        ),
                                            )
                                            .map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            selectedUsers.some(
                                                                (u) =>
                                                                    u.id ===
                                                                    user.id,
                                                            )
                                                        ) {
                                                            setSelectedUsers(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (u) =>
                                                                            u.id !==
                                                                            user.id,
                                                                    ),
                                                            );
                                                        } else {
                                                            setSelectedUsers(
                                                                (prev) => [
                                                                    ...prev,
                                                                    user,
                                                                ],
                                                            );
                                                        }
                                                    }}
                                                    className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-surface-container-low ${
                                                        selectedUsers.some(
                                                            (u) =>
                                                                u.id ===
                                                                user.id,
                                                        )
                                                            ? 'bg-primary/5 text-primary'
                                                            : 'text-on-surface'
                                                    }`}
                                                >
                                                    <span>{user.name}</span>
                                                    <span className="text-xs text-on-surface-variant">
                                                        {user.email}
                                                    </span>
                                                    {selectedUsers.some(
                                                        (u) => u.id === user.id,
                                                    ) && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        {filteredUsers.length === 0 && (
                                            <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
                                                No users found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Schedule */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                    Schedule (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={(e) =>
                                        setData('scheduled_at', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Expiry */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                                    Expires At (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.expires_at}
                                    onChange={(e) =>
                                        setData('expires_at', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                        <h3 className="mb-4 text-sm font-bold text-on-surface dark:text-white">
                            Preview
                        </h3>
                        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4 dark:bg-slate-800">
                            <div className="flex items-start gap-3">
                                <div
                                    className={`rounded-lg p-2 ${
                                        data.type === 'info'
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                                            : data.type === 'success'
                                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                                              : data.type === 'warning'
                                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                                                : 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                                    }`}
                                >
                                    {data.type === 'info' && (
                                        <Info className="h-5 w-5" />
                                    )}
                                    {data.type === 'success' && (
                                        <CheckCircle className="h-5 w-5" />
                                    )}
                                    {data.type === 'warning' && (
                                        <AlertTriangle className="h-5 w-5" />
                                    )}
                                    {data.type === 'alert' && (
                                        <AlertCircle className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-on-surface dark:text-white">
                                            {data.title || 'Broadcast Title'}
                                        </h4>
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                                                data.priority === 'urgent'
                                                    ? 'bg-red-500 text-white'
                                                    : data.priority === 'high'
                                                      ? 'bg-amber-500 text-white'
                                                      : 'bg-blue-500 text-white'
                                            }`}
                                        >
                                            {data.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                                        {data.message ||
                                            'Your broadcast message will appear here.'}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant dark:text-slate-500">
                                        <Users className="h-3 w-3" />
                                        <span>
                                            {data.target_audience.includes(
                                                'all',
                                            )
                                                ? 'All Users'
                                                : data.target_audience.includes(
                                                        'admins',
                                                    )
                                                  ? 'Admins Only'
                                                  : 'Custom Users'}
                                        </span>
                                        {data.scheduled_at && (
                                            <>
                                                <span>•</span>
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    Scheduled:{' '}
                                                    {new Date(
                                                        data.scheduled_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-wrap sm:flex-nowrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                router.visit(route('admin.broadcasts'))
                            }
                            className="rounded-lg border border-outline px-6 py-2.5 text-sm font-semibold hover:bg-surface-container-dark/90"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary shadow-sm shadow-primary/20 hover:bg-primary-container disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Broadcast
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
