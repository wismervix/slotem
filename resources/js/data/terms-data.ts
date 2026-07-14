import { TermsVersionInfo } from '@/types';

export const TERMS_VERSIONS: TermsVersionInfo[] = [
    {
        id: 'v3',
        date: 'May 24, 2024',
        description:
            'Current Version - Updated user obligations and clarified intellectual property rights.',
        changes: [
            'Added explicit provisions regarding AI-assisted scheduling features.',
            'Clarified data ownership and intellectual property rights for user-generated content.',
            'Updated payment terms with clearer refund and cancellation policies.',
            'Added section on third-party service integrations and their respective terms.',
            'Enhanced limitation of liability clauses for enterprise users.',
        ],
    },
    {
        id: 'v2',
        date: 'January 12, 2023',
        description:
            'Intermediate Release - Introduced payment processing and commercial usage terms.',
        changes: [
            'Added Stripe payment processing terms and conditions.',
            'Introduced commercial usage licensing for teams and enterprises.',
            'Clarified account termination procedures and data retention policies.',
            'Added governing law provisions specific to California jurisdiction.',
        ],
    },
    {
        id: 'v1',
        date: 'October 08, 2022',
        description:
            'Initial Terms - First established Slotem legal framework.',
        changes: [
            'Established core terms of service for scheduling platform usage.',
            'Defined user obligations and acceptable use policies.',
            'Created initial intellectual property and copyright protections.',
            'Set basic limitation of liability framework.',
        ],
    },
];
