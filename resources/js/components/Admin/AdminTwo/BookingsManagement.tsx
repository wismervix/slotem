import React, { useState, useMemo } from 'react';
import { Calendar, Trash2, Search, Filter, Plus, Check, Clock, X, AlertTriangle, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { BookingThree, UserThree, AvailabilityThree } from '@/types';

interface BookingsManagementProps {
    bookings: BookingThree[];
    users: UserThree[];
    availability: AvailabilityThree[];
    onAddBooking: (booking: BookingThree) => void;
    onUpdateBookingStatus: (
        bookingId: string,
        status: BookingThree['status'],
    ) => void;
    onDeleteBooking: (bookingId: string) => void;
}

export default function BookingsManagement({
  bookings,
  users,
  availability,
  onAddBooking,
  onUpdateBookingStatus,
  onDeleteBooking
}: BookingsManagementProps) {
  // Filters
  const [filterService, setFilterService] = useState('All Services');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');

  // Creation State
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedService, setSelectedService] = useState('VIP Strategy Consultation');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [bookingTime, setBookingTime] = useState('10:00 AM');

  const servicesOption = [
    'VIP Strategy Consultation',
    'Technical Onboarding Session',
    'General Consultation',
    'Design Review & Feedback',
    'Health & Wellness Assessment',
  ];

  const timeslotsOption = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Map of unique booked services for filtering
  const existingServices = useMemo(() => {
    return Array.from(new Set(bookings.map(b => b.service)));
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesService = filterService === 'All Services' || b.service === filterService;
      const matchesStatus = filterStatus === 'All Statuses' || b.status === filterStatus;

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [bookings, searchQuery, filterService, filterStatus]);

  const handleCreateBooking = () => {
    if (!selectedUserId) {
      alert('Please select an active client from the registered database.');
      return;
    }
    const userObj = users.find(u => u.id === selectedUserId);
    if (!userObj) return;

    const newBooking: BookingThree = {
      id: `BK-${1000 + bookings.length + 1}`,
      userId: userObj.id,
      userName: userObj.name,
      userEmail: userObj.email,
      service: selectedService,
      date: bookingDate,
      timeSlot: bookingTime,
      status: 'Confirmed'
    };

    onAddBooking(newBooking);
    setIsAdding(false);
    setSelectedUserId('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Segment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Bookings Catalog</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Browse reservation rosters, assign appointments, and moderates SLA responses.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-all cursor-pointer shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Booking Filter bar */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-wrap items-center gap-4">
        {/* Keyword Search */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant flex-1 min-w-[190px]">
          <Search className="text-outline w-4 h-4" />
          <input
            type="text"
            placeholder="Search booking (ID, client name, user ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-on-surface w-full focus:outline-none placeholder-outline/80"
          />
        </div>

        {/* Filter by Booked Service */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant flex-1 min-w-[190px]">
          <Filter className="text-outline w-4 h-4" />
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="bg-transparent border-none text-xs focus:ring-0 text-on-surface w-full cursor-pointer font-medium focus:outline-none"
          >
            <option value="All Services">All Services</option>
            {existingServices.map((service, index) => (
              <option key={index} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant flex-1 min-w-[160px]">
          <Clock className="text-outline w-4 h-4" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-none text-xs focus:ring-0 text-on-surface w-full cursor-pointer font-medium focus:outline-none"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Bookings Table list */}
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Client Username</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Focus Focus / Service focus</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Schedule Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">SLA status</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Moderations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-on-surface-variant/80">
                    No active bookings found matched with key conditions.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-on-surface font-mono">{b.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-xs font-bold text-on-surface">{b.userName}</p>
                        <p className="text-[10px] text-on-surface-variant/90">{b.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-primary">{b.service}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-on-surface font-medium">
                        <Calendar className="w-3.5 h-3.5 text-outline" />
                        <span>{b.date} @ {b.timeSlot}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {b.status === 'Confirmed' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wide border border-indigo-200">
                          Confirmed
                        </span>
                      ) : b.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 uppercase tracking-wide border border-green-200">
                          Completed
                        </span>
                      ) : b.status === 'Cancelled' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase tracking-wide border border-red-200">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 uppercase tracking-wide border border-yellow-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Active Actions */}
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Confirmed')}
                            className="p-1 px-2.5 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Completed')}
                            className="p-1 px-2 bg-primary text-on-primary rounded text-[10px] font-bold hover:bg-primary-container transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}
                        {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Cancelled')}
                            className="p-1.5 text-outline hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Cancel Booking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Delete this historical registration completely from database archives?')) {
                              onDeleteBooking(b.id);
                            }
                          }}
                          className="p-1.5 text-outline hover:text-red-800 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Purge Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking schedule insight dialog */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-700 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-on-surface">Bookings SLA Healthy</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Users are served by date schedule order automatically. Check the <strong className="text-primary hover:underline cursor-pointer" onClick={() => setSelectedService('General Consultation')}>Operational Availability</strong> planner to adjust default time slots.
            </p>
          </div>
        </div>
      </div>

      {/* New Reservation Dialog Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-outline-variant shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-sm text-on-surface">Schedule Appointment</h3>
              <button onClick={() => setIsAdding(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Client drop-down selection */}
              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Registered Client *</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="">-- Choose active client from dashboard roster --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} (ID: {u.id} - {u.email})
                    </option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p className="text-red-600 mt-1 font-semibold">No clients registered inside roster, add a new user first.</p>
                )}
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Selected Consultation focus *</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2.5 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer"
                >
                  {servicesOption.map((srv, index) => (
                    <option key={index} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              {/* Date & Timeslot */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Reservation Date *</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Work Hour Slot *</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer"
                  >
                    {timeslotsOption.map((time, idx) => (
                      <option key={idx} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-surface-container px-6 py-4 flex justify-end gap-2.5">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-lg cursor-pointer"
              >
                Abort
              </button>
              <button
                onClick={handleCreateBooking}
                className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary-container transition-all cursor-pointer shadow-sm shadow-primary/20"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
