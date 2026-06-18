import React, { useState } from 'react';
import { Calendar, Save, CheckCircle, XCircle, Sliders, Sun, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { AvailabilityThree } from '@/types';

interface AvailabilityManagerProps {
    availability: AvailabilityThree[];
    onToggleSlot: (dayName: string, time: string) => void;
    onApplyPreset: (presetType: 'office' | 'block' | 'open') => void;
}

export default function AvailabilityManager({
  availability,
  onToggleSlot,
  onApplyPreset
}: AvailabilityManagerProps) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleApplyPreset = (preset: 'office' | 'block' | 'open') => {
    onApplyPreset(preset);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const currentDayData = availability.find(d => d.day === selectedDay) || availability[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and presets title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Operational Availability</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Toggle schedule vacancies for your business hours, or apply global presets instantly.
          </p>
        </div>
        
        {/* Presets Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleApplyPreset('office')}
            className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer bg-white"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>9-5 Weekdays Preset</span>
          </button>
          
          <button
            onClick={() => handleApplyPreset('open')}
            className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer bg-white"
          >
            <Check className="w-3.5 h-3.5 text-green-600" />
            <span>Open All Slots</span>
          </button>

          <button
            onClick={() => handleApplyPreset('block')}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Block All Hours</span>
          </button>
        </div>
      </div>

      {/* Preset applied feedback banner */}
      {saveSuccess && (
        <div className="bg-green-100 border border-green-200 text-green-800 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-4.5 h-4.5 text-green-700" />
          <span>Operational schedule preset applied successfully. Users will sync instantly.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Weekdays Selector Sidebar */}
        <div className="lg:col-span-1 bg-white border border-outline-variant rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-outline uppercase tracking-wider px-3 block mb-2">
            Select Operation Day
          </span>
          {availability.map((dayData) => {
            const isSelected = dayData.day === selectedDay;
            const availableCount = dayData.slots.filter(s => s.isAvailable).length;
            
            return (
              <button
                key={dayData.day}
                onClick={() => setSelectedDay(dayData.day)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span>{dayData.day}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {availableCount} slots active
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Interactive Slots grid */}
        <div className="lg:col-span-3 bg-white border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3 mb-6">
              <div>
                <h3 className="font-bold text-sm text-on-surface">{selectedDay} Work Hours</h3>
                <p className="text-xs text-on-surface-variant">Tap hours below to toggle calendar vacancies</p>
              </div>
              <div className="flex gap-4 text-[11px] font-semibold text-outline">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-surface-container-highest rounded-full"></span>
                  <span>Blocked</span>
                </div>
              </div>
            </div>

            {/* Grid of Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentDayData.slots.map((slot) => {
                const active = slot.isAvailable;
                return (
                  <button
                    key={slot.time}
                    onClick={() => onToggleSlot(selectedDay, slot.time)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer active:scale-95 ${
                      active
                        ? 'bg-primary/5 border-primary/40 hover:bg-primary/10'
                        : 'bg-surface border-outline-variant/60 hover:bg-surface-container text-outline'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-bold leading-none ${active ? 'text-primary' : 'text-on-surface-variant/80'}`}>
                        {slot.time}
                      </span>
                      {active ? (
                        <CheckCircle className="w-4.5 h-4.5 text-primary" />
                      ) : (
                        <XCircle className="w-4.5 h-4.5 text-outline-variant" />
                      )}
                    </div>
                    <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider">
                      {active ? (
                        <span className="text-primary/90">Slot booking open</span>
                      ) : (
                        <span className="text-outline">Blocked off</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Clicking any slot automatically saves variables to device cache.</span>
            </div>
            <div className="flex items-center gap-1 text-primary hover:underline cursor-pointer group" onClick={() => handleApplyPreset('office')}>
              <span>Quickly apply office guidelines</span>
              <Sparkles className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
