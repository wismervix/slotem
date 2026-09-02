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
              <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Search className="h-5 w-5 shrink-0 text-amber-500" />
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">
                      Showing highlighted results matching &ldquo;
                      <span className="font-bold">{searchQuery}</span>&rdquo;.
                      Scroll down to view matches.
                  </p>
              </div>
          )}

          {/* Section: Information We Collect */}
          <section id="information-we-collect" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Information We Collect
                  </h2>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="mb-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {highlightText(
                          'To provide an efficient booking experience, we collect information that allows us to manage your appointments and communicate effectively. This is categorized into:',
                          searchQuery,
                      )}
                  </p>
                  <ul className="space-y-5">
                      <li className="flex items-start gap-4">
                          <div className="mt-1 shrink-0 text-violet-600 dark:text-violet-400">
                              <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                              <h4 className="mb-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                  Account Information
                              </h4>
                              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                  {highlightText(
                                      'Name, email address, phone number, and encrypted passwords created during platform sign-up.',
                                      searchQuery,
                                  )}
                              </p>
                          </div>
                      </li>
                      <li className="flex items-start gap-4">
                          <div className="mt-1 shrink-0 text-violet-600 dark:text-violet-400">
                              <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                              <h4 className="mb-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                  Booking Data
                              </h4>
                              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                  {highlightText(
                                      'Appointment times, durations, scheduling links, services requested, and custom client scheduling notes.',
                                      searchQuery,
                                  )}
                              </p>
                          </div>
                      </li>
                      <li className="flex items-start gap-4">
                          <div className="mt-1 shrink-0 text-violet-600 dark:text-violet-400">
                              <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                              <h4 className="mb-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                  Payment Details
                              </h4>
                              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                  {highlightText(
                                      'Processed securely through PCI-DSS third-party providers. We do not store or transit raw credit card numbers on our servers.',
                                      searchQuery,
                                  )}
                              </p>
                          </div>
                      </li>
                  </ul>
              </div>
          </section>

          {/* Section: How We Use Information */}
          <section id="how-we-use-information" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <Settings className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      How We Use Information
                  </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 font-bold text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                              1
                          </div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                              Service Delivery
                          </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {highlightText(
                              'We use your data to facilitate scheduling, send reminders via SMS or email, and ensure your calendar is synchronized seamlessly across physical devices.',
                              searchQuery,
                          )}
                      </p>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 font-bold text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                              2
                          </div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                              Product Improvement
                          </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {highlightText(
                              'Aggregated, non-identifying metrics help us understand feature usage to improve our layout hierarchy, scheduling algorithms, and visual accessibility.',
                              searchQuery,
                          )}
                      </p>
                  </div>
              </div>
          </section>

          {/* Section: Cookies & Tracking */}
          <section id="cookies" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <Cookie className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Cookies & Tracking
                  </h2>
              </div>
              <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {highlightText(
                          'We use essential cookies to maintain your session and remember your custom dashboard arrangements. You can fully customize these cookie permissions at any time.',
                          searchQuery,
                      )}
                  </p>

                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/40">
                      <div className="overflow-x-auto">
                          <table className="w-full min-w-max border-collapse text-left text-xs">
                              <thead>
                                  <tr className="border-b border-zinc-200 bg-zinc-100/60 font-bold tracking-wider text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-900/40">
                                      <th className="px-4 py-3">Type</th>
                                      <th className="px-4 py-3">Purpose</th>
                                      <th className="px-4 py-3">Lifespan</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-200 text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300">
                                  <tr className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                                      <td className="px-4 py-3.5 font-bold">
                                          Essential
                                      </td>
                                      <td className="px-4 py-3.5">
                                          Authentication, compliance triggers,
                                          and session security checks.
                                      </td>
                                      <td className="px-4 py-3.5">Session</td>
                                  </tr>
                                  <tr className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                                      <td className="px-4 py-3.5 font-bold">
                                          Preference
                                      </td>
                                      <td className="px-4 py-3.5">
                                          Timezone matching parameters, dark
                                          mode setting, and regional translation
                                          choice.
                                      </td>
                                      <td className="px-4 py-3.5">1 Year</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>

                  <div className="flex justify-end pt-2">
                      <button
                          onClick={onOpenCookies}
                          className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      >
                          Adjust Cookie Preferences{' '}
                          <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                  </div>
              </div>
          </section>

          {/* Section: Analytics */}
          <section id="analytics" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <LineChart className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Analytics
                  </h2>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {highlightText(
                          'We utilize industry-standard analytics tools to monitor system performance, server response rates, and customer navigation patterns. This telemetry is strictly used to identify server latency, resolve UI bottlenecks in the scheduling interface, and ensure 99.9% high availability of our calendars.',
                          searchQuery,
                      )}
                  </p>
              </div>
          </section>

          {/* Section: Security */}
          <section id="security" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Security
                  </h2>
              </div>
              <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-600/5 to-indigo-600/5 p-6 shadow-xs sm:p-8 dark:border-violet-400/20 dark:from-violet-950/10 dark:to-indigo-950/10">
                  <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                      <div className="flex-1 space-y-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/50 bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800 dark:border-violet-800/40 dark:bg-violet-950 dark:text-violet-300">
                              Enterprise-Grade Protection
                          </span>
                          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                              Safeguarding Your Calendar Data
                          </h3>
                          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                              {highlightText(
                                  'All database connections are encrypted in transit using strict TLS 1.3 parameters and encrypted at rest utilizing robust AES-256 standards. We conduct routine pen-testing, strict SOC-2 audits, and vulnerability assessments to safeguard client databases against security threats.',
                                  searchQuery,
                              )}
                          </p>
                      </div>
                      <div className="flex h-24 w-24 shrink-0 animate-pulse items-center justify-center rounded-2xl border border-violet-500/10 bg-violet-600/10 dark:bg-violet-400/10">
                          <ShieldCheck className="h-12 w-12 text-violet-600 dark:text-violet-400" />
                      </div>
                  </div>
              </div>
          </section>

          {/* Section: Data Retention */}
          <section id="data-retention" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <History className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Data Retention
                  </h2>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {highlightText(
                          'We retain your personal scheduling details for as long as your Slotem workspace remains active. If you initiate account closure, our systems delete all database records, custom booking calendars, and client logs completely within 30 days, except where legal, accounting, or compliance holds command continuous archival retention.',
                          searchQuery,
                      )}
                  </p>
              </div>
          </section>

          {/* Section: Third-party Services */}
          <section id="third-party-services" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <Share2 className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Third-party Services
                  </h2>
              </div>
              <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {highlightText(
                          'We only distribute data to audited, verified third-party subprocessors who assist in facilitating booking checkout cycles and notification infrastructure:',
                          searchQuery,
                      )}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {SUB_PROCESSORS.map((sp) => (
                          <div
                              key={sp.name}
                              className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-center transition-all duration-300 hover:border-violet-500/30 dark:border-zinc-800 dark:bg-zinc-950"
                          >
                              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition-transform group-hover:scale-110 dark:bg-violet-900/50 dark:text-violet-400">
                                  {sp.name === 'Stripe' && (
                                      <FileText className="h-5 w-5" />
                                  )}
                                  {sp.name === 'AWS' && (
                                      <Cpu className="h-5 w-5" />
                                  )}
                                  {sp.name === 'SendGrid' && (
                                      <Mail className="h-5 w-5" />
                                  )}
                              </div>
                              <h4 className="mb-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                  {sp.name}
                              </h4>
                              <p className="mb-2 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                                  {sp.purpose}
                              </p>
                              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                  {highlightText(sp.details, searchQuery)}
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
          </section>

          {/* Section: Your Rights */}
          <section id="your-rights" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <Scale className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Your Rights
                  </h2>
              </div>
              <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {highlightText(
                          'Under GDPR and international data compliance legislations, you hold specific, powerful rights regarding the personal schedules and identities we track. Click any card below to launch that request directly in our compliance portal:',
                          searchQuery,
                      )}
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {DATA_RIGHTS.map((right) => (
                          <button
                              key={right.id}
                              onClick={() =>
                                  onExerciseRight(right.id as RightType)
                              }
                              className="group flex gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-left transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-50/20 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-violet-500/20 dark:hover:bg-violet-950/10"
                          >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-xs transition-transform group-hover:scale-110 dark:bg-zinc-900 dark:text-violet-400">
                                  {right.id === 'access' && (
                                      <Download className="h-5 w-5" />
                                  )}
                                  {right.id === 'rectify' && (
                                      <Edit3 className="h-5 w-5" />
                                  )}
                                  {right.id === 'erasure' && (
                                      <Trash2 className="h-5 w-5" />
                                  )}
                                  {right.id === 'object' && (
                                      <Ban className="h-5 w-5" />
                                  )}
                              </div>
                              <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                          {right.title}
                                      </h4>
                                      <ChevronRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-1" />
                                  </div>
                                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                      {highlightText(
                                          right.description,
                                          searchQuery,
                                      )}
                                  </p>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>
          </section>

          {/* Section: Contact Information */}
          <section id="contact-information" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <Contact className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Contact Information
                  </h2>
              </div>
              <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-violet-500/20 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {highlightText(
                          'For any legal, privacy, or compliance inquiries regarding this policy or our data safety arrangements, please reach out directly to our designated Data Protection Officer:',
                          searchQuery,
                      )}
                  </p>

                  <div className="flex flex-col gap-6 sm:flex-row">
                      {/* Email card */}
                      <div className="group relative flex flex-1 items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                              <Mail className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                  Compliance Email
                              </p>
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                  privacy@slotem.io
                              </p>
                              <button
                                  onClick={handleCopyEmail}
                                  className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400"
                              >
                                  {copiedEmail ? 'Copied!' : 'Copy Address'}
                              </button>
                          </div>
                      </div>

                      {/* Address card */}
                      <div className="flex flex-1 items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                              <MapPin className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                  Physical HQ
                              </p>
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
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
