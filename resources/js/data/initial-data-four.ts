/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomerProfile, BookingFour, ActivityLog, ServiceDetail } from '@/types';

export const INITIAL_PROFILE: CustomerProfile = {
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    joinedDate: 'Jan 12, 2023',
    tier: 'Premium Member',
    city: 'Chicago, IL',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS4hUTLFx0E6J98uzd04i3YX6UOkhedlYUCmPnbrvti24Ue_CL6ri6q8vvcD63qahKE-7K_01ONMTOkm7IPXtgdV-TEaq37JuFM-5sjMu1ZaVI1rzD_8U8PNnuBFrixHoY11-QO-v2o22VH5iCzzuqXgzXh8ziXm5jJpj3gYs7mJICzXvnr61i7sCB6Q1do1IsZEgg-ruxOHu7mP4fkgIIXgkTMq0CfMnHZc29JZ51XanpLw0JXNLLrR0XIr2A_YvkkkTl4TVWVbs',
    active: true,
};

export const INITIAL_BOOKINGS: BookingFour[] = [
    {
        id: '1',
        service: 'Consultation Session',
        ref: '#BK-8291',
        date: 'Oct 24, 2023',
        timeSlot: '10:00 AM - 11:30 AM',
        amount: 150.0,
        status: 'Confirmed',
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor.vance@example.com',
        notes: 'Review primary marketing roadmap, identify top performance acquisition channels, and map launch calendar milestones.',
    },
    {
        id: '2',
        service: 'Strategy Workshop',
        ref: '#BK-7520',
        date: 'Oct 12, 2023',
        timeSlot: '02:00 PM - 05:00 PM',
        amount: 450.0,
        status: 'Confirmed',
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor.vance@example.com',
        notes: 'Deep dive interactive workshop with core engineering and design leads. Syncing product specifications and system components.',
    },
    {
        id: '3',
        service: 'Follow-up Call',
        ref: '#BK-6104',
        date: 'Sep 28, 2023',
        timeSlot: '11:00 AM - 11:30 AM',
        amount: 75.0,
        status: 'Pending',
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor.vance@example.com',
        notes: 'Review Post-launch KPIs, address minor bug reports, and finalize retainer contracts.',
    },
    {
        id: '4',
        service: 'Branding Review',
        ref: '#BK-5932',
        date: 'Sep 15, 2023',
        timeSlot: '04:00 PM - 05:00 PM',
        amount: 300.0,
        status: 'Cancelled',
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor.vance@example.com',
        notes: 'Visual typography pairing system, tone guide alignment, and logo badge options.',
    },
    {
        id: '5',
        service: 'UX Audit Session',
        ref: '#BK-3829',
        date: 'Nov 05, 2023',
        timeSlot: '09:00 AM - 10:30 AM',
        amount: 200.0,
        status: 'Confirmed',
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor.vance@example.com',
        notes: 'Thorough onboarding audit, user activation metric review, and sign-up feedback loops design.',
    },
];

export const INITIAL_LOGS: ActivityLog[] = [
    {
        id: 'log-1',
        type: 'rescheduled',
        title: 'Booking Rescheduled',
        subtitle: 'Moved Consultation Session to Oct 24th.',
        timeText: '2 hours ago',
        timestamp: Date.now() - 2 * 3600000,
    },
    {
        id: 'log-2',
        type: 'payment',
        title: 'Payment Received',
        subtitle: '$450.00 for Strategy Workshop.',
        timeText: 'Yesterday',
        timestamp: Date.now() - 24 * 3600000,
    },
    {
        id: 'log-3',
        type: 'profile',
        title: 'Profile Updated',
        subtitle: 'Customer updated phone number and address.',
        timeText: '3 days ago',
        timestamp: Date.now() - 3 * 24 * 3600000,
    },
    {
        id: 'log-4',
        type: 'email',
        title: 'Email Sent',
        subtitle: 'Sent welcome package to eleanor.vance@example.com',
        timeText: 'Oct 1, 2023',
        timestamp: Date.now() - 15 * 24 * 3600000,
    },
];

export const SERVICES_CATALOG: ServiceDetail[] = [
    {
        id: 'srv-1',
        name: 'Consultation Session',
        price: 150,
        duration: 90,
        category: 'Advisory',
    },
    {
        id: 'srv-2',
        name: 'Strategy Workshop',
        price: 450,
        duration: 180,
        category: 'Consulting',
    },
    {
        id: 'srv-3',
        name: 'Follow-up Call',
        price: 75,
        duration: 30,
        category: 'Advisory',
    },
    {
        id: 'srv-4',
        name: 'Branding Review',
        price: 300,
        duration: 60,
        category: 'Creative',
    },
    {
        id: 'srv-5',
        name: 'UX Audit Session',
        price: 200,
        duration: 90,
        category: 'Creative',
    },
];
