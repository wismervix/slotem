export interface WeeklySchedule {
    monToFriStart: string; // "09:00 AM" or similar
    monToFriEnd: string;
    saturdayEnabled: boolean;
    sundayEnabled: boolean;
    timeSlotMinutes: 30 | 60;
}

export interface BookingTwo {
    id: string;
    clientName: string;
    clientEmail: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    serviceName: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface HolidayOverride {
    id: string;
    name: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    type: 'Blocked' | 'Partial';
}

export interface DailySlots {
    [dateStr: string]: string[]; // dateStr: "YYYY-MM-DD" -> array of slot strings e.g. ["09:00 AM", "10:00 AM"]
}

export type BookingWindow = 'Next 30 Days' | 'Next 90 Days' | 'Next 180 Days';

export type SidebarTab = 'Dashboard' | 'Bookings' | 'Availability' | 'Settings';
