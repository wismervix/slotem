import { useState } from 'react';
import {
    Search,
    HelpCircle,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Lock,
    RefreshCw,
    Calendar,
    Mail,
} from 'lucide-react';
import { FAQItem } from '@/types';

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<
        'all' | 'general' | 'pricing' | 'technical' | 'security'
    >('all');
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    const faqs: (FAQItem & { id: number })[] = [
        {
            id: 1,
            category: 'general',
            question:
                'How does Slotem handle team members in different timezones?',
            answer: 'Slotem features real-time, bi-directional timezone calculation. When a prospect visits your booking page, we automatically detect their local timezone and dynamically convert the available slots. The host receives the booking directly mapped into their own native timezone, eliminating any AM/PM coordination errors.',
        },
        {
            id: 2,
            category: 'technical',
            question:
                'Does Slotem support two-way synchronization with Outlook and Google Calendar?',
            answer: 'Absolutely. Slotem integrates directly with Google Calendar, Microsoft Exchange, Outlook.com, and Office 365. When a booking occurs on Slotem, it immediately writes to your calendar. Conversely, if you add a personal event or blocking placeholder on your calendar, Slotem instantly recognizes it and hides those times on your booking pages.',
        },
        {
            id: 3,
            category: 'security',
            question: 'Is Slotem SOC 2 Type II certified and HIPAA compliant?',
            answer: 'Yes, security is a core pillar of our platform. Slotem is fully SOC 2 Type II certified. For health and wellness enterprises, we offer signing of Business Associate Agreements (BAAs) to secure HIPAA compliance. All user data, calendar metadata, and communication channels are encrypted in transit and at rest.',
        },
        {
            id: 4,
            category: 'pricing',
            question:
                'What happens if we add or remove seats mid-billing cycle?',
            answer: 'Our seats model supports full pro-ration. If you add seats, we will issue a pro-rated charge covering the remaining days of the active billing cycle. If you remove seats, you will receive corresponding seat credits applied to your subsequent renewal bill.',
        },
        {
            id: 5,
            category: 'technical',
            question: 'How does round-robin scheduling distribute meetings?',
            answer: 'We support multiple distribution modes: Equal Distribution (reps are assigned sequentially to keep load strictly equal), Weighted Distribution (assign more leads to senior reps or ramp-up reps), and Availability-first (give the meeting to whoever is available soonest to optimize lead speed).',
        },
        {
            id: 6,
            category: 'security',
            question:
                'Can we configure Single Sign-On (SSO) for our operators?',
            answer: 'Yes! Slotem supports standard enterprise SSO protocols including SAML 2.0, Okta, Microsoft Azure AD, Google Workspace SSO, and Ping Identity. This can be configured by your IT administrators in the Slotem admin dashboard under Security Settings.',
        },
    ];

    const filteredFaqs = faqs.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            activeCategory === 'all' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { id: 'all', label: 'All FAQ' },
        { id: 'general', label: 'General Usage' },
        { id: 'pricing', label: 'Billing & Plans' },
        { id: 'technical', label: 'Technical & Routing' },
        { id: 'security', label: 'Security & Compliance' },
    ] as const;

    return (
        <div
            className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8 dark:border-slate-700 dark:bg-slate-800"
            id="help-center-knowledge-base"
        >
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#630ed4] uppercase dark:text-purple-400">
                        <BookOpen className="h-3 w-3" /> Slotem Documentation
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Help & Knowledge Center
                    </h2>
                </div>

                {/* Live Search Bar */}
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search helpful articles..."
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-4 pl-10 text-xs text-slate-800 transition-all focus:border-[#630ed4] focus:ring-0 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-purple-500"
                    />
                    <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-4 dark:border-slate-700">
                {categories.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => {
                            setActiveCategory(c.id);
                            setOpenFaqId(null);
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                            activeCategory === c.id
                                ? 'bg-[#630ed4] text-white dark:bg-purple-600'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* FAQ Accordion List */}
            <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => {
                        const isOpen = openFaqId === faq.id;
                        return (
                            <div
                                key={faq.id}
                                className="transition-all hover:bg-slate-50/20 dark:hover:bg-slate-800/20"
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaqId(isOpen ? null : faq.id)
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <span className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                                        {faq.category === 'security' && (
                                            <Lock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                        )}
                                        {faq.category === 'technical' && (
                                            <RefreshCw className="h-3.5 w-3.5 shrink-0 text-[#630ed4] dark:text-purple-400" />
                                        )}
                                        {faq.category === 'pricing' && (
                                            <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                        )}
                                        {faq.category === 'general' && (
                                            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                        )}
                                        {faq.question}
                                    </span>
                                    {isOpen ? (
                                        <ChevronUp className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="bg-slate-50/50 px-5 pt-1 pb-5 text-xs leading-relaxed text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="space-y-2 p-8 text-center text-slate-400 dark:text-slate-500">
                        <Search className="mx-auto h-8 w-8 animate-pulse text-slate-300 dark:text-slate-600" />
                        <p className="text-xs">
                            No matching articles found. Try searching for
                            "HIPAA", "timezone", or "pricing".
                        </p>
                    </div>
                )}
            </div>

            {/* Support Direct Banner */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-purple-100 bg-purple-50/30 p-4 sm:flex-row sm:items-center dark:border-purple-800/30 dark:bg-purple-950/20">
                <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                        Need direct engineering assistance?
                    </h4>
                    <p className="text-[11px] leading-none text-slate-500 dark:text-slate-400">
                        Our technical experts can configure a custom routing
                        sandbox for you.
                    </p>
                </div>
                <a
                    href="mailto:sales@slotem.com"
                    className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-[#630ed4] shadow-sm transition-all hover:bg-slate-50 dark:border-purple-800/30 dark:bg-slate-900 dark:text-purple-400 dark:hover:bg-slate-800"
                >
                    <Mail className="h-3.5 w-3.5" /> Email support@slotem.com
                </a>
            </div>
        </div>
    );
}
