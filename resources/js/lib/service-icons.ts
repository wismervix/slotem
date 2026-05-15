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
