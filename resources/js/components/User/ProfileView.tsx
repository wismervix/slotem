import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { 
  User, 
  Mail, 
  Phone, 
  Hospital, 
  BadgeCheck, 
  Save, 
  BellRing, 
  ShieldAlert, 
  CheckCircle,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Activity
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export default function ProfileView({ profile, onSaveProfile }: ProfileViewProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [preferredClinic, setPreferredClinic] = useState(profile.preferredClinic);
  const [marketingConsent, setMarketingConsent] = useState(profile.marketingConsent);
  
  // Extra settings for richness
  const [smsReminders, setSmsReminders] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      email,
      phone,
      preferredClinic,
      memberSince: profile.memberSince,
      marketingConsent
    });
    
    setToastMessage("Profile settings updated successfully!");
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleDarkMode = () => {
    const isDarkNow = !isDarkMode;
    setIsDarkMode(isDarkNow);
    if (isDarkNow) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-slide-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Profile summary banner */}
      <div className="bg-white dark:bg-neutral-900 border border-outline-variant rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-xs">
        <div className="relative">
          <div className="w-20 h-20 bg-primary-fixed text-primary rounded-full flex items-center justify-center font-extrabold text-2xl border border-primary/20">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 border border-white dark:border-neutral-900">
            <BadgeCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="text-center md:text-left space-y-1.5 flex-grow">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{name || 'Unnamed Slotem User'}</h2>
            <span className="text-[10px] font-extrabold text-primary bg-primary-container/10 px-2.5 py-0.5 rounded-full uppercase">
              Loyal Subscriber
            </span>
          </div>
          <p className="text-xs text-secondary font-medium">Preferred facility: {preferredClinic}</p>
          <p className="text-[11px] text-gray-400">Owner of {email} · Member since {profile.memberSince}</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggleDarkMode}
            className="p-2.5 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            title="Toggle dark theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-700" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main profile form */}
        <div className="bg-white dark:bg-neutral-900 border border-outline-variant rounded-2xl p-6 md:col-span-2 shadow-xs">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-1.5">
            <User className="w-5 h-5 text-primary" />
            Personal Demographics
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  Preferred Clinic
                </label>
                <div className="relative">
                  <Hospital className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={preferredClinic}
                    onChange={(e) => setPreferredClinic(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium appearance-none"
                  >
                    <option value="Smile Clinic West">Smile Clinic West</option>
                    <option value="Zen Wellness Center">Zen Wellness Center</option>
                    <option value="Apex Medical Suite">Apex Medical Suite</option>
                    <option value="Radiant Skin Spa">Radiant Skin Spa</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="h-px bg-outline-variant my-4" />

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notification Channels</h4>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={smsReminders}
                  onChange={(e) => setSmsReminders(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 group-hover:text-primary">
                    Instant SMS notifications & phone reminders
                  </p>
                  <p className="text-[10px] text-gray-400">Sends text alerts 2 hours before slotted timings.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 group-hover:text-primary">
                    Audible sound feedback alerts
                  </p>
                  <p className="text-[10px] text-gray-400">Play pleasant click feedback and task completions sounds.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 group-hover:text-primary">
                    Receive diagnostic recommendations & tips
                  </p>
                  <p className="text-[10px] text-gray-400">Periodic emails about dental wellness, skin hygiene and cardiology notes.</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg active:scale-98 transition-all text-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Demographic Profile
            </button>
          </form>

        </div>

        {/* Insurance and Medical Card details */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-neutral-900 border border-outline-variant rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-6 -mt-6" />
            
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-1.5 border-b border-outline-variant pb-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Insurance Status
            </h3>
            
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="text-gray-400">Policy Provider:</span>
                <span className="text-gray-800 dark:text-white font-bold text-right">Alliance Shield Med</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Group Number:</span>
                <span className="text-gray-800 dark:text-white font-mono text-right font-bold">ASM-92180A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Co-Pay Rate:</span>
                <span className="text-emerald-600 font-extrabold text-right">$15.00 flat</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-outline-variant pt-2">
                <span className="text-gray-400">Verification State:</span>
                <span className="text-emerald-600 bg-emerald-100/50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full font-bold text-[10px]">Verified Active</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-extrabold text-red-800 dark:text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              Medical Alert notes
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
              Allergies recorded: Penicillin, Sulfites. Please inform the dental surgeon or therapeutic masseuse immediately upon reception.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
