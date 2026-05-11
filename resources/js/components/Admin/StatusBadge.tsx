import type { BookingStatus } from '@/types/booking';

interface Props {
    status: BookingStatus;
}

export default function StatusBadge({ status }: Props) {
    const styles = {
        Pending: 'bg-tertiary-fixed text-on-tertiary-fixed',
        Confirmed: 'bg-secondary-container text-on-secondary-container',
        Completed: 'bg-surface-container-highest text-on-surface-variant',
        Cancelled: 'bg-error-container text-on-error-container',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {status}
        </span>
    );
}
