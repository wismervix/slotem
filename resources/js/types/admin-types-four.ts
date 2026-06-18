/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CustomerProfile {
    name: string;
    email: string;
    joinedDate: string;
    tier: string;
    city: string;
    avatar: string;
    active: boolean;
}

export type BookingStatusFour = 'Confirmed' | 'Pending' | 'Cancelled';

export interface BookingFour {
    id: string;
    service: string;
    ref: string;
    date: string; // "YYYY-MM-DD" style or "MMM DD, YYYY"
    timeSlot: string; // e.g. "10:00 AM - 11:30 AM" or "02:00 PM"
    amount: number;
    status: BookingStatusFour;
    customerName: string;
    customerEmail: string;
    phoneNumber?: string;
    notes?: string;
}

export type ActivityType =
    | 'rescheduled'
    | 'payment'
    | 'profile'
    | 'email'
    | 'system';

export interface ActivityLog {
    id: string;
    type: ActivityType;
    title: string;
    subtitle: string;
    timeText: string;
    timestamp: number;
}

export interface DaySchedule {
    day: string; // e.g. "Monday"
    enabled: boolean;
    slots: { time: string; booked: boolean }[];
}

export interface ServiceDetail {
    id: string;
    name: string;
    price: number;
    duration: number; // in mins
    category: string;
}
