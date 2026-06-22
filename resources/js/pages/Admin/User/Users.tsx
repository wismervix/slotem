import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { User, UserStatus } from '@/types';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Link } from '@inertiajs/react';
import { extractAndFormatDate, extractAndFormatTime, formatDateAndTime, formatTime } from '@/lib/calendar-utils';

interface AdminUsersProps {
    users: User[];
}

export default function AdminUsers({ users }: AdminUsersProps) {
    const [searchQuery, setSearchQuery] = useState<string>('');


    // State Action Handlers
    const handleAddUser = (newUser: User) => {
        const updated = [newUser, ...users];
        // setUsers(updated);
        console.log("Added new user", updated)
    };
    
    const handleUpdateUser = (updatedUser: User) => {
        const updated = users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u,
    );
    // setUsers(updated);
    console.log("Updated new user", updated)
};

const handleDeleteUser = (userId: number) => {
        const updated = users.filter((u) => u.id !== userId);
        // setUsers(updated);
        console.log("Deleted new user", updated)
        // Also cancel bookings associated with deleted profiles
        const updatedBookings = users.flatMap((u) =>
            (u.bookings ?? []).map((b) => ({
                ...b,
                status: 'cancelled' as const,
            }))
        );
        
        // setBookings(updatedBookings);
        console.log("Cancelled all bookings ass. w this user", updatedBookings)
    };

    // Filters & Sorting state
    const [statusFilter, setStatusFilter] = useState<
        'All Statuses' | 'Active' | 'Inactive' | 'Suspended' | 'Deleted'
    >('All Statuses');
    const [sortBy, setSortBy] = useState<
        'Registration Date' | 'Name (A-Z)' | 'Most Bookings'
    >('Registration Date');
    const [dateFilter, setDateFilter] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Selected User Modal States
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);

    // Form states for Add/Edit
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formStatus, setFormStatus] = useState<UserStatus>('active');
    const [formAvatar, setFormAvatar] = useState('');

    // CSV Export animation/feedback
    const [showExportSuccess, setShowExportSuccess] = useState(false);

    // Refresh trigger handler
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setStatusFilter('All Statuses');
            setSortBy('Registration Date');
            setDateFilter('');
        }, 600);
    };

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
                return statuses.includes('active')
            case 'Inactive':
                return statuses.includes('inactive')
            case 'Suspended':
                return statuses.includes('suspended')
            case 'Deleted':
                return statuses.includes('deleted')
        }
        
        // return filter === 'All Statuses' || statuses === filter;
    };

    // Filtered & Sorted users list
    const processedUsers = useMemo(() => {
        return users
            .filter((user) => {
                // Search Query filter
                const query = searchQuery.toLowerCase().trim();
                const matchesSearch =
                    !query ||
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.id.toString().includes(query);

                // Status filter
                // const matchesStatus =
                //     statusFilter === 'All Statuses' ||
                //     user.status === statusFilter;
                const matchesStatus = doesStatusMatch(user.status, statusFilter);

                // Custom Date filter (e.g. Month name or date string)
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
                // Default Sort by Date (assume ID order correlates to registration order for simplicity, or reverse chronological)
                return b.id - a.id;
            });
    }, [users, searchQuery, statusFilter, sortBy, dateFilter]);


    // Paginated partition
    const totalItems = processedUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = useMemo(() => {
        return processedUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [processedUsers, startIndex]);

    // Adjust page boundary on filter change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, sortBy, dateFilter, searchQuery]);

    // Computed stats for quick insight cards
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

    // Export CSV simulation
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

    // Setup form with current user values for editing
    const handleStartEdit = (user: User) => {
        setEditingUser(user);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormPhone(user.phone || '');
        setFormStatus(user.status);
        setFormAvatar(user.avatar_url || '');
    };

    const handleSaveEdit = () => {
        if (!editingUser) return;
        if (!formName.trim() || !formEmail.trim()) {
            alert('Name and Email are required.');
            return;
        }
        const updated: User = {
            ...editingUser,
            name: formName,
            email: formEmail,
            phone: formPhone,
            status: formStatus,
            avatar_url:
                formAvatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        };
        handleUpdateUser(updated);
        setEditingUser(null);
    };

    const handleStartAdd = () => {
        setIsAddingUser(true);
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormStatus('active');
        // Random beautiful placeholder avatar_url
        const randId = Math.floor(Math.random() * 100);
        setFormAvatar(
            `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80`,
        );
    };

    const handleSaveAdd = () => {
        if (!formName.trim() || !formEmail.trim()) {
            alert('Name and Email are required.');
            return;
        }
        // Generate novel ID
        const newIdNum = 49200 + users.length + 1;
        const newUser: User = {
            // id: `SL-${newIdNum}`,
            id: newIdNum,
            name: formName,
            email: formEmail,
            phone: formPhone || '+1 (555) 000-0000',
            created_at: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            }),
            updated_at: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            }),
            email_verified_at: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            }),
            bookingsCount: 0,
            status: formStatus,
            avatar_url:
                formAvatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        };
        handleAddUser(newUser);
        setIsAddingUser(false);
    };

    const handleToggleStatus = (user: User) => {
        const nextStatus = user.status === 'active' ? 'suspended' : 'active';
        handleUpdateUser({ ...user, status: nextStatus });
    };

    console.log('Users Prop: ', users);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Top Title Bar */}
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
                            onClick={handleStartAdd}
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary shadow-sm shadow-primary/20 transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                {/* CSV Export Success Toast/indicator */}
                {showExportSuccess && (
                    <div className="animate-fade-in flex items-center gap-2 rounded-xl border border-green-200 bg-green-100 px-4 py-2 text-xs text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                        <Check className="h-4 w-4 text-green-700 dark:text-green-400" />
                        <span>
                            User roster successfully exported to local download
                            directory as CSV.
                        </span>
                    </div>
                )}

                {/* Filter Toolbar controls */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-outline-variant bg-surface p-4 dark:border-slate-700 dark:bg-slate-900">
                    {/* Status drop filter */}
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

                    {/* Custom date range simple search */}
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

                    {/* Sort drop filter */}
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

                    {/* Refresh clean triggers */}
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

                {/* Main Table Segment */}
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
                                            No users matching your filter inputs
                                            found. Try resetting filters.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((user) => {
                                        // Bookings relative bar (let's assume out of 30 max Bookings list scale for design styling)
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
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            alt={user.name}
                                                            referrerPolicy="no-referrer"
                                                            className="h-10 w-10 rounded-full border border-outline-variant/40 object-cover dark:border-slate-700"
                                                            src={user.avatar_url}
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
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-medium text-on-surface dark:text-white">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant dark:text-slate-500">
                                                        {user.phone}
                                                    </p>
                                                </td>
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
                                                            ></span>
                                                        </span>
                                                    </div>
                                                </td>
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
                                                <td className="px-6 py-4 text-right">
                                                    {/* Inline actions fade in on hover */}
                                                    <div className="flex items-center justify-end gap-1.5 transition-opacity group-hover:opacity-100 md:opacity-0">
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
                                                        <button
                                                            onClick={() =>
                                                                handleStartEdit(
                                                                    user,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg p-1.5 text-outline transition-all hover:bg-primary/5 hover:text-primary dark:text-slate-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-400"
                                                            title="Edit Credentials"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
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
                                                                    ? 'Toggle Suspend'
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

                    {/* Footer with Pagination selectors */}
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

                {/* Insight Bento row underneath */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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

                {/* view_file detail dialog */}
                {viewingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs dark:bg-black/60">
                        <div className="animate-scale-up w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-2xl dark:border-slate-700 dark:bg-slate-900">
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
                                                {/* {viewingUser.registeredTime} */}
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

                                {/* Connected User Bookings Schedule */}
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

                            <div className="flex justify-end gap-2.5 bg-surface-container p-4 dark:bg-slate-800">
                                <button
                                    onClick={() => setViewingUser(null)}
                                    className="cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-on-surface-variant transition-all hover:bg-surface-container-low dark:text-slate-500 dark:hover:bg-slate-700"
                                >
                                    Close Details
                                </button>
                                <Link
                                    href={route('admin.users.details', {user: viewingUser.id})}
                                    className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                                >
                                    View Profile Details
                                </Link>
                                <button
                                    onClick={() => {
                                        const toEdit = viewingUser;
                                        setViewingUser(null);
                                        handleStartEdit(toEdit);
                                    }}
                                    className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                                >
                                    Modify profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Form Modal */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs dark:bg-black/60">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
                                <h3 className="text-sm font-bold text-on-surface dark:text-white">
                                    Edit User: {editingUser.name}
                                </h3>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="cursor-pointer text-on-surface-variant hover:text-on-surface dark:text-slate-500 dark:hover:text-slate-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4 p-6 text-xs">
                                <div>
                                    <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) =>
                                            setFormName(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formEmail}
                                        onChange={(e) =>
                                            setFormEmail(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formPhone}
                                        onChange={(e) =>
                                            setFormPhone(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Operational Status
                                        </label>
                                        <select
                                            value={formStatus}
                                            onChange={(e) =>
                                                setFormStatus(
                                                    e.target.value as any,
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
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Avatar Image URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formAvatar}
                                            onChange={(e) =>
                                                setFormAvatar(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-outline-variant px-3 py-2 font-mono text-[10px] text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between bg-surface-container px-6 py-4 dark:bg-slate-800">
                                <button
                                    onClick={() => {
                                        if (
                                            confirm(
                                                `Are you absolutely sure you want to delete client ${editingUser.name}? All history will be archived.`,
                                            )
                                        ) {
                                            handleDeleteUser(editingUser.id);
                                            setEditingUser(null);
                                        }
                                    }}
                                    className="cursor-pointer rounded-lg border border-red-200 px-3.5 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                                >
                                    Delete Client Profile
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingUser(null)}
                                        className="cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low dark:text-slate-500 dark:hover:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm shadow-primary/20 hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add User Form Dialog */}
                {isAddingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs dark:bg-black/60">
                        <div className="animate-scale-up w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
                                <h3 className="text-sm font-bold text-on-surface dark:text-white">
                                    Register New User
                                </h3>
                                <button
                                    onClick={() => setIsAddingUser(false)}
                                    className="cursor-pointer text-on-surface-variant hover:text-on-surface dark:text-slate-500 dark:hover:text-slate-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4 p-6 text-xs">
                                <div>
                                    <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                        Client Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Samantha Vance"
                                        value={formName}
                                        onChange={(e) =>
                                            setFormName(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-outline/65 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-600 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                        Official Email *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        value={formEmail}
                                        onChange={(e) =>
                                            setFormEmail(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-outline/65 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-600 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                        Mobile Phone
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+1 (555) 000-0000"
                                        value={formPhone}
                                        onChange={(e) =>
                                            setFormPhone(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-outline/65 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-600 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Initial Status
                                        </label>
                                        <select
                                            value={formStatus}
                                            onChange={(e) =>
                                                setFormStatus(
                                                    e.target.value as any,
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
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block font-bold tracking-wider text-outline uppercase dark:text-slate-400">
                                            Headshot Preset
                                        </label>
                                        <select
                                            onChange={(e) =>
                                                setFormAvatar(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                        >
                                            <option value="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150">
                                                Professional Female A
                                            </option>
                                            <option value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150">
                                                Professional Male A
                                            </option>
                                            <option value="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150">
                                                Professional Female B
                                            </option>
                                            <option value="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150">
                                                Professional Male B
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2.5 bg-surface-container px-6 py-4 dark:bg-slate-800">
                                <button
                                    onClick={() => setIsAddingUser(false)}
                                    className="cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low dark:text-slate-500 dark:hover:bg-slate-700"
                                >
                                    Abandon
                                </button>
                                <button
                                    onClick={handleSaveAdd}
                                    className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-on-primary shadow-sm shadow-primary/20 transition-all hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                                >
                                    Register User
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
