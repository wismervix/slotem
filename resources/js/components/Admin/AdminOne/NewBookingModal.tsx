import React, { useState } from 'react';
import { ServiceTwo, BookingTwo } from '@/types';
import { Calendar, Clock, DollarSign, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    services: ServiceTwo[];
    onAddBooking: (newBooking: Omit<BookingTwo, 'id' | 'createdAt'>) => void;
}

export default function NewBookingModal({
  isOpen,
  onClose,
  services,
  onAddBooking
}: NewBookingModalProps) {
  const activeServices = services.filter((s) => s.status === 'Active');

  // Input states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(activeServices[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('2026-06-18');
  const [bookingTime, setBookingTime] = useState('10:00 AM');

  // Success Feedback state
  const [showSuccessText, setShowSuccessText] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  // Ready-to-use timeslots
  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '11:15 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !selectedServiceId) return;

    const chosenService = services.find(s => s.id === selectedServiceId);
    if (!chosenService) return;

    onAddBooking({
      clientName,
      clientEmail,
      serviceId: selectedServiceId,
      serviceName: chosenService.name,
      date: bookingDate,
      time: bookingTime,
      price: chosenService.price,
      status: 'Confirmed'
    });

    // Provide success visual, then close
    setShowSuccessText(true);
    setTimeout(() => {
      setShowSuccessText(false);
      // Reset inputs
      setClientName('');
      setClientEmail('');
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Black backdrop blur */}
      <div className="absolute inset-0 bg-on-background/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl z-20 overflow-hidden flex flex-col border border-outline-variant">
        {/* Header toolbar */}
        <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Schedule Client Booking</h3>
            <p className="text-xs text-outline mt-0.5">Appoint details for active service catalog item.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container rounded-full text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {showSuccessText ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-surface h-[380px]">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle size={36} />
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">Booking Confirmed!</p>
              <p className="text-xs text-outline mt-1 font-medium">Session listed correctly in operations database.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Client Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant block">Client Full Name</label>
              <input
                required
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium bg-surface-container-lowest"
                placeholder="e.g. Eleanor Vance"
              />
            </div>

            {/* Client Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant block">Client Email Address</label>
              <input
                required
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium bg-surface-container-lowest"
                placeholder="e.g. eleanor@vance.com"
              />
            </div>

            {/* Services Available Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant block">Select Offering</label>
              {activeServices.length === 0 ? (
                <p className="text-xs text-error font-medium">No active services offered. Make sure service items are set to Active status.</p>
              ) : (
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold bg-surface-container-lowest cursor-pointer"
                >
                  {activeServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} (${service.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Custom Grid: DatePicker & Time Slots Selector */}
            <div className="grid grid-cols-2 gap-4 pb-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block">Session Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    required
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold bg-surface-container-lowest text-on-surface"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block">Time Slot</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold bg-surface-container-lowest cursor-pointer text-on-surface"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected summary banner */}
            {selectedService && (
              <div className="bg-surface-container p-3 rounded-lg flex justify-between items-center text-xs font-medium border border-outline-variant/40">
                <div className="text-outline">
                  <span>Price Quote: </span>
                  <span className="font-bold text-on-surface-variant">{selectedService.duration} mins session</span>
                </div>
                <div className="text-primary font-bold">
                  Total ${selectedService.price.toFixed(2)}
                </div>
              </div>
            )}

            {/* Submit Toolbar */}
            <div className="flex gap-2.5 pt-3 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-outline text-on-surface-variant font-semibold rounded-lg hover:bg-surface-container transition-all text-xs cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={activeServices.length === 0}
                className="flex-1 py-2.5 bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all text-xs cursor-pointer text-center shadow-md shadow-primary/10"
              >
                Book Service
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
