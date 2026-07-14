/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TOPICS } from '@/data/help-center';
import {
    Rocket,
    CalendarCheck,
    Ticket,
    Calendar,
    CreditCard,
    Bell,
    Users,
    Settings,
    X,
} from 'lucide-react';
import { Topic } from '@/types';

interface TopicsGridProps {
    onSelectCategory: (categorySlug: string | null) => void;
    selectedCategory: string | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Rocket,
    CalendarCheck,
    Ticket,
    Calendar,
    CreditCard,
    Bell,
    Users,
    Settings,
};

export default function TopicsGrid({
    onSelectCategory,
    selectedCategory,
}: TopicsGridProps) {
    return (
        <section className="mx-auto max-w-7xl px-6 py-8" id="topics-section">
            <div
                className="mb-8 flex items-center justify-between"
                id="topics-header"
            >
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Browse by Topic
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Select a category to view corresponding help files
                    </p>
                </div>

                {selectedCategory && (
                    <button
                        onClick={() => onSelectCategory(null)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400"
                        id="btn-clear-category-filter"
                    >
                        <span>Clear Filter</span>
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            <div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                id="topics-bento-grid"
            >
                {TOPICS.map((topic) => {
                    const IconComponent = iconMap[topic.iconName] || Settings;
                    const isSelected = selectedCategory === topic.id;

                    return (
                        <div
                            key={topic.id}
                            onClick={() =>
                                onSelectCategory(isSelected ? null : topic.id)
                            }
                            className={`group flex h-[180px] cursor-pointer flex-col justify-between rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-zinc-900 ${
                                isSelected
                                    ? 'border-indigo-600 ring-2 ring-indigo-600/10 dark:border-indigo-500'
                                    : 'border-zinc-100 hover:border-indigo-500/50 dark:border-zinc-800'
                            }`}
                            id={`topic-card-${topic.id}`}
                        >
                            <div>
                                <div
                                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${topic.colorClass} group-hover:scale-105`}
                                >
                                    <IconComponent className="h-6 w-6 stroke-[2]" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-zinc-950 dark:text-white">
                                    {topic.title}
                                </h3>
                                <p className="line-clamp-2 text-xs leading-normal text-zinc-500 dark:text-zinc-400">
                                    {topic.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
