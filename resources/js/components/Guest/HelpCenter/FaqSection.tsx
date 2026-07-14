/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQS } from '@/data/help-center';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FaqSection() {
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    const toggleFaq = (id: string) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <section
            className="mx-auto max-w-4xl px-6 py-12 md:py-16"
            id="faqs-accordion-section"
        >
            <h2
                className="mb-8 text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white"
                id="faqs-header"
            >
                Frequently Asked Questions
            </h2>

            <div className="space-y-4" id="faqs-accordion-container">
                {FAQS.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                        <div
                            key={faq.id}
                            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                            id={`faq-item-${faq.id}`}
                        >
                            {/* Accordion Toggle Button */}
                            <button
                                onClick={() => toggleFaq(faq.id)}
                                className="text-zinc-850 dark:hover:bg-zinc-850/55 flex w-full items-center justify-between p-5 text-left font-semibold transition-colors hover:bg-zinc-50 focus:outline-none dark:text-zinc-600"
                                id={`faq-toggle-${faq.id}`}
                            >
                                <span className="pr-4 text-base font-bold tracking-tight md:text-lg">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
                                        isOpen
                                            ? 'rotate-180 text-indigo-600 dark:text-indigo-400'
                                            : ''
                                    }`}
                                />
                            </button>

                            {/* Accordion Expandable Content Panel */}
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.25,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <div
                                            className="border-t border-zinc-100 px-6 pt-1 pb-6 text-sm leading-relaxed text-zinc-600 md:text-base dark:border-zinc-800/60 dark:text-zinc-400"
                                            id={`faq-content-${faq.id}`}
                                        >
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
