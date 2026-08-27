import { useState } from 'react';
import {
    FileCheck,
    UserCheck,
    Shield,
    CreditCard,
    Brain,
    Share2,
    AlertTriangle,
    XCircle,
    Gavel,
    RefreshCw,
    Contact,
    Mail,
    MapPin,
    Search,
    CheckCircle,
    ExternalLink,
} from 'lucide-react';
import { TermsSectionId } from '@/types';

interface TermsContentProps {
    searchQuery: string;
    currentVersion: string;
}

export default function TermsContent({
    searchQuery,
    currentVersion,
}: TermsContentProps) {
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('legal@slotem.io');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    // Helper to highlight matching text
    const highlightText = (text: string, search: string) => {
        if (!search.trim()) return text;
        const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-amber-100 dark:bg-amber-950/80 text-zinc-900 dark:text-zinc-100 rounded px-0.5">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    return (
        <div className="flex-1 space-y-16 pb-24">
            {/* Dynamic search query visual status */}
            {searchQuery && (
                <div className="p-4 bg-amber-50 dark:bg-zinc-900 border border-amber-100 dark:border-zinc-800 rounded-2xl flex items-center gap-3">
                    <Search className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">
                        Showing highlighted results matching &ldquo;<span className="font-bold">{searchQuery}</span>&rdquo;. Scroll down to view matches.
                    </p>
                </div>
            )}

            {/* Section: Acceptance of Terms */}
            <section id="acceptance-of-terms" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Acceptance of Terms
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'By accessing or using Slotem\'s scheduling platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.',
                            searchQuery
                        )}
                    </p>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            <strong>Effective Date:</strong> August 11, 2026
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            <strong>Last Updated:</strong> August 11, 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Section: User Obligations */}
            <section id="user-obligations" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        User Obligations
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-6">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'As a user of Slotem, you agree to the following obligations to ensure a secure and reliable experience for all users:',
                            searchQuery
                        )}
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                            <div className="mt-1 text-violet-600 dark:text-violet-400 shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                                    Accurate Information
                                </h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {highlightText(
                                        'Provide accurate and complete information when creating your account and using our services.',
                                        searchQuery
                                    )}
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 text-violet-600 dark:text-violet-400 shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                                    Account Security
                                </h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {highlightText(
                                        'Maintain the confidentiality of your account credentials and notify us immediately of any unauthorized access.',
                                        searchQuery
                                    )}
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 text-violet-600 dark:text-violet-400 shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                                    Compliance with Laws
                                </h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {highlightText(
                                        'Use Slotem in compliance with all applicable local, state, national, and international laws and regulations.',
                                        searchQuery
                                    )}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Section: Account Registration */}
            <section id="account-registration" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Account Registration
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'To access certain features of Slotem, you must register for an account. By registering, you represent that you are at least 18 years old and have the legal capacity to enter into binding agreements.',
                            searchQuery
                        )}
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-violet-600 dark:text-violet-400 font-bold">•</span>
                            {highlightText('You are responsible for all activities that occur under your account.', searchQuery)}
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-violet-600 dark:text-violet-400 font-bold">•</span>
                            {highlightText('Slotem reserves the right to suspend or terminate accounts that violate our terms.', searchQuery)}
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-violet-600 dark:text-violet-400 font-bold">•</span>
                            {highlightText('We may require identity verification for certain account activities.', searchQuery)}
                        </li>
                    </ul>
                </div>
            </section>

            {/* Section: Payment Terms */}
            <section id="payment-terms" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Payment Terms
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'Slotem offers both free and paid subscription plans. By subscribing to a paid plan, you agree to pay the applicable fees and taxes as outlined in our pricing.',
                            searchQuery
                        )}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                                Billing Cycle
                            </h4>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {highlightText(
                                    'Subscriptions are billed monthly or annually in advance. All payments are non-refundable except as required by law.',
                                    searchQuery
                                )}
                            </p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                                Cancellation
                            </h4>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {highlightText(
                                    'You may cancel your subscription at any time. Cancellation will take effect at the end of the current billing period.',
                                    searchQuery
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <Brain className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Intellectual Property
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'All content, features, and functionality of Slotem, including but not limited to software, design, text, graphics, and logos, are the exclusive property of Slotem and are protected by intellectual property laws.',
                            searchQuery
                        )}
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-violet-600 dark:text-violet-400 font-bold">•</span>
                            {highlightText('You may not reproduce, distribute, or create derivative works without our explicit permission.', searchQuery)}
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-violet-600 dark:text-violet-400 font-bold">•</span>
                            {highlightText('Slotem grants you a limited, non-exclusive license to use the platform for your scheduling needs.', searchQuery)}
                        </li>
                    </ul>
                </div>
            </section>

            {/* Section: Third-party Services */}
            <section id="third-party-services" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Third-party Services
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'Slotem integrates with third-party services to enhance your experience. These services are subject to their own terms and conditions:',
                            searchQuery
                        )}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Stripe</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Payment Processing</p>
                            <a href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline mt-2 inline-block">
                                Terms <ExternalLink className="w-3 h-3 inline ml-0.5" />
                            </a>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Google</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Calendar Integration</p>
                            <a href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline mt-2 inline-block">
                                Terms <ExternalLink className="w-3 h-3 inline ml-0.5" />
                            </a>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">SendGrid</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Email Delivery</p>
                            <a href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline mt-2 inline-block">
                                Terms <ExternalLink className="w-3 h-3 inline ml-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Limitation of Liability */}
            <section id="limitation-of-liability" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Limitation of Liability
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-600/5 to-rose-600/5 dark:from-amber-950/10 dark:to-rose-950/10 rounded-3xl border border-amber-500/30 dark:border-amber-400/20 shadow-xs">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'To the maximum extent permitted by law, Slotem shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:',
                            searchQuery
                        )}
                    </p>
                    <ul className="mt-4 space-y-3">
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                            {highlightText('Your use or inability to use the Slotem platform.', searchQuery)}
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                            {highlightText('Any unauthorized access to or use of our servers and/or personal information stored therein.', searchQuery)}
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                            {highlightText('Any interruption or cessation of transmission to or from our services.', searchQuery)}
                        </li>
                    </ul>
                </div>
            </section>

            {/* Section: Termination */}
            <section id="termination" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Termination
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'Slotem reserves the right to suspend or terminate your account and access to the platform at any time, with or without cause, and with or without notice, effective immediately.',
                            searchQuery
                        )}
                    </p>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">Grounds for Termination</h4>
                        <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <li>• {highlightText('Violation of any provision of these terms.', searchQuery)}</li>
                            <li>• {highlightText('Fraudulent, abusive, or unlawful activities.', searchQuery)}</li>
                            <li>• {highlightText('Non-payment of fees when due.', searchQuery)}</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section: Governing Law */}
            <section id="governing-law" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <Gavel className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Governing Law
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.',
                            searchQuery
                        )}
                    </p>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {highlightText(
                                'Any legal action or proceeding relating to your access to, or use of, Slotem shall be instituted exclusively in the federal or state courts located in San Francisco, California.',
                                searchQuery
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {/* Section: Changes to Terms */}
            <section id="changes-to-terms" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Changes to Terms
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-4">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'Slotem reserves the right to update or modify these Terms at any time without prior notice. Your continued use of the platform after any changes constitutes your acceptance of the updated Terms.',
                            searchQuery
                        )}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="inline-block w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400" />
                        <span>We recommend reviewing these Terms periodically to stay informed of any changes.</span>
                    </div>
                </div>
            </section>

            {/* Section: Contact Information */}
            <section id="contact-information" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                        <Contact className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Contact Information
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-6">
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {highlightText(
                            'If you have any questions about these Terms, please contact us through the following channels:',
                            searchQuery
                        )}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Email card */}
                        <div className="flex-1 p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 relative group">
                            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    Legal Email
                                </p>
                                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                    legal@slotem.io
                                </p>
                                <button
                                    onClick={handleCopyEmail}
                                    className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 font-semibold"
                                >
                                    {copiedEmail ? 'Copied!' : 'Copy Address'}
                                </button>
                            </div>
                        </div>

                        {/* Address card */}
                        <div className="flex-1 p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    Physical HQ
                                </p>
                                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                    15 Ogunbambi Street
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Dopemu, LAG 100001, NG
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}