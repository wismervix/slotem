import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Info,
    History,
    Calendar,
    PlusCircle,
    ArrowRight,
    Scale,
} from 'lucide-react';
import { TERMS_VERSIONS } from '@/data/terms-data';
import { Link } from '@inertiajs/react';

export default function TermsPreview() {
    const [currentVersionId, setCurrentVersionId] = useState('v3');
        const selectedVersion =
            TERMS_VERSIONS.find((v) => v.id === currentVersionId) ||
            TERMS_VERSIONS[0];
    

    return (
        <div
            className="mx-auto max-w-4xl px-4 py-12"
            id="privacy-policy-preview"
        >
                {/* Hero Section */}
                <section className="mb-10">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/50 bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800 dark:border-violet-800/40 dark:bg-violet-950/60 dark:text-violet-300">
                                Effective Date: May 24, 2024
                            </span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                                Terms & Conditions
                            </h1>
                            <p className="max-w-3xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
                                These terms govern your use of Slotem's
                                scheduling platform. By using our services, you
                                agree to comply with these legally binding
                                provisions.
                            </p>
                        </div>
                        {/* Shield graphic */}
                        <div className="hidden shrink-0 md:block">
                            <div className="relative flex h-32 w-32 items-center justify-center text-violet-600/10 dark:text-violet-400/10">
                                <Scale
                                    className="absolute h-28 w-28 translate-x-2 transform"
                                    style={{ opacity: 0.1 }}
                                />
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/10 bg-violet-600/10 dark:bg-violet-400/10">
                                    <Scale className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
                </section>


        <div className="mb-12 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-xs sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col justify-between gap-8 lg:flex-row">
                {/* Dropdown Selector & Info */}
                <div className="space-y-4 lg:w-1/3">
                    <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                        <History className="h-5 w-5" />
                        <span className="text-xs font-bold tracking-wider uppercase">
                            Terms Version History
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            Interactive Terms Versioning
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Select any past version to see what terms,
                            conditions, or legal provisions were updated.
                        </p>
                    </div>

                    <div className="relative">
                        <select
                            id="version-select"
                            value={currentVersionId}
                            onChange={(e) => setCurrentVersionId(e.target.value)}
                            className="w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-800 transition-all outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                        >
                            {TERMS_VERSIONS.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.date} (
                                    {v.id === 'v3' ? 'Current' : 'Archive'})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-zinc-400">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* Change Log Details */}
                <div className="flex-1 space-y-4 border-t border-zinc-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <Info className="h-4.5 w-4.5 shrink-0 text-zinc-400" />
                        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                            {selectedVersion.description}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                            Key Policy Adjustments
                        </p>
                        <div className="space-y-2.5">
                            {selectedVersion.changes.map((change, idx) => (
                                <motion.div
                                    key={`${selectedVersion.id}-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-3.5 dark:border-zinc-900/50 dark:bg-zinc-950"
                                >
                                    <PlusCircle className="mt-0.5 h-4 w-4 shrink-0 animate-pulse text-violet-600 dark:text-violet-400" />
                                    <span className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                                        {change}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

                <div className="flex justify-end pt-10">
                    <Link
                        href={route('terms-of-service')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        View Full Terms Of Service{' '}
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
        </div>
        </div>
    );
}
