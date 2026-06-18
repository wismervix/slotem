export type BookingStatusTwo =
    | 'Pending'
    | 'Confirmed'
    | 'Completed'
    | 'Cancelled';

export interface AdminBooking {
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

export interface WebsiteSettings {
    name: string;
    managerName: string;
    email: string;
    phone: string;
    role: string;
    websiteUrl: string;
    logoUrl: string;
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

export interface ServiceTwo {
    id: string;
    name: string;
    description: string;
    category: string;
    duration: number; // in minutes
    price: number;
    status: 'Active' | 'Inactive';
    bookingsCount: number;
    imageUrl: string;
    createdAt: string;
}

export interface AdminProfile {
    name: string;
    title: string;
    email: string;
    avatarUrl: string;
    notificationsEnabled: boolean;
    currency: string;
}
export interface UserThree {
    id: string;
    name: string;
    email: string;
    phone: string;
    registeredDate: string;
    registeredTime: string;
    bookingsCount: number;
    status: 'Active' | 'Suspended' | 'Pending';
    avatar: string;
}

export interface BookingThree {
    id: string;
    userName: string;
    userEmail: string;
    userId: string;
    service: string;
    date: string;
    timeSlot: string;
    status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

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

