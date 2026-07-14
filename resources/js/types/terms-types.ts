// Add to your types/index.ts

export type TermsSectionId =
    | 'acceptance-of-terms'
    | 'user-obligations'
    | 'account-registration'
    | 'payment-terms'
    | 'intellectual-property'
    | 'third-party-services'
    | 'limitation-of-liability'
    | 'termination'
    | 'governing-law'
    | 'changes-to-terms'
    | 'contact-information';

export interface TermsVersionInfo {
    id: string;
    date: string;
    description: string;
    changes: string[];
}
