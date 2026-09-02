import { useState } from 'react';
import {
    Clock,
    Globe,
    ArrowRight,
    CheckCircle2,
    User,
    RefreshCw,
    Calendar,
    Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Host {
    name: string;
    role: string;
    avatar: string;
    timezone: string;
    weight: string;
}

export default function FeaturesShowcase() {
    const [activeTab, setActiveTab] = useState<
        'round-robin' | 'timezone' | 'collective'
    >('round-robin');
    const [selectedZone, setSelectedZone] = useState('America/New_York');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignedHost, setAssignedHost] = useState<Host | null>(null);
    const [roundRobinIndex, setRoundRobinIndex] = useState(0);

    const teamHosts: Host[] = [
        {
            name: 'Sarah Chen',
            role: 'VP of Operations / Enterprise Lead',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPUwtTdBhrZXWZilQC8pJvwYym2g_AoPh4Aa0cOkKAnXuI-KuObRlhLtXZn4Te8Nm7ylko6xD8ZqxE1fsZHzqZIYCpyWE1qSGj_h5WTwphm-nMiMam6FwZ6FnlOcE0_VEwsMB-2Kg7c_YBVvCCPKEtJ5lixXEhZV2SV8pCmVReO-iGy38w3wgLFFrQD9R3Dmk2RB4dsQhoXLlRGm4AHn74j35vWuGOAV_rS8Klg7u2NmKjKzVFsufhXXFiG1hiR_OxC3xD9Lby_II',
            timezone: 'America/Los_Angeles',
            weight: '35% Priority',
        },
        {
            name: 'David Miller',
            role: 'Senior Solutions Engineer',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
            timezone: 'Europe/London',
            weight: '40% Priority',
        },
        {
            name: 'Kenji Sato',
            role: 'Strategic Accounts Architect',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
            timezone: 'Asia/Tokyo',
            weight: '25% Priority',
        },
    ];

    const timezones = [
        { name: 'New York (EST)', value: 'America/New_York', offset: '-4h' },
        { name: 'London (BST)', value: 'Europe/London', offset: '+1h' },
        { name: 'Tokyo (JST)', value: 'Asia/Tokyo', offset: '+9h' },
        { name: 'Sydney (AEST)', value: 'Australia/Sydney', offset: '+10h' },
    ];

    const timeslots = [
        { nyc: '09:00 AM', london: '02:00 PM', tokyo: '10:00 PM' },
        { nyc: '11:30 AM', london: '04:30 PM', tokyo: '12:30 AM (+1)' },
        { nyc: '02:00 PM', london: '07:00 PM', tokyo: '03:00 AM (+1)' },
        { nyc: '04:30 PM', london: '09:30 PM', tokyo: '05:30 AM (+1)' },
    ];

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (activeTab === 'round-robin') {
            setIsAssigning(true);
            setAssignedHost(null);

            setTimeout(() => {
                const nextIndex = (roundRobinIndex + 1) % teamHosts.length;
                setRoundRobinIndex(nextIndex);
                setAssignedHost(teamHosts[roundRobinIndex]);
                setIsAssigning(false);
            }, 1200);
        }
    };

    return (
        <div
            className="space-y-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8 dark:border-slate-700 dark:bg-slate-800"
            id="features-interactive-playground"
        >
            <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center dark:border-slate-700">
                <div>
                    <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#630ed4] uppercase dark:text-purple-400">
                        <Sparkles className="h-3 w-3" /> Interactive Platform
                        Tour
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Experience Slotem Scheduling
                    </h2>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap self-stretch rounded-lg bg-slate-200/60 p-1 md:self-auto dark:bg-slate-700">
                    {(['round-robin', 'timezone', 'collective'] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setSelectedTime(null);
                                    setAssignedHost(null);
                                }}
                                className={`flex-1 rounded-md px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-all md:flex-none ${
                                    activeTab === tab
                                        ? 'bg-white text-[#630ed4] shadow-sm dark:bg-slate-900 dark:text-purple-400 dark:shadow-slate-700'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ),
                    )}
                </div>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-12">
                {/* Left Interactive Control Panel (8 cols) */}
                <div className="space-y-6 lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {activeTab === 'round-robin' && (
                            <motion.div
                                key="rr"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                                        <RefreshCw className="h-4 w-4 animate-spin-slow text-[#630ed4] dark:text-purple-400" />
                                        Automatic Lead Assignment (Round-Robin)
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Incoming request bookings are shared in
                                        real-time between pre-authorized team
                                        specialists according to team weight
                                        preferences. Click a slot to test
                                        assignment.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {teamHosts.map((host, idx) => (
                                        <div
                                            key={host.name}
                                            className={`relative flex items-center gap-3 rounded-xl border p-3 transition-all ${
                                                assignedHost?.name === host.name
                                                    ? 'border-[#630ed4] bg-purple-50 ring-2 ring-[#630ed4]/10 dark:border-purple-500 dark:bg-purple-950/20 dark:ring-purple-500/20'
                                                    : 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900'
                                            }`}
                                        >
                                            <img
                                                src={host.avatar}
                                                alt={host.name}
                                                className="h-9 w-9 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div>
                                                <h4 className="text-xs leading-tight font-bold text-slate-800 dark:text-white">
                                                    {host.name}
                                                </h4>
                                                <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                                                    {host.weight}
                                                </span>
                                                {roundRobinIndex === idx && (
                                                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'timezone' && (
                            <motion.div
                                key="tz"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                                        <Globe className="h-4 w-4 text-sky-500" />
                                        Intelligent Timezone Conversion
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        The platform auto-detects prospect
                                        locations and maps availability without
                                        confusing AM/PM calculations. Choose a
                                        prospect zone to see the instant
                                        localized shift.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {timezones.map((tz) => (
                                        <button
                                            key={tz.value}
                                            onClick={() => {
                                                setSelectedZone(tz.value);
                                                setSelectedTime(null);
                                            }}
                                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                                                selectedZone === tz.value
                                                    ? 'border-sky-400 bg-sky-50 text-sky-700 dark:border-sky-500 dark:bg-sky-950/30 dark:text-sky-300'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {tz.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'collective' && (
                            <motion.div
                                key="co"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                                        <User className="h-4 w-4 text-[#630ed4] dark:text-purple-400" />
                                        Collective Multi-Host Scheduling
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Ideal for executive panels or customer
                                        success kickoffs. Slotem
                                        cross-references multiple team calendars
                                        simultaneously, offering times only when
                                        *all* selected hosts are free.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 rounded-lg border border-purple-100 bg-purple-50/50 p-3 text-xs text-purple-700 dark:border-purple-800/30 dark:bg-purple-950/20 dark:text-purple-300">
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#630ed4] dark:text-purple-400" />
                                    <span>
                                        Showing mutual slots for{' '}
                                        <strong>Sarah Chen</strong> (Sales) +{' '}
                                        <strong>David Miller</strong>{' '}
                                        (Technical).
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Availability Grid */}
                    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-0 items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-white">
                                <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                Select Demo Time (Monday, July 20)
                            </span>
                            <span className="text-slate-400 dark:text-slate-500">
                                {activeTab === 'timezone'
                                    ? `Zone: ${selectedZone}`
                                    : 'Auto UTC Sync'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                            {timeslots.map((ts, idx) => {
                                let displayTime = ts.nyc;
                                if (activeTab === 'timezone') {
                                    if (selectedZone === 'Europe/London')
                                        displayTime = ts.london;
                                    if (selectedZone === 'Asia/Tokyo')
                                        displayTime = ts.tokyo;
                                    if (selectedZone === 'Australia/Sydney') {
                                        displayTime =
                                            ts.nyc === '09:00 AM'
                                                ? '11:00 PM'
                                                : ts.nyc === '11:30 AM'
                                                  ? '01:30 AM (+1)'
                                                  : '04:00 AM (+1)';
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            handleTimeSelect(displayTime)
                                        }
                                        className={`flex h-11 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                                            selectedTime === displayTime
                                                ? 'border-[#630ed4] bg-[#630ed4] text-white shadow-md shadow-purple-500/10 dark:shadow-purple-500/20'
                                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <Clock className="mr-1.5 h-3.5 w-3.5 opacity-60" />
                                        {displayTime}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Status Result Panel (5 cols) */}
                <div className="h-full lg:col-span-5">
                    <div className="flex min-h-[340px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                            Allocation Output
                        </h3>

                        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                            <AnimatePresence mode="wait">
                                {isAssigning ? (
                                    <motion.div
                                        key="assigning"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-3"
                                    >
                                        <RefreshCw className="mx-auto h-10 w-10 animate-spin text-[#630ed4] dark:text-purple-400" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                                                Assigning Specialist...
                                            </h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                Consulting round-robin weights
                                                and calendar queue
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : assignedHost ? (
                                    <motion.div
                                        key="host-assigned"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative inline-block">
                                            <img
                                                src={assignedHost.avatar}
                                                alt={assignedHost.name}
                                                className="mx-auto h-16 w-16 rounded-full border-2 border-emerald-500 object-cover shadow-md"
                                                referrerPolicy="no-referrer"
                                            />
                                            <span className="absolute right-0 bottom-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[8px] font-bold text-white dark:border-slate-900">
                                                ✓
                                            </span>
                                        </div>
                                        <div>
                                            <span className="mb-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase dark:bg-emerald-950/30 dark:text-emerald-300">
                                                Match Completed
                                            </span>
                                            <h4 className="text-base font-bold text-slate-800 dark:text-white">
                                                {assignedHost.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {assignedHost.role}
                                            </p>
                                        </div>
                                        <div className="mx-auto max-w-[250px] rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800">
                                            <span className="block text-[10px] text-slate-400 uppercase dark:text-slate-500">
                                                Selected Time
                                            </span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-white">
                                                {selectedTime} (Local Time)
                                            </span>
                                        </div>
                                    </motion.div>
                                ) : selectedTime ? (
                                    <motion.div
                                        key="time-selected"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-3"
                                    >
                                        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                                                Time Lock Successful
                                            </h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                Local selection registered:{' '}
                                                <strong>{selectedTime}</strong>
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="max-w-[200px] space-y-2 text-slate-400 dark:text-slate-500"
                                    >
                                        <Calendar className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                Pick a Time Slot
                                            </h4>
                                            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                                                Select an available time to
                                                trigger active scheduling
                                                scenarios
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-0 items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                Response SLA: &lt;2 hours
                            </span>
                            <a
                                href="#request-demo-section"
                                className="flex items-center font-bold text-[#630ed4] hover:underline dark:text-purple-400"
                            >
                                Lock Demo{' '}
                                <ArrowRight className="ml-0.5 h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
