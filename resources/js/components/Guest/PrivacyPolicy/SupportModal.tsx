import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Check, AlertCircle, Sparkles } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const FAQ_SUGGESTIONS = [
  'Do you sell my data to advertisers?',
  'How long does Slotem store my calendars?',
  'Is my credit card or bank details safe?',
  'How do I completely delete my Slotem account?',
];

const BOT_ANSWERS: Record<string, string> = {
  'do you sell my data to advertisers?':
    'Absolutely not. Slotem has a strict zero-ad-brokerage policy. Your scheduling data, customer records, and notes are exclusively yours. We never rent or sell your personal details to advertising networks under any circumstances.',
  'how long does slotem store my calendars?':
    'We retain your calendars, appointments, and meeting notes for as long as your account remains active. If you close your account, all associated user data is securely purged within 30 days, unless a legal hold dictates otherwise.',
  'is my credit card or bank details safe?':
    'Extremely safe. Slotem processes all checkout flows through Stripe, an industry-leading PCI-DSS level 1 certified payment processor. We never store or transit your raw credit card number on our own hosting servers.',
  'how do i completely delete my slotem account?':
    'You can easily delete your account by submitting an "Erasure" claim under our "Your Rights" portal directly on this page, or inside your workspace billing settings. All files and calendar logs will be deleted permanently within 30 days.',
};

const DEFAULT_REPLY =
  "I am Slotem's Compliance & Privacy Assistant. For complex privacy questions or formal litigation queries, please drop an email directly to privacy@slotem.io. Alternatively, you can easily exercise your data deletion or access rights using the 'Your Rights' portal in the header.";

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am Slotem\'s Compliance & Data Protection Assistant. Ask me anything about how we safeguard and process your scheduling records.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate reply
    setTimeout(() => {
      const cleanQuery = textToSend.trim().toLowerCase().replace(/[?.]/g, '');
      const answer = BOT_ANSWERS[cleanQuery] || DEFAULT_REPLY;

      const botMessage: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
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
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col h-[550px]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-600 text-white rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Privacy Helpdesk</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Compliance Officer online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                        isBot
                          ? 'bg-violet-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble Content */}
                    <div>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isBot
                            ? 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60 rounded-tl-none shadow-xs'
                            : 'bg-violet-600 text-white rounded-tr-none shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="block text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Bot typing simulation */}
              {isTyping && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 bg-violet-600 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (FAQ) */}
            {messages.length === 1 && !isTyping && (
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-500" /> Suggested Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {FAQ_SUGGESTIONS.map((faq) => (
                    <button
                      key={faq}
                      onClick={() => handleSendMessage(faq)}
                      className="text-[10.5px] text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-violet-50 dark:bg-zinc-800 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 border border-transparent hover:border-violet-100 dark:hover:border-violet-900 px-2.5 py-1.5 rounded-lg transition-all text-left"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSubmitForm}
              className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask our compliance bot a question..."
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-3.5 py-2 text-xs outline-none transition-all dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 text-white p-2 rounded-xl transition-all shadow-md shadow-violet-500/10 shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
