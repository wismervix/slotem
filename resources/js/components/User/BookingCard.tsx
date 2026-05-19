import { MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

interface BookingCardProps {
    image: string;
    status: 'Confirmed' | 'Pending';
    refId: string;
    title: string;
    provider: string;
    location: string;
    date: string;
    time: string;
    actionLabel: string;
    actionType?: 'reschedule' | 'cancel';
}

export default function BookingCard({
    image,
    status,
    refId,
    title,
    provider,
    location,
    date,
    time,
    actionLabel,
    actionType = 'reschedule',
}: BookingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest flex flex-col items-start gap-6 rounded-2xl border border-outline-variant p-6 transition-shadow hover:shadow-md md:flex-row md:items-center"
        >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-container-high">
                <img
                    alt={provider}
                    className="h-full w-full object-cover"
                    src={image}
                    referrerPolicy="no-referrer"
                />
            </div>

            <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                    <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                            status === 'Confirmed'
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-tertiary-container text-on-tertiary-container'
                        }`}
                    >
                        {status}
                    </span>
                    <span className="text-outline text-xs">Ref: {refId}</span>
                </div>
                <h4 className="text-lg font-semibold text-on-surface">
                    {title}
                </h4>
                <p className="text-sm text-on-surface-variant">
                    {provider} • {location}
                </p>
            </div>

            <div className="w-full border-t border-outline-variant pt-4 md:w-auto md:border-t-0 md:border-l md:pt-0 md:pl-6 md:text-right">
                <p className="text-lg font-semibold text-primary">{date}</p>
                <p className="text-sm font-medium text-on-surface-variant">
                    {time}
                </p>
            </div>

            <div className="flex w-full gap-2 md:w-auto">
                <button
                    className={`flex-1 rounded-lg border border-outline-variant px-4 py-2 text-xs font-semibold transition-colors hover:bg-surface-container md:flex-none ${
                        actionType === 'cancel'
                            ? 'text-error hover:bg-error-container/10'
                            : 'text-on-surface'
                    }`}
                >
                    {actionLabel}
                </button>
                <button className="flex-1 rounded-lg p-2 text-primary transition-colors hover:bg-primary-container md:flex-none">
                    <MoreVertical className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    );
}
