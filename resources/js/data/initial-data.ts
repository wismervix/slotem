export interface WebsiteSettings {
    name: string;
    managerName: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    websiteUrl: string;
    logoUrl: string;
    faviconUrl: string;
}

export interface BookingRules {
    minimumLeadTime: string;
    bookingWindow: string;
    cancellationPolicyEnabled: boolean;
    cancellationPolicyText: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Staff';
    status: 'Active' | 'Pending Invite';
    avatarInitials: string;
}

export interface AdminProfile {
    name: string;
    phone: string;
    email: string;
    avatarUrl: string;
}

// Initial Admin Profile to be replaced with real data from the backend
export const INITIAL_ADMIN_PROFILE: AdminProfile = {
    name: 'Admin User',
    email: 'admin@slotem.com',
    phone: '+1 (555) 124-7890',
    avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuABzFFmj9Azf-OKguonlWJbM-mTIDI5pnlpLXB069Q5wPGwb2v4ibxbEEm3V6YTHQptXoDC_s3Nj68XNZSX7gJcA-i7O_BvNL74Z8ND0Z4yTyLpsQiUCM8NUKdTsyplCEq2yprxrYAyxj0gGS6QfHQ8d2qVhdvFvgnKHplJGkL-SXgybR1NIzqFx3TgqlASuFtojpyKu9sKL1pq4_aczMKEfjEv3BDLGGlEGi08mmryNNUADbSfdYp-6vCDwBVOy_ct2YqgXxePVV0',
};

export const WEBSITE_SETTINGS: WebsiteSettings = {
    name: 'Slotem',
    managerName: 'Admin  Manager',
    email: 'manager@slotem.com',
    phone: '+1 (555) 124-7890',
    address: '123 Main Street, City, State 12345',
    description:
        'Slotem is a modern booking platform that helps businesses manage appointments and reservations efficiently.',
    websiteUrl: 'https://slotem.design',
    logoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC1rP8O-hKV-IMgURs4PoVY9K0CmDPbRU41joJp_l23yeKaWxXAbDePLHsiw-qTEcFI2YGm54EU5vl5sy4NKq7f39BDoyFTzRK5wIi9dUXP7sf4DeOX2rHqSJMlUATco37WzvAh_JYt1tnHqChw1yCFGEM4OSbKOIh83qpmJOuMvVCmw95xjFVIKnHqw6aynPwW-3W0Neg4OTRPYVoHD98-LfPWfY6xQLdESm_9IXZYRuG4DpiprU2_5Ck0ajhO_ow3eJ3iYQI_5-U',
    faviconUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC1rP8O-hKV-IMgURs4PoVY9K0CmDPbRU41joJp_l23yeKaWxXAbDePLHsiw-qTEcFI2YGm54EU5vl5sy4NKq7f39BDoyFTzRK5wIi9dUXP7sf4DeOX2rHqSJMlUATco37WzvAh_JYt1tnHqChw1yCFGEM4OSbKOIh83qpmJOuMvVCmw95xjFVIKnHqw6aynPwW-3W0Neg4OTRPYVoHD98-LfPWfY6xQLdESm_9IXZYRuG4DpiprU2_5Ck0ajhO_ow3eJ3iYQI_5-U',
};

export const defaultBookingRules: BookingRules = {
    minimumLeadTime: '24 Hours',
    bookingWindow: '30 Days',
    cancellationPolicyEnabled: true,
    cancellationPolicyText:
        'Cancellations made within 24 hours of the appointment will be subject to a 50% service fee. No-shows will be charged at the full rate.',
};

export const defaultTeamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@slotem.design',
        role: 'Admin',
        status: 'Active',
        avatarInitials: 'JD',
    },
    {
        id: '2',
        name: 'Mark Kim',
        email: 'mark@slotem.design',
        role: 'Staff',
        status: 'Active',
        avatarInitials: 'MK',
    },
    {
        id: '3',
        name: 'Sarah White',
        email: 'sarah@slotem.design',
        role: 'Staff',
        status: 'Pending Invite',
        avatarInitials: 'SW',
    },
];
