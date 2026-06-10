import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Clock, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { AdminBookingThree, TeamMember } from '@/types';
import { defaultServices } from '@/data/initial-data-three';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffMembers: TeamMember[];
    onAddBooking: (booking: AdminBookingThree) => void;
}

export default function NewBookingModal({
  isOpen,
  onClose,
  staffMembers,
  onAddBooking,
}: NewBookingModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedService, setSelectedService] = useState(defaultServices[0].name);
  const [date, setDate] = useState('2026-06-11');
  const [time, setTime] = useState('10:00 AM');
  const [staffId, setStaffId] = useState('');

  // Auto-select first active staff member
  useEffect(() => {
    if (staffMembers.length > 0 && !staffId) {
      setStaffId(staffMembers[0].id);
    }
  }, [staffMembers, staffId]);

  if (!isOpen) return null;

  const activeService = defaultServices.find(s => s.name === selectedService) || defaultServices[0];
  const activeStaff = staffMembers.find(s => s.id === staffId) || staffMembers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    const newBooking: AdminBookingThree = {
        id: 'b_' + Math.random().toString(36).substring(2, 9),
        clientName,
        clientEmail,
        service: selectedService,
        date,
        time,
        staffId: activeStaff?.id || '1',
        staffName: activeStaff?.name || 'Jane Doe',
        status: 'Confirmed',
        price: activeService.price,
    };

    onAddBooking(newBooking);
    onClose();
    // Reset state
    setClientName('');
    setClientEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden z-10 border border-gray-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span className="text-xs uppercase font-bold tracking-wider text-purple-200">New Booking Session</span>
          </div>
          <h3 className="text-xl font-bold font-sans">Create a New Booking</h3>
          <p className="text-sm text-purple-100 mt-1">Schedule an appointment directly inside Slotem Admin suite.</p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                required
                type="text"
                placeholder="e.g. Liam Neeson"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              required
              type="email"
              placeholder="e.g. liam@neeson.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-xl py-2.5 px-4 text-sm text-slate-800 transition-all font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Service Tier</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-xl py-2.5 px-3 text-sm text-slate-800 transition-all"
              >
                {defaultServices.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Staff Handler</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-xl py-2.5 px-3 text-sm text-slate-800 transition-all"
              >
                {staffMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Time Slot</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  required
                  type="text"
                  placeholder="10:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Pricing breakdown card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center text-slate-800">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Cost</p>
              <p className="text-xs text-gray-500 mt-0.5 mt-1">{activeService.duration} duration</p>
            </div>
            <div className="flex items-center text-xl font-extrabold text-slate-900">
              <DollarSign className="w-5 h-5 text-purple-700" />
              <span>{activeService.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-3 justify-end text-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 active:scale-95 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-semibold rounded-xl hover:brightness-110 shadow-md active:scale-95 transition-all"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
