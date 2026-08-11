/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Article {
    id: string;
    title: string;
    category: string;
    content: string;
    isFeatured?: boolean;
    publishDate?: string;
    readTime: string;
    author: {
        name: string;
        avatar?: string;
        role: string;
    };
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    iconName: string; // mapped to a Lucide icon
    colorClass: string; // background color for icon container
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export interface SupportTicket {
    id: string;
    name: string;
    email: string;
    topic: string;
    subject: string;
    description: string;
    status: 'open' | 'pending' | 'resolved';
    createdAt: string;
}
