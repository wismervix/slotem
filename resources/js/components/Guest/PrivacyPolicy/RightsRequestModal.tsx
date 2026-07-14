import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Globe, Send, User, Mail, FileText, Calendar, Trash2, Clock, CheckCircle } from 'lucide-react';
import { RightType, PrivacyRequest } from '@/types';
import { DATA_RIGHTS } from '@/data/policy-data';

interface RightsRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: PrivacyRequest[];
  onAddRequest: (request: Omit<PrivacyRequest, 'id' | 'createdAt' | 'status' | 'slaDaysRemaining'>) => void;
  onDeleteRequest: (id: string) => void;
  initialRightType?: RightType | null;
}

export default function RightsRequestModal({
  isOpen,
  onClose,
  requests,
  onAddRequest,
  onDeleteRequest,
  initialRightType,
}: RightsRequestModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'tracker'>('form');
  const [type, setType] = useState<RightType>('access');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Synchronize initialRightType if provided
  useEffect(() => {
    if (initialRightType) {
      setType(initialRightType);
      setActiveTab('form');
    }
  }, [initialRightType]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !details.trim()) return;

    onAddRequest({
      type,
      name,
      email,
      details,
    });

    setFormSubmitted(true);
    setDetails('');
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('tracker');
    }, 1500);
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
                <div className="p-2.5 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">Your Privacy Portal</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Exercise and track your GDPR, CCPA, and international data privacy rights.
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

            {/* Toggle Tabs */}
            <div className="flex border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-2.5 gap-4">
              <button
                onClick={() => setActiveTab('form')}
                className={`text-xs font-semibold pb-1.5 border-b-2 transition-all ${
                  activeTab === 'form'
                    ? 'text-violet-600 dark:text-violet-400 border-violet-600 dark:border-violet-400'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 border-transparent'
                }`}
              >
                Submit New Request
              </button>
              <button
                onClick={() => setActiveTab('tracker')}
                className={`text-xs font-semibold pb-1.5 border-b-2 relative transition-all ${
                  activeTab === 'tracker'
                    ? 'text-violet-600 dark:text-violet-400 border-violet-600 dark:border-violet-400'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 border-transparent'
                }`}
              >
                Active Requests Tracker
                {requests.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.25 text-[10px] bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 rounded-full font-bold">
                    {requests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'form' ? (
                <AnimatePresence mode="wait">
                  {formSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-2">Request Successfully Queued!</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
                        We have logged your legal privacy request in our system under GDPR compliance laws. You can track its status instantly in the Active Requests tab.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Select Right Type */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
                          Select the Right to Exercise
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {DATA_RIGHTS.map((r) => {
                            const isSelected = type === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setType(r.id as RightType)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'border-violet-600 bg-violet-50/40 dark:bg-violet-950/20 text-violet-900 dark:text-violet-200 ring-1 ring-violet-600'
                                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400'
                                }`}
                              >
                                <span className="block text-xs font-bold leading-tight truncate">
                                  {r.title.replace('Right to ', '')}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {/* Brief explanation of selected right */}
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 italic bg-zinc-50 dark:bg-zinc-950/30 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-900">
                          {DATA_RIGHTS.find((r) => r.id === type)?.details}
                        </p>
                      </div>

                      {/* Name & Email inputs */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Jane Doe"
                              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-xl outline-none transition-all dark:text-zinc-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">
                            Verification Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="jane@example.com"
                              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-xl outline-none transition-all dark:text-zinc-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Request details */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">
                          Details of the Request
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none text-zinc-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <textarea
                            required
                            rows={3}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder={
                              type === 'access'
                                ? 'I request a backup file containing all scheduling entries and email parameters related to my account.'
                                : type === 'rectify'
                                ? 'Correct my account profile from email jane.d@example.com to jane.doe@example.com.'
                                : type === 'erasure'
                                ? 'Please delete my entire profile and all scheduling histories from Slotem services permanently.'
                                : 'Please opt me out of non-essential third-party metrics sharing.'
                            }
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-xl outline-none transition-all dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-violet-500/15 flex items-center justify-center gap-2 transition-all mt-2"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Compliance Request
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              ) : (
                /* Tracker Tab */
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 dark:text-zinc-500">
                      <Clock className="w-10 h-10 mb-3 opacity-60" />
                      <p className="text-sm font-semibold mb-1">No Active Requests Found</p>
                      <p className="text-xs max-w-sm">
                        Any privacy claims you file will appear here so you can check their verification status in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requests.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-violet-500/20 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">
                                {req.type.toUpperCase()}
                              </span>
                              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {req.createdAt}
                              </span>
                              <span className="text-[11px] text-zinc-500 font-mono">
                                ID: {req.id}
                              </span>
                            </div>
                            <h5 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 mb-1">
                              Filed by: {req.name} ({req.email})
                            </h5>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 max-w-lg">
                              &ldquo;{req.details}&rdquo;
                            </p>
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-zinc-200/50 dark:border-zinc-800/50 gap-2">
                            {/* Status Indicator */}
                            <div className="flex items-center gap-1.5">
                              {req.status === 'completed' ? (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                                  <CheckCircle className="w-3.5 h-3.5" /> Completed
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                                  <Clock className="w-3.5 h-3.5" /> Processing
                                </span>
                              )}
                            </div>

                            {/* SLA remaining */}
                            {req.status !== 'completed' && (
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                                GDPR SLA: <strong>{req.slaDaysRemaining} days</strong> remaining
                              </span>
                            )}

                            {/* Cancel/Delete Request */}
                            <button
                              onClick={() => onDeleteRequest(req.id)}
                              className="text-zinc-400 hover:text-red-500 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all"
                              title="Delete Request Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={onClose}
                className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold px-4 py-2 rounded-xl text-xs transition-all"
              >
                Close Portal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
