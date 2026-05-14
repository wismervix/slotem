import type { IconName } from "@/pages/Guest/Services";

export type ServiceBadge = 'popular' | 'recommended' | 'best-value';

export interface Service {
    id: string;
    name: string;
    icon: IconName;
    description?: string;
    image?: string;
    price: number;
    variant: 'standard' | 'featured';

    // duration in minutes
    duration: number;

    active?: boolean;
    badges?: ServiceBadge[];
}
