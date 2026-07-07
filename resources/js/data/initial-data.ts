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
