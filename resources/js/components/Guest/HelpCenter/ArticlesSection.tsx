/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Article } from '@/types';
import {
    Star,
    ArrowRight,
    BookOpen,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ArticlesSectionProps {
    articles: Article[];
    onSelectArticle: (article: Article) => void;
    searchQuery: string;
    selectedCategory: string | null;
    onResetFilters: () => void;
}

export default function ArticlesSection({
    articles,
    onSelectArticle,
    searchQuery,
    selectedCategory,
    onResetFilters,
}: ArticlesSectionProps) {
    // Filter logic
    const filteredArticles = articles.filter((art) => {
        const matchesCategory = selectedCategory
            ? art.category === selectedCategory
            : true;
        const matchesSearch = searchQuery
            ? art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              art.category.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });

    const featuredList = filteredArticles.filter((art) => art.isFeatured);
    const recentList = filteredArticles.filter((art) => !art.isFeatured);

    // If a filter is active, show combined filtered results or no results state
    const isFiltering = !!searchQuery || !!selectedCategory;

    if (filteredArticles.length === 0) {
        return (
            <div
                className="mx-auto max-w-4xl px-6 py-12 text-center"
                id="no-articles-panel"
            >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    No articles found
                </h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                    We couldn't find any help articles matching your criteria.
                    Try adjusting your keywords or clearing the category filter.
                </p>
                <button
                    onClick={onResetFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
                    id="btn-no-results-reset"
                >
                    <RefreshCw className="h-4 w-4" />
                    Clear Search &amp; Filters
                </button>
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-8" id="articles-section">
            {isFiltering ? (
                <div id="filtered-articles-list">
                    <h2 className="mb-6 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Search Results ({filteredArticles.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => onSelectArticle(article)}
                                className="dark:hover:bg-zinc-850 group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-100 bg-white p-5 transition-all duration-200 hover:border-indigo-500/30 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                                id={`filtered-article-${article.id}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                            article.isFeatured
                                                ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/35'
                                                : 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/35'
                                        }`}
                                    >
                                        {article.isFeatured ? (
                                            <Star className="h-5 w-5 fill-current" />
                                        ) : (
                                            <BookOpen className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                            {article.category}
                                        </span>
                                        <h4 className="font-semibold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                            {article.title}
                                        </h4>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1.5" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    className="grid grid-cols-1 gap-12 lg:grid-cols-2"
                    id="split-articles-grid"
                >
                    {/* Featured Column */}
                    <div id="featured-articles-column">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Featured Articles
                        </h2>
                        <div className="space-y-4">
                            {featuredList.map((article) => (
                                <div
                                    key={article.id}
                                    onClick={() => onSelectArticle(article)}
                                    className="dark:hover:bg-zinc-850 group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/30 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                                    id={`featured-article-${article.id}`}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <Star className="h-5 w-5 shrink-0 animate-pulse fill-amber-500 text-amber-500" />
                                        <span className="text-zinc-850 font-medium transition-colors group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
                                            {article.title}
                                        </span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1.5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Column */}
                    <div id="recent-articles-column">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Recent Articles
                        </h2>
                        <div className="space-y-4">
                            {recentList.map((article) => (
                                <div
                                    key={article.id}
                                    onClick={() => onSelectArticle(article)}
                                    className="dark:hover:bg-zinc-850 group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/30 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                                    id={`recent-article-${article.id}`}
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="text-zinc-850 font-medium transition-colors group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
                                            {article.title}
                                        </span>
                                        {article.publishDate && (
                                            <span className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                                                {article.publishDate}
                                            </span>
                                        )}
                                    </div>
                                    <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1.5" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
