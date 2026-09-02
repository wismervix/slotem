import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Cookie, Shield, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { CookiePreferences } from '@/types';

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: CookiePreferences;
  onSave: (prefs: CookiePreferences) => void;
}

export default function CookieConsentModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: CookieConsentModalProps) {
  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    onSave({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const handleAcceptAll = () => {
    onSave({
      essential: true,
      preference: true,
      analytics: true,
      marketing: true,
    });
    onClose();
  };

  const handleSavePreferences = () => {
    onSave(preferences);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-start px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">Cookie Preferences</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Control how cookies are utilized to personalize your Slotem scheduling experience.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5">
              {/* Essential */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-900">
                <div className="mt-1 text-violet-600 dark:text-violet-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      Essential Cookies
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 rounded">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Necessary for core security features, customer session management, and basic language/timezone memory. These cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Preference */}
              <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/30 transition-all">
                <div className="mt-1 text-blue-500 dark:text-blue-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      Preference Cookies
                    </span>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle('preference')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                        preferences.preference ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.preference ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Allow the platform to remember your custom display arrangements, filter settings, and recurring schedule visual presets.
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/30 transition-all">
                <div className="mt-1 text-emerald-500 dark:text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      Performance & Analytics Cookies
                    </span>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle('analytics')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                        preferences.analytics ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Help us collect aggregated, anonymous page telemetry to analyze server response times, load testing, and identify visual bottlenecks.
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/30 transition-all">
                <div className="mt-1 text-pink-500 dark:text-pink-400">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      Marketing & Targeting Cookies
                    </span>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle('marketing')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                        preferences.marketing ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Used to coordinate our promotional announcements and offer tailored subscription packages that match your enterprise size.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                You can adjust these settings at any time in the future.
              </span>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 sm:flex-none text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-semibold px-4 py-2 rounded-xl text-xs transition-all"
                >
                  Save My Choices
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-violet-500/10 transition-all"
                >
                  Accept All Cookies
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
