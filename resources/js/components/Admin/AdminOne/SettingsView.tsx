import { useState, FormEvent } from 'react';
import { 
  Settings, 
  Mail, 
  Bell, 
  Smartphone, 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface SettingsViewProps {
  userEmail?: string;
  showToast: (msg: string) => void;
}

export default function SettingsView({ userEmail, showToast }: SettingsViewProps) {
  // Local toggles & state
  const [calendarTitle, setCalendarTitle] = useState('Slotem Scheduling System');
  const [supportEmail, setSupportEmail] = useState(userEmail || 'etangdgm001@gmail.com');
  const [smsToggled, setSmsToggled] = useState(true);
  const [gcalSynced, setGcalSynced] = useState(false);
  const [strictDoubleBook, setStrictDoubleBook] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    showToast('All Slotem Settings saved and dispatched successfully.');
  };

  return (
    <div id="settings-management-view" className="bg-white border border-outline-variant rounded-xl shadow-xs overflow-hidden max-w-3xl">
      <div className="p-6 border-b border-outline-variant">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Settings Panel
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Tweak administrative features, sync behaviors, user communications, and authentication rules.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
        
        {/* Section 1: General Core Admin parameters */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-outline-variant/35 pb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4" /> General Parameters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Calendar Booking Title</label>
              <input 
                type="text"
                value={calendarTitle}
                onChange={(e) => setCalendarTitle(e.target.value)}
                className="w-full text-xs font-medium border border-outline-variant p-2.5 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Notification Report Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/70" />
                <input 
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full pl-9 text-xs font-mono font-semibold border border-outline-variant p-2.5 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Automated Actions & Integrations */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-outline-variant/35 pb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Integrations & Actions
          </h4>

          <div className="space-y-3">
            {/* Google Calendar sync toggle */}
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Google Calendar Sync</p>
                  <p className="text-[11px] text-on-surface-variant/80">
                    Propagate booked spots back and forth dynamically with external google account feeds.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={gcalSynced}
                  onChange={(e) => setGcalSynced(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-outline-variant/65 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* SMS Notifications toggle */}
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-on-surface">SMS Client Dispatcher</p>
                  <p className="text-[11px] text-on-surface-variant/80">
                    Automatically dispatch calendar text notices directly to prospective clients 1 hour before slots run.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={smsToggled}
                  onChange={(e) => setSmsToggled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-outline-variant/65 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Double Book Prevention guard */}
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Double-Booking Armor Shield</p>
                  <p className="text-[11px] text-on-surface-variant/80">
                    Immediately reject parallel write requests if clients click the identical open time-slot simultaneously.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={strictDoubleBook}
                  onChange={(e) => setStrictDoubleBook(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-outline-variant/65 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Instant Approval versus Manual Verification */}
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Auto-Approve Appointments</p>
                  <p className="text-[11px] text-on-surface-variant/80">
                    Bypass the pending verification register and auto-confirm slots as soon as the client books.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-outline-variant/65 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </div>

        {/* Action Button footer */}
        <div className="pt-4 border-t border-outline-variant/40 flex justify-end gap-3">
          <button 
            type="button"
            className="px-4 py-2 bg-gray-150 hover:bg-gray-200 text-on-surface-variant text-xs font-semibold rounded-lg"
            onClick={() => showToast('Preferences reset.')}
          >
            Reset
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>

      </form>
    </div>
  );
}
