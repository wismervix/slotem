export interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    password: string;
    avatar_url: string;
    memberSince: string;
    marketing_consent: boolean;
    product_updates: boolean;
    sms_reminders: boolean;
    sound_enabled: boolean;
}
