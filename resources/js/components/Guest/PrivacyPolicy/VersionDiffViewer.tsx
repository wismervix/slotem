import { motion } from 'motion/react';
import { Calendar, History, PlusCircle, CheckCircle, Info } from 'lucide-react';
import { POLICY_VERSIONS } from '@/data/policy-data';

interface VersionDiffViewerProps {
  currentVersionId: string;
  onSelectVersion: (id: string) => void;
}

export default function VersionDiffViewer({
  currentVersionId,
  onSelectVersion,
}: VersionDiffViewerProps) {
  const selectedVersion = POLICY_VERSIONS.find((v) => v.id === currentVersionId) || POLICY_VERSIONS[0];

  return (
    <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl mb-12 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-8 justify-between">
        {/* Dropdown Selector & Info */}
        <div className="space-y-4 lg:w-1/3">
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <History className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Policy Version History</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Interactive Policy Versioning
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
              Select any past release to see what security guidelines, subprocessors, or policies were updated.
            </p>
          </div>

          <div className="relative">
            <select
              id="version-select"
              value={currentVersionId}
              onChange={(e) => onSelectVersion(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all cursor-pointer appearance-none"
            >
              {POLICY_VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.date} ({v.id === 'v3' ? 'Current' : 'Archive'})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-zinc-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Change Log Details */}
        <div className="flex-1 space-y-4 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0 lg:pl-8">
          <div className="flex items-center gap-2">
            <Info className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              {selectedVersion.description}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Key Policy Adjustments
            </p>
            <div className="space-y-2.5">
              {selectedVersion.changes.map((change, idx) => (
                <motion.div
                  key={`${selectedVersion.id}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3 items-start bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/50 p-3.5 rounded-2xl"
                >
                  <PlusCircle className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5 animate-pulse" />
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
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
