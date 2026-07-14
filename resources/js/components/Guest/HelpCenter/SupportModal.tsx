/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ArrowRight, Headphones, Sparkles, CheckCircle2, Ticket, Mail, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessages } from '@/types';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'ticket' | 'chat';
}

export default function SupportModal({ isOpen, onClose, initialMode = 'ticket' }: SupportModalProps) {
  const [mode, setMode] = useState<'ticket' | 'chat'>(initialMode);
  
  // Ticket form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('getting-started');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessages[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Slotem's AI Assistant. Ask me anything about setting up your calendar, managing availability, billing, WhatsApp notifications, or standard configurations!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    // Reset ticket fields on opening
    if (isOpen) {
      setSubmittedTicketId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !description) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = 'SLT-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicketId(ticketId);
    }, 1500);
  };

  const getAssistantResponse = (text: string): string => {
    const q = text.toLowerCase();
    if (q.includes('calendar') || q.includes('google') || q.includes('outlook') || q.includes('icloud') || q.includes('sync')) {
      return "To sync multiple calendars, go to Account Settings > Calendar Connections and click '+ Connect New Calendar'. You can check up to 6 calendars for conflicts. All slot conflicts will be automatically avoided in real-time.";
    }
    if (q.includes('timezone') || q.includes('time zone') || q.includes('zone')) {
      return "You can adjust your default timezone in Account Settings > General. In addition, Slotem automatically detects the timezone of any client visiting your booking link to prevent confusion.";
    }
    if (q.includes('stripe') || q.includes('pay') || q.includes('payment') || q.includes('fee')) {
      return "You can secure payments by connecting Stripe or PayPal from the 'Payments' settings page. Once connected, open any Event Type, toggle on 'Collect Payments', and input your required pricing.";
    }
    if (q.includes('whatsapp') || q.includes('sms') || q.includes('remind')) {
      return "Automated reminders are highly customisable! You can schedule emails, SMS, and our brand new WhatsApp alerts. Head over to Event Types > Notifications and set custom timing offsets (e.g. 24 hours prior).";
    }
    if (q.includes('free') || q.includes('price') || q.includes('cost') || q.includes('subscription')) {
      return "Slotem offers a 100% free plan for individuals. It includes one calendar connection, unlimited booking types, and email updates. Our paid Team Plan ($12/user/mo) includes custom workflows, SMS, and WhatsApp.";
    }
    if (q.includes('cancel') || q.includes('reschedule') || q.includes('no-show')) {
      return "Attendees can reschedule or cancel directly from the links injected into calendar invitations and confirmation emails. You can also specify a minimum cancellation window (e.g. no cancellations within 4 hours).";
    }
    if (q.includes('api') || q.includes('webhook') || q.includes('developer')) {
      return "Our Developer and Enterprise plans support webhooks ('booking.created', 'booking.cancelled') and full REST API endpoint access. Reach out to our sales team if you need sandbox access.";
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return "Hello there! How can I help you navigate the Slotem scheduling platform today? Feel free to ask about calendars, Stripe, or notification triggers.";
    }
    
    return "Thank you for asking! I've logged this question for our team. You can also file a ticket directly in the 'Submit Ticket' tab, or check out our Documentation sidebar. If you are having trouble with a specific booking link, please share the link URL!";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessages = {
      id: String(Date.now()),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const replyText = getAssistantResponse(userMsg.text);
      const botMsg: ChatMessages = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" id="support-modal-wrapper">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          id="support-backdrop"
        />

        <div className="relative flex min-h-screen items-center justify-center p-4 text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col h-[600px]"
            id="support-panel"
          >
            {/* Header with Mode Toggle Tabs */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4" id="support-modal-header">
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('ticket')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    mode === 'ticket'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                      : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-400'
                  }`}
                  id="tab-toggle-ticket"
                >
                  <Ticket className="h-4 w-4" />
                  Submit Ticket
                </button>
                <button
                  onClick={() => setMode('chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    mode === 'chat'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                      : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-400'
                  }`}
                  id="tab-toggle-chat"
                >
                  <Sparkles className="h-4 w-4" />
                  Slotem Help Bot
                </button>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                id="btn-close-support-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto" id="support-modal-content">
              {mode === 'ticket' ? (
                <div className="p-6 h-full flex flex-col justify-between" id="ticket-form-pane">
                  <AnimatePresence mode="wait">
                    {!submittedTicketId ? (
                      <motion.form
                        key="ticket-form"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onSubmit={handleTicketSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Your Name</label>
                          <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-transparent dark:text-white"
                            id="input-ticket-name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Email Address</label>
                          <input
                            required
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-transparent dark:text-white"
                            id="input-ticket-email"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Topic</label>
                            <select
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 bg-transparent dark:bg-zinc-800 dark:text-white"
                              id="select-ticket-topic"
                            >
                              <option value="getting-started">Getting Started</option>
                              <option value="calendar">Calendar Connections</option>
                              <option value="bookings">Booking Issues</option>
                              <option value="payments">Billing & Stripe</option>
                              <option value="notifications">Workflows & SMS</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Subject</label>
                            <input
                              required
                              type="text"
                              placeholder="Need help with..."
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-transparent dark:text-white"
                              id="input-ticket-subject"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Detailed Description</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Please explain your issue or question in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-transparent dark:text-white resize-none"
                            id="textarea-ticket-description"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
                          id="btn-submit-ticket"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Submitting Ticket...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4" />
                              Submit Support Ticket
                            </>
                          )}
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="ticket-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 px-6 flex flex-col items-center justify-center h-full space-y-6"
                        id="ticket-success-pane"
                      >
                        <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner">
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Ticket Submitted Successfully!</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                            Thank you, <strong className="text-zinc-700 dark:text-zinc-300">{name}</strong>. Your ticket has been logged and assigned ID <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-indigo-600 dark:text-indigo-400 font-bold">{submittedTicketId}</span>.
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-left max-w-md w-full">
                          <h4 className="text-xs font-bold uppercase text-zinc-400 mb-1">Estimated response time</h4>
                          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Under 2 hours (Professional support agent)</p>
                        </div>
                        <div className="flex gap-3 w-full max-w-sm">
                          <button
                            onClick={() => {
                              setMode('chat');
                              setSubmittedTicketId(null);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-all"
                            id="btn-success-switch-chat"
                          >
                            <Sparkles className="h-4 w-4 text-indigo-500" />
                            Try AI Helper
                          </button>
                          <button
                            onClick={onClose}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                            id="btn-success-close"
                          >
                            Close Support
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950/40" id="chat-pane-wrapper">
                  {/* Messages list */}
                  <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[440px] min-h-[380px]" id="chat-messages-container">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-2.5 max-w-[80%]`}>
                          {msg.sender === 'assistant' && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
                              <Sparkles className="h-4 w-4" />
                            </div>
                          )}
                          <div className="flex flex-col space-y-1">
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-indigo-600 text-white rounded-br-none'
                                  : 'bg-white dark:bg-zinc-850 text-zinc-800 dark:text-zinc-600 border border-zinc-100 dark:border-zinc-800 rounded-bl-none shadow-sm'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-zinc-400 text-right">{msg.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Bot Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2.5 max-w-[80%]">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="bg-white dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2" id="chat-input-form">
                    <input
                      type="text"
                      placeholder="Type your question (e.g. 'How do I connect Stripe?' or 'How do I change timezone?')..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isTyping}
                      className="flex-grow rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 bg-transparent dark:text-white"
                      id="input-chat-message"
                    />
                    <button
                      type="submit"
                      disabled={isTyping || !inputMessage.trim()}
                      className="rounded-xl bg-indigo-600 text-white p-2.5 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
                      id="btn-send-chat"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
