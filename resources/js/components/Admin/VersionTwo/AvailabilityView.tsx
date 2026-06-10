/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, Check, X, ShieldAlert, CalendarRange, Plus, Trash2, CalendarDays } from 'lucide-react';
import { BusinessHours, HolidayBlock } from '@/types';

interface AvailabilityViewProps {
  businessHours: BusinessHours[];
  onUpdateHours: (hours: BusinessHours[]) => void;
  holidayBlocks: HolidayBlock[];
  onAddHolidayBlock: (block: Omit<HolidayBlock, 'id'>) => void;
  onRemoveHolidayBlock: (id: string) => void;
}

export default function AvailabilityView({
  businessHours,
  onUpdateHours,
  holidayBlocks,
  onAddHolidayBlock,
  onRemoveHolidayBlock
}: AvailabilityViewProps) {
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleOpen = (idx: number) => {
    const updated = businessHours.map((h, i) =>
      i === idx ? { ...h, isOpen: !h.isOpen } : h
    );
    onUpdateHours(updated);
  };

  const handleTimeChange = (idx: number, field: 'openTime' | 'closeTime', val: string) => {
    const updated = businessHours.map((h, i) =>
      i === idx ? { ...h, [field]: val } : h
    );
    onUpdateHours(updated);
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate || !newBlockedReason.trim()) return;

    onAddHolidayBlock({
      date: newBlockedDate,
      reason: newBlockedReason
    });
    setNewBlockedDate('');
    setNewBlockedReason('');
  };

  const saveConfig = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            Availability Schedulers
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure weekly business hours and block calendar holiday periods.
          </p>
        </div>
        <button
          onClick={saveConfig}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
          id="btn-save-availability"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 animate-scale-up" />
              <span>Hours Updated!</span>
            </>
          ) : (
            <span>Save Configuration</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Operating Hours panel */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <CalendarDays className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Standard Business Hours</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Determine standard opening / closing segments per weekday.</p>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {businessHours.map((hours, idx) => (
              <div key={hours.day} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3 w-32">
                  <button
                    onClick={() => handleToggleOpen(idx)}
                    className={`w-10 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      hours.isOpen ? 'bg-purple-600' : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                    id={`toggle-availability-${hours.day.toLowerCase()}`}
                  >
                    <div
                      className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform duration-200 ${
                        hours.isOpen ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-semibold ${hours.isOpen ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400'}`}>
                    {hours.day}
                  </span>
                </div>

                {hours.isOpen ? (
                  <div className="flex items-center gap-2" id={`hours-selector-${hours.day.toLowerCase()}`}>
                    <select
                      value={hours.openTime}
                      onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                      className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-850 dark:text-white text-xs font-medium focus:ring-1.5 focus:ring-purple-500 focus:outline-none transition-all cursor-pointer"
                    >
                      {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'].map((time) => (
                        <option key={time} value={time}>
                          {time} AM
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-zinc-400 font-bold px-1 select-none">to</span>
                    <select
                      value={hours.closeTime}
                      onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                      className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-850 dark:text-white text-xs font-medium focus:ring-1.5 focus:ring-purple-500 focus:outline-none transition-all cursor-pointer"
                    >
                      {['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => {
                        const hr = Number(time.split(':')[0]);
                        return (
                          <option key={time} value={time}>
                            {hr > 12 ? hr - 12 : hr}:00 PM
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-lg select-none">
                    Closed
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Holiday Blocks panel */}
        <section className="space-y-6">
          {/* Add Holiday blocker tool */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <CalendarRange className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Block Single Days</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Block calendars for holidays or special leaves.</p>
              </div>
            </div>

            <form onSubmit={handleAddHoliday} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1">Select Date</label>
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-850 dark:text-white text-xs focus:ring-1.5 focus:ring-purple-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1">Blocker Code / Purpose</label>
                <input
                  type="text"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  placeholder="Private retreat"
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-850 dark:text-white text-xs focus:ring-1.5 focus:ring-purple-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                id="btn-add-holiday-blocker"
              >
                <Plus className="w-4 h-4" />
                Add Restrict Block
              </button>
            </form>
          </div>

          {/* Blocked Days Listing */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Registered Day Blocks</h3>
            
            {holidayBlocks.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-3 bg-zinc-50 dark:bg-zinc-950/20 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 select-none">
                No active calendar holiday blockades.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto scrollbar pr-1">
                {holidayBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="p-2.5 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-red-800 dark:text-red-400">{block.date}</span>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">{block.reason}</p>
                    </div>
                    <button
                      onClick={() => onRemoveHolidayBlock(block.id)}
                      className="p-1 px-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Remove blocker"
                      id={`btn-remove-blocker-${block.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
