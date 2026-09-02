/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from '@/components/Guest/HelpCenter/Sidebar';
import Hero from '@/components/Guest/HelpCenter/Hero';
import TopicsGrid from '@/components/Guest/HelpCenter/TopicsGrid';
import ArticlesSection from '@/components/Guest/HelpCenter/ArticlesSection';
import FaqSection from '@/components/Guest/HelpCenter/FaqSection';
import SupportCta from '@/components/Guest/HelpCenter/SupportCta';
import ArticleModal from '@/components/Guest/HelpCenter/ArticleModal';
import SupportModal from '@/components/Guest/HelpCenter/SupportModal';
import DocsReader from '@/components/Guest/HelpCenter/DocsReader';
import { ARTICLES } from '@/data/help-center';
import { Article } from '@/types';
import {
    Check,
    ArrowRight,
    ShieldCheck,
    HelpCircle,
    Sparkles,
    Building,
    Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GuestLayout from '@/layouts/Guest/GuestLayout';

export default function App() {
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    // Modals state
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null,
    );
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [supportMode, setSupportMode] = useState<'ticket' | 'chat'>('ticket');

    // Pricing options state
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
        'monthly',
    );

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
    };

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        // Auto-scroll to top on transition
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGetSupport = () => {
        setSupportMode('ticket');
        setIsSupportOpen(true);
    };

    const handleContactSupport = () => {
        setSupportMode('ticket');
        setIsSupportOpen(true);
    };

    const handleContactSales = () => {
        setSupportMode('ticket');
        setIsSupportOpen(true);
    };

    const handleLogin = () => {
        // Open chat help as an assistant login helper
        setSupportMode('chat');
        setIsSupportOpen(true);
    };

    // Determine if left sidebar is visible
    const showSidebar = [
        'overview',
        'documentation',
        'faqs',
        'terms',
        'privacy',
    ].includes(activeSection);

    return (
        <GuestLayout>
            {/* Main container with optional Sidebar spacing */}
            <div
                className="pt-40 sm:pt-18 relative flex flex-grow flex-col lg:flex-row"
                id="layout-main-container"
            >
                {/* Left Sidebar */}
                {showSidebar && (
                    <Sidebar
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                        onGetSupport={handleGetSupport}
                    />
                )}

                {/* Content canvas */}
                <main
                    className={`flex flex-grow flex-col ${
                        showSidebar ? 'lg:pl-64' : ''
                    } transition-all duration-300`}
                    id="main-content-canvas"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="flex flex-grow flex-col"
                        >
                            {/* === HELP CENTER OVERVIEW === */}
                            {activeSection === 'overview' && (
                                <div
                                    id="section-view-overview"
                                    className="flex-grow"
                                >
                                    <Hero
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                    />

                                    <TopicsGrid
                                        selectedCategory={selectedCategory}
                                        onSelectCategory={(cat) => {
                                            setSelectedCategory(cat);
                                            // Scroll to filtered articles
                                            const artSection =
                                                document.getElementById(
                                                    'articles-section',
                                                );
                                            if (artSection) {
                                                artSection.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start',
                                                });
                                            }
                                        }}
                                    />

                                    <ArticlesSection
                                        articles={ARTICLES}
                                        onSelectArticle={setSelectedArticle}
                                        searchQuery={searchQuery}
                                        selectedCategory={selectedCategory}
                                        onResetFilters={handleResetFilters}
                                    />

                                    <FaqSection />

                                    <SupportCta
                                        onContactSupport={handleContactSupport}
                                        onContactSales={handleContactSales}
                                    />
                                </div>
                            )}

                            {/* === DOCUMENTATION READERS === */}
                            {['documentation', 'terms', 'privacy'].includes(
                                activeSection,
                            ) && (
                                <div
                                    id="section-view-docs"
                                    className="flex-grow"
                                >
                                    <DocsReader
                                        sectionKey={activeSection as any}
                                    />
                                    <SupportCta
                                        onContactSupport={handleContactSupport}
                                        onContactSales={handleContactSales}
                                    />
                                </div>
                            )}

                            {/* === FAQ STANDALONE VIEW === */}
                            {activeSection === 'faqs' && (
                                <div
                                    id="section-view-faqs"
                                    className="flex-grow pt-8"
                                >
                                    <FaqSection />
                                    <SupportCta
                                        onContactSupport={handleContactSupport}
                                        onContactSales={handleContactSales}
                                    />
                                </div>
                            )}

                            {/* === INTERACTIVE FEATURES PAGE === */}
                            {activeSection === 'features' && (
                                <div
                                    id="section-view-features"
                                    className="mx-auto max-w-6xl flex-grow space-y-12 px-6 py-16 text-center"
                                >
                                    <div className="mx-auto max-w-3xl space-y-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700 uppercase dark:bg-indigo-950/40 dark:text-indigo-400">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Product Tour
                                        </span>
                                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                            Built to automate your scheduling
                                            workflow
                                        </h1>
                                        <p className="text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                                            Slotem handles bookings end-to-end
                                            so you can focus on making
                                            meaningful connections.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-3">
                                        <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-8 text-left dark:border-zinc-800 dark:bg-zinc-900/60">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                                <Check className="h-6 w-6 stroke-[3]" />
                                            </div>
                                            <h3 className="text-xl font-bold">
                                                Smart Round Robin
                                            </h3>
                                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                Inbound leads are paired
                                                dynamically with open
                                                executives, maintaining equal
                                                weight or criteria thresholds.
                                            </p>
                                        </div>

                                        <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-8 text-left dark:border-zinc-800 dark:bg-zinc-900/60">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500 text-white">
                                                <ShieldCheck className="h-6 w-6 stroke-[2]" />
                                            </div>
                                            <h3 className="text-xl font-bold">
                                                Enterprise Isolation
                                            </h3>
                                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                Data resides in localized
                                                compliant servers utilizing
                                                AES-256 secure vaults,
                                                compatible with HIPAA
                                                directives.
                                            </p>
                                        </div>

                                        <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-8 text-left dark:border-zinc-800 dark:bg-zinc-900/60">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                                                <Sparkles className="h-6 w-6 stroke-[2]" />
                                            </div>
                                            <h3 className="text-xl font-bold">
                                                WhatsApp Reminders
                                            </h3>
                                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                Reach clients instantly with
                                                real-time text threads, reducing
                                                meeting no-shows to practically
                                                zero.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-10">
                                        <button
                                            onClick={() =>
                                                handleSectionChange('overview')
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white transition-all hover:bg-indigo-700"
                                            id="btn-features-back-help"
                                        >
                                            <span>Explore Help Center</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* === INTERACTIVE ENTERPRISE PAGE === */}
                            {activeSection === 'enterprise' && (
                                <div
                                    id="section-view-enterprise"
                                    className="mx-auto max-w-6xl flex-grow space-y-12 px-6 py-16 text-center"
                                >
                                    <div className="mx-auto max-w-3xl space-y-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700 uppercase dark:bg-indigo-950/40 dark:text-indigo-400">
                                            <Building className="h-3.5 w-3.5" />
                                            Scalable Platform
                                        </span>
                                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                            Enterprise Scheduling Administration
                                        </h1>
                                        <p className="text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                                            Streamlined provisioning, unified
                                            invoicing, and SOC 2 Type II
                                            certified structures for
                                            thousand-seat organizations.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center justify-between gap-8 rounded-[2rem] border border-zinc-100 bg-zinc-50 p-8 text-left md:flex-row md:p-12 dark:border-zinc-800 dark:bg-zinc-900/40">
                                        <div className="max-w-xl space-y-4">
                                            <h3 className="text-2xl font-bold">
                                                Security, compliance, &amp;
                                                administration
                                            </h3>
                                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                Slotem connects securely to
                                                Google, Microsoft, and iCloud
                                                environments, ensuring strict
                                                user roles, access logs, and
                                                central governance.
                                            </p>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {[
                                                    'SOC2 Certified',
                                                    'GDPR Compliant',
                                                    'SAML SSO',
                                                    'SLA Guarantee',
                                                ].map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-lg border border-zinc-200/60 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleContactSales}
                                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
                                            id="btn-enterprise-contact-sales"
                                        >
                                            <Briefcase className="h-5 w-5" />
                                            <span>
                                                Contact Enterprise Sales
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* === INTERACTIVE PRICING PAGE === */}
                            {activeSection === 'pricing' && (
                                <div
                                    id="section-view-pricing"
                                    className="mx-auto max-w-6xl flex-grow space-y-12 px-6 py-16 text-center"
                                >
                                    <div className="mx-auto max-w-2xl space-y-4">
                                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                            Simple, transparent pricing plans
                                        </h1>
                                        <p className="text-base text-zinc-500 md:text-lg dark:text-zinc-400">
                                            Start scheduling instantly for free.
                                            Upgrade whenever you need automated
                                            team actions.
                                        </p>

                                        {/* Toggle Button */}
                                        <div className="mt-4 inline-flex items-center justify-center rounded-xl border border-zinc-200/50 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                                            <button
                                                onClick={() =>
                                                    setBillingCycle('monthly')
                                                }
                                                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                                                    billingCycle === 'monthly'
                                                        ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                                                        : 'text-zinc-500 hover:text-zinc-700'
                                                }`}
                                            >
                                                Monthly Billing
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setBillingCycle('yearly')
                                                }
                                                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                                                    billingCycle === 'yearly'
                                                        ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                                                        : 'text-zinc-500 hover:text-zinc-700'
                                                }`}
                                            >
                                                <span>Yearly Billing</span>
                                                <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                                    SAVE 20%
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Plan Grid */}
                                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-6 text-left md:grid-cols-3">
                                        {/* Free Plan */}
                                        <div className="flex h-full flex-col justify-between space-y-6 rounded-2xl border border-zinc-200/70 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-extrabold text-zinc-800 dark:text-white">
                                                    Free Plan
                                                </h3>
                                                <p className="text-xs text-zinc-500">
                                                    Perfect for individuals
                                                    getting started with simple
                                                    bookings.
                                                </p>
                                                <div className="pt-2">
                                                    <span className="text-4xl font-extrabold">
                                                        $0
                                                    </span>
                                                    <span className="text-xs font-medium text-zinc-400">
                                                        {' '}
                                                        / month
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-3.5 border-t border-zinc-100 pt-5 dark:border-zinc-800/80">
                                                {[
                                                    '1 Calendar Connection',
                                                    'Unlimited booking types',
                                                    'Email reminders',
                                                    'Slotem branding',
                                                ].map((f) => (
                                                    <div
                                                        key={f}
                                                        className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300"
                                                    >
                                                        <Check className="h-4.5 w-4.5 shrink-0 stroke-[2.5] text-emerald-500" />
                                                        <span>{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleSectionChange(
                                                        'overview',
                                                    )
                                                }
                                                className="w-full rounded-xl border border-zinc-200 py-3 text-center text-sm font-bold transition-all hover:border-zinc-300"
                                            >
                                                Get Started Free
                                            </button>
                                        </div>

                                        {/* Pro Plan */}
                                        <div className="relative flex h-full flex-col justify-between space-y-6 rounded-2xl border-2 border-indigo-600 bg-white p-8 shadow-xl dark:border-indigo-500 dark:bg-zinc-900">
                                            <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[9px] font-black tracking-widest text-white uppercase dark:bg-indigo-500">
                                                Most Popular
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                                    Pro Plan
                                                </h3>
                                                <p className="text-xs text-zinc-500">
                                                    For active professionals
                                                    requiring advanced
                                                    automations.
                                                </p>
                                                <div className="pt-2">
                                                    <span className="text-4xl font-extrabold">
                                                        $
                                                        {billingCycle ===
                                                        'monthly'
                                                            ? '12'
                                                            : '10'}
                                                    </span>
                                                    <span className="text-xs font-medium text-zinc-400">
                                                        {' '}
                                                        / user / month
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-3.5 border-t border-zinc-100 pt-5 dark:border-zinc-800/80">
                                                {[
                                                    '6 Calendar Connections',
                                                    'Stripe & PayPal collection',
                                                    'WhatsApp & SMS Reminders',
                                                    'Round-Robin dispatching',
                                                    'No Slotem branding',
                                                ].map((f) => (
                                                    <div
                                                        key={f}
                                                        className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300"
                                                    >
                                                        <Check className="h-4.5 w-4.5 shrink-0 stroke-[2.5] text-emerald-500" />
                                                        <span>{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleContactSales}
                                                className="w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700"
                                            >
                                                Start 14-Day Free Trial
                                            </button>
                                        </div>

                                        {/* Enterprise Plan */}
                                        <div className="flex h-full flex-col justify-between space-y-6 rounded-2xl border border-zinc-200/70 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-extrabold text-zinc-800 dark:text-white">
                                                    Enterprise Plan
                                                </h3>
                                                <p className="text-xs text-zinc-500">
                                                    For large organizations
                                                    requiring master
                                                    administration.
                                                </p>
                                                <div className="pt-2">
                                                    <span className="text-4xl font-extrabold">
                                                        Custom
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-3.5 border-t border-zinc-100 pt-5 dark:border-zinc-800/80">
                                                {[
                                                    'Unlimited Connections',
                                                    'SAML/SSO Provisioning',
                                                    'Dedicated Support SLA',
                                                    'Custom domain hosting',
                                                    'Master style presets',
                                                ].map((f) => (
                                                    <div
                                                        key={f}
                                                        className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300"
                                                    >
                                                        <Check className="h-4.5 w-4.5 shrink-0 stroke-[2.5] text-emerald-500" />
                                                        <span>{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleContactSales}
                                                className="w-full rounded-xl border border-zinc-200 py-3 text-center text-sm font-bold transition-all hover:border-zinc-300"
                                            >
                                                Contact Sales
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Overlay Modals */}
            <ArticleModal
                article={selectedArticle}
                onClose={() => setSelectedArticle(null)}
            />

            <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
                initialMode={supportMode}
            />
        </GuestLayout>
    );
}
