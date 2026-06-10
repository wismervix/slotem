import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  User, 
  Clock, 
  CheckCircle2, 
  X, 
  XOctagon, 
  Check, 
  Edit3,
  Stethoscope,
  DoorOpen,
  Eye
} from 'lucide-react';
import { AdminBooking, ClinicService, Staff } from '@/types';

interface BookingsScreenProps {
    bookings: AdminBooking[];
    services: ClinicService[];
    staff: Staff[];
    onOpenNewBooking: () => void;
    onSelectBooking: (booking: AdminBooking) => void;
}

type FilterStatus = 'All' | 'Confirmed' | 'In Progress' | 'Upcoming' | 'Completed' | 'Cancelled';

export default function BookingsScreen({
  bookings,
  services,
  staff,
  onOpenNewBooking,
  onSelectBooking
}: BookingsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('All');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-09'); // align to dashboard date

  // Find unique rooms in the current bookings dataset
  const uniqueRooms = useMemo(() => {
    const rooms = new Set(bookings.map(b => b.room));
    return Array.from(rooms).sort();
  }, [bookings]);

  // Filter and sort bookings dynamically
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Search text matches patient name, phone, or email
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        b.clientName.toLowerCase().includes(searchLower) ||
        b.clientPhone.includes(searchTerm) ||
        b.clientEmail.toLowerCase().includes(searchLower);

      // Status Matches
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

      // Staff Matches
      const matchesStaff = selectedStaffFilter === 'All' || b.staffId === selectedStaffFilter;

      // Room Matches
      const matchesRoom = selectedRoomFilter === 'All' || b.room === selectedRoomFilter;

      // Date Matches
      const matchesDate = !selectedDate || b.date === selectedDate;

      return matchesSearch && matchesStatus && matchesStaff && matchesRoom && matchesDate;
    }).sort((a, b) => {
      // sort chronologically
      const timeCompare = a.time.localeCompare(b.time);
      if (timeCompare !== 0) return timeCompare;
      return b.createdTime - a.createdTime;
    });
  }, [bookings, searchTerm, statusFilter, selectedStaffFilter, selectedRoomFilter, selectedDate]);

  // Total earnings of filtered bookings
  const filteredEarnings = useMemo(() => {
    return filteredBookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => {
        const srv = services.find(s => s.id === b.serviceId);
        return sum + (srv ? srv.price : 0);
      }, 0);
  }, [filteredBookings, services]);

  const getService = (id: string) => services.find(s => s.id === id);
  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Unassigned Staff';

  return (
    <div className="animate-fade-in relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1d1a24] mb-1">Clinic Appointments</h2>
          <p className="text-gray-500">Search, filter, and manage orthodontic & medical reservations.</p>
        </div>
        <button
          onClick={onOpenNewBooking}
          className="bg-[#630ed4] text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#7c3aed] transition-colors active:scale-95 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      {/* Date Shortcuts & Fast Filter stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#e8dfee] rounded-xl p-4 flex flex-col justify-center">
          <p className="text-xs text-gray-500 font-semibold mb-1">TARGET DATE</p>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-[#1d1a24] font-bold text-sm bg-gray-50 p-1.5 rounded-lg border border-[#e8dfee] focus:outline-none focus:ring-1 focus:ring-[#630ed4]"
          />
          <button 
            onClick={() => setSelectedDate('')}
            className="text-[10px] text-gray-400 mt-1 hover:text-[#630ed4] text-left self-start"
          >
            Clear Date (Show All days)
          </button>
        </div>

        <div className="bg-white border border-[#e8dfee] rounded-xl p-4 flex flex-col justify-center">
          <p className="text-xs text-gray-500 font-semibold uppercase">Matches Found</p>
          <p className="text-2xl font-black text-[#1d1a24] mt-1">{filteredBookings.length}</p>
        </div>

        <div className="bg-white border border-[#e8dfee] rounded-xl p-4 flex flex-col justify-center">
          <p className="text-xs text-gray-500 font-semibold uppercase">Pending/Upcoming</p>
          <p className="text-2xl font-black text-[#7d3d00] mt-1">
            {filteredBookings.filter(b => b.status === 'Upcoming' || b.status === 'In Progress').length}
          </p>
        </div>

        <div className="bg-white border border-[#e8dfee] rounded-xl p-4 flex flex-col justify-center bg-[#fef7ff]">
          <p className="text-xs text-[#630ed4]/70 font-semibold uppercase">Forecasted Income</p>
          <p className="text-2xl font-black text-[#630ed4] mt-1">${filteredEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Control Panel: Filters & Search */}
      <div className="bg-white rounded-xl border border-[#e8dfee] p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Search bar */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm border border-transparent focus:bg-white focus:border-[#630ed4] focus:ring-1 focus:ring-[#630ed4] text-[#1d1a24] transition-all"
            />
          </div>

          {/* Status Filter buttons */}
          <div className="lg:col-span-8 flex flex-wrap gap-2 justify-start lg:justify-end">
            {(['All', 'Upcoming', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'] as FilterStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#630ed4] text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Technical filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          {/* Staff Filter */}
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={selectedStaffFilter}
              onChange={(e) => setSelectedStaffFilter(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-lg text-xs py-2 px-3 text-gray-700 cursor-pointer focus:ring-1 focus:ring-[#630ed4]"
            >
              <option value="All">All Dental Staff</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>Dr. {s.name}</option>
              ))}
            </select>
          </div>

          {/* Room Filter */}
          <div className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={selectedRoomFilter}
              onChange={(e) => setSelectedRoomFilter(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-lg text-xs py-2 px-3 text-gray-700 cursor-pointer focus:ring-1 focus:ring-[#630ed4]"
            >
              <option value="All">All Operations Rooms</option>
              {uniqueRooms.map(rm => (
                <option key={rm} value={rm}>Room {rm}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings listings body block */}
      <div className="bg-white rounded-xl border border-[#e8dfee] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#e8dfee] text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Time / Date</th>
                <th className="py-4 px-6">Patient Details</th>
                <th className="py-4 px-6">Treatment Plan</th>
                <th className="py-4 px-6">Dentist & Room</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Fee / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    No matching appointments found. Try altering your filters or adding a new booking!
                  </td>
                </tr>
              ) : (
                filteredBookings.map((bk) => {
                  const srv = getService(bk.serviceId);
                  const assignedStaff = staff.find(s => s.id === bk.staffId);

                  // Set badge rendering
                  let badgeClass = 'bg-gray-100 text-gray-600';
                  if (bk.status === 'Confirmed') {
                    badgeClass = 'bg-emerald-100 text-emerald-800 font-bold';
                  } else if (bk.status === 'In Progress') {
                    badgeClass = 'bg-amber-100 text-amber-800 font-bold';
                  } else if (bk.status === 'Upcoming') {
                    badgeClass = 'bg-[#eaddff] text-[#630ed4] font-bold';
                  } else if (bk.status === 'Completed') {
                    badgeClass = 'bg-blue-100 text-blue-800 font-bold';
                  } else if (bk.status === 'Cancelled') {
                    badgeClass = 'bg-rose-100 text-rose-800 font-bold line-through';
                  }

                  return (
                    <motion.tr 
                      key={bk.id}
                      className="hover:bg-violet-50/20 active:bg-violet-50/50 transition-colors cursor-pointer group"
                      onClick={() => onSelectBooking(bk)}
                    >
                      {/* Hour column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#630ed4]" />
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">{bk.time}</span>
                            <span className="text-[11px] text-gray-500 font-medium">{bk.date}</span>
                          </div>
                        </div>
                      </td>

                      {/* Patient metadata */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-[#1d1a24] text-sm group-hover:text-[#630ed4] transition-colors">{bk.clientName}</p>
                          <p className="text-xs text-gray-500 font-medium">{bk.clientPhone}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{bk.clientEmail}</p>
                        </div>
                      </td>

                      {/* Treatment Plan */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-800 text-xs">
                            {srv?.name || bk.serviceId}
                          </p>
                          <p className="text-[11px] text-gray-500 font-semibold">{srv?.durationMinutes || 30} mins</p>
                        </div>
                      </td>

                      {/* Dentist / Operating Room */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-xs text-gray-700 font-bold">
                            {assignedStaff ? `Dr. ${assignedStaff.name}` : 'Unassigned'}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] uppercase font-black bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            Room {bk.room}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-block text-xs uppercase px-2 py-0.5 rounded-full ${badgeClass}`}>
                          {bk.status}
                        </span>
                      </td>

                      {/* Actions or view details popup */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-black text-gray-900 pr-2">
                            ${srv?.price || 0}
                          </span>
                          <button 
                            title="View / Modify Booking"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectBooking(bk);
                            }}
                            className="p-1 px-2.5 rounded-lg border border-gray-100 text-[#630ed4] hover:bg-[#630ed4] hover:text-white hover:border-[#630ed4] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Open
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
