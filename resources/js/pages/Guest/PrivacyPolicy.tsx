import { useState, useEffect } from 'react';
import Sidebar from '@/components/Guest/PrivacyPolicy/Sidebar';
import PrivacyContent from '@/components/Guest/PrivacyPolicy/PrivacyContent';
import CookieConsentModal from '@/components/Guest/PrivacyPolicy/CookieConsentModal';
import RightsRequestModal from '@/components/Guest/PrivacyPolicy/RightsRequestModal';
import SupportModal from '@/components/Guest/PrivacyPolicy/SupportModal';
import VersionDiffViewer from '@/components/Guest/PrivacyPolicy/VersionDiffViewer';
import {
    PrivacySectionId,
    CookiePreferences,
    PrivacyRequest,
    RightType,
} from '@/types';
import {
    ShieldAlert,
    Printer,
    Check,
    Search,
    Sliders,
    Globe,
} from 'lucide-react';
import GuestLayout from '@/layouts/Guest/GuestLayout';

const SECTION_IDS: PrivacySectionId[] = [
    'information-we-collect',
    'how-we-use-information',
    'cookies',
    'analytics',
    'security',
    'data-retention',
    'third-party-services',
    'your-rights',
    'contact-information',
];

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState<PrivacySectionId>(
        'information-we-collect',
    );
    const [searchQuery, setSearchQuery] = useState('');

    // Modals state
    const [isCookiesOpen, setIsCookiesOpen] = useState(false);
    const [isRequestsOpen, setIsRequestsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [selectedRightType, setSelectedRightType] =
        useState<RightType | null>(null);

    // Versioning state
    const [currentVersionId, setCurrentVersionId] = useState('v3');

    // Cookies state
    const [cookiePreferences, setCookiePreferences] =
        useState<CookiePreferences>(() => {
            const saved = localStorage.getItem('cookiePreferences');
            if (saved) return JSON.parse(saved);
            return {
                essential: true,
                preference: true,
                analytics: false,
                marketing: false,
            };
        });

    // Privacy compliance requests state
    const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>(
        () => {
            const saved = localStorage.getItem('privacyRequests');
            if (saved) return JSON.parse(saved);

            // Initial mock request to populate the tracker for high-fidelity interactive experience
            return [
                {
                    id: 'REQ-8301-GDPR',
                    type: 'access',
                    email: 'jane.doe@example.com',
                    name: 'Jane Doe',
                    details:
                        'Requesting full scheduling log export under GDPR Article 15.',
                    status: 'processing',
                    createdAt: '2026-07-01',
                    slaDaysRemaining: 17,
                },
            ];
        },
    );

    // Toast notification for user actions
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Sync Cookie Preferences to localStorage
    const handleSaveCookies = (prefs: CookiePreferences) => {
        setCookiePreferences(prefs);
        localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
        triggerToast('Cookie choices updated and applied securely.');
    };

    // Add Privacy compliance request
    const handleAddRequest = (
        newReq: Omit<
            PrivacyRequest,
            'id' | 'createdAt' | 'status' | 'slaDaysRemaining'
        >,
    ) => {
        const fresh: PrivacyRequest = {
            ...newReq,
            id: `REQ-${Math.floor(1000 + Math.random() * 9000)}-GDPR`,
            status: 'processing',
            createdAt: new Date().toISOString().split('T')[0],
            slaDaysRemaining: 30,
        };
        const updated = [fresh, ...privacyRequests];
        setPrivacyRequests(updated);
        localStorage.setItem('privacyRequests', JSON.stringify(updated));
        triggerToast(
            'Privacy request successfully registered under GDPR SLA terms.',
        );
    };

    // Cancel/Delete Request
    const handleDeleteRequest = (id: string) => {
        const filtered = privacyRequests.filter((r) => r.id !== id);
        setPrivacyRequests(filtered);
        localStorage.setItem('privacyRequests', JSON.stringify(filtered));
        triggerToast('Compliance request cancelled successfully.');
    };

    // Callback when exercising a right from direct content buttons
    const handleExerciseRight = (type: RightType) => {
        setSelectedRightType(type);
        setIsRequestsOpen(true);
    };

    // Scrollspy logic using IntersectionObserver
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // focused in the center of view
            threshold: 0,
        };

        const observers = SECTION_IDS.map((id) => {
            const element = document.getElementById(id);
            if (!element) return null;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                });
            }, observerOptions);

            observer.observe(element);
            return { observer, element };
        });

        return () => {
            observers.forEach((obs) => {
                if (obs) obs.observer.unobserve(obs.element);
            });
        };
    }, []);

    // Smooth scroll to section
    const handleSectionClick = (id: PrivacySectionId) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 90; // account for sticky header height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            setActiveSection(id);
        }
    };

    return (
        <GuestLayout>
            {/* Main Container */}
            <main className="mx-auto max-w-7xl pt-20 pb-4 py-10 sm:px-6 lg:px-8">
                {/* Banner Announcement / Version History Indicator */}
                <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-violet-600 dark:bg-violet-400" />
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                            You are viewing the current official privacy policy
                            framework. Last revised:{' '}
                            <span className="font-bold">August 11, 2026</span>.
                        </p>
                    </div>

                    {/* Search, Actions & Dark Mode */}
                    <div className="mx-8 hidden max-w-sm flex-1 items-center gap-4 md:flex">
                        <div className="relative w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                id="search-input"
                                type="text"
                                placeholder="Search privacy policy..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-transparent bg-zinc-100 py-1.5 pr-4 pl-9 text-sm placeholder-zinc-400 transition-all outline-none hover:border-zinc-300 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:bg-zinc-800/60 dark:text-zinc-200 dark:placeholder-zinc-500 dark:hover:border-zinc-700 dark:focus:bg-zinc-900"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute top-2 right-2.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* My Requests Badge Button */}
                        <button
                            id="my-requests-btn"
                            onClick={() => {
                                setSelectedRightType(null);
                                setIsRequestsOpen(true);
                            }}
                            className="relative rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            title="My Privacy Requests"
                        >
                            <Globe className="h-4.5 w-4.5" />
                            {privacyRequests.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
                                    {privacyRequests.length}
                                </span>
                            )}
                        </button>

                        {/* Cookies preference Trigger Button */}
                        <button
                            id="cookies-trigger-btn"
                            onClick={() => setIsCookiesOpen(true)}
                            className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            title="Cookie Settings"
                        >
                            <Sliders className="h-4.5 w-4.5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600 transition-all hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                        >
                            <Printer className="h-3.5 w-3.5" /> Print Policy
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="mb-10">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/50 bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800 dark:border-violet-800/40 dark:bg-violet-950/60 dark:text-violet-300">
                                Effective Date: August 11, 2026
                            </span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                                Privacy Policy
                            </h1>
                            <p className="max-w-3xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
                                Your trust is our most valuable asset. This
                                policy outlines how Slotem handles your personal
                                data with the transparent assurance and strict
                                enterprise security you expect from a
                                professional scheduling partner.
                            </p>
                        </div>
                        {/* Shield graphic */}
                        <div className="hidden shrink-0 md:block">
                            <div className="relative flex h-32 w-32 items-center justify-center text-violet-600/10 dark:text-violet-400/10">
                                <ShieldAlert
                                    className="absolute h-28 w-28 translate-x-2 transform"
                                    style={{ opacity: 0.1 }}
                                />
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/10 bg-violet-600/10 dark:bg-violet-400/10">
                                    <ShieldAlert className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
                </section>

                {/* Dynamic Version Diff Timeline Viewer */}
                <VersionDiffViewer
                    currentVersionId={currentVersionId}
                    onSelectVersion={(id) => setCurrentVersionId(id)}
                />

                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Scrollspy Navigation rail sidebar */}
                    <Sidebar
                        activeSection={activeSection}
                        onSectionClick={handleSectionClick}
                        onOpenSupport={() => setIsSupportOpen(true)}
                    />

                    {/* Privacy Policy main articles */}
                    <PrivacyContent
                        searchQuery={searchQuery}
                        onOpenCookies={() => setIsCookiesOpen(true)}
                        onExerciseRight={handleExerciseRight}
                        currentVersion={currentVersionId}
                    />
                </div>
            </main>

            {/* Modal overlays */}
            <CookieConsentModal
                isOpen={isCookiesOpen}
                onClose={() => setIsCookiesOpen(false)}
                preferences={cookiePreferences}
                onSave={handleSaveCookies}
            />

            <RightsRequestModal
                isOpen={isRequestsOpen}
                onClose={() => {
                    setIsRequestsOpen(false);
                    setSelectedRightType(null);
                }}
                requests={privacyRequests}
                onAddRequest={handleAddRequest}
                onDeleteRequest={handleDeleteRequest}
                initialRightType={selectedRightType}
            />

            <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />

            {/* Action notification toast */}
            {toastMessage && (
                <div className="fixed right-5 bottom-5 z-50 flex max-w-sm animate-bounce items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-xs font-semibold text-white shadow-xl dark:border-zinc-200 dark:bg-white dark:text-zinc-900">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </GuestLayout>
    );
}
