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

export interface BookingTwo {
    id: string;
    clientName: string;
    clientEmail: string;
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    price: number;
    status: 'Confirmed' | 'Completed' | 'Cancelled';
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
