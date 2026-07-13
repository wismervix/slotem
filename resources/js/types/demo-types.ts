export interface Lead {
  id: string;
  fullName: string;
  company: string;
  workEmail: string;
  phoneNumber: string;
  companySize: string;
  industry: string;
  country: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Qualified' | 'Unqualified';
}

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
