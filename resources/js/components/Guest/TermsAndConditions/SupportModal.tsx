import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Check, Sparkles } from 'lucide-react';

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
    'Can I cancel my subscription at any time?',
    'What happens to my data if I terminate my account?',
    'Are there any hidden fees?',
    'Can I use Slotem for commercial purposes?',
];

const BOT_ANSWERS: Record<string, string> = {
    'can i cancel my subscription at any time?':
        'Yes, absolutely. You can cancel your Slotem subscription at any time from your account settings. Cancellation will take effect at the end of your current billing period. No cancellation fees apply.',
    'what happens to my data if i terminate my account?':
        'Upon account termination, your data will be securely deleted from our active systems within 30 days, subject to any legal or regulatory retention requirements. You can request a data export before termination.',
    'are there any hidden fees?':
        'No, Slotem is transparent about pricing. There are no hidden fees. You will only be charged the subscription fees as displayed on our pricing page. All taxes are clearly stated at checkout.',
    'can i use slotem for commercial purposes?':
        'Yes, Slotem is designed for both personal and commercial use. Our commercial plans are available for teams and enterprises. Please review our pricing page for detailed commercial licensing options.',
};

const DEFAULT_REPLY =
    "I'm Slotem's Legal Assistant. For specific legal questions or to request a formal legal document, please contact our legal team directly at legal@slotem.io. I can help with general questions about our terms and conditions.";

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'bot',
            text: "Hello! I'm Slotem's Legal & Terms Assistant. Ask me anything about our terms and conditions, user obligations, or legal policies.",
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = (textToSend: string) => {
        if (!textToSend.trim()) return;

        const userMessage: Message = {
            id: Math.random().toString(),
            sender: 'user',
            text: textToSend,
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            const cleanQuery = textToSend
                .trim()
                .toLowerCase()
                .replace(/[?.]/g, '');
            const answer = BOT_ANSWERS[cleanQuery] || DEFAULT_REPLY;

            const botMessage: Message = {
                id: Math.random().toString(),
                sender: 'bot',
                text: answer,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
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
                        className="relative z-10 flex h-[550px] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-violet-600 p-2 text-white">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        Terms Helpdesk
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                                            Legal Assistant online
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 space-y-4 overflow-y-auto bg-zinc-50/50 p-5 dark:bg-zinc-950/20">
                            {messages.map((msg) => {
                                const isBot = msg.sender === 'bot';
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex max-w-[85%] gap-3 ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                                                isBot
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                                            }`}
                                        >
                                            {isBot ? (
                                                <Bot className="h-4 w-4" />
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                        </div>

                                        {/* Bubble Content */}
                                        <div>
                                            <div
                                                className={`rounded-2xl p-3 text-xs leading-relaxed ${
                                                    isBot
                                                        ? 'rounded-tl-none border border-zinc-200/60 bg-white text-zinc-800 shadow-xs dark:border-zinc-800/60 dark:bg-zinc-900 dark:text-zinc-300'
                                                        : 'rounded-tr-none bg-violet-600 text-white shadow-xs'
                                                }`}
                                            >
                                                {msg.text}
                                            </div>
                                            <span className="mt-1 block px-1 text-[9px] text-zinc-400 dark:text-zinc-500">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Bot typing simulation */}
                            {isTyping && (
                                <div className="mr-auto flex max-w-[80%] gap-3">
                                    <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-zinc-200/60 bg-white p-3.5 dark:border-zinc-800/60 dark:bg-zinc-900">
                                        <span
                                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                                            style={{ animationDelay: '0ms' }}
                                        />
                                        <span
                                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                                            style={{ animationDelay: '150ms' }}
                                        />
                                        <span
                                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                                            style={{ animationDelay: '300ms' }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestions (FAQ) */}
                        {messages.length === 1 && !isTyping && (
                            <div className="border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <p className="mb-2 flex items-center gap-1 text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                    <Sparkles className="h-3 w-3 text-violet-500" />{' '}
                                    Suggested Questions
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {FAQ_SUGGESTIONS.map((faq) => (
                                        <button
                                            key={faq}
                                            onClick={() =>
                                                handleSendMessage(faq)
                                            }
                                            className="rounded-lg border border-transparent bg-zinc-100 px-2.5 py-1.5 text-left text-[10.5px] text-zinc-700 transition-all hover:border-violet-100 hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-900 dark:hover:bg-violet-950/40 dark:hover:text-violet-400"
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
                            className="flex gap-2 border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask our legal assistant a question..."
                                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs placeholder-zinc-400 transition-all outline-none hover:border-zinc-300 focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="shrink-0 rounded-xl bg-violet-600 p-2 text-white shadow-md shadow-violet-500/10 transition-all hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600"
                            >
                                <Send className="h-4.5 w-4.5" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
