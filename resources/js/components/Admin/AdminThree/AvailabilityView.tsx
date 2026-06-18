/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CalendarClock, 
  Check, 
  Lock, 
  Unlock, 
  Calendar, 
  Clock, 
  Coffee, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

export default function AvailabilityView() {
  const [schedule, setSchedule] = useState([
    { day: 'Monday', enabled: true, start: '09:00 AM', end: '05:00 PM', slotsCount: 6 },
    { day: 'Tuesday', enabled: true, start: '09:00 AM', end: '05:00 PM', slotsCount: 6 },
    { day: 'Wednesday', enabled: true, start: '09:00 AM', end: '05:00 PM', slotsCount: 6 },
    { day: 'Thursday', enabled: true, start: '09:00 AM', end: '05:00 PM', slotsCount: 6 },
    { day: 'Friday', enabled: true, start: '09:00 AM', end: '04:00 PM', slotsCount: 5 },
    { day: 'Saturday', enabled: false, start: '10:00 AM', end: '02:00 PM', slotsCount: 0 },
    { day: 'Sunday', enabled: false, start: '10:00 AM', end: '02:00 PM', slotsCount: 0 },
  ]);

  const [activeDay, setActiveDay] = useState('Monday');
  
  // Custom slot tracker block list
  const [slotsData, setSlotsData] = useState<Record<string, { id: string; time: string; state: 'Available' | 'Blocked' | 'Booked' }[]>>({
    'Monday': [
      { id: 'm1', time: '09:00 AM - 10:30 AM', state: 'Available' },
      { id: 'm2', time: '10:00 AM - 11:30 AM', state: 'Booked' },
      { id: 'm3', time: '11:00 AM - 12:30 PM', state: 'Available' },
      { id: 'm4', time: '01:00 PM - 02:30 PM', state: 'Available' },
      { id: 'm5', time: '02:00 PM - 03:30 PM', state: 'Blocked' },
      { id: 'm6', time: '04:00 PM - 05:30 PM', state: 'Available' },
    ],
    'Tuesday': [
      { id: 't1', time: '09:00 AM - 10:30 AM', state: 'Available' },
      { id: 't2', time: '10:00 AM - 11:30 AM', state: 'Available' },
      { id: 't3', time: '11:00 AM - 12:30 PM', state: 'Booked' },
      { id: 't4', time: '01:00 PM - 02:30 PM', state: 'Available' },
      { id: 't5', time: '02:00 PM - 03:30 PM', state: 'Available' },
      { id: 't6', time: '04:00 PM - 05:30 PM', state: 'Available' },
    ],
    'Wednesday': [
      { id: 'w1', time: '09:00 AM - 10:30 AM', state: 'Available' },
      { id: 'w2', time: '10:00 AM - 11:30 AM', state: 'Available' },
      { id: 'w3', time: '11:00 AM - 12:30 PM', state: 'Available' },
      { id: 'w4', time: '01:00 PM - 02:30 PM', state: 'Blocked' },
      { id: 'w5', time: '02:00 PM - 03:30 PM', state: 'Booked' },
      { id: 'w6', time: '04:00 PM - 05:30 PM', state: 'Available' },
    ],
    'Thursday': [
      { id: 'th1', time: '09:00 AM - 10:30 AM', state: 'Available' },
      { id: 'th2', time: '10:00 AM - 11:30 AM', state: 'Available' },
      { id: 'th3', time: '11:00 AM - 12:30 PM', state: 'Available' },
      { id: 'th4', time: '01:00 PM - 02:30 PM', state: 'Booked' },
      { id: 'th5', time: '02:00 PM - 03:30 PM', state: 'Available' },
      { id: 'th6', time: '04:00 PM - 05:30 PM', state: 'Blocked' },
    ],
    'Friday': [
      { id: 'f1', time: '09:00 AM - 10:30 AM', state: 'Available' },
      { id: 'f2', time: '10:00 AM - 11:30 AM', state: 'Booked' },
      { id: 'f3', time: '11:00 AM - 12:30 PM', state: 'Available' },
      { id: 'f4', time: '01:00 PM - 02:30 PM', state: 'Available' },
      { id: 'f5', time: '02:00 PM - 03:30 PM', state: 'Available' },
    ],
  });

  const [blackoutDates, setBlackoutDates] = useState([
    { id: 'bo-1', label: 'Independence Day Holiday', date: '2026-07-04' },
    { id: 'bo-2', label: 'Admin Strategy Offsite', date: '2026-08-11' },
  ]);

  const [newBlackoutLabel, setNewBlackoutLabel] = useState('');
  const [newBlackoutDate, setNewBlackoutDate] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Toggle general day status (Active / Offline)
  const handleToggleDayEnabled = (dayName: string) => {
    setSchedule(schedule.map(d => {
      if (d.day === dayName) {
        return { ...d, enabled: !d.enabled };
      }
      return d;
    }));
  };

  // Toggle individual hour slot state
  const handleToggleSlotState = (dayName: string, slotId: string) => {
    const list = slotsData[dayName];
    if (!list) return;

    const updatedList = list.map(item => {
      if (item.id === slotId) {
        let nextState: 'Available' | 'Blocked' | 'Booked' = 'Available';
        if (item.state === 'Available') nextState = 'Blocked';
        else if (item.state === 'Blocked') nextState = 'Available';
        else nextState = 'Available'; // resets booked slots to test easily
        
        return { ...item, state: nextState };
      }
      return item;
    });

    setSlotsData({
      ...slotsData,
      [dayName]: updatedList
    });
  };

  const handleAddBlackout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlackoutLabel.trim() || !newBlackoutDate) return;

    setBlackoutDates([
      ...blackoutDates,
      {
        id: `bo-${Date.now()}`,
        label: newBlackoutLabel,
        date: newBlackoutDate
      }
    ]);
    setNewBlackoutLabel('');
    setNewBlackoutDate('');
  };

  const handleDeleteBlackout = (id: string) => {
    setBlackoutDates(blackoutDates.filter(b => b.id !== id));
  };

  const handleSaveGeneralSettings = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div id="availability_view" className="space-y-6 animate-in fade-in duration-300 text-left">
      
      {/* Alert banner */}
      {showNotification && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-800 flex items-center justify-between shadow-sm animate-bounce" id="alert_saved">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Check className="w-4 h-4 bg-emerald-600 text-white rounded-full p-0.5" />
            <span>Success: Booking availability rules saved to storage successfully!</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly schedule list, Col span 2 */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-[#ccc3d8]/40 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-[#ccc3d8]/30 pb-4.5 mb-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-base text-[#25005a] flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-[#630ed4]" /> Weekly Hours Planner
                </h3>
                <p className="text-xs text-[#4a4455]/75 mt-0.5">Toggle default business days and operational hours below.</p>
              </div>

              <button 
                onClick={handleSaveGeneralSettings}
                className="bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Save Hours
              </button>
            </div>

            {/* Days table */}
            <div className="space-y-3">
              {schedule.map((item) => {
                const isActive = activeDay === item.day;
                return (
                  <div 
                    key={item.day}
                    onClick={() => item.enabled && setActiveDay(item.day)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isActive 
                        ? 'bg-[#f3ebfa]/45 border-[#630ed4] ring-1 ring-[#630ed4]' 
                        : 'bg-white border-[#ccc3d8]/20 hover:border-[#ccc3d8]/50'
                    } ${!item.enabled ? 'opacity-60 cursor-default' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={item.enabled}
                        onChange={() => handleToggleDayEnabled(item.day)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-[#630ed4] focus:ring-[#630ed4] border-neutral-300 rounded cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#1d1a24]">{item.day}</span>
                        <p className="text-[10px] text-[#4a4455]/60">
                          {item.enabled ? 'Accepts digital appointments' : 'Closed for bookings'}
                        </p>
                      </div>
                    </div>

                    {item.enabled && (
                      <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <input 
                            type="text" 
                            defaultValue={item.start} 
                            className="bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold py-1 px-2.5 w-24 text-center focus:ring-1 focus:ring-[#630ed4] focus:border-[#630ed4]"
                          />
                        </div>
                        <span className="text-xs text-neutral-400">—</span>
                        <div className="relative">
                          <input 
                            type="text" 
                            defaultValue={item.end} 
                            className="bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold py-1 px-2.5 w-24 text-center focus:ring-1 focus:ring-[#630ed4] focus:border-[#630ed4]"
                          />
                        </div>

                        {isActive && (
                          <span className="ml-2 bg-[#630ed4] text-white p-1 rounded-full text-[10px]">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slots manager for the active selected day */}
          <div className="bg-white border border-[#ccc3d8]/40 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-[#ccc3d8]/30 pb-4 mb-4 flex justify-between items-center bg-[#fef7ff]/10">
              <div>
                <h4 className="font-bold text-sm text-[#25005a] flex items-center gap-1.5">
                  <Clock className="w-4.5 h-4.5 text-[#630ed4]" /> Interactive Hours Matrix: {activeDay}
                </h4>
                <p className="text-xs text-[#4a4455]/70 mt-0.5">Click any slot badge below to toggle default available status to Blocked.</p>
              </div>
            </div>

            {slotsData[activeDay] ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slotsData[activeDay].map((slot) => {
                  return (
                    <button
                      key={slot.id}
                      onClick={() => handleToggleSlotState(activeDay, slot.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer hover:shadow-xs outline-none group active:scale-98 ${
                        slot.state === 'Available'
                          ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                          : slot.state === 'Blocked'
                          ? 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                          : 'bg-purple-50/40 border-purple-200 hover:border-purple-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#1d1a24]">{slot.time}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          {slot.state === 'Available' && <Unlock className="w-3 h-3 text-emerald-600" />}
                          {slot.state === 'Blocked' && <Lock className="w-3 h-3 text-neutral-400" />}
                          {slot.state === 'Booked' && <Calendar className="w-3 h-3 text-purple-600" />}
                          Type: {slot.state}
                        </p>
                      </div>

                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        slot.state === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : slot.state === 'Blocked'
                          ? 'bg-neutral-200 text-neutral-700'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {slot.state}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-xl text-neutral-400 text-xs">
                {activeDay} is closed for bookings. Toggle on to open slots.
              </div>
            )}
          </div>

        </div>

        {/* Temporary Vacation date Blockers (Col span 1) */}
        <div className="space-y-6">
          <div className="bg-[#fef7ff]/40 border border-[#ccc3d8]/40 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-[#25005a] mb-2 flex items-center gap-1.5 border-b border-[#ccc3d8]/20 pb-3">
              <Calendar className="w-4 h-4 text-[#630ed4]" /> Calendar Exclusions
            </h3>
            <p className="text-xs text-[#4a4455]/70 pb-4">Define specific calendar blackout dates to block online customer bookings globally.</p>

            {/* List blackout list */}
            <div className="space-y-2 mb-4">
              {blackoutDates.map((bo) => (
                <div key={bo.id} className="bg-white p-3 rounded-xl border border-[#ccc3d8]/20 flex items-center justify-between text-xs transition-shadow hover:shadow-xs">
                  <div>
                    <p className="font-bold text-[#1d1a24]">{bo.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">{bo.date}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteBlackout(bo.id)}
                    className="p-1 rounded-full text-neutral-300 hover:text-red-600 hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add blackout field */}
            <form onSubmit={handleAddBlackout} className="space-y-3 pt-3 border-t border-[#ccc3d8]/20">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Blockout Label</label>
                <input 
                  type="text" 
                  value={newBlackoutLabel}
                  onChange={(e) => setNewBlackoutLabel(e.target.value)}
                  placeholder="e.g. Christmas Eve Block"
                  className="w-full px-3 py-1.5 border border-[#ccc3d8] rounded-lg text-xs bg-white text-[#1d1a24]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target Date</label>
                <input 
                  type="date" 
                  value={newBlackoutDate}
                  onChange={(e) => setNewBlackoutDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#ccc3d8] rounded-lg text-xs bg-white text-[#1d1a24]"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Exclusion
              </button>
            </form>
          </div>

          {/* Quick FAQ info panel */}
          <div className="bg-white border border-[#ccc3d8]/40 p-4 rounded-xl text-xs space-y-2 shadow-xs">
            <span className="font-bold text-[#630ed4] flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Schedule Assistance
            </span>
            <p className="text-[#4a4455]/85 leading-relaxed text-[11px]">
              Customer queries check Slotem's available slots, overlapping blackout lists, and specific customer-tiered slots before authorizing bookings. Keep hours synchronized!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
