import { useState } from 'react';
import {
    Check,
    ShieldCheck,
    Zap,
    Activity,
    HelpCircle,
    ArrowRight,
} from 'lucide-react';

export default function PricingCalculator() {
    const [seats, setSeats] = useState(15);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
        'annual',
    );

    const getPricePerSeat = (numSeats: number) => {
        if (numSeats < 20) return 15;
        if (numSeats < 100) return 12;
        return 10;
    };

    const basePricePerSeat = getPricePerSeat(seats);
    const finalPricePerSeat =
        billingCycle === 'annual'
            ? Math.floor(basePricePerSeat * 0.8)
            : basePricePerSeat;
    const totalMonthlyPrice = seats * finalPricePerSeat;

    const growthFeatures = [
        'Bidirectional calendar syncing',
        'Timezone routing algorithms',
        'Individual custom booking pages',
        'Integrations: Zoom, Teams, Meet',
        'Standard round-robin routing',
        'Standard email notifications',
    ];

    const enterpriseFeatures = [
        'EVERYTHING in Growth',
        'Dedicated 24/7 Success Manager',
        'SSO (SAML, Okta, Active Directory)',
        'Full HIPAA Compliance support',
        'Custom Weighted Round-Robin routing',
        'Salesforce & HubSpot CRM write-backs',
        'Custom branding and white-labeling',
        'Flexible custom contracts',
    ];

    return (
        <div
            className="space-y-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8 dark:border-slate-700 dark:bg-slate-800"
            id="pricing-interactive-calculator"
        >
            <div className="mx-auto max-w-xl space-y-2 text-center">
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold tracking-wider text-[#630ed4] uppercase dark:bg-purple-950/30 dark:text-purple-400">
                    Transparent & Scalable Plans
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Flexible Pricing Configurator
                </h2>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Scale your enterprise coordination without seat limits. Use
                    our sliding calculator to calculate custom volume discounts
                    in real-time.
                </p>
            </div>

            {/* Seat Configurator Control */}
            <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                            Configure Your Team Size
                        </h3>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            Drag the slider to match your registered scheduling
                            operators
                        </p>
                    </div>

                    {/* Toggle Monthly / Annual */}
                    <div className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                billingCycle === 'monthly'
                                    ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                billingCycle === 'annual'
                                    ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Annual{' '}
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase dark:text-slate-500">
                            Operator Seats
                        </span>
                        <span className="rounded-md border border-purple-100 bg-purple-50 px-3 py-1 text-lg font-extrabold text-[#630ed4] dark:border-purple-800/30 dark:bg-purple-950/20 dark:text-purple-400">
                            {seats === 500 ? '500+ Seats' : `${seats} Seats`}
                        </span>
                    </div>

                    <input
                        type="range"
                        min="5"
                        max="500"
                        step="5"
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#630ed4] focus:outline-none dark:bg-slate-700"
                    />

                    <div className="flex justify-between px-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        <span>5 SEATS</span>
                        <span>100 SEATS (Volume Discount)</span>
                        <span>500+ SEATS (Custom SLA)</span>
                    </div>
                </div>

                {/* Dynamic Discount Alert */}
                {seats >= 100 && (
                    <div className="flex animate-pulse items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-300">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>
                            <strong>Enterprise volume discount active!</strong>{' '}
                            Seat price reduced to{' '}
                            <strong>${finalPricePerSeat}/seat/mo</strong> (from
                            standard $15).
                        </span>
                    </div>
                )}
            </div>

            {/* Plan Grid */}
            <div className="grid items-start gap-6 md:grid-cols-2">
                {/* Growth Plan Card */}
                <div
                    className={`relative space-y-6 rounded-xl border bg-white p-6 shadow-sm transition-all ${seats >= 150 ? 'opacity-60 grayscale-[30%]' : 'border-slate-200 dark:border-slate-700 dark:bg-slate-900'}`}
                >
                    {seats < 150 && (
                        <span className="absolute -top-2.5 right-6 rounded-full bg-[#630ed4] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase dark:bg-purple-600">
                            Recommended for your size
                        </span>
                    )}
                    <div className="space-y-2">
                        <h3 className="flex items-center gap-1.5 text-lg font-extrabold text-slate-800 dark:text-white">
                            <Zap className="h-4 w-4 text-[#630ed4] dark:text-purple-400" />{' '}
                            Growth Plan
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Everything needed for expanding mid-size
                            coordination
                        </p>
                    </div>

                    <div className="flex items-baseline gap-1 border-y border-slate-100 py-4 dark:border-slate-800">
                        <span className="text-2xl font-black text-slate-800 dark:text-white">
                            ${totalMonthlyPrice}
                        </span>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            / month billed {billingCycle}
                        </span>
                        <span className="ml-auto text-xs font-semibold text-slate-400 dark:text-slate-500">
                            (${finalPricePerSeat}/seat)
                        </span>
                    </div>

                    <ul className="space-y-3">
                        {growthFeatures.map((f) => (
                            <li
                                key={f}
                                className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400"
                            >
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="#request-demo-section"
                        className="flex h-11 w-full items-center justify-center rounded-lg border border-[#630ed4] text-xs font-semibold text-[#630ed4] transition-all hover:bg-purple-50/50 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-950/20"
                    >
                        Get Started with Growth
                    </a>
                </div>

                {/* Enterprise Plan Card */}
                <div
                    className={`relative space-y-6 rounded-xl border bg-white p-6 shadow-md transition-all ${seats >= 150 ? 'border-[#630ed4] ring-2 ring-[#630ed4]/10 dark:border-purple-500 dark:ring-purple-500/20' : 'border-slate-200 dark:border-slate-700 dark:bg-slate-900'}`}
                >
                    {seats >= 150 && (
                        <span className="absolute -top-2.5 right-6 rounded-full bg-[#630ed4] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase dark:bg-purple-600">
                            Best Match for scale
                        </span>
                    )}
                    <div className="space-y-2">
                        <h3 className="flex items-center gap-1.5 text-lg font-extrabold text-slate-800 dark:text-white">
                            <ShieldCheck className="h-4 w-4 text-[#630ed4] dark:text-purple-400" />{' '}
                            Enterprise Plan
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Tailored solutions, security SLA agreements, and
                            support contracts
                        </p>
                    </div>

                    <div className="flex flex-col justify-center border-y border-slate-100 py-4 dark:border-slate-800">
                        <span className="text-2xl font-black text-[#630ed4] dark:text-purple-400">
                            Custom Pricing
                        </span>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            Dedicated volume discounting contracts
                        </span>
                    </div>

                    <ul className="space-y-3">
                        {enterpriseFeatures.map((f) => (
                            <li
                                key={f}
                                className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400"
                            >
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
                                <span
                                    className={
                                        f.startsWith('EVERYTHING')
                                            ? 'font-bold text-slate-800 dark:text-white'
                                            : ''
                                    }
                                >
                                    {f}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="#request-demo-section"
                        className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#630ed4] text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#5209b5] dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                        Request Custom Quote{' '}
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
