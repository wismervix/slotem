/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DOCUMENTATION_CONTENT } from '@/data/help-center';
import {
    FileText,
    Shield,
    Scale,
    BookOpen,
    AlertCircle,
    Calendar,
} from 'lucide-react';
import TermsPreview from './TermsPreview';
import PrivacyPolicyPreview from './PrivacyPolicyPreview';

interface DocsReaderProps {
    sectionKey: 'overview' | 'documentation' | 'faqs' | 'terms' | 'privacy';
}

const sectionMeta = {
    overview: {
        title: 'Overview & Guides',
        badge: 'Resources',
        icon: BookOpen,
    },
    documentation: {
        title: 'Product Documentation',
        badge: 'Guides',
        icon: FileText,
    },
    faqs: { title: 'FAQs Directory', badge: 'FAQ', icon: AlertCircle },
    terms: { title: 'Terms of Service', badge: 'Legal', icon: Scale },
    privacy: { title: 'Privacy Policy', badge: 'Legal', icon: Shield },
};

export default function DocsReader({ sectionKey }: DocsReaderProps) {
    if (sectionKey === 'privacy') {
        return <PrivacyPolicyPreview />;
    }

    if (sectionKey === 'terms') {
        return <TermsPreview />;
    }
    
    const contentText = DOCUMENTATION_CONTENT[sectionKey] || '';
    const meta = sectionMeta[sectionKey] || {
        title: 'Document',
        badge: 'Doc',
        icon: FileText,
    };
    const Icon = meta.icon;

    return (
        <div
            className="mx-auto max-w-4xl px-6 py-12"
            id={`docs-reader-${sectionKey}`}
        >
            {/* Header Info */}
            <div
                className="mb-8 border-b border-zinc-200 pb-6 text-left dark:border-zinc-800"
                id="docs-reader-header"
            >
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700 uppercase dark:bg-indigo-950/40 dark:text-indigo-400">
                    <Icon className="h-3 w-3" />
                    <span>{meta.badge}</span>
                </span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    {meta.title}
                </h1>
                <p className="mt-2 flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Last modified: July 14, 2026</span>
                </p>
            </div>

            {/* Structured Parsing of MD text to gorgeous visual elements */}
            <div
                className="space-y-6 text-left text-zinc-800 dark:text-zinc-100"
                id="docs-reader-body"
            >
                {contentText
                    .trim()
                    .split('\n')
                    .map((line, idx) => {
                        const trimmed = line.trim();

                        // Hide top level headings since they are already rendered in the header info
                        if (trimmed.startsWith('# ')) {
                            return null;
                        }
                        if (trimmed.startsWith('## ')) {
                            return (
                                <h2
                                    key={idx}
                                    className="mt-8 mb-4 border-l-4 border-indigo-600 pl-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
                                >
                                    {trimmed.replace('## ', '')}
                                </h2>
                            );
                        }
                        if (trimmed.startsWith('### ')) {
                            return (
                                <h3
                                    key={idx}
                                    className="mt-6 mb-2 text-base font-bold text-zinc-800 dark:text-zinc-200"
                                >
                                    {trimmed.replace('### ', '')}
                                </h3>
                            );
                        }
                        if (
                            trimmed.startsWith('* ') ||
                            trimmed.startsWith('- ')
                        ) {
                            return (
                                <div
                                    key={idx}
                                    className="mb-1 ml-4 flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600 md:text-base dark:text-zinc-300"
                                >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                                    <span>{trimmed.substring(2)}</span>
                                </div>
                            );
                        }
                        if (/^\d+\.\s/.test(trimmed)) {
                            const num = trimmed.match(/^\d+/)
                                ? trimmed.match(/^\d+/)![0]
                                : '1';
                            return (
                                <div
                                    key={idx}
                                    className="mb-1 ml-4 flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600 md:text-base dark:text-zinc-300"
                                >
                                    <span className="mt-0.5 shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        {num}.
                                    </span>
                                    <span>
                                        {trimmed.replace(/^\d+\.\s/, '')}
                                    </span>
                                </div>
                            );
                        }
                        if (trimmed === '') {
                            return null;
                        }

                        // Format code-like blocks or simple bolding
                        let finalNode: React.ReactNode = trimmed;
                        if (trimmed.includes('**')) {
                            const boldParts = trimmed.split('**');
                            finalNode = boldParts.map((part, i) =>
                                i % 2 === 1 ? (
                                    <strong
                                        key={i}
                                        className="font-bold text-zinc-900 dark:text-white"
                                    >
                                        {part}
                                    </strong>
                                ) : (
                                    part
                                ),
                            );
                        }

                        return (
                            <p
                                key={idx}
                                className="text-sm leading-relaxed text-zinc-600 md:text-base dark:text-zinc-300"
                            >
                                {finalNode}
                            </p>
                        );
                    })}
            </div>
        </div>
    );
}
