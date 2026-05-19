import { CheckCircle2, XCircle } from 'lucide-react';

interface HistoryItemProps {
    title: string;
    date: string;
    status: 'Completed' | 'Cancelled';
    actionLabel: string;
}

export default function HistoryItem({
    title,
    date,
    status,
    actionLabel,
}: HistoryItemProps) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-low/50 p-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-high">
                {status === 'Completed' ? (
                    <CheckCircle2 className="text-outline h-6 w-6" />
                ) : (
                    <XCircle className="text-error h-6 w-6 opacity-60" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h5 className="truncate text-sm font-semibold text-on-surface">
                    {title}
                </h5>
                <p className="text-xs text-on-surface-variant">
                    {date} • {status}
                </p>
            </div>
            <button className="text-xs font-bold whitespace-nowrap text-primary hover:underline">
                {actionLabel}
            </button>
        </div>
    );
}
