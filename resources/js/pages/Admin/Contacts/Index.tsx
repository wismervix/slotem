// resources/js/Pages/Admin/Contacts/Index.tsx
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Mail,
    Eye,
    Trash2,
    Check,
    Archive,
    Search,
    Filter,
    Clock,
    User,
    Calendar,
    MessageSquare,
} from 'lucide-react';
import { formatDateAndTime } from '@/lib/calendar-utils';

interface Contact {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    type: 'general' | 'sales';
    status: 'new' | 'read' | 'replied' | 'archived';
    read_at: string | null;
    replied_at: string | null;
    created_at: string;
}

interface ContactsIndexProps {
    contacts: Contact[];
    unreadCount: number;
}

export default function ContactsIndex({ contacts, unreadCount }: ContactsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'general' | 'sales'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch = 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || contact.type === filterType;
        const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleArchive = (id: number) => {
        if (confirm('Archive this contact?')) {
            router.patch(route('admin.contacts.archive', id), {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this contact permanently?')) {
            router.delete(route('admin.contacts.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleView = (id: number) => {
        router.visit(route('admin.contacts.show', id));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-400">New</span>;
            case 'read':
                return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/30 dark:text-blue-400">Read</span>;
            case 'replied':
                return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950/30 dark:text-green-400">Replied</span>;
            case 'archived':
                return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-950/30 dark:text-gray-400">Archived</span>;
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 py-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
                            📬 Contact Messages
                        </h1>
                        <p className="mt-1 text-xs text-on-surface-variant dark:text-slate-400">
                            Manage and respond to customer inquiries.
                            {unreadCount > 0 && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-400">
                                    {unreadCount} unread
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-outline-variant bg-surface p-4 dark:bg-slate-900">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-10 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="general">General</option>
                        <option value="sales">Sales</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setFilterType('all');
                            setFilterStatus('all');
                        }}
                        className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-sm hover:bg-surface-container"
                    >
                        <Filter className="h-4 w-4" />
                        Reset
                    </button>
                </div>

                {/* Contacts Table */}
                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-low dark:border-slate-700 dark:bg-slate-800">
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Sender
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Subject
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Received
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-on-surface-variant uppercase dark:text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/60 dark:divide-slate-700">
                                {filteredContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-on-surface-variant/80 dark:text-slate-500">
                                            No contacts found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContacts.map((contact) => (
                                        <tr
                                            key={contact.id}
                                            className={`transition-colors hover:bg-surface-container/60 dark:hover:bg-slate-800/50 ${
                                                contact.status === 'new' ? 'bg-primary/5' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface dark:text-white">
                                                        {contact.name}
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant dark:text-slate-500">
                                                        {contact.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-medium text-on-surface dark:text-white">
                                                    {contact.subject}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    contact.type === 'sales'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                                                }`}>
                                                    {contact.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(contact.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-on-surface-variant dark:text-slate-500">
                                                    {formatDateAndTime(contact.created_at)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleView(contact.id)}
                                                        className="cursor-pointer rounded-lg p-1.5 text-outline transition-all hover:bg-primary/5 hover:text-primary dark:text-slate-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-400"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {contact.status !== 'archived' && (
                                                        <button
                                                            onClick={() => handleArchive(contact.id)}
                                                            className="cursor-pointer rounded-lg p-1.5 text-outline transition-all hover:bg-primary/5 hover:text-primary dark:text-slate-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-400"
                                                            title="Archive"
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(contact.id)}
                                                        className="cursor-pointer rounded-lg p-1.5 text-outline transition-all hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}