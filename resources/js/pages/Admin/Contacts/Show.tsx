// resources/js/Pages/Admin/Contacts/Show.tsx
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Mail,
    User,
    Calendar,
    Reply,
    Archive,
    Trash2,
    Check,
    X,
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
    admin_notes: string | null;
    created_at: string;
    replied_by?: {
        name: string;
    };
}

interface ContactShowProps {
    contact: Contact;
}

export default function ContactShow({ contact }: ContactShowProps) {
    const { data, setData, patch, processing } = useForm({
        admin_notes: contact.admin_notes || '',
    });

    const handleMarkReplied = () => {
        patch(route('admin.contacts.replied', contact.id), {
            preserveScroll: true,
        });
    };

    const handleArchive = () => {
        if (confirm('Archive this contact?')) {
            router.patch(route('admin.contacts.archive', contact.id));
        }
    };

    const handleDelete = () => {
        if (confirm('Delete this contact permanently?')) {
            router.delete(route('admin.contacts.destroy', contact.id));
        }
    };

    const handleBack = () => {
        router.visit(route('admin.contacts.index'));
    };

    return (
        <AdminLayout>
            <div className="space-y-6 py-6">
                {/* Navigation */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface dark:text-slate-400 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Contacts
                </button>

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-on-surface dark:text-white">
                                {contact.subject}
                            </h1>
                            {contact.status === 'new' && (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-400">
                                    New
                                </span>
                            )}
                            {contact.status === 'replied' && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950/30 dark:text-green-400">
                                    Replied
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                            From {contact.name} • {contact.email}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {contact.status !== 'replied' && (
                            <button
                                onClick={handleMarkReplied}
                                disabled={processing}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-sm shadow-primary/20 hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                            >
                                <Reply className="h-4 w-4" />
                                Mark as Replied
                            </button>
                        )}
                        {contact.status !== 'archived' && (
                            <button
                                onClick={handleArchive}
                                className="flex items-center gap-2 rounded-lg border border-outline px-4 py-2 text-sm font-semibold hover:bg-surface-container"
                            >
                                <Archive className="h-4 w-4" />
                                Archive
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Message Content */}
                <div className="rounded-xl border border-outline-variant bg-surface p-6 dark:bg-slate-900">
                    <div className="flex flex-col gap-6 md:flex-row">
                        {/* Left: Message */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <h3 className="font-bold text-on-surface dark:text-white">Message</h3>
                            </div>
                            <div className="rounded-lg bg-surface-container-low p-4 dark:bg-slate-800">
                                <p className="whitespace-pre-wrap text-sm text-on-surface dark:text-white">
                                    {contact.message}
                                </p>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="w-full md:w-64 space-y-4">
                            <div className="rounded-lg bg-surface-container-low p-4 dark:bg-slate-800">
                                <h4 className="mb-3 text-xs font-bold text-on-surface-variant uppercase dark:text-slate-500">
                                    Details
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-on-surface-variant dark:text-slate-500">Type</p>
                                        <p className="text-sm font-semibold text-on-surface dark:text-white capitalize">
                                            {contact.type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-on-surface-variant dark:text-slate-500">Status</p>
                                        <p className="text-sm font-semibold text-on-surface dark:text-white capitalize">
                                            {contact.status}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-on-surface-variant dark:text-slate-500">Received</p>
                                        <p className="text-sm font-semibold text-on-surface dark:text-white">
                                            {formatDateAndTime(contact.created_at)}
                                        </p>
                                    </div>
                                    {contact.read_at && (
                                        <div>
                                            <p className="text-xs text-on-surface-variant dark:text-slate-500">Read At</p>
                                            <p className="text-sm font-semibold text-on-surface dark:text-white">
                                                {formatDateAndTime(contact.read_at)}
                                            </p>
                                        </div>
                                    )}
                                    {contact.replied_at && (
                                        <div>
                                            <p className="text-xs text-on-surface-variant dark:text-slate-500">Replied At</p>
                                            <p className="text-sm font-semibold text-on-surface dark:text-white">
                                                {formatDateAndTime(contact.replied_at)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div className="rounded-lg bg-surface-container-low p-4 dark:bg-slate-800">
                                <h4 className="mb-3 text-xs font-bold text-on-surface-variant uppercase dark:text-slate-500">
                                    Admin Notes
                                </h4>
                                <textarea
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    placeholder="Add internal notes about this contact..."
                                    rows={3}
                                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                                {data.admin_notes !== contact.admin_notes && (
                                    <button
                                        onClick={() => {
                                            patch(route('admin.contacts.replied', contact.id), {
                                                preserveScroll: true,
                                            });
                                        }}
                                        disabled={processing}
                                        className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary-container dark:bg-purple-600 dark:hover:bg-purple-700"
                                    >
                                        Save Notes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}