import { motion } from 'motion/react';
import { Calendar, History, PlusCircle, Info } from 'lucide-react';
import { TERMS_VERSIONS } from '@/data/terms-data';

interface VersionDiffViewerProps {
    currentVersionId: string;
    onSelectVersion: (id: string) => void;
}

export default function VersionDiffViewer({
    currentVersionId,
    onSelectVersion,
}: VersionDiffViewerProps) {
    const selectedVersion =
        TERMS_VERSIONS.find((v) => v.id === currentVersionId) ||
        TERMS_VERSIONS[0];

    return (
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
                            onChange={(e) => onSelectVersion(e.target.value)}
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
        </div>
    );
}
