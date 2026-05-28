import {
    Scissors,
    Sparkles,
    ShieldCheck,
    Paintbrush,
    UserCheck,
    Smile,
} from 'lucide-react';

import type { ServiceIcon } from '@/types/service';

export const serviceIcons = {
    scissors: Scissors,
    'user-check': UserCheck,
    sparkles: Sparkles,
    paintbrush: Paintbrush,
    'shield-check': ShieldCheck,
} satisfies Record<ServiceIcon, any>;

export const getServiceIcon = (iconKey?: ServiceIcon) => {
    return iconKey ? serviceIcons[iconKey] : Smile;
};

export const getServiceTheme = (serviceIcon: string) => {
    switch (serviceIcon) {
        case 'scissors':
            return 'bg-primary-container text-on-primary-container border-l-4 border-primary';
        case 'user-check':
            return 'bg-secondary-fixed text-on-secondary-fixed border-l-4 border-secondary';
        case 'sparkles':
            return 'bg-tertiary-fixed text-on-tertiary-fixed border-l-4 border-tertiary';
        case 'paintbrush':
            return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-l-4 border-blue-600';
        case 'shield-check':
            return 'bg-teal-100 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 border-l-4 border-teal-600';
        default:
            return 'bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 border-l-4 border-purple-600';
    }
};

export const getServiceIconTheme = (serviceIcon: string) => {
    const base =
        'flex h-14 w-14 items-center justify-center rounded-xl border transition-colors';

    switch (serviceIcon) {
        case 'scissors':
            return `${base}  border-l-4 bg-primary/10 text-primary border-primary/20 dark:bg-primary/15 dark:text-primary dark:border-primary/30`;

        case 'user-check':
            return `${base}  border-l-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20`;

        case 'sparkles':
            return `${base}  border-l-4 bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-400/20`;

        case 'paintbrush':
            return `${base}  border-l-4 bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/20`;

        case 'shield-check':
            return `${base}  border-l-4 bg-teal-500/10 text-teal-600 border-teal-500/20 dark:bg-teal-400/10 dark:text-teal-300 dark:border-teal-400/20`;

        default:
            return `${base}  border-l-4 bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:bg-zinc-400/10 dark:text-zinc-300 dark:border-zinc-400/20`;
    }
};
