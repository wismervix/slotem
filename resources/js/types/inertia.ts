// types/inertia.ts

import { PageProps } from '@inertiajs/core';
import { AdminProfile, User } from './auth';

export interface SharedPageProps extends PageProps {
    auth: {
        user: User | null;
        admin: (AdminProfile & { id: number }) | null;
    };

    flash: {
        success?: string;
        error?: string;
    };
}



export interface WebsiteSettings {
    name: string;
    manager_name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    website_url: string;
    logo_url: string;
    logo_public_id?: string;
    favicon_url: string;
    favicon_public_id?: string;
}