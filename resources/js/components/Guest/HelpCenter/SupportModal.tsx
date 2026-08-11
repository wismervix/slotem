import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Send,
    ArrowRight,
    Headphones,
    Sparkles,
    CheckCircle2,
    Ticket,
    Mail,
    HelpCircle,
    Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '@/types';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'ticket' | 'chat';
}

export default function SupportModal({
    isOpen,
    onClose,
    initialMode = 'ticket',
}: SupportModalProps) {
    const [mode, setMode] = useState<'ticket' | 'chat'>(initialMode);

    // Ticket form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [topic, setTopic] = useState('getting-started');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(
        null,
    );

    // Chat state
    
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            sender: 'assistant',
            text: "Hello! I'm the **Slotem Help Center Assistant**. I can help you with:\n\n" +
                "• **Getting Started** - Account setup and first booking\n" +
                "• **Booking Help** - Creating, rescheduling, or cancelling\n" +
                "• **Billing & Payments** - Plans, invoices, and subscriptions\n" +
                "• **Technical Support** - Troubleshooting common issues\n" +
                "• **Notifications** - Email, SMS, and WhatsApp reminders\n" +
                "• **Security & Privacy** - Data protection and account security\n\n" +
                "What can I help you with today?",
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickPrompts = [
        {
            label: '📖 Getting Started',
            query: 'How do I get started with Slotem?',
        },
        { label: '📅 Manage Bookings', query: 'How do I cancel a booking?' },
        {
            label: '💳 Billing Help',
            query: 'How do I upgrade my subscription plan?',
        },
        {
            label: '🔧 Technical Help',
            query: "My calendar won't sync. What do I do?",
        },
    ];

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

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
            const ticketId =
                'SLT-' + Math.floor(100000 + Math.random() * 900000);
            setSubmittedTicketId(ticketId);
        }, 1500);
    };


    const getCsrfToken = () => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        return token || '';
    };

    const handleSendMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: `msg-${crypto.randomUUID()}`,
            sender: 'user',
            text: textToSend.trim(),
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const updatedMessages = [...messages, userMsg];

            const response = await fetch('/api/help-center/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            const assistantMsg: ChatMessage = {
                id: `msg-${crypto.randomUUID()}`,
                sender: 'assistant',
                text:
                    data.text ||
                    "I'm sorry, I encountered a temporary connection issue. Please try again.",
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
            console.error('Help Center Chat API error:', err);

            const fallbackMsg: ChatMessage = {
                id: `msg-${crypto.randomUUID()}`,
                sender: 'assistant',
                text:
                    "I'm having trouble connecting right now. Here's what you can do:\n\n" +
                    '• **Browse our Help Center** - Check out articles and guides\n' +
                    '• **Submit a Support Ticket** - Get help from our team\n' +
                    '• **Check our FAQs** - Quick answers to common questions\n\n' +
                    'Our support team typically responds within 2 hours.',
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };
            setMessages((prev) => [...prev, fallbackMsg]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                id="support-modal-wrapper"
            >
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
                        className="flex h-[600px] w-full max-w-2xl transform flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white text-left align-middle shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-900"
                        id="support-panel"
                    >
                        {/* Header with Mode Toggle Tabs */}
                        <div
                            className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800"
                            id="support-modal-header"
                        >
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMode('ticket')}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                        mode === 'ticket'
                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                                            : 'text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                    }`}
                                    id="tab-toggle-ticket"
                                >
                                    <Ticket className="h-4 w-4" />
                                    Submit Ticket
                                </button>
                                <button
                                    onClick={() => setMode('chat')}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                        mode === 'chat'
                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                                            : 'text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                    }`}
                                    id="tab-toggle-chat"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Slotem Help Bot
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                id="btn-close-support-modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div
                            className="flex-grow overflow-y-auto"
                            id="support-modal-content"
                        >
                            {mode === 'ticket' ? (
                                <div
                                    className="flex h-full flex-col justify-between p-6"
                                    id="ticket-form-pane"
                                >
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
                                                    <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                                        Your Name
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="John Doe"
                                                        value={name}
                                                        onChange={(e) =>
                                                            setName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:text-white dark:focus:border-indigo-400"
                                                        id="input-ticket-name"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        required
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:text-white dark:focus:border-indigo-400"
                                                        id="input-ticket-email"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                                            Topic
                                                        </label>
                                                        <select
                                                            value={topic}
                                                            onChange={(e) =>
                                                                setTopic(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                                            id="select-ticket-topic"
                                                        >
                                                            <option value="getting-started">
                                                                Getting Started
                                                            </option>
                                                            <option value="calendar">
                                                                Calendar
                                                                Connections
                                                            </option>
                                                            <option value="bookings">
                                                                Booking Issues
                                                            </option>
                                                            <option value="payments">
                                                                Billing & Stripe
                                                            </option>
                                                            <option value="notifications">
                                                                Workflows & SMS
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                                            Subject
                                                        </label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="Need help with..."
                                                            value={subject}
                                                            onChange={(e) =>
                                                                setSubject(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:text-white dark:focus:border-indigo-400"
                                                            id="input-ticket-subject"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                                        Detailed Description
                                                    </label>
                                                    <textarea
                                                        required
                                                        rows={4}
                                                        placeholder="Please explain your issue or question in detail..."
                                                        value={description}
                                                        onChange={(e) =>
                                                            setDescription(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:text-white dark:focus:border-indigo-400"
                                                        id="textarea-ticket-description"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
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
                                                            Submit Support
                                                            Ticket
                                                        </>
                                                    )}
                                                </button>
                                            </motion.form>
                                        ) : (
                                            <motion.div
                                                key="ticket-success"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                className="flex h-full flex-col items-center justify-center space-y-6 px-6 py-12 text-center"
                                                id="ticket-success-pane"
                                            >
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <CheckCircle2 className="h-10 w-10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                                                        Ticket Submitted
                                                        Successfully!
                                                    </h3>
                                                    <p className="mx-auto max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                                                        Thank you,{' '}
                                                        <strong className="text-zinc-700 dark:text-zinc-300">
                                                            {name}
                                                        </strong>
                                                        . Your ticket has been
                                                        logged and assigned ID{' '}
                                                        <span className="rounded bg-zinc-100 px-2 py-1 font-mono font-bold text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400">
                                                            {submittedTicketId}
                                                        </span>
                                                        .
                                                    </p>
                                                </div>
                                                <div className="w-full max-w-md rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-800/40">
                                                    <h4 className="mb-1 text-xs font-bold text-zinc-400 uppercase">
                                                        Estimated response time
                                                    </h4>
                                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                        Under 2 hours
                                                        (Professional support
                                                        agent)
                                                    </p>
                                                </div>
                                                <div className="flex w-full max-w-sm gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setMode('chat');
                                                            setSubmittedTicketId(
                                                                null,
                                                            );
                                                        }}
                                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                        id="btn-success-switch-chat"
                                                    >
                                                        <Sparkles className="h-4 w-4 text-indigo-500" />
                                                        Try AI Helper
                                                    </button>
                                                    <button
                                                        onClick={onClose}
                                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
                                <div
                                    className="flex h-full flex-col bg-zinc-50 dark:bg-zinc-950/40"
                                    id="chat-pane-wrapper"
                                >
                                    {/* Messages list */}
                                    <div
                                        className="max-h-[440px] min-h-[380px] flex-grow space-y-4 overflow-y-auto p-4"
                                        id="chat-messages-container"
                                    >
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`flex max-w-[80%] items-start gap-2.5`}
                                                >
                                                    {msg.sender ===
                                                        'assistant' && (
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm dark:bg-indigo-950 dark:text-indigo-400">
                                                            <Sparkles className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col space-y-1">
                                                        <div
                                                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                                msg.sender ===
                                                                'user'
                                                                    ? 'rounded-br-none bg-indigo-600 text-white'
                                                                    : 'dark:bg-zinc-850 rounded-bl-none border border-zinc-100 bg-white text-zinc-800 shadow-sm dark:border-zinc-800 dark:text-zinc-600'
                                                            }`}
                                                        >
                                                            {msg.text
                                                                .split('\n')
                                                                .map(
                                                                    (
                                                                        line,
                                                                        idx,
                                                                    ) => {
                                                                        const boldRegex =
                                                                            /\*\*(.*?)\*\*/g;
                                                                        const parts =
                                                                            [];
                                                                        let lastIndex = 0;
                                                                        let match;

                                                                        while (
                                                                            (match =
                                                                                boldRegex.exec(
                                                                                    line,
                                                                                )) !==
                                                                            null
                                                                        ) {
                                                                            if (
                                                                                match.index >
                                                                                lastIndex
                                                                            ) {
                                                                                parts.push(
                                                                                    line.substring(
                                                                                        lastIndex,
                                                                                        match.index,
                                                                                    ),
                                                                                );
                                                                            }
                                                                            parts.push(
                                                                                <strong
                                                                                    key={
                                                                                        match.index
                                                                                    }
                                                                                    className="font-semibold"
                                                                                >
                                                                                    {
                                                                                        match[1]
                                                                                    }
                                                                                </strong>,
                                                                            );
                                                                            lastIndex =
                                                                                boldRegex.lastIndex;
                                                                        }
                                                                        if (
                                                                            lastIndex <
                                                                            line.length
                                                                        ) {
                                                                            parts.push(
                                                                                line.substring(
                                                                                    lastIndex,
                                                                                ),
                                                                            );
                                                                        }

                                                                        return (
                                                                            <p
                                                                                key={
                                                                                    idx
                                                                                }
                                                                            >
                                                                                {parts.length >
                                                                                0
                                                                                    ? parts
                                                                                    : line}
                                                                            </p>
                                                                        );
                                                                    },
                                                                )}
                                                        </div>
                                                        <span className="text-right text-[10px] text-zinc-400">
                                                            {msg.timestamp}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Bot Typing indicator */}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="flex max-w-[80%] items-start gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm dark:bg-indigo-950 dark:text-indigo-400">
                                                        <Sparkles className="h-4 w-4" />
                                                    </div>
                                                    <div className="dark:bg-zinc-850 flex items-center gap-1 rounded-2xl rounded-bl-none border border-zinc-100 bg-white px-4 py-3 shadow-sm dark:border-zinc-800">
                                                        <div
                                                            className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                                                            style={{
                                                                animationDelay:
                                                                    '0ms',
                                                            }}
                                                        />
                                                        <div
                                                            className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                                                            style={{
                                                                animationDelay:
                                                                    '150ms',
                                                            }}
                                                        />
                                                        <div
                                                            className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                                                            style={{
                                                                animationDelay:
                                                                    '300ms',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Quick Prompts Container */}
                                    <div className="scrollbar-none flex shrink-0 gap-1.5 overflow-x-auto border-t border-slate-100 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                                        {quickPrompts.map((p) => (
                                            <button
                                                key={p.label}
                                                disabled={isLoading}
                                                onClick={() =>
                                                    handleSendMessage(p.query)
                                                }
                                                className="shrink-0 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-xs text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-100/75 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Input form */}
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage(inputValue);
                                        }}
                                        className="flex gap-2 border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                                        id="chat-input-form"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Type your question (e.g. 'How do I get started?' or 'How do I create booking?')..."
                                            value={inputValue}
                                            onChange={(e) =>
                                                setInputValue(e.target.value)
                                            }
                                            disabled={isLoading}
                                            className="flex-grow rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:text-white"
                                            id="input-chat-message"
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                isLoading || !inputValue.trim()
                                            }
                                            className="flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 p-2.5 text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
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
