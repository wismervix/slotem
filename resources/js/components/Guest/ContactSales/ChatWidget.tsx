import { useState, useRef, useEffect } from 'react';
import {
    MessageSquare,
    X,
    Send,
    Sparkles,
    User,
    ShieldCheck,
    HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '@/types';

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

export default function ChatWidget({
    isOpen,
    onClose,
    onOpen,
}: ChatWidgetProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            sender: 'assistant',
            text: "Hello! I'm the **Slotem AI Assistant**. I can answer questions about our enterprise calendar booking systems, compliance policies, integrations, or custom plans. Ask me anything!",
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
            label: '💳 Custom pricing?',
            query: 'What are your enterprise and custom volume plans?',
        },
        {
            label: '📅 Google / Outlook Sync?',
            query: 'Do you support real-time Google and Outlook calendar integration?',
        },
        {
            label: '🔒 HIPAA / SOC 2?',
            query: 'Tell me about your security compliance (HIPAA and SOC 2).',
        },
        {
            label: '🔀 What is Round-Robin?',
            query: 'Explain how round-robin booking works in Slotem.',
        },
    ];

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, messages, isLoading]);

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

            const response = await fetch('/api/chat', {
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
            console.error('Chat API error:', err);

            const fallbackMsg: ChatMessage = {
                id: `msg-${crypto.randomUUID()}`,
                // id: `msg-${Date.now() + 1}`,
                sender: 'assistant',
                text:
                    "I'm having trouble connecting to my AI brain right now. However, Slotem supports:\n\n" +
                    '• **Enterprise-grade scheduling** with custom routing rules\n' +
                    '• **All major calendar integrations** (Google, Outlook, Salesforce)\n' +
                    '• **SOC 2 & HIPAA compliance** for security-conscious organizations\n\n' +
                    'Please fill out our demo form to connect with a specialist who can answer all your questions!',
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
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        id="chat-trigger-btn"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onOpen}
                        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#630ed4] text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-[#5209b5] focus:ring-2 focus:ring-[#630ed4] focus:ring-offset-2 focus:outline-none dark:shadow-purple-500/10"
                    >
                        <MessageSquare className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-pulse rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Messenger Drawer/Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="chat-messenger-box"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className="fixed right-6 bottom-6 z-50 flex h-[580px] w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl shadow-purple-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#630ed4] to-[#7c3aed] p-4 text-white dark:from-[#4a0a9e] dark:to-[#6d28d9]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                    <Sparkles className="h-5 w-5 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className="leading-none font-semibold">
                                        Slotem Specialist
                                    </h3>
                                    <span className="mt-1 flex items-center gap-1 text-xs text-purple-200">
                                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                        AI Assistant • Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 transition-colors hover:bg-white/10 focus:outline-none"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-800">
                            {messages.map((msg) => {
                                const isAssistant = msg.sender === 'assistant';
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex max-w-[85%] gap-2.5 ${
                                            isAssistant
                                                ? 'mr-auto'
                                                : 'ml-auto flex-row-reverse'
                                        }`}
                                    >
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold select-none ${
                                                isAssistant
                                                    ? 'bg-purple-100 text-[#630ed4] dark:bg-slate-700 dark:text-purple-400'
                                                    : 'bg-purple-600 text-white dark:bg-purple-700'
                                            }`}
                                        >
                                            {isAssistant ? (
                                                <Sparkles className="h-4 w-4" />
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div>
                                            <div
                                                className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                                                    isAssistant
                                                        ? 'rounded-tl-none border border-slate-100 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                                                        : 'rounded-tr-none bg-[#630ed4] text-white dark:bg-purple-600'
                                                }`}
                                            >
                                                <div className="space-y-1.5 leading-relaxed whitespace-pre-line">
                                                    {msg.text
                                                        .split('\n')
                                                        .map((line, idx) => {
                                                            const boldRegex =
                                                                /\*\*(.*?)\*\*/g;
                                                            const parts = [];
                                                            let lastIndex = 0;
                                                            let match;

                                                            while (
                                                                (match =
                                                                    boldRegex.exec(
                                                                        line,
                                                                    )) !== null
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
                                                                <p key={idx}>
                                                                    {parts.length >
                                                                    0
                                                                        ? parts
                                                                        : line}
                                                                </p>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                            <span className="mt-1 block text-right text-[10px] text-slate-400 dark:text-slate-500">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {isLoading && (
                                <div className="mr-auto flex max-w-[85%] gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-[#630ed4] dark:bg-slate-700 dark:text-purple-400">
                                        <Sparkles className="h-4 w-4 animate-spin" />
                                    </div>
                                    <div className="rounded-2xl rounded-tl-none border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600"
                                                style={{
                                                    animationDelay: '0ms',
                                                }}
                                            />
                                            <span
                                                className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600"
                                                style={{
                                                    animationDelay: '150ms',
                                                }}
                                            />
                                            <span
                                                className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600"
                                                style={{
                                                    animationDelay: '300ms',
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
                                    onClick={() => handleSendMessage(p.query)}
                                    className="shrink-0 rounded-full border border-purple-100 bg-purple-50/50 px-3 py-1 text-xs text-[#630ed4] transition-colors hover:border-purple-200 hover:bg-purple-100/75 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-purple-400 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }}
                            className="flex shrink-0 items-center gap-2 border-t border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about integrations, security..."
                                className="h-10 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 transition-all focus:border-[#630ed4] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-purple-500 dark:focus:bg-slate-700"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#630ed4] text-white transition-all hover:bg-[#5209b5] focus:outline-none active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
