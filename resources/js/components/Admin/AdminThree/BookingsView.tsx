/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  CreditCard, 
  Calendar as CalendarIcon, 
  Clock, 
  Mail, 
  User, 
  AlertCircle,
  Plus,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { BookingFour, BookingStatusFour } from '@/types';

interface BookingsViewProps {
    bookings: BookingFour[];
    onUpdateBookingStatus: (id: string, newStatus: BookingStatusFour) => void;
    onUpdateBookingAmount: (id: string, newAmount: number) => void;
    onDeleteBooking: (id: string) => void;
    onOpenNewBooking: () => void;
}

export default function BookingsView({
  bookings,
  onUpdateBookingStatus,
  onUpdateBookingAmount,
  onDeleteBooking,
  onOpenNewBooking
}: BookingsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatusFour>(
      'All',
  );
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(bookings[0]?.id || null);
  
  // Interactive editing states inside detail panel
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Derived filtered & sorted list
  const filteredBookings = useMemo(() => {
    return bookings
      .filter(bk => {
        const matchesSearch = 
          bk.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bk.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bk.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bk.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || bk.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        
        // Date sorting fallback parser
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        if (sortBy === 'date-asc') return dateA - dateB;
        return dateB - dateA;
      });
  }, [bookings, searchTerm, statusFilter, sortBy]);

  // Handle active details
  const activeBooking = useMemo(() => {
    const found = bookings.find(b => b.id === selectedBookingId);
    if (found) return found;
    return filteredBookings[0] || null;
  }, [bookings, selectedBookingId, filteredBookings]);

  const handleStartEditingPrice = (currentPrice: number) => {
    setTempPrice(currentPrice);
    setIsEditingPrice(true);
  };

  const handleSavePrice = (id: string) => {
    onUpdateBookingAmount(id, tempPrice);
    setIsEditingPrice(false);
  };

  return (
    <div id="bookings_view" className="space-y-6 animate-in fade-in duration-300 text-left">
      
      {/* Header Controls Banner */}
      <section className="bg-white border border-[#ccc3d8]/40 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        
        {/* Search Input bar */}
        <div id="search_bookings_bar" className="flex items-center bg-[#f3ebfa] rounded-xl px-3.5 py-2.5 w-full md:max-w-md border border-[#ccc3d8]/25">
          <Search className="w-4 h-4 text-[#4a4455]/70 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search booking codes, services, or customer details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#4a4455]/50 focus:ring-0 text-[#1d1a24]"
          />
        </div>

        {/* Filter Toolbar Group */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#ccc3d8] rounded-xl px-3 py-2 text-xs font-semibold text-[#4a4455]">
            <Filter className="w-3.5 h-3.5 text-[#630ed4]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent border-none outline-none focus:ring-0 p-0 text-xs font-semibold text-[#4a4455] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Cancelled">Cancelled Only</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#ccc3d8] rounded-xl px-3 py-2 text-xs font-semibold text-[#4a4455]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#630ed4]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-none focus:ring-0 p-0 text-xs font-semibold text-[#4a4455] cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High-Low</option>
              <option value="amount-asc">Amount: Low-High</option>
            </select>
          </div>

          <button
            onClick={onOpenNewBooking}
            className="bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Book Session
          </button>
        </div>

      </section>

      {/* Main Database Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Bookings List Panel (Col span 3) */}
        <div className="col-span-1 lg:col-span-3 bg-white border border-[#ccc3d8]/40 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#ccc3d8]/30 flex justify-between items-center bg-[#fef7ff]/40">
              <span className="text-xs font-bold text-[#25005a] uppercase tracking-wider">
                Booking Database ({filteredBookings.length} records)
              </span>
            </div>

            <div className="divide-y divide-[#ccc3d8]/20 overflow-y-auto max-h-[580px] custom-scrollbar">
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                  <AlertCircle className="w-10 h-10 mb-2.5 text-[#4a4455]/40" />
                  <p className="font-semibold text-sm">No bookings matched this filter</p>
                  <p className="text-xs text-[#4a4455]/70 mt-1">Try modifying your query or filter configurations.</p>
                </div>
              ) : (
                filteredBookings.map((bk) => {
                  const isSelected = bk.id === activeBooking?.id;
                  return (
                    <div
                      key={bk.id}
                      onClick={() => {
                        setSelectedBookingId(bk.id);
                        setIsEditingPrice(false);
                      }}
                      className={`p-4 transition-all duration-150 cursor-pointer text-left border-l-4 ${
                        isSelected 
                          ? 'bg-[#f3ebfa]/45 border-[#630ed4]' 
                          : 'border-transparent hover:bg-neutral-50/70'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-[#1d1a24]">{bk.service}</h4>
                          <span className="font-mono text-[10px] text-gray-500">{bk.ref}</span>
                        </div>
                        <span className="text-sm font-bold text-[#630ed4]">${bk.amount.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-[#4a4455]/70">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#4a4455]/60" />
                            {bk.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#4a4455]/60" />
                            {String(bk.timeSlot).split(' - ')[0]}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                          bk.status === 'Confirmed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : bk.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {bk.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-[#f9f1ff] p-4 text-center border-t border-gray-100">
            <p className="text-[11px] text-[#4a4455]/60">
              Double-click any card to view rapid administrator controls on the sidebar inspector.
            </p>
          </div>
        </div>

        {/* Selected Booking Inspector Panel (Col span 2) */}
        <div className="col-span-1 lg:col-span-2 bg-[#fef7ff]/40 border border-[#ccc3d8]/40 rounded-2xl p-5 shadow-sm h-fit">
          {activeBooking ? (
            <div className="space-y-5">
              
              {/* Header Info */}
              <div className="border-b border-[#ccc3d8]/30 pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-gray-500 font-bold uppercase">
                    Slot Inspector {activeBooking.ref}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    activeBooking.status === 'Confirmed' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : activeBooking.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {activeBooking.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#25005a]">{activeBooking.service}</h3>
              </div>

              {/* Info checklist */}
              <div className="space-y-3.5">
                
                {/* Client detail */}
                <div className="bg-white p-3.5 rounded-xl border border-[#ccc3d8]/20 shadow-xs space-y-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Customer Account
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#eaddff] text-[#630ed4] text-xs font-bold flex items-center justify-center shrink-0">
                      {activeBooking.customerName[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1d1a24]">{activeBooking.customerName}</h4>
                      <p className="text-[11px] text-[#4a4455]/70 truncate selection:bg-purple-100">{activeBooking.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-white p-3.5 rounded-xl border border-[#ccc3d8]/20 shadow-xs space-y-3 text-xs">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Logistics & timing
                  </span>

                  <div className="flex items-center gap-2 text-neutral-700">
                    <CalendarIcon className="w-4 h-4 text-[#630ed4]" />
                    <div>
                      <p className="font-semibold">{activeBooking.date}</p>
                      <p className="text-[10px] text-gray-400">Scheduled Date</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-700 pt-1">
                    <Clock className="w-4 h-4 text-[#630ed4]" />
                    <div>
                      <p className="font-semibold">{activeBooking.timeSlot}</p>
                      <p className="text-[10px] text-gray-400">Reserved Interval</p>
                    </div>
                  </div>
                </div>

                {/* Direct Price Edit block */}
                <div className="bg-white p-3.5 rounded-xl border border-[#ccc3d8]/20 shadow-xs space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Financial Quote
                    </span>
                    {!isEditingPrice && (
                      <button 
                        onClick={() => handleStartEditingPrice(activeBooking.amount)}
                        className="text-[#630ed4] hover:underline flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Adjust
                      </button>
                    )}
                  </div>

                  {isEditingPrice ? (
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-grow">
                        <span className="absolute left-2.5 top-2 text-gray-400 text-xs">$</span>
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-1.5 border border-purple-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-[#630ed4] focus:border-[#630ed4]"
                        />
                      </div>
                      <button
                        onClick={() => handleSavePrice(activeBooking.id)}
                        className="bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingPrice(false)}
                        className="border border-neutral-300 text-neutral-500 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <p className="text-lg font-extrabold text-[#630ed4]">
                      ${activeBooking.amount.toFixed(2)}
                      <span className="text-[10px] text-gray-400 font-normal ml-1">USD billed</span>
                    </p>
                  )}
                </div>

                {/* Remarks note */}
                <div className="bg-white p-3.5 rounded-xl border border-[#ccc3d8]/20 shadow-xs space-y-1">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Remarks Notes
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed italic max-h-24 overflow-y-auto">
                    {activeBooking.notes || "No extra requirements logged by client."}
                  </p>
                </div>

              </div>

              {/* Status workflow togglers */}
              <div className="pt-3 border-t border-[#ccc3d8]/30">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Update Booking status
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateBookingStatus(activeBooking.id, 'Confirmed')}
                    className={`py-2 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                      activeBooking.status === 'Confirmed'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white border border-[#ccc3d8] hover:bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onUpdateBookingStatus(activeBooking.id, 'Pending')}
                    className={`py-2 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                      activeBooking.status === 'Pending'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white border border-[#ccc3d8] hover:bg-amber-50 text-amber-700'
                    }`}
                  >
                    Pend
                  </button>
                  <button
                    onClick={() => onUpdateBookingStatus(activeBooking.id, 'Cancelled')}
                    className={`py-2 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                      activeBooking.status === 'Cancelled'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white border border-[#ccc3d8] hover:bg-rose-50 text-rose-700'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Delete action wrapper */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to permanently delete this booking slot?")) {
                      onDeleteBooking(activeBooking.id);
                    }
                  }}
                  className="w-full py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#ba1a1a]/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Session Record</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm font-semibold">No booking selected</p>
              <p className="text-xs mt-1 text-[#4a4455]/70">Add custom slots to make queries live.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
