import { useState } from "react";
import { Clock, Globe, ArrowRight, CheckCircle2, User, RefreshCw, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Host {
  name: string;
  role: string;
  avatar: string;
  timezone: string;
  weight: string;
}

export default function FeaturesShowcase() {
  const [activeTab, setActiveTab] = useState<"round-robin" | "timezone" | "collective">("round-robin");
  const [selectedZone, setSelectedZone] = useState("America/New_York");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignedHost, setAssignedHost] = useState<Host | null>(null);
  const [roundRobinIndex, setRoundRobinIndex] = useState(0);

  const teamHosts: Host[] = [
    {
      name: "Sarah Chen",
      role: "VP of Operations / Enterprise Lead",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPUwtTdBhrZXWZilQC8pJvwYym2g_AoPh4Aa0cOkKAnXuI-KuObRlhLtXZn4Te8Nm7ylko6xD8ZqxE1fsZHzqZIYCpyWE1qSGj_h5WTwphm-nMiMam6FwZ6FnlOcE0_VEwsMB-2Kg7c_YBVvCCPKEtJ5lixXEhZV2SV8pCmVReO-iGy38w3wgLFFrQD9R3Dmk2RB4dsQhoXLlRGm4AHn74j35vWuGOAV_rS8Klg7u2NmKjKzVFsufhXXFiG1hiR_OxC3xD9Lby_II",
      timezone: "America/Los_Angeles",
      weight: "35% Priority"
    },
    {
      name: "David Miller",
      role: "Senior Solutions Engineer",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
      timezone: "Europe/London",
      weight: "40% Priority"
    },
    {
      name: "Kenji Sato",
      role: "Strategic Accounts Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      timezone: "Asia/Tokyo",
      weight: "25% Priority"
    }
  ];

  const timezones = [
    { name: "New York (EST)", value: "America/New_York", offset: "-4h" },
    { name: "London (BST)", value: "Europe/London", offset: "+1h" },
    { name: "Tokyo (JST)", value: "Asia/Tokyo", offset: "+9h" },
    { name: "Sydney (AEST)", value: "Australia/Sydney", offset: "+10h" }
  ];

  const timeslots = [
    { nyc: "09:00 AM", london: "02:00 PM", tokyo: "10:00 PM" },
    { nyc: "11:30 AM", london: "04:30 PM", tokyo: "12:30 AM (+1)" },
    { nyc: "02:00 PM", london: "07:00 PM", tokyo: "03:00 AM (+1)" },
    { nyc: "04:30 PM", london: "09:30 PM", tokyo: "05:30 AM (+1)" }
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (activeTab === "round-robin") {
      setIsAssigning(true);
      setAssignedHost(null);
      
      setTimeout(() => {
        // Cycle hosts via round-robin allocation logic
        const nextIndex = (roundRobinIndex + 1) % teamHosts.length;
        setRoundRobinIndex(nextIndex);
        setAssignedHost(teamHosts[roundRobinIndex]);
        setIsAssigning(false);
      }, 1200);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 lg:p-8 space-y-8" id="features-interactive-playground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold text-[#630ed4] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3 w-3" /> Interactive Platform Tour
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Experience Slotem Scheduling</h2>
        </div>
        <div className="flex bg-slate-200/60 p-1 rounded-lg self-stretch md:self-auto">
          {(["round-robin", "timezone", "collective"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedTime(null);
                setAssignedHost(null);
              }}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-medium rounded-md transition-all uppercase tracking-wider ${
                activeTab === tab
                  ? "bg-white text-[#630ed4] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Control Panel (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "round-robin" && (
              <motion.div
                key="rr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-[#630ed4] animate-spin-slow" />
                    Automatic Lead Assignment (Round-Robin)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Incoming request bookings are shared in real-time between pre-authorized team specialists according to team weight preferences. Click a slot to test assignment.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {teamHosts.map((host, idx) => (
                    <div
                      key={host.name}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        assignedHost?.name === host.name
                          ? "bg-purple-50 border-[#630ed4] ring-2 ring-[#630ed4]/10"
                          : "bg-white border-slate-100"
                      }`}
                    >
                      <img src={host.avatar} alt={host.name} className="h-9 w-9 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{host.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{host.weight}</span>
                        {roundRobinIndex === idx && (
                          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "timezone" && (
              <motion.div
                key="tz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4 text-sky-500" />
                    Intelligent Timezone Conversion
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    The platform auto-detects prospect locations and maps availability without confusing AM/PM calculations. Choose a prospect zone to see the instant localized shift.
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
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedZone === tz.value
                          ? "bg-sky-50 border-sky-400 text-sky-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {tz.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "collective" && (
              <motion.div
                key="co"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-[#630ed4]" />
                    Collective Multi-Host Scheduling
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ideal for executive panels or customer success kickoffs. Slotem cross-references multiple team calendars simultaneously, offering times only when *all* selected hosts are free.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-purple-50/50 border border-purple-100 p-3 rounded-lg text-xs text-purple-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#630ed4]" />
                  <span>Showing mutual slots for <strong>Sarah Chen</strong> (Sales) + <strong>David Miller</strong> (Technical).</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Availability Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                Select Demo Time (Monday, July 20)
              </span>
              <span className="text-slate-400">
                {activeTab === "timezone" ? `Zone: ${selectedZone}` : "Auto UTC Sync"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {timeslots.map((ts, idx) => {
                let displayTime = ts.nyc;
                if (activeTab === "timezone") {
                  if (selectedZone === "Europe/London") displayTime = ts.london;
                  if (selectedZone === "Asia/Tokyo") displayTime = ts.tokyo;
                  if (selectedZone === "Australia/Sydney") {
                    // Simple offset approximation
                    displayTime = ts.nyc === "09:00 AM" ? "11:00 PM" : ts.nyc === "11:30 AM" ? "01:30 AM (+1)" : "04:00 AM (+1)";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleTimeSelect(displayTime)}
                    className={`h-11 flex items-center justify-center rounded-lg text-xs font-semibold border transition-all ${
                      selectedTime === displayTime
                        ? "bg-[#630ed4] border-[#630ed4] text-white shadow-md shadow-purple-500/10"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5 opacity-60" />
                    {displayTime}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Status Result Panel (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-white rounded-xl border border-slate-200 p-5 min-h-[340px] flex flex-col justify-between shadow-sm">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Allocation Output</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              <AnimatePresence mode="wait">
                {isAssigning ? (
                  <motion.div
                    key="assigning"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <RefreshCw className="h-10 w-10 text-[#630ed4] mx-auto animate-spin" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Assigning Specialist...</h4>
                      <p className="text-xs text-slate-400">Consulting round-robin weights and calendar queue</p>
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
                        className="h-16 w-16 rounded-full mx-auto object-cover border-2 border-emerald-500 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider mb-1">
                        Match Completed
                      </span>
                      <h4 className="text-base font-bold text-slate-800">{assignedHost.name}</h4>
                      <p className="text-xs text-slate-500">{assignedHost.role}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 max-w-[250px] mx-auto">
                      <span className="text-[10px] text-slate-400 block uppercase">Selected Time</span>
                      <span className="text-xs font-bold text-slate-700">{selectedTime} (Local Time)</span>
                    </div>
                  </motion.div>
                ) : selectedTime ? (
                  <motion.div
                    key="time-selected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Time Lock Successful</h4>
                      <p className="text-xs text-slate-400">Local selection registered: <strong>{selectedTime}</strong></p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 space-y-2 max-w-[200px]"
                  >
                    <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500">Pick a Time Slot</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Select an available time to trigger active scheduling scenarios</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Response SLA: &lt;2 hours
              </span>
              <a href="#request-demo-section" className="text-[#630ed4] font-bold hover:underline flex items-center">
                Lock Demo <ArrowRight className="h-3 w-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
