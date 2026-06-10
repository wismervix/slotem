import {
    BusinessProfile,
    BookingRules,
    TeamMember,
    AdminBookingThree,
    StaffAvailability,
} from '@/types';

export const defaultBusinessProfile: BusinessProfile = {
    businessName: 'Slotem Creative Studio',
    emailAddress: 'hello@slotem.design',
    phoneNumber: '+1 (555) 000-1234',
    websiteUrl: 'https://slotem.design',
    logoUrl:
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

export const defaultBookings: AdminBookingThree[] = [
    {
        id: 'b1',
        clientName: 'Liam Neeson',
        clientEmail: 'liam@neeson.com',
        service: 'Brand Identity Design',
        date: '2026-06-11',
        time: '10:00 AM',
        staffId: '1',
        staffName: 'Jane Doe',
        status: 'Confirmed',
        price: 1500,
    },
    {
        id: 'b2',
        clientName: 'Alex Rivera',
        clientEmail: 'alex@rivera.co',
        service: 'UI/UX Consultation',
        date: '2026-06-12',
        time: '02:00 PM',
        staffId: '2',
        staffName: 'Mark Kim',
        status: 'Confirmed',
        price: 350,
    },
    {
        id: 'b3',
        clientName: 'Chloe Bennett',
        clientEmail: 'chloe@shield.org',
        service: 'Motion Design Strategy',
        date: '2026-06-10',
        time: '09:00 AM',
        staffId: '2',
        staffName: 'Mark Kim',
        status: 'Completed',
        price: 800,
    },
    {
        id: 'b4',
        clientName: 'Bruce Wayne',
        clientEmail: 'bruce@waynecorp.com',
        service: 'Product Design Workshop',
        date: '2026-06-09',
        time: '04:30 PM',
        staffId: '1',
        staffName: 'Jane Doe',
        status: 'Completed',
        price: 2500,
    },
    {
        id: 'b5',
        clientName: 'Selina Kyle',
        clientEmail: 'selina@gotham.cat',
        service: 'Website Audit & Strategy',
        date: '2026-06-14',
        time: '11:30 AM',
        staffId: '3',
        staffName: 'Sarah White',
        status: 'Confirmed',
        price: 500,
    },
];

export const defaultStaffAvailability: StaffAvailability[] = [
    {
        staffId: '1',
        staffName: 'Jane Doe',
        schedule: [
            { day: 'Monday', active: true, start: '09:00 AM', end: '05:00 PM' },
            {
                day: 'Tuesday',
                active: true,
                start: '09:00 AM',
                end: '05:00 PM',
            },
            {
                day: 'Wednesday',
                active: true,
                start: '09:00 AM',
                end: '05:00 PM',
            },
            {
                day: 'Thursday',
                active: true,
                start: '09:00 AM',
                end: '05:00 PM',
            },
            { day: 'Friday', active: true, start: '09:00 AM', end: '04:00 PM' },
            {
                day: 'Saturday',
                active: false,
                start: '10:00 AM',
                end: '02:00 PM',
            },
            {
                day: 'Sunday',
                active: false,
                start: '10:00 AM',
                end: '02:00 PM',
            },
        ],
    },
    {
        staffId: '2',
        staffName: 'Mark Kim',
        schedule: [
            { day: 'Monday', active: true, start: '09:00 AM', end: '05:00 PM' },
            {
                day: 'Tuesday',
                active: true,
                start: '09:00 AM',
                end: '05:00 PM',
            },
            {
                day: 'Wednesday',
                active: true,
                start: '09:00 AM',
                end: '05:00 PM',
            },
            {
                day: 'Thursday',
                active: true,
                start: '09:00 AM',
                end: '05:00 PM',
            },
            { day: 'Friday', active: true, start: '09:00 AM', end: '05:00 PM' },
            {
                day: 'Saturday',
                active: true,
                start: '10:00 AM',
                end: '03:00 PM',
            },
            {
                day: 'Sunday',
                active: false,
                start: '10:00 AM',
                end: '02:00 PM',
            },
        ],
    },
    {
        staffId: '3',
        staffName: 'Sarah White',
        schedule: [
            { day: 'Monday', active: true, start: '10:00 AM', end: '06:00 PM' },
            {
                day: 'Tuesday',
                active: true,
                start: '10:00 AM',
                end: '06:00 PM',
            },
            {
                day: 'Wednesday',
                active: true,
                start: '10:00 AM',
                end: '06:00 PM',
            },
            {
                day: 'Thursday',
                active: true,
                start: '10:00 AM',
                end: '06:00 PM',
            },
            { day: 'Friday', active: true, start: '10:00 AM', end: '05:00 PM' },
            {
                day: 'Saturday',
                active: false,
                start: '10:00 AM',
                end: '02:00 PM',
            },
            {
                day: 'Sunday',
                active: false,
                start: '10:00 AM',
                end: '02:00 PM',
            },
        ],
    },
];

export const defaultServices = [
    { name: 'Brand Identity Design', duration: '2 hours', price: 1500 },
    { name: 'UI/UX Consultation', duration: '1 hour', price: 350 },
    { name: 'Motion Design Strategy', duration: '1.5 hours', price: 800 },
    { name: 'Product Design Workshop', duration: '3 hours', price: 2500 },
    { name: 'Website Audit & Strategy', duration: '1 hour', price: 500 },
];
