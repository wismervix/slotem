import { Booking } from './booking';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'deleted';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
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

export interface AdminProfile {
    name: string;
    email: string;
    phone: string;
    avatar_url: string;
    avatar_public_id?: string;
}