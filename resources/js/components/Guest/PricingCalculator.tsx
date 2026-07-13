import { useState } from "react";
import { Check, ShieldCheck, Zap, Activity, HelpCircle, ArrowRight } from "lucide-react";

export default function PricingCalculator() {
  const [seats, setSeats] = useState(15);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const getPricePerSeat = (numSeats: number) => {
    if (numSeats < 20) return 15;
    if (numSeats < 100) return 12;
    return 10; // Volume discount
  };

  const basePricePerSeat = getPricePerSeat(seats);
  const finalPricePerSeat = billingCycle === "annual" ? Math.floor(basePricePerSeat * 0.8) : basePricePerSeat;
  const totalMonthlyPrice = seats * finalPricePerSeat;

  const growthFeatures = [
    "Bidirectional calendar syncing",
    "Timezone routing algorithms",
    "Individual custom booking pages",
    "Integrations: Zoom, Teams, Meet",
    "Standard round-robin routing",
    "Standard email notifications"
  ];

  const enterpriseFeatures = [
    "EVERYTHING in Growth",
    "Dedicated 24/7 Success Manager",
    "SSO (SAML, Okta, Active Directory)",
    "Full HIPAA Compliance support",
    "Custom Weighted Round-Robin routing",
    "Salesforce & HubSpot CRM write-backs",
    "Custom branding and white-labeling",
    "Flexible custom contracts"
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8" id="pricing-interactive-calculator">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-[#630ed4] uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full">
          Transparent & Scalable Plans
        </span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Flexible Pricing Configurator</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Scale your enterprise coordination without seat limits. Use our sliding calculator to calculate custom volume discounts in real-time.
        </p>
      </div>

      {/* Seat Configurator Control */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Configure Your Team Size</h3>
            <p className="text-xs text-slate-400 mt-1">Drag the slider to match your registered scheduling operators</p>
          </div>

          {/* Toggle Monthly / Annual */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                billingCycle === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                billingCycle === "annual" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Annual <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-1.5 py-0.5 rounded">-20%</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Operator Seats</span>
            <span className="text-lg font-extrabold text-[#630ed4] bg-purple-50 px-3 py-1 rounded-md border border-purple-100">
              {seats === 500 ? "500+ Seats" : `${seats} Seats`}
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#630ed4] focus:outline-none"
          />

          <div className="flex justify-between text-[10px] text-slate-400 px-1 font-mono">
            <span>5 SEATS</span>
            <span>100 SEATS (Volume Discount)</span>
            <span>500+ SEATS (Custom SLA)</span>
          </div>
        </div>

        {/* Dynamic Discount Alert */}
        {seats >= 100 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2 animate-pulse">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              <strong>Enterprise volume discount active!</strong> Seat price reduced to <strong>${finalPricePerSeat}/seat/mo</strong> (from standard $15).
            </span>
          </div>
        )}
      </div>

      {/* Plan Grid */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Growth Plan Card */}
        <div className={`bg-white rounded-xl border p-6 space-y-6 shadow-sm transition-all relative ${seats >= 150 ? "opacity-60 grayscale-[30%]" : "border-slate-200"}`}>
          {seats < 150 && (
            <span className="absolute -top-2.5 right-6 bg-[#630ed4] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Recommended for your size
            </span>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-[#630ed4]" /> Growth Plan
            </h3>
            <p className="text-xs text-slate-400">Everything needed for expanding mid-size coordination</p>
          </div>

          <div className="border-y border-slate-100 py-4 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800">${totalMonthlyPrice}</span>
            <span className="text-xs text-slate-400 font-medium">/ month billed {billingCycle}</span>
            <span className="text-xs font-semibold text-slate-400 ml-auto">(${finalPricePerSeat}/seat)</span>
          </div>

          <ul className="space-y-3">
            {growthFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <a
            href="#request-demo-section"
            className="w-full h-11 flex items-center justify-center rounded-lg border border-[#630ed4] text-[#630ed4] font-semibold text-xs hover:bg-purple-50/50 transition-all"
          >
            Get Started with Growth
          </a>
        </div>

        {/* Enterprise Plan Card */}
        <div className={`bg-white rounded-xl border p-6 space-y-6 shadow-md transition-all relative ${seats >= 150 ? "border-[#630ed4] ring-2 ring-[#630ed4]/10" : "border-slate-200"}`}>
          {seats >= 150 && (
            <span className="absolute -top-2.5 right-6 bg-[#630ed4] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Best Match for scale
            </span>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#630ed4]" /> Enterprise Plan
            </h3>
            <p className="text-xs text-slate-400">Tailored solutions, security SLA agreements, and support contracts</p>
          </div>

          <div className="border-y border-slate-100 py-4 flex flex-col justify-center">
            <span className="text-2xl font-black text-[#630ed4]">Custom Pricing</span>
            <span className="text-xs text-slate-400 font-medium">Dedicated volume discounting contracts</span>
          </div>

          <ul className="space-y-3">
            {enterpriseFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600">
                <Check className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span className={f.startsWith("EVERYTHING") ? "font-bold text-slate-800" : ""}>{f}</span>
              </li>
            ))}
          </ul>

          <a
            href="#request-demo-section"
            className="w-full h-11 flex items-center justify-center rounded-lg bg-[#630ed4] text-white font-semibold text-xs hover:bg-[#5209b5] transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            Request Custom Quote <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
