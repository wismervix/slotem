/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info, FileText, HelpCircle, Scale, Shield, Headphones, Star } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onGetSupport: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, onGetSupport }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'terms', label: 'Terms', icon: Scale },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const helpCenterTabs = ['overview', 'documentation', 'faqs', 'terms', 'privacy'];
  const isHelpCenterActive = helpCenterTabs.includes(activeSection);

  if (!isHelpCenterActive) {
    return null; // Don't show sidebar if they click other main nav tabs like features or pricing
  }

  return (
    <aside 
      className="hidden lg:flex flex-col p-4 w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-zinc-50/50 dark:bg-zinc-900/40 border-r border-zinc-200/80 dark:border-zinc-800/80 z-30"
      id="help-sidebar"
    >
      {/* Title / Brand Segment */}
      <div className="mb-6 px-2 mt-2" id="sidebar-brand-box">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Help Center</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Resources &amp; Guides</p>
      </div>

      {/* Navigation list */}
      <nav className="flex flex-col gap-1.5" id="sidebar-navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-left w-full font-medium text-sm ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 dark:bg-indigo-500 dark:shadow-none font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
              id={`sidebar-tab-${item.id}`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Support CTA at bottom */}
      <div className="mt-auto p-1" id="sidebar-footer">
        <button
          onClick={onGetSupport}
          className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 text-indigo-600 border border-indigo-600/10 hover:border-indigo-600/20 hover:bg-indigo-50 dark:bg-zinc-800 dark:text-indigo-400 dark:border-zinc-700/60 dark:hover:bg-zinc-750 transition-all font-bold text-sm rounded-xl hover:scale-[1.01]"
          id="btn-sidebar-get-support"
        >
          <Headphones className="h-4 w-4 shrink-0" />
          <span>Get Support</span>
        </button>
      </div>
    </aside>
  );
}
