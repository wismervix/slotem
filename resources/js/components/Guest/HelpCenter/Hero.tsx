/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Hero({ searchQuery, onSearchChange }: HeroProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePopularClick = (keyword: string) => {
    onSearchChange(keyword);
    searchInputRef.current?.focus();
  };

  return (
    <section className="relative py-16 md:py-24 px-6 overflow-hidden text-center" id="help-hero">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white" id="hero-title">
          How can we help you?
        </h1>

        {/* Custom Search Box */}
        <div className="relative max-w-2xl mx-auto mt-8 group" id="search-box-container">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 h-6 w-6 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-16 pr-24 py-4.5 md:py-5 rounded-full border-2 border-zinc-200 focus:border-indigo-600 focus:ring-0 text-base md:text-lg shadow-xl shadow-zinc-100/40 dark:shadow-none hover:shadow-2xl hover:border-zinc-300 dark:border-zinc-800 dark:focus:border-indigo-400 outline-none bg-white dark:bg-zinc-900 dark:text-white transition-all duration-300"
            placeholder="Search for articles, guides, or keywords..."
            id="input-hero-search"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1 items-center pointer-events-none" id="keyboard-shortcut-tag">
            <kbd className="hidden md:inline-block px-2 py-1 bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold text-zinc-400 rounded-lg border border-zinc-200 dark:border-zinc-700">⌘</kbd>
            <kbd className="hidden md:inline-block px-2 py-1 bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold text-zinc-400 rounded-lg border border-zinc-200 dark:border-zinc-700">K</kbd>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-5 flex flex-wrap justify-center items-center gap-2 text-sm" id="popular-suggestions-row">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Popular:</span>
          {['Sync Calendar', 'Reset Password', 'Refund Policy'].map((keyword) => (
            <button
              key={keyword}
              onClick={() => handlePopularClick(keyword)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline font-semibold focus:outline-none"
              id={`popular-tag-${keyword.toLowerCase().replace(' ', '-')}`}
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
