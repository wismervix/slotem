export type ActiveTab = 'dashboard' | 'bookings' | 'availability' | 'settings';

export interface BusinessProfile {
    businessName: string;
    emailAddress: string;
    phoneNumber: string;
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

export interface AdminBookingThree {
    id: string;
    clientName: string;
    clientEmail: string;
    service: string;
    date: string;
    time: string;
    staffId: string;
    staffName: string;
    status: 'Confirmed' | 'Completed' | 'Cancelled';
    price: number;
}

export interface DaySchedule {
    day: string; // e.g., 'Monday'
    active: boolean;
    start: string; // e.g., '09:00'
    end: string; // e.g., '17:00'
}

export interface StaffAvailability {
    staffId: string;
    staffName: string;
    schedule: DaySchedule[];
}
