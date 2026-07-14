export type PrivacySectionId =
    | 'information-we-collect'
    | 'how-we-use-information'
    | 'cookies'
    | 'analytics'
    | 'security'
    | 'data-retention'
    | 'third-party-services'
    | 'your-rights'
    | 'contact-information';

export interface VersionInfo {
    id: string;
    date: string;
    description: string;
    changes: string[];
}

export interface CookiePreferences {
    essential: boolean;
    preference: boolean;
    analytics: boolean;
    marketing: boolean;
}

export type RightType = 'access' | 'rectify' | 'erasure' | 'object';

export interface PrivacyRequest {
    id: string;
    type: RightType;
    email: string;
    name: string;
    details: string;
    status: 'pending' | 'processing' | 'completed';
    createdAt: string;
    slaDaysRemaining: number;
}
