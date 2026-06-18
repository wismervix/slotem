/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, FileText, User, Mail, Sparkles } from 'lucide-react';
import { BookingFour, ServiceDetail } from '@/types';
import { SERVICES_CATALOG } from '@/data/initial-data-four';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCustomerName: string;
    defaultCustomerEmail: string;
    onAddBooking: (booking: BookingFour) => void;
}

export default function NewBookingModal({
  isOpen,
  onClose,
  defaultCustomerName,
  defaultCustomerEmail,
  onAddBooking
}: NewBookingModalProps) {
  const [serviceId, setServiceId] = useState(SERVICES_CATALOG[0].id);
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [customerEmail, setCustomerEmail] = useState(defaultCustomerEmail);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [amount, setAmount] = useState(SERVICES_CATALOG[0].price);
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');

  // Auto update amount based on service selection
  useEffect(() => {
    const srv = SERVICES_CATALOG.find(s => s.id === serviceId);
    if (srv) {
      setAmount(srv.price);
    }
  }, [serviceId]);

  // Set default tomorrow date
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      
      setCustomerName(defaultCustomerName);
      setCustomerEmail(defaultCustomerEmail);
      setNotes('');
      setPhone('');
    }
  }, [isOpen, defaultCustomerName, defaultCustomerEmail]);

  if (!isOpen) return null;

  const timeSlots = [
    '09:00 AM - 10:30 AM',
    '10:00 AM - 11:30 AM',
    '11:00 AM - 12:30 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 05:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = SERVICES_CATALOG.find(s => s.id === serviceId);
    const serviceName = serviceObj ? serviceObj.name : "Custom Session";

    // Format human date, e.g. "2023-10-24" -> "Oct 24, 2023"
    let displayDate = date;
    try {
      const parts = date.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {
      // Fallback
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRef = `#BK-${randomNum}`;

    const newBooking: BookingFour = {
        id: `bk-${Date.now()}`,
        service: serviceName,
        ref: newRef,
        date: displayDate,
        timeSlot,
        amount,
        status: 'Confirmed',
        customerName,
        customerEmail,
        phoneNumber: phone,
        notes: notes.trim(),
    };

    onAddBooking(newBooking);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      id="new_booking_modal_backdrop"
    >
      <div 
        className="bg-white rounded-2xl border border-[#ccc3d8]/40 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="new_booking_dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ccc3d8]/30 flex justify-between items-center bg-[#fef7ff]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#630ed4]" />
            <h3 className="font-semibold text-lg text-[#25005a]">Book New Session</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#4a4455]/70 hover:bg-[#e8dfee]/50 hover:text-[#630ed4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#630ed4]" /> Customer Name
              </label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white cursor-text"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#630ed4]" /> Customer Email
              </label>
              <input 
                type="email" 
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white cursor-text"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#630ed4]" /> Service Type
              </label>
              <select 
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white cursor-pointer"
              >
                {SERVICES_CATALOG.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#630ed4]" /> Booking Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-4 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#630ed4]" /> Date
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#630ed4]" /> Time Slot
              </label>
              <select 
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white cursor-pointer"
              >
                {timeSlots.map((ts, idx) => (
                  <option key={idx} value={ts}>{ts}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5">Phone Number (Optional)</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white cursor-text"
              placeholder="+1 (555) 019-2834"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#630ed4]" /> Specific Booking Notes
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white h-20"
              placeholder="e.g. Needs screen-sharing setup, client is on West Coast time..."
            />
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-4 justify-end">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-[#ccc3d8] rounded-xl text-sm font-semibold text-[#4a4455] hover:bg-[#e8dfee]/30 active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-[#630ed4] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
