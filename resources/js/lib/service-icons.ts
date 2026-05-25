import {
    Scissors,
    Sparkles,
    ShieldCheck,
    Paintbrush,
    UserCheck,
} from 'lucide-react';

import type { ServiceIcon } from '@/types/service';

export const serviceIcons = {
    scissors: Scissors,
    'user-check': UserCheck,
    sparkles: Sparkles,
    paintbrush: Paintbrush,
    'shield-check': ShieldCheck,
} satisfies Record<ServiceIcon, any>;

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
