export type ServiceIcon =
    | 'scissors'
    | 'user-check'
    | 'sparkles'
    | 'paintbrush'
    | 'shield-check';

export type ServiceBadge = 'popular' | 'recommended' | 'best-value';

export interface Service {
    id: number;
    name: string;
    icon: ServiceIcon;
    description?: string | null;
    image?: string | null;
    price: string;
    variant: 'standard' | 'featured';

    // duration in minutes
    duration: number;

    active: boolean;
    badges?: ServiceBadge[] | null;
    created_at: string;
    image_public_id?: string | null;
    [key: string]: unknown; // This allows for additional properties...
}
