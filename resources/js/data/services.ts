import type { Service } from '@/types';

export const services: Service[] = [
    {
        id: 'service-1',
        icon: 'Scissors',
        name: 'Signature Haircut',
        description:
            'Our most requested service. Includes consultation, precision cut, scalp massage, and styling.',
        duration: 45,
        price: 45,
        active: true,
        badges: ['popular', 'recommended'],
        variant: 'standard',
    },

    {
        id: 'service-2',
        icon: 'UserCheck',
        name: 'Beard Trim & Sculpt',
        description:
            'A meticulous trim and shape-up using clippers and shears. Finished with organic beard oil.',
        duration: 20,
        price: 25,
        active: true,
        variant: 'standard',
    },

    {
        id: 'service-3',
        icon: 'Sparkles',
        name: 'Classic Hot Towel Shave',
        description:
            'Traditional straight razor shave with hot towels and premium pre-shave treatment.',
        duration: 30,
        price: 35,
        active: true,
        variant: 'standard',
    },

    {
        id: 'service-4',
        icon: 'Paintbrush',
        name: 'Hair Coloring',
        description:
            "Full color or grey coverage using premium dyes that protect your hair's health.'",
        duration: 60,
        price: 60,
        active: true,
        badges: ['popular'],
        variant: 'standard',
    },

    {
        id: 'deluxe-service-1',
        icon: 'ShieldCheck',
        name: 'The Deluxe Package',
        description:
            'Our ultimate experience combining the Signature Haircut, Beard Trim, and Charcoal Facial Mask.',
        duration: 90,
        price: 85,
        active: true,
        badges: ['popular', 'recommended', 'best-value'],
        variant: 'featured',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop',
    },
];
