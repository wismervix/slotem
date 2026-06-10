import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  FileText
} from 'lucide-react';
import { AdminBooking, ClinicService, Staff } from '@/types';
import { ROOMS } from '@/data/initial-data';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newBooking: Omit<AdminBooking, 'id' | 'createdTime'>) => void;
    services: ClinicService[];
    staff: Staff[];
    bookings: AdminBooking[];
}

export default function NewBookingModal({
  isOpen,
  onClose,
  onSubmit,
  services,
  staff,
  bookings
}: NewBookingModalProps) {
  // Input fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [staffId, setStaffId] = useState(staff[1]?.id || staff[0]?.id || '');
  const [room, setRoom] = useState('102');
  const [date, setDate] = useState('2026-06-09');
  const [time, setTime] = useState('11:30 AM');
  const [notes, setNotes] = useState('');

  // Conflict warning trigger
  const [checkConflict, setCheckConflict] = useState(false);

  if (!isOpen) return null;

  // Real-time conflict checks to see if Doctor or Room is already occupied at that specific hour!
  const isConflictDetected = () => {
    return bookings.some(b => {
      if (b.status === 'Cancelled') return false;
      
      const isSameDate = b.date === date;
      const isSameTime = b.time.trim().toLowerCase() === time.trim().toLowerCase();
      
      if (isSameDate && isSameTime) {
        // Conflict on dentist or room
        return b.staffId === staffId || b.room === room;
      }
      return false;
    });
  };

  const getConflictingBooking = () => {
    return bookings.find(b => {
      if (b.status === 'Cancelled') return false;
      const isSameDate = b.date === date;
      const isSameTime = b.time.trim().toLowerCase() === time.trim().toLowerCase();
      
      if (isSameDate && isSameTime) {
        return b.staffId === staffId || b.room === room;
      }
      return false;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim() || !serviceId || !staffId) {
      alert('Kindly fill in all required patient indicators.');
      return;
    }

    // Double booking guard
    const conflict = getConflictingBooking();
    if (conflict && !checkConflict) {
      setCheckConflict(true);
      return; // pause to show conflict warning first
    }

    onSubmit({
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      serviceId,
      staffId,
      room,
      date,
      time,
      status: 'Confirmed',
      notes
    });

    // Reset parameters
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNotes('');
    setCheckConflict(false);
    onClose();
  };

  // Selected Service values for pricing layout
  const selectedSrv = services.find(s => s.id === serviceId);

  return (
    <div className="fixed inset-0 bg-[#1d1a24]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl w-full max-w-[580px] shadow-2xl border border-[#e8dfee] overflow-hidden animate-fade-in"
      >
        {/* Header bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-[#e8dfee] flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-[#1d1a24] text-lg">Schedule New Appointment</h3>
            <p className="text-[11px] text-gray-400 font-semibold uppercase">Slotem Live Scheduler</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 bg-white border p-1.5 rounded-lg hover:shadow-xs transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body layout */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Double booking alert section */}
          {isConflictDetected() && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Clinical Priority Intersection Detected!</p>
                <p className="text-amber-700 font-medium mt-0.5">
                  Another patient ({getConflictingBooking()?.clientName}) already has an appointment assigned to the requested dentist or Dental Room on {date} at {time}.
                </p>
                <button
                  type="button"
                  onClick={() => setCheckConflict(true)}
                  className="mt-2 text-[10px] font-bold underline text-amber-950 block"
                >
                  Ignore conflict and enforce double-booking override
                </button>
              </div>
            </div>
          )}

          {/* Section: Patient details */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Patient Identification</p>
            
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Patient Full Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 text-sm rounded-lg border border-transparent focus:bg-white focus:border-[#630ed4] outline-none text-gray-800 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Cell Contacts (e.g. 555-0123)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 text-xs rounded-lg border border-transparent focus:bg-white focus:border-[#630ed4] outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email ID (Optional)"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 text-xs rounded-lg border border-transparent focus:bg-white focus:border-[#630ed4] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Clinical details */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operational Requirements</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Treatment */}
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Dental Treatment</label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 text-xs text-gray-700 rounded-lg outline-none cursor-pointer"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dentist */}
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Attending Clinician</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 text-xs text-gray-700 rounded-lg outline-none cursor-pointer"
                  >
                    {staff.filter(s => s.role !== 'Lead Admin' && s.isActive).map(s => (
                      <option key={s.id} value={s.id}>Dr. {s.name} ({s.role.split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Room */}
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Operation Room</label>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full p-2 bg-gray-50 text-xs text-gray-700 rounded-lg outline-none cursor-pointer"
                >
                  {ROOMS.map(r => (
                    <option key={r} value={r}>Room {r}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Meeting Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 bg-gray-50 text-xs text-gray-700 rounded-lg outline-none"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Hour Allocation</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 bg-gray-50 text-xs text-gray-700 rounded-lg outline-none cursor-pointer"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:15 PM">02:15 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:45 PM">04:45 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Pre-treatment clinical complaints</label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <textarea
                  placeholder="Toothache scale 1-10, swelling history, or general checkups..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 text-xs rounded-lg border border-transparent focus:bg-white focus:border-[#630ed4] outline-none min-h-[70px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing projections and submission */}
          <div className="bg-[#fef7ff] border border-[#e8dfee] p-4 rounded-xl flex items-center justify-between mt-4">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Estimated Bill Total</p>
              <p className="text-xl font-black text-[#630ed4] mt-0.5">
                ${selectedSrv?.price || 0}
              </p>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              {checkConflict ? 'Override & Force Secure Book' : 'Secure Book Appointment'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
