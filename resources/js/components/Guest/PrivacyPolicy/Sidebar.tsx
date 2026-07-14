import { HelpCircle } from 'lucide-react';
import { PrivacySectionId } from '@/types';

interface SidebarProps {
    activeSection: PrivacySectionId;
    onSectionClick: (id: PrivacySectionId) => void;
    onOpenSupport: () => void;
}

const TOC_ITEMS: { id: PrivacySectionId; label: string }[] = [
    { id: 'information-we-collect', label: 'Information We Collect' },
    { id: 'how-we-use-information', label: 'How We Use Information' },
    { id: 'cookies', label: 'Cookies & Tracking' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'security', label: 'Security' },
    { id: 'data-retention', label: 'Data Retention' },
    { id: 'third-party-services', label: 'Third-party Services' },
    { id: 'your-rights', label: 'Your Rights' },
    { id: 'contact-information', label: 'Contact Information' },
];

export default function Sidebar({
    activeSection,
    onSectionClick,
    onOpenSupport,
}: SidebarProps) {
    return (
        <aside className="w-full flex-shrink-0 lg:w-64">
            <div className="sticky top-24 space-y-8">
                {/* Table of Contents */}
                <div>
                    <p className="mb-3 px-4 text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                        On this page
                    </p>
                    <nav className="flex flex-col border-l border-zinc-200 dark:border-zinc-800">
                        {TOC_ITEMS.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onSectionClick(item.id)}
                                    className={`-ml-px border-l-2 px-4 py-2.5 text-left text-sm transition-all duration-200 ${
                                        isActive
                                            ? 'border-violet-600 bg-violet-50/60 font-semibold text-violet-600 dark:border-violet-400 dark:bg-violet-950/20 dark:text-violet-400'
                                            : 'border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-100'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Support Callout Panel */}
                <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-violet-500/5 transition-transform duration-300 group-hover:scale-125 dark:bg-violet-400/5" />
                    <div className="relative">
                        <div className="mb-3 flex items-center gap-2">
                            <HelpCircle className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Need Help?
                            </h3>
                        </div>
                        <p className="mb-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                            Our legal team and Data Protection Officer are
                            available to answer any questions regarding your
                            personal information.
                        </p>
                        <button
                            id="get-support-btn"
                            onClick={onOpenSupport}
                            className="w-full rounded-xl border border-violet-200 bg-white py-2 text-center text-xs font-semibold text-violet-600 shadow-sm transition-all duration-200 hover:border-transparent hover:bg-violet-600 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-violet-400 dark:hover:border-transparent dark:hover:bg-violet-600 dark:hover:text-white"
                        >
                            Get Support
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
