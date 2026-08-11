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

/**
 * Normalizes a user query so that common punctuation,
 * capitalization, and spacing differences do not affect matching.
 */
const normalizeQuery = (text: string) =>
    text
        .trim()
        .toLowerCase()
        .replace(/[?.!,]/g, '')
        .replace(/\s+/g, ' ');

/**
 * Each FAQ contains keyword groups.
 *
 * The query must contain at least one keyword from EVERY group.
 *
 * Example:
 * [['sell', 'sale'], ['data'], ['advertiser', 'advertising']]
 *
 * Matches:
 * "Do you sell my data to advertisers?"
 * "Does Slotem sell user data to advertising companies?"
 */
const FAQ_RESPONSES = [
    {
        keywords: [
            ['sell', 'sale', 'sellings', 'rent'],
            ['data', 'information', 'details'],
            ['advertiser', 'advertisers', 'advertising', 'ad'],
        ],
        answer: 'Absolutely not. Slotem has a strict zero-ad-brokerage policy. Your scheduling data, customer records, and notes are exclusively yours. We never rent or sell your personal details to advertising networks under any circumstances.',
    },

    {
        keywords: [
            ['calendar', 'calendars', 'appointment', 'appointments', 'meeting'],
            ['store', 'retain', 'keep', 'save', 'saved', 'storage'],
        ],
        answer: 'We retain your calendars, appointments, and meeting notes for as long as your account remains active. If you close your account, all associated user data is securely purged within 30 days, unless a legal hold dictates otherwise.',
    },

    {
        keywords: [
            ['credit', 'card', 'bank', 'payment', 'payments', 'billing'],
            ['safe', 'secure', 'security', 'securely', 'protect', 'protected'],
        ],
        answer: 'Extremely safe. Slotem processes all checkout flows through Stripe, an industry-leading PCI-DSS Level 1 certified payment processor. We never store or transit your raw credit card number on our own hosting servers.',
    },

    {
        keywords: [
            [
                'delete',
                'deleted',
                'deletion',
                'erase',
                'erasure',
                'remove',
                'close',
                'terminate',
            ],
            ['account', 'profile', 'workspace'],
        ],
        answer: 'You can easily delete your account by submitting an "Erasure" claim under our "Your Rights" portal directly on this page, or inside your workspace billing settings. All files and calendar logs will be deleted permanently within 30 days.',
    },
];

const CONVERSATIONAL_RESPONSES = {
    greetings: [
        'hello',
        'hi',
        'hey',
        'hello there',
        'hi there',
        'good morning',
        'good afternoon',
        'good evening',
    ],

    thanks: [
        'thanks',
        'thank you',
        'thanks a lot',
        'thank you so much',
        'thanks so much',
        'much appreciated',
        'appreciate it',
    ],

    acknowledgements: [
        'ok',
        'okay',
        'alright',
        'all right',
        'got it',
        'understood',
        'makes sense',
        'that makes sense',
    ],

    farewells: ['bye', 'goodbye', 'see you', 'see ya', 'talk to you later'],
};

const DEFAULT_REPLY =
    "I'm Slotem's Compliance & Privacy Assistant. I can help with general questions about Slotem's privacy practices, data protection, account deletion, payment security, data retention, and your privacy rights. For complex privacy questions, formal legal matters, or litigation-related requests, please contact our privacy team directly at privacy@slotem.io.";

const containsAny = (text: string, words: string[]) =>
    words.some((word) => text.includes(word));

/**
 * Checks whether the query contains at least one keyword
 * from every required group.
 */
const matchesKeywordGroups = (query: string, groups: string[][]): boolean => {
    return groups.every((group) => containsAny(query, group));
};

const getFAQResponse = (query: string): string | null => {
    const match = FAQ_RESPONSES.find(({ keywords }) =>
        matchesKeywordGroups(query, keywords),
    );

    return match?.answer ?? null;
};

const getConversationalResponse = (query: string): string | null => {
    if (
        CONVERSATIONAL_RESPONSES.greetings.some((word) => query.includes(word))
    ) {
        return "Hello! How can I help you with Slotem's privacy, data protection, or account policies?";
    }

    if (CONVERSATIONAL_RESPONSES.thanks.some((word) => query.includes(word))) {
        return "You're very welcome! If you have any other questions about Slotem's privacy or data practices, I'm happy to help.";
    }

    if (
        CONVERSATIONAL_RESPONSES.acknowledgements.some((word) =>
            query.includes(word),
        )
    ) {
        return 'Got it! If you have another privacy or data protection question, feel free to ask.';
    }

    if (
        CONVERSATIONAL_RESPONSES.farewells.some((word) => query.includes(word))
    ) {
        return "Goodbye! If you have any questions about Slotem's privacy policies later, I'll be here.";
    }

    return null;
};

const getBotResponse = (text: string): string => {
    const query = normalizeQuery(text);

    // Empty input should never normally reach this function,
    // but keeping this guard makes the function safer.
    if (!query) {
        return "I'm here whenever you're ready. What would you like to know about Slotem's privacy practices?";
    }

    // 1. Try known privacy FAQs first.
    const faqResponse = getFAQResponse(query);

    if (faqResponse) {
        return faqResponse;
    }

    // 2. Handle natural conversation.
    const conversationalResponse = getConversationalResponse(query);

    if (conversationalResponse) {
        return conversationalResponse;
    }

    // 3. Unknown question.
    return DEFAULT_REPLY;
};

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'bot',
            text: "Hello! I am Slotem's Compliance & Data Protection Assistant. Ask me anything about how we safeguard and process your scheduling records.",
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
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
        const trimmedText = textToSend.trim();

        if (!trimmedText || isTyping) {
            return;
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            sender: 'user',
            text: trimmedText,
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate reply
        setTimeout(() => {
            const botMessage: Message = {
                id: crypto.randomUUID(),
                sender: 'bot',
                text: getBotResponse(trimmedText),
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
                                        Privacy Helpdesk
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                                            Compliance Officer online
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
                        {/* {messages.length === 1 && !isTyping && ( */}
                        {!isTyping && (
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
                                placeholder="Ask our compliance bot a question..."
                                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs placeholder-zinc-400 transition-all outline-none hover:border-zinc-300 focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-900 dark:placeholder-zinc-500"
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
