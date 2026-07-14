export interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
}

export interface FAQItem {
    question: string;
    answer: string;
    category: 'general' | 'pricing' | 'technical' | 'security';
}
