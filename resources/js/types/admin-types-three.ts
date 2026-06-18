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

export interface AvailabilityThree {
    day: string;
    slots: {
        time: string;
        isAvailable: boolean;
    }[];
}

export interface AdminProfileThree {
    name: string;
    role: string;
    avatar: string;
    notificationsCount: number;
}
