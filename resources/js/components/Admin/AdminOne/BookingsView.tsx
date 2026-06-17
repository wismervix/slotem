import React, { useState, useMemo } from 'react';
import { BookingTwo } from '@/types';
import { Calendar, Search, Trash2, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingsViewProps {
    bookings: BookingTwo[];
    onUpdateBookingStatus: (id: string, status: BookingTwo['status']) => void;
    onDeleteBooking: (id: string) => void;
    searchQuery: string;
}

export default function BookingsView({
  bookings,
  onUpdateBookingStatus,
  onDeleteBooking,
  searchQuery
}: BookingsViewProps) {
  // Tabs: All, Confirmed, Completed, Cancelled
  const [activeTab, setActiveTab] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  
  // Local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeTab === 'All' ? true : b.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [bookings, searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const paginatedBookings = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIdx = (safePage - 1) * itemsPerPage;
    return filteredBookings.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredBookings, currentPage, totalPages]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-bold text-on-background tracking-tight font-sans">Bookings Registry</h2>
          <p className="text-on-surface-variant mt-1 text-sm md:text-base">Review, confirm, or terminate customer session assignments.</p>
        </div>
      </div>

      {/* Filter status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium text-xs tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {tab === 'All' ? 'All Bookings' : tab}
          </button>
        ))}
      </div>

      {/* Table listing */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-outline">
                <Calendar size={22} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">No bookings found</p>
                <p className="text-xs text-outline mt-1">Try tweaking filters or select "New Booking" to schedule one.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-outline">Client Name / Email</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-outline">Registered Service</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-outline">Date &amp; Time</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-outline">Paid</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-outline">Status Badge</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-outline text-right">Perform Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Client Column */}
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-on-surface text-sm">{b.clientName}</p>
                        <p className="text-[11px] text-outline mt-0.5">{b.clientEmail}</p>
                      </div>
                    </td>

                    {/* Service Column */}
                    <td className="p-4">
                      <div className="font-semibold text-xs text-primary rounded px-2.5 py-1 bg-primary/10 inline-block font-sans">
                        {b.serviceName}
                      </div>
                    </td>

                    {/* Date/Time Column */}
                    <td className="p-4">
                      <div className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5">
                        <Calendar size={14} className="text-outline" />
                        <span>{b.date}</span>
                        <span className="text-outline text-xs">•</span>
                        <span className="text-primary font-mono text-xs">{b.time}</span>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="p-4">
                      <span className="text-sm font-semibold text-on-background">${b.price.toFixed(2)}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${
                        b.status === 'Confirmed'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300/35'
                          : b.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/35'
                          : 'bg-rose-100 text-rose-800 border border-rose-300/35'
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    {/* Action Trigger keys */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5 items-center">
                        {b.status === 'Confirmed' && (
                          <>
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'Completed')}
                              title="Mark Completed"
                              className="p-1.5 hover:bg-emerald-50 text-outline hover:text-emerald-700 hover:border-emerald-200 border border-transparent rounded transition-all cursor-pointer"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'Cancelled')}
                              title="Cancel Session"
                              className="p-1.5 hover:bg-rose-50 text-outline hover:text-rose-700 hover:border-rose-200 border border-transparent rounded transition-all cursor-pointer"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        {b.status === 'Cancelled' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Confirmed')}
                            title="Re-confirm"
                            className="p-1.5 hover:bg-amber-50 text-outline hover:text-amber-700 hover:border-amber-200 border border-transparent rounded transition-all cursor-pointer"
                          >
                            <Clock size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteBooking(b.id)}
                          title="Remove Entry"
                          className="p-1.5 hover:bg-rose-100 hover:text-error text-outline hover:border-rose-300 border border-transparent rounded transition-all cursor-pointer ml-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Local Table Footer Pagination */}
        {filteredBookings.length > 0 && (
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex items-center justify-between">
            <p className="text-xs font-medium text-on-surface-variant">
              Showing <span className="font-bold">{Math.min(filteredBookings.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredBookings.length, currentPage * itemsPerPage)}</span> of <span className="font-bold">{filteredBookings.length}</span> bookings
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded border border-outline-variant hover:bg-surface-container disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded border border-outline-variant hover:bg-surface-container disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
