import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Settings,
  Cpu,
  Cookie,
  LineChart,
  ShieldCheck,
  History,
  Share2,
  Scale,
  Contact,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Download,
  Edit3,
  Trash2,
  Ban,
  Check,
  Search,
} from 'lucide-react';
import { PrivacySectionId, RightType } from '@/types';
import { SUB_PROCESSORS, DATA_RIGHTS } from '@/data/policy-data';

interface PrivacyContentProps {
  searchQuery: string;
  onOpenCookies: () => void;
  onExerciseRight: (type: RightType) => void;
  currentVersion: string;
}

export default function PrivacyContent({
  searchQuery,
  onOpenCookies,
  onExerciseRight,
  currentVersion,
}: PrivacyContentProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('privacy@slotem.io');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Helper to highlight matching text for high-fidelity search
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

      {/* Section: Information We Collect */}
      <section id="information-we-collect" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Information We Collect
          </h2>
        </div>
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300">
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
            {highlightText(
              'To provide an efficient booking experience, we collect information that allows us to manage your appointments and communicate effectively. This is categorized into:',
              searchQuery
            )}
          </p>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="mt-1 text-violet-600 dark:text-violet-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                  Account Information
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {highlightText(
                    'Name, email address, phone number, and encrypted passwords created during platform sign-up.',
                    searchQuery
                  )}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 text-violet-600 dark:text-violet-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                  Booking Data
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {highlightText(
                    'Appointment times, durations, scheduling links, services requested, and custom client scheduling notes.',
                    searchQuery
                  )}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 text-violet-600 dark:text-violet-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                  Payment Details
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {highlightText(
                    'Processed securely through PCI-DSS third-party providers. We do not store or transit raw credit card numbers on our servers.',
                    searchQuery
                  )}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Section: How We Use Information */}
      <section id="how-we-use-information" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            How We Use Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
                1
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Service Delivery
              </h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {highlightText(
                'We use your data to facilitate scheduling, send reminders via SMS or email, and ensure your calendar is synchronized seamlessly across physical devices.',
                searchQuery
              )}
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
                2
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Product Improvement
              </h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {highlightText(
                'Aggregated, non-identifying metrics help us understand feature usage to improve our layout hierarchy, scheduling algorithms, and visual accessibility.',
                searchQuery
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Section: Cookies & Tracking */}
      <section id="cookies" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
            <Cookie className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Cookies & Tracking
          </h2>
        </div>
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-6">
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {highlightText(
              'We use essential cookies to maintain your session and remember your custom dashboard arrangements. You can fully customize these cookie permissions at any time.',
              searchQuery
            )}
          </p>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/40 text-zinc-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Purpose</th>
                  <th className="py-3 px-4">Lifespan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold">Essential</td>
                  <td className="py-3.5 px-4">Authentication, compliance triggers, and session security checks.</td>
                  <td className="py-3.5 px-4">Session</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold">Preference</td>
                  <td className="py-3.5 px-4">Timezone matching parameters, dark mode setting, and regional translation choice.</td>
                  <td className="py-3.5 px-4">1 Year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onOpenCookies}
              className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-bold text-xs"
            >
              Adjust Cookie Preferences <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section: Analytics */}
      <section id="analytics" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
            <LineChart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Analytics
          </h2>
        </div>
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300">
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {highlightText(
              'We utilize industry-standard analytics tools to monitor system performance, server response rates, and customer navigation patterns. This telemetry is strictly used to identify server latency, resolve UI bottlenecks in the scheduling interface, and ensure 99.9% high availability of our calendars.',
              searchQuery
            )}
          </p>
        </div>
      </section>

      {/* Section: Security */}
      <section id="security" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Security
          </h2>
        </div>
        <div className="p-6 sm:p-8 bg-gradient-to-r from-violet-600/5 to-indigo-600/5 dark:from-violet-950/10 dark:to-indigo-950/10 rounded-3xl border border-violet-500/30 dark:border-violet-400/20 shadow-xs">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="space-y-3 flex-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 rounded-full border border-violet-200/50 dark:border-violet-800/40">
                Enterprise-Grade Protection
              </span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Safeguarding Your Calendar Data
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {highlightText(
                  'All database connections are encrypted in transit using strict TLS 1.3 parameters and encrypted at rest utilizing robust AES-256 standards. We conduct routine pen-testing, strict SOC-2 audits, and vulnerability assessments to safeguard client databases against security threats.',
                  searchQuery
                )}
              </p>
            </div>
            <div className="w-24 h-24 shrink-0 bg-violet-600/10 dark:bg-violet-400/10 rounded-2xl flex items-center justify-center border border-violet-500/10 animate-pulse">
              <ShieldCheck className="w-12 h-12 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Data Retention */}
      <section id="data-retention" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
            <History className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Data Retention
          </h2>
        </div>
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300">
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {highlightText(
              'We retain your personal scheduling details for as long as your Slotem workspace remains active. If you initiate account closure, our systems delete all database records, custom booking calendars, and client logs completely within 30 days, except where legal, accounting, or compliance holds command continuous archival retention.',
              searchQuery
            )}
          </p>
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
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-6">
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {highlightText(
              'We only distribute data to audited, verified third-party subprocessors who assist in facilitating booking checkout cycles and notification infrastructure:',
              searchQuery
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SUB_PROCESSORS.map((sp) => (
              <div
                key={sp.name}
                className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center group hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {sp.name === 'Stripe' && <FileText className="w-5 h-5" />}
                  {sp.name === 'AWS' && <Cpu className="w-5 h-5" />}
                  {sp.name === 'SendGrid' && <Mail className="w-5 h-5" />}
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">
                  {sp.name}
                </h4>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                  {sp.purpose}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {highlightText(sp.details, searchQuery)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Your Rights */}
      <section id="your-rights" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Your Rights
          </h2>
        </div>
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-violet-500/20 transition-all duration-300 space-y-6">
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {highlightText(
              'Under GDPR and international data compliance legislations, you hold specific, powerful rights regarding the personal schedules and identities we track. Click any card below to launch that request directly in our compliance portal:',
              searchQuery
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DATA_RIGHTS.map((right) => (
              <button
                key={right.id}
                onClick={() => onExerciseRight(right.id as RightType)}
                className="p-5 text-left bg-zinc-50 hover:bg-violet-50/20 dark:bg-zinc-950 dark:hover:bg-violet-950/10 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/30 dark:hover:border-violet-500/20 rounded-2xl transition-all duration-300 group flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                  {right.id === 'access' && <Download className="w-5 h-5" />}
                  {right.id === 'rectify' && <Edit3 className="w-5 h-5" />}
                  {right.id === 'erasure' && <Trash2 className="w-5 h-5" />}
                  {right.id === 'object' && <Ban className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {right.title}
                    </h4>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {highlightText(right.description, searchQuery)}
                  </p>
                </div>
              </button>
            ))}
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
              'For any legal, privacy, or compliance inquiries regarding this policy or our data safety arrangements, please reach out directly to our designated Data Protection Officer:',
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
                  Compliance Email
                </p>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  privacy@slotem.io
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
