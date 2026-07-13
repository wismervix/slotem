import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video, Rocket, Building2, ShieldCheck, Users, 
  Mail, Phone, MessageSquare, Menu, X, ArrowRight,
  Sparkles, CheckCircle, Lock, ShieldAlert, LogIn, ChevronRight, HelpCircle,
  RefreshCw
} from "lucide-react";

import ChatWidget from "@/components/Guest/ChatWidget";
import FeaturesShowcase from "@/components/Guest/FeaturesShowcase";
import PricingCalculator from "@/components/Guest/PricingCalculator";
import HelpCenter from "@/components/Guest/HelpCenter";
import GuestLayout from "@/layouts/Guest/GuestLayout";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companySize, setCompanySize] = useState("Select Size");
  const [industry, setIndustry] = useState("Select Industry");
  const [country, setCountry] = useState("United States");
  const [message, setMessage] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePrivacy) {
      setSubmitError("You must agree to Slotem's Privacy Policy to request a demo.");
      return;
    }
    if (companySize === "Select Size" || industry === "Select Industry") {
      setSubmitError("Please specify your company size and industry.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          company,
          workEmail,
          phoneNumber,
          companySize,
          industry,
          country,
          message
        })
      });

      if (!res.ok) {
        throw new Error("Form submission failed. Please verify connection details.");
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const resetFormState = () => {
    setFullName("");
    setCompany("");
    setWorkEmail("");
    setPhoneNumber("");
    setCompanySize("Select Size");
    setIndustry("Select Industry");
    setCountry("United States");
    setMessage("");
    setAgreePrivacy(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  };


  return (
    <GuestLayout>
      {/* ----------------- Hero / Form Main Section ----------------- */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Pitch and Benefits */}
          <section className="space-y-10">
            <div className="space-y-5">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Let's build a better booking experience together.
              </h1>
              <p className="text-base text-slate-500 max-w-lg leading-relaxed">
                Empower your team with a scheduling engine designed for high-growth enterprises. Scale operations without the friction.
              </p>
            </div>

            {/* Benefits Stack list */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center shadow-sm">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Personalized demo</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">See Slotem in action tailored to your specific workflows.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center shadow-sm">
                  <Rocket className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Custom onboarding</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">White-glove implementation to get your team running fast.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center shadow-sm">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Enterprise pricing</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Volume discounts and flexible contracts for large teams.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Dedicated support</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">A designated success manager for your account 24/7.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center shadow-sm">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Team training</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Comprehensive workshops to maximize your ROI on the platform.</p>
                </div>
              </div>
            </div>

            {/* Trusted monochrome logos with perfect hotlinks */}
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Trusted by Industry Leaders</span>
              <div className="flex flex-wrap gap-8 items-center opacity-40 grayscale hover:opacity-60 transition-opacity">
                <img className="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANqQHRCfGse3JpxuJ7uS1ftYMfipq4WNm5ag2W6eM3oTraOt65s4LXDXoeoK53w7FnkCaZDWQbHaqLb3pz7Sf74t-16Lb83YHQ4Yb90CnyF58ZsMr6os8cDrwm1odg39Fm0QDGg2tfZjAhVJNe_m1Xi-rt2Dye-3qsCd6MtnVQm17zgtnUBsa4RXfV2qn39Cz3xB_9qzo5uQuHSC4enfUK0ZB4de00NbW0gavFFsOof2k9cOL3vj_uIa-P8pRk6nvOHg7bmMxdcwQ" alt="Logo 1" referrerPolicy="no-referrer" />
                <img className="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOG8saf7ZDA6wU06PNN1ECT_QwFbR6hrDjSqccGHKHYmu0XBWGrFCgNHeG6TWEn8hRfXKcYL6SgNjYeFOkNZrwKN6xlS_XtHOCdz6166OSnC6qaVWLRimZqRkUTBhMRfxQ45blkHAmSnhQPvrdhuj9adAteNtd6rEnFzw4rSnaJbTLZ-TYWv1PaEyyAl-Iv5yBpFfLem8zgaul7LTyqUTzhpKjgHxIXIUj_MQ4kXzgQNuPmgcFNQ2H4H89fFxqy3iaxqYQKfwWw5M" alt="Logo 2" referrerPolicy="no-referrer" />
                <img className="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMiFcbOyfA0DoA8lx9vyMxZ8lXDuHi6VzdYSO5ZB_Wug55sVLxnyB2yjio1w6P8acRkWHmkz1t2GaxqESiLP6OE4pcUR3z3bSDbQ6R52yRi3OOwGEpt0MoX3v9SvpN-A3cvJGGC8FRTXnor6Rneor9wMgv0dZLZ_ZMgMiqgcMuTDciRAwCRr17EeLjDxfoblMZJKX-Jj_T-53Y84CmFP3mwL38mENI4rPqasuMOVUYGFxSTVibeLsRqGqXE-4NNRfKVo_UP1H8-gE" alt="Logo 3" referrerPolicy="no-referrer" />
                <img className="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzRHzo8c3ZK78qJme7m8y9Xbd4igapsiFFlx5_7E7pACxGgkE-rr_TwxHlZXn6B_tj0DSwUi2DU2sAALkivtkBKPpTovKPIa9Tyc6a9Khv4VJHAsTTtr3ZzxXWAqrLtvZmjRZakLxz3iBi1CsaMBZSxnVY7vMhm_2Jp8HFGSZW_wPT38yWex6ObXijKu_2IQ0H9MvtxcCrV5HA4kEbv-RrMuY6tpCruZTqxw42hZKPjTfpNzzsW4Qt-hENSQTML_GElw_jlbxfpd4" alt="Logo 4" referrerPolicy="no-referrer" />
              </div>
            </div>

            {/* Premium Testimonial Card */}
            <div className="bg-purple-50/40 border border-purple-100 p-5 rounded-2xl space-y-4">
              <p className="text-xs font-semibold text-[#630ed4] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <Sparkles className="h-3.5 w-3.5" /> Customer Testimonial
              </p>
              <p className="text-sm italic text-slate-700 leading-relaxed">
                "Slotem transformed how our global sales teams coordinate demos. We've seen a 40% increase in conversion rates since migrating to their enterprise tier."
              </p>
              <div className="flex items-center gap-3 border-t border-purple-100/60 pt-3">
                <img 
                  className="w-10 h-10 rounded-full object-cover border border-purple-200"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPUwtTdBhrZXWZilQC8pJvwYym2g_AoPh4Aa0cOkKAnXuI-KuObRlhLtXZn4Te8Nm7ylko6xD8ZqxE1fsZHzqZIYCpyWE1qSGj_h5WTwphm-nMiMam6FwZ6FnlOcE0_VEwsMB-2Kg7c_YBVvCCPKEtJ5lixXEhZV2SV8pCmVReO-iGy38w3wgLFFrQD9R3Dmk2RB4dsQhoXLlRGm4AHn74j35vWuGOAV_rS8Klg7u2NmKjKzVFsufhXXFiG1hiR_OxC3xD9Lby_II" 
                  alt="Sarah Chen Portrait" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sarah Chen</h4>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">VP of Operations, GlobalScale</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Side: Demo Request Form Card */}
          <section id="request-demo-section" className="lg:sticky lg:top-24">
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-purple-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl opacity-70 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.div
                    key="form-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request a Demo</h2>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Complete the form below and an enterprise specialist will reach out within 2 hours.
                      </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {submitError && (
                        <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 font-semibold">
                          {submitError}
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Jane Doe" 
                            className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Company</label>
                          <input 
                            type="text" 
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Company Inc." 
                            className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Work Email</label>
                          <input 
                            type="email" 
                            required
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                            placeholder="jane@company.com" 
                            className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Phone Number</label>
                          <input 
                            type="tel" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1 (555) 000-0000" 
                            className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Company Size</label>
                          <select 
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all"
                          >
                            <option value="Select Size">Select Size</option>
                            <option value="1-50">1-50 employees</option>
                            <option value="51-250">51-250 employees</option>
                            <option value="251-1000">251-1000 employees</option>
                            <option value="1000+">1000+ employees</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Industry</label>
                          <select 
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all"
                          >
                            <option value="Select Industry">Select Industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Education">Education</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Country</label>
                        <input 
                          type="text" 
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="United States" 
                          className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Message</label>
                        <textarea 
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="How can we help you?" 
                          className="w-full px-3.5 py-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#630ed4] focus:bg-white transition-all resize-none"
                        />
                      </div>

                      <div className="flex items-start gap-2.5 pt-2">
                        <input 
                          id="privacy-chk" 
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          className="h-4 w-4 rounded text-[#630ed4] focus:ring-[#630ed4] border-slate-200 mt-0.5"
                        />
                        <label htmlFor="privacy-chk" className="text-[11px] text-slate-400 leading-normal">
                          I agree to Slotem's Privacy Policy and consent to receive communications about Slotem products and services.
                        </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#630ed4] hover:bg-[#5209b5] text-white font-extrabold rounded-full transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-purple-500/10 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" /> Sending...
                          </>
                        ) : (
                          "Request Demo"
                        )}
                      </button>

                      <p className="text-center text-[10px] text-slate-400">
                        By clicking "Request Demo", you agree to our{" "}
                        <a href="#" className="text-[#630ed4] font-bold hover:underline">Terms of Service</a>.
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-800">Booking Pipeline Registered</h3>
                      <p className="text-xs text-slate-400 px-4 leading-relaxed">
                        Thank you, <strong>{fullName || "there"}</strong>! Your enterprise request is logged inside our servers. An account executive from <strong>{company}</strong> will connect with you within 2 hours.
                      </p>
                    </div>

                    <div className="bg-purple-50/50 rounded-xl p-4 text-left border border-purple-100 max-w-sm mx-auto space-y-2.5">
                      <span className="text-[9px] bg-purple-100 text-[#630ed4] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                        Instant Option
                      </span>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        While waiting, why not test our interactive features or chat immediately with our <strong>Slotem AI Specialist</strong> floating in the corner?
                      </p>
                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="text-xs text-[#630ed4] font-bold flex items-center gap-1 hover:underline"
                      >
                        Open AI Messenger <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={resetFormState}
                      className="text-xs text-slate-400 font-bold hover:text-slate-600 transition-colors underline"
                    >
                      Submit another request
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* ----------------- Interactive Platform Tour (Features) ----------------- */}
        <section className="bg-slate-100/50 border-y border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <FeaturesShowcase />
          </div>
        </section>

        {/* ----------------- Pricing Slider Section ----------------- */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <PricingCalculator />
          </div>
        </section>

        {/* ----------------- Help Center & FAQ Section ----------------- */}
        <section className="bg-slate-100/50 border-t border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <HelpCenter />
          </div>
        </section>
      </main>


      {/* ----------------- Detailed CTA Footer & Links ----------------- */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          
          {/* Top segment: Contact Option Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Email Us CTA */}
            <a 
              href="mailto:sales@slotem.com"
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/10 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">Email Us</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">Direct inquiry to our enterprise team.</p>
              <span className="text-xs font-bold text-[#630ed4] group-hover:underline">sales@slotem.com</span>
            </a>

            {/* Call Sales CTA */}
            <a 
              href="tel:+1800SLOTEM0"
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/10 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">Call Sales</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">Talk to a specialist immediately.</p>
              <span className="text-xs font-bold text-[#630ed4] group-hover:underline">+1 (800) SLOTEM-0</span>
            </a>

            {/* Live Chat CTA */}
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 hover:border-[#630ed4]/30 hover:bg-purple-50/10 transition-all group w-full"
            >
              <div className="w-12 h-12 bg-purple-50 text-[#630ed4] rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">Live Chat</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">Real-time support from our team.</p>
              <span className="text-xs font-bold text-[#630ed4] group-hover:underline">Open Messenger</span>
            </button>
          </div>

        </div>
      </section>

      {/* ----------------- Interactive Floating AI Messenger Widget ----------------- */}
      <ChatWidget 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onOpen={() => setIsChatOpen(true)} 
      />
    </GuestLayout>
  );
}
