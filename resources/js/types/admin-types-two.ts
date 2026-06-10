/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BookingStatusTwo = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface AdminBookingTwo {
    id: string;
    clientName: string;
    clientEmail: string;
    serviceId: string;
    serviceName: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM AM/PM
    endTime: string; // HH:MM AM/PM
    status: BookingStatusTwo;
    notes?: string;
    price: number;
}

export interface AdminServiceTwo {
    id: string;
    name: string;
    duration: number; // in minutes
    price: number;
    category: string;
}

export interface BusinessSettings {
    name: string;
    managerName: string;
    email: string;
    phone: string;
    role: string;
}

export interface BusinessHours {
    day: string; // e.g. "Monday"
    dayIndex: number; // 0 = Sunday, 1 = Monday etc.
    isOpen: boolean;
    openTime: string; // "09:00"
    closeTime: string; // "17:00"
}

export interface HolidayBlock {
    id: string;
    date: string;
    reason: string;
}
