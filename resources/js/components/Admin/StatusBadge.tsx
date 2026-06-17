import type { BookingStatus } from '@/types/booking';

interface Props {
    status: BookingStatus;
}

export default function StatusBadge({ status }: Props) {
    const styles = {
        pending: 'bg-tertiary-fixed text-on-tertiary-fixed',
        approved: 'bg-secondary-container text-on-secondary-container',
        completed: 'bg-surface-container-highest text-on-surface-variant',
        cancelled: 'bg-error-container text-on-error-container',
        rejected: 'bg-error-container text-on-error-container',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
