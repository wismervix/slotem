import { useState } from "react";
import { Search, HelpCircle, BookOpen, ChevronDown, ChevronUp, Lock, RefreshCw, Calendar, Mail } from "lucide-react";
import { FAQItem } from "@/types";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "pricing" | "technical" | "security">("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const faqs: (FAQItem & { id: number })[] = [
    {
      id: 1,
      category: "general",
      question: "How does Slotem handle team members in different timezones?",
      answer: "Slotem features real-time, bi-directional timezone calculation. When a prospect visits your booking page, we automatically detect their local timezone and dynamically convert the available slots. The host receives the booking directly mapped into their own native timezone, eliminating any AM/PM coordination errors."
    },
    {
      id: 2,
      category: "technical",
      question: "Does Slotem support two-way synchronization with Outlook and Google Calendar?",
      answer: "Absolutely. Slotem integrates directly with Google Calendar, Microsoft Exchange, Outlook.com, and Office 365. When a booking occurs on Slotem, it immediately writes to your calendar. Conversely, if you add a personal event or blocking placeholder on your calendar, Slotem instantly recognizes it and hides those times on your booking pages."
    },
    {
      id: 3,
      category: "security",
      question: "Is Slotem SOC 2 Type II certified and HIPAA compliant?",
      answer: "Yes, security is a core pillar of our platform. Slotem is fully SOC 2 Type II certified. For health and wellness enterprises, we offer signing of Business Associate Agreements (BAAs) to secure HIPAA compliance. All user data, calendar metadata, and communication channels are encrypted in transit and at rest."
    },
    {
      id: 4,
      category: "pricing",
      question: "What happens if we add or remove seats mid-billing cycle?",
      answer: "Our seats model supports full pro-ration. If you add seats, we will issue a pro-rated charge covering the remaining days of the active billing cycle. If you remove seats, you will receive corresponding seat credits applied to your subsequent renewal bill."
    },
    {
      id: 5,
      category: "technical",
      question: "How does round-robin scheduling distribute meetings?",
      answer: "We support multiple distribution modes: Equal Distribution (reps are assigned sequentially to keep load strictly equal), Weighted Distribution (assign more leads to senior reps or ramp-up reps), and Availability-first (give the meeting to whoever is available soonest to optimize lead speed)."
    },
    {
      id: 6,
      category: "security",
      question: "Can we configure Single Sign-On (SSO) for our operators?",
      answer: "Yes! Slotem supports standard enterprise SSO protocols including SAML 2.0, Okta, Microsoft Azure AD, Google Workspace SSO, and Ping Identity. This can be configured by your IT administrators in the Slotem admin dashboard under Security Settings."
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All FAQ" },
    { id: "general", label: "General Usage" },
    { id: "pricing", label: "Billing & Plans" },
    { id: "technical", label: "Technical & Routing" },
    { id: "security", label: "Security & Compliance" }
  ] as const;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6" id="help-center-knowledge-base">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-[#630ed4] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <BookOpen className="h-3 w-3" /> Slotem Documentation
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Help & Knowledge Center</h2>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search helpful articles..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#630ed4] focus:ring-0 transition-all"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCategory(c.id);
              setOpenFaqId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === c.id
                ? "bg-[#630ed4] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="transition-all hover:bg-slate-50/20">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left gap-4"
                >
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    {faq.category === "security" && <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                    {faq.category === "technical" && <RefreshCw className="h-3.5 w-3.5 text-[#630ed4] shrink-0" />}
                    {faq.category === "pricing" && <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                    {faq.category === "general" && <HelpCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Search className="h-8 w-8 mx-auto text-slate-300 animate-pulse" />
            <p className="text-xs">No matching articles found. Try searching for "HIPAA", "timezone", or "pricing".</p>
          </div>
        )}
      </div>

      {/* Support Direct Banner */}
      <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800">Need direct engineering assistance?</h4>
          <p className="text-[11px] text-slate-500 leading-none">Our technical experts can configure a custom routing sandbox for you.</p>
        </div>
        <a
          href="mailto:sales@slotem.com"
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-purple-200 text-[#630ed4] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Mail className="h-3.5 w-3.5" /> Email support@slotem.com
        </a>
      </div>
    </div>
  );
}
