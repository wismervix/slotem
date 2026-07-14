/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Headphones, Building2, HelpCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface SupportCtaProps {
    onContactSupport: () => void;
    onContactSales: () => void;
}

export default function SupportCta({
    onContactSupport,
    onContactSales,
}: SupportCtaProps) {
    return (
        <section
            className="mx-auto max-w-7xl px-6 py-16"
            id="support-cta-section"
        >
            <div
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-700 to-violet-800 p-8 text-center shadow-2xl shadow-indigo-600/10 md:p-12 dark:from-indigo-900 dark:to-violet-950"
                id="cta-wrapper-card"
            >
                {/* Subtle background glow blobs */}
                <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />
                <div className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-violet-400/20 blur-2xl" />

                <div
                    className="relative z-10 mx-auto max-w-2xl space-y-6"
                    id="cta-contents"
                >
                    <h2
                        className="text-3xl font-extrabold tracking-tight text-white md:text-4xl"
                        id="cta-heading"
                    >
                        Still need help?
                    </h2>
                    <p
                        className="text-sm leading-relaxed text-indigo-100 md:text-base"
                        id="cta-subtext"
                    >
                        Our support team is available 24/7 to help you with any
                        technical issues or billing questions.
                    </p>

                    <div
                        className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
                        id="cta-actions-row"
                    >
                        <button
                            onClick={onContactSupport}
                            className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-lg transition-all hover:bg-zinc-50 active:scale-[0.98] sm:w-auto"
                            id="btn-cta-contact-support"
                        >
                            <Headphones className="h-5 w-5 stroke-[2.5]" />
                            Contact Support
                        </button>
                        {/* <button
                            onClick={onContactSales}
                            className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-indigo-500/25 px-8 py-4 text-base font-bold text-white transition-all hover:bg-indigo-500/40 active:scale-[0.98] sm:w-auto"
                            id="btn-cta-contact-sales"
                        >
                            <Building2 className="h-5 w-5 stroke-[2.5]" />
                            Contact Sales
                        </button> */}
                        <Link
                            href={route('contact-sales')}
                            className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-indigo-500/25 px-8 py-4 text-base font-bold text-white transition-all hover:bg-indigo-500/40 active:scale-[0.98] sm:w-auto"
                            id="btn-cta-contact-sales"
                        >
                            <Building2 className="h-5 w-5 stroke-[2.5]" />
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
