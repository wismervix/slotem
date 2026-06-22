import { Booking } from "./booking";

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'deleted';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    bookings_count?: number;
    bookings?: Booking[];
    email_verified_at: string | null;
    status: UserStatus;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
};

export type Auth = {
    user: User;
};
