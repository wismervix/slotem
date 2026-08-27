import { VersionInfo } from '../types';

export const POLICY_VERSIONS: VersionInfo[] = [
    {
        id: 'v3',
        date: 'August 11, 2026',
        description:
            'Current Version - Added advanced enterprise security safeguards and SendGrid email delivery services.',
        changes: [
            'Added SendGrid as a trusted third-party subprocessor for email delivery and calendar reminders.',
            'Upgraded transit encryption standard strictly to TLS 1.3 across all scheduling endpoints.',
            'Reduced initial data deletion SLA response window to 30 days maximum (down from 45 days).',
            'Clarified user rights procedures under GDPR and CCPA.',
        ],
    },
    {
        id: 'v2',
        date: 'May 24, 2024',
        description:
            'Intermediate Release - Introduced support for Stripe payments and localized timezone matching.',
        changes: [
            'Integrated Stripe payment processing for enterprise booking tiers.',
            'Introduced performance monitoring cookies for analytics and platform stabilization.',
            'Added physical calendar synchronization with Google Workspace and AWS Cloud hosting.',
        ],
    },
    {
        id: 'v1',
        date: 'January 12, 2023',
        description:
            'Initial Policy - First established Slotem privacy framework.',
        changes: [
            'Established core policies regarding data collection of account info and scheduling entries.',
            'Defined essential cookie mechanics for basic user authentication.',
        ],
    },
];

export const SUB_PROCESSORS = [
    {
        name: 'Stripe',
        purpose: 'Payment Processing',
        icon: 'credit-card',
        details:
            'Used to process customer payments securely. We do not store or transit full card data.',
    },
    {
        name: 'AWS',
        purpose: 'Cloud Infrastructure',
        icon: 'cloud',
        details:
            'Hosts our encrypted databases and server workloads under strict compliance agreements.',
    },
    {
        name: 'SendGrid',
        purpose: 'Email Communication',
        icon: 'mail',
        details:
            'Delivers appointment confirmations, calendar invites, and legal security alerts.',
    },
];

export const DATA_RIGHTS = [
    {
        id: 'access',
        title: 'Right to Access',
        description:
            'Request a comprehensive copy of all personal data we hold about your scheduling account.',
        icon: 'download',
        details:
            'We will compile a structured, machine-readable ZIP package containing your profile details, scheduling history, and preferences.',
    },
    {
        id: 'rectify',
        title: 'Right to Rectify',
        description:
            'Correct inaccurate or incomplete account details or calendar booking profiles.',
        icon: 'edit',
        details:
            'Ensure your timezone, emails, and phone numbers are completely accurate to avoid booking errors.',
    },
    {
        id: 'erasure',
        title: 'Right to Erasure',
        description:
            'Request complete deletion of your account and all associated personal calendar history.',
        icon: 'trash-2',
        details:
            'This is irreversible. We purge database records within 30 days except where active compliance holds apply.',
    },
    {
        id: 'object',
        title: 'Right to Object',
        description:
            'Opt-out of data processing activities, marketing campaigns, or optional cookie tracking.',
        icon: 'ban',
        details:
            'Allows you to withdraw consent for performance tracking or specialized smart suggestions.',
    },
];
