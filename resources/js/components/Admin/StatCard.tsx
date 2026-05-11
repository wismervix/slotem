import { motion } from 'motion/react';

interface Props {
    label: string;
    value: string;
    icon: any;
    color: string;
    isAccent?: boolean;
}

export default function StatCard({
    label,
    value,
    icon: Icon,
    color,
    isAccent = false,
}: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-outline-variant flex h-32 flex-col justify-between rounded-2xl border p-4 ${
                isAccent ? 'bg-primary text-primary-foreground' : 'bg-white'
            }`}
        >
            <div className="flex items-start justify-between">
                <span
                    className={`text-[10px] font-bold tracking-wider uppercase ${
                        isAccent
                            ? 'text-primary-foreground/80'
                            : 'text-on-surface-variant'
                    }`}
                >
                    {label}
                </span>

                <Icon
                    size={20}
                    className={isAccent ? 'text-primary-foreground' : color}
                />
            </div>

            <div className="text-2xl font-bold">{value}</div>
        </motion.div>
    );
}
