/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Article } from '@/types';
import {
    X,
    Calendar,
    Clock,
    Star,
    ThumbsUp,
    ThumbsDown,
    Share2,
    Check,
    User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleModalProps {
    article: Article | null;
    onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
    const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
    const [copied, setCopied] = useState(false);

    if (!article) return null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(
            window.location.href + '?article=' + article.id,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                id="article-modal-container"
            >
                {/* Backdrop - separate div with pointer-events-auto */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    id="article-backdrop"
                />

                {/* Modal Panel - centered with pointer-events-none on container */}
                <div className="pointer-events-none relative flex min-h-screen items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="pointer-events-auto w-full max-w-3xl transform overflow-hidden rounded-2xl border border-zinc-100 bg-white text-left align-middle shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-900"
                        id="article-panel"
                    >
                        {/* Header / Actions bar */}
                        <div
                            className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800"
                            id="article-modal-header"
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700 uppercase dark:bg-indigo-950/40 dark:text-indigo-300">
                                {article.isFeatured && (
                                    <Star className="h-3 w-3 fill-current" />
                                )}
                                {article.category}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyLink}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    id="btn-copy-article-link"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4 text-emerald-500" />
                                            <span className="font-bold text-emerald-500">
                                                Copied!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="h-4 w-4" />
                                            <span>Share</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                    id="btn-close-article-modal"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content body */}
                        <div
                            className="prose prose-zinc dark:prose-invert max-h-[70vh] max-w-none overflow-y-auto px-8 py-6"
                            id="article-scrollable-body"
                        >
                            {/* Author and Read metadata */}
                            <div
                                className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800"
                                id="article-author-info"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                                            {article.author.name}
                                        </h4>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {article.author.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                                    {article.publishDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{article.publishDate}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{article.readTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Title & Article Text Rendering */}
                            <div
                                className="text-zinc-800 dark:text-zinc-100"
                                id="article-content-wrapper"
                            >
                                {article.content
                                    .trim()
                                    .split('\n')
                                    .map((line, idx) => {
                                        const trimmed = line.trim();
                                        if (trimmed.startsWith('# ')) {
                                            return (
                                                <h1
                                                    key={idx}
                                                    className="mb-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white"
                                                >
                                                    {trimmed.replace('# ', '')}
                                                </h1>
                                            );
                                        }
                                        if (trimmed.startsWith('## ')) {
                                            return (
                                                <h2
                                                    key={idx}
                                                    className="mt-8 mb-4 text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100"
                                                >
                                                    {trimmed.replace('## ', '')}
                                                </h2>
                                            );
                                        }
                                        if (trimmed.startsWith('### ')) {
                                            return (
                                                <h3
                                                    key={idx}
                                                    className="mt-6 mb-3 text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-200"
                                                >
                                                    {trimmed.replace(
                                                        '### ',
                                                        '',
                                                    )}
                                                </h3>
                                            );
                                        }
                                        if (
                                            trimmed.startsWith('* ') ||
                                            trimmed.startsWith('- ')
                                        ) {
                                            return (
                                                <li
                                                    key={idx}
                                                    className="mb-2 ml-6 list-disc leading-relaxed text-zinc-600 dark:text-zinc-300"
                                                >
                                                    {trimmed.substring(2)}
                                                </li>
                                            );
                                        }
                                        if (/^\d+\.\s/.test(trimmed)) {
                                            return (
                                                <li
                                                    key={idx}
                                                    className="mb-2 ml-6 list-decimal leading-relaxed text-zinc-600 dark:text-zinc-300"
                                                >
                                                    {trimmed.replace(
                                                        /^\d+\.\s/,
                                                        '',
                                                    )}
                                                </li>
                                            );
                                        }
                                        if (trimmed.startsWith('> ')) {
                                            return (
                                                <blockquote
                                                    key={idx}
                                                    className="my-4 rounded-r-lg border-l-4 border-indigo-500 bg-indigo-50/50 px-4 py-3 text-zinc-700 italic dark:bg-indigo-950/20 dark:text-zinc-300"
                                                >
                                                    {trimmed.substring(2)}
                                                </blockquote>
                                            );
                                        }
                                        if (trimmed === '') {
                                            return (
                                                <div
                                                    key={idx}
                                                    className="h-4"
                                                />
                                            );
                                        }

                                        // Simple bold mapping for **text**
                                        let formattedText: React.ReactNode =
                                            trimmed;
                                        if (trimmed.includes('**')) {
                                            const parts = trimmed.split('**');
                                            formattedText = parts.map(
                                                (part, i) =>
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
                                                className="mb-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300"
                                            >
                                                {formattedText}
                                            </p>
                                        );
                                    })}
                            </div>

                            {/* Feedback and rating section */}
                            <div
                                className="mt-12 border-t border-zinc-100 pt-8 pb-4 text-center dark:border-zinc-800"
                                id="article-feedback-area"
                            >
                                <AnimatePresence mode="wait">
                                    {feedback === null ? (
                                        <motion.div
                                            key="feedback-prompt"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                                Was this article helpful?
                                            </h4>
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        setFeedback('yes')
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                                                    id="btn-feedback-yes"
                                                >
                                                    <ThumbsUp className="h-4 w-4" />
                                                    Yes, thanks!
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setFeedback('no')
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                                                    id="btn-feedback-no"
                                                >
                                                    <ThumbsDown className="h-4 w-4" />
                                                    No, not really
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="feedback-thanks"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-800/50"
                                        >
                                            <h4 className="mb-1 text-base font-bold text-zinc-800 dark:text-zinc-100">
                                                Thank you for your feedback!
                                            </h4>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                {feedback === 'yes'
                                                    ? 'We are glad you found this helpful. Your feedback helps us build a better support resource!'
                                                    : "We are sorry this didn't answer your question. Our support team is always ready to assist if you need further help."}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}
