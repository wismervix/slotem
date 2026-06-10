import { useState } from 'react';
import { Search, Calendar, Plus, Trash2, Check, X, FileEdit, Clock, DollarSign, Filter } from 'lucide-react';
import { AdminBookingThree, TeamMember } from '@/types';

interface BookingsTabProps {
    bookings: AdminBookingThree[];
    onUpdateStatus: (
        id: string,
        status: 'Confirmed' | 'Completed' | 'Cancelled',
    ) => void;
    onDeleteBooking: (id: string) => void;
    onOpenNewBooking: () => void;
}

export default function BookingsTab({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onOpenNewBooking,
}: BookingsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.staffName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'All' || b.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Quick Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients, services, staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-xl py-2 pl-9 pr-4 text-sm text-slate-800 transition-all font-sans"
          />
        </div>

        {/* Status segment buttons */}
        <div className="flex gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto overflow-x-auto scrollbar-hide shrink-0">
          {(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeFilter === status
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-gray-500 hover:text-purple-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings table list */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Client Contact</th>
                  <th className="px-6 py-4">Service Details</th>
                  <th className="px-6 py-4">Schedule Point</th>
                  <th className="px-6 py-4">Staff Assignee</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{b.clientName}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{b.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-700">{b.service}</p>
                        <div className="flex items-center text-xs text-purple-700 font-bold mt-0.5">
                          <DollarSign className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>{b.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs font-mono">
                        <span className="font-semibold text-slate-600 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {b.date}
                        </span>
                        <span className="text-gray-400 pl-4.5 mt-0.5">{b.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-purple-700 border border-slate-200 uppercase">
                          {b.staffName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-slate-600">{b.staffName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          b.status === 'Completed'
                            ? 'bg-purple-100 text-purple-800'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.status === 'Completed'
                              ? 'bg-purple-500'
                              : b.status === 'Cancelled'
                              ? 'bg-rose-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'Confirmed' && (
                          <>
                            <button
                              onClick={() => onUpdateStatus(b.id, 'Completed')}
                              title="Mark Completed"
                              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onUpdateStatus(b.id, 'Cancelled')}
                              title="Cancel Appointment"
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onDeleteBooking(b.id)}
                          title="Purge Entry"
                          className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 max-w-sm mx-auto">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-md font-bold text-slate-800 mb-1">No Bookings Found</h4>
            <p className="text-sm text-gray-400 mb-4">
              {searchTerm ? "No entries match your search query." : "There are currently no scheduled appointments in this state scope."}
            </p>
            {!searchTerm && (
              <button
                onClick={onOpenNewBooking}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
              >
                Add Your First Appointment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
