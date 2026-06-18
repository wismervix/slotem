import { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  FileText, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  FilterX
} from 'lucide-react';
import { BookingTwo } from '@/types';

interface BookingsViewProps {
    bookings: BookingTwo[];
    onApproveBooking: (id: string) => void;
    onCancelBooking: (id: string) => void;
    onDeleteBooking: (id: string) => void;
    onNewBookingClick: () => void;
}

export default function BookingsView({
  bookings,
  onApproveBooking,
  onCancelBooking,
  onDeleteBooking,
  onNewBookingClick,
}: BookingsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled'>('All');

  // Filter implementation
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && booking.status === statusFilter;
  });

  return (
    <div id="bookings-view" className="bg-white border border-outline-variant rounded-xl shadow-xs overflow-hidden">
      {/* Title & Actions Bar */}
      <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Bookings Registers</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Audit, verify, and approve user-booked appointment dates and service blocks.
          </p>
        </div>
        
        <button 
          onClick={onNewBookingClick}
          className="bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create General Booking
        </button>
      </div>

      {/* Inputs: Search & Filters */}
      <div className="p-4 bg-surface-container-low border-b border-outline-variant flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant/70" />
          <input 
            type="text" 
            placeholder="Search by client name, email, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm bg-white"
          />
        </div>

        {/* Status Pills Tab */}
        <div className="flex flex-wrap gap-1 bg-white border border-outline-variant p-1 rounded-lg">
          {(['All', 'Confirmed', 'Pending', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                statusFilter === tab 
                  ? 'bg-primary text-on-primary shadow-xs' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Card list */}
      <div className="overflow-x-auto">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <FilterX className="w-12 h-12 text-on-surface-variant/35 mb-3" />
            <p className="text-sm font-semibold text-on-surface-variant">No matching bookings found</p>
            <p className="text-xs text-on-surface-variant/60 mt-1">
              Try adjusting your lookup keywords or select a different filter category.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/40 border-b border-outline-variant text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Client Info</th>
                <th className="py-3.5 px-4">Service Required</th>
                <th className="py-3.5 px-4">Reserved Schedule</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-sm">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-surface-container-low/30 transition-colors">
                  {/* Client Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {booking.clientName.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-on-surface flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-on-surface-variant/60" /> {booking.clientName}
                        </p>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 font-mono">
                          <Mail className="w-3 h-3 text-on-surface-variant/50" /> {booking.clientEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="py-4 px-4 max-w-[200px]">
                    <p className="font-medium text-xs text-on-surface line-clamp-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-on-surface-variant/60" /> {booking.serviceName}
                    </p>
                  </td>

                  {/* Reserved Date & Time */}
                  <td className="py-4 px-4 font-mono text-xs">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-on-surface font-medium">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1 text-on-surface-variant">
                        <Clock className="w-3.5 h-3.5 text-on-surface-variant/70" /> {booking.time}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center justify-center font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      booking.status === 'Confirmed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : booking.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {booking.status}
                    </span>
                  </td>

                  {/* Quick Inline Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {booking.status === 'Pending' && (
                        <button
                          onClick={() => onApproveBooking(booking.id)}
                          title="Confirm Reservation"
                          className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-200 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      
                      {booking.status !== 'Cancelled' && (
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          title="Cancel Reservation"
                          className="p-1.5 hover:bg-red-50 text-red-650 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDeleteBooking(booking.id)}
                        title="Delete Record"
                        className="p-1.5 hover:bg-gray-100 text-on-surface-variant hover:text-dark-900 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
