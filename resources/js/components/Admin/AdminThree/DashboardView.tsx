/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Calendar as CalendarIcon, 
  Award, 
  MapPin, 
  ArrowRight, 
  MoreVertical,
  Check,
  X,
  RotateCcw,
  Sparkles,
  UserCheck,
  CreditCard,
  User,
  Info
} from 'lucide-react';
import { CustomerProfile, BookingFour, ActivityLog } from '@/types';

interface DashboardViewProps {
    profile: CustomerProfile;
    bookings: BookingFour[];
    logs: ActivityLog[];
    onOpenEditProfile: () => void;
    onSetTab: (tab: string) => void;
    onUpdateBookingStatus: (
        id: string,
        newStatus: 'Confirmed' | 'Pending' | 'Cancelled',
    ) => void;
    onClearLogs: () => void;
    onAddLog: (
        type: 'rescheduled' | 'payment' | 'profile' | 'email' | 'system',
        title: string,
        subtitle: string,
    ) => void;
}

export default function DashboardView({
  profile,
  bookings,
  logs,
  onOpenEditProfile,
  onSetTab,
  onUpdateBookingStatus,
  onClearLogs,
  onAddLog
}: DashboardViewProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] =
      useState<BookingFour | null>(null);

  // Derive stats dynamically from current master list for responsive updates!
  const completedCount = bookings.filter(b => b.status === 'Confirmed').length + 38; // Initial layout had 42
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length; // Initial had 3
  const upcomingCount = bookings.filter(b => b.status === 'Pending').length + 6; // Initial had 8

  const handleToggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleStatusChange = (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled', serviceName: string) => {
    onUpdateBookingStatus(id, status);
    setActiveMenuId(null);
    onAddLog(
      status === 'Cancelled' ? 'system' : status === 'Confirmed' ? 'payment' : 'rescheduled',
      `Status: ${status}`,
      `"${serviceName}" has been set to ${status}.`
    );
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'rescheduled': return <CalendarIcon className="w-4 h-4 text-purple-600" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-amber-600" />;
      case 'profile': return <UserCheck className="w-4 h-4 text-indigo-600" />;
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      default: return <Info className="w-4 h-4 text-[#4a4455]" />;
    }
  };

  const getLogBg = (type: string) => {
    switch (type) {
      case 'rescheduled': return 'bg-purple-100/70 text-purple-700';
      case 'payment': return 'bg-amber-100/70 text-amber-800';
      case 'profile': return 'bg-indigo-100/70 text-indigo-800';
      case 'email': return 'bg-blue-100/70 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div id="dashboard_view" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Section: Customer Profile Info */}
      <section className="bg-white border border-[#ccc3d8]/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-4 right-4">
          <button 
            id="edit_profile_btn"
            onClick={onOpenEditProfile}
            className="bg-[#f3ebfa] hover:bg-[#eaddff] text-[#630ed4] font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer hover:shadow active:scale-95"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Avatar with live indicator */}
        <div className="relative">
          <img 
            alt="Customer Profile" 
            className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover bg-[#f3ebfa]" 
            src={profile.avatar}
          />
          {profile.active && (
            <div 
              className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" 
              title="Active Status"
            ></div>
          )}
        </div>

        {/* Profile meta info */}
        <div className="text-center md:text-left pt-2 flex-grow">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
            <h2 className="text-2xl font-bold text-[#1d1a24] tracking-tight">{profile.name}</h2>
            <span className="bg-[#eaddff] text-[#5a00c6] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
              Client Profile
            </span>
          </div>

          <p className="text-sm text-[#4a4455] flex items-center justify-center md:justify-start gap-1.5 mb-4 selection:bg-[#eaddff]">
            <Mail className="w-4 h-4 text-[#630ed4]" />
            <span>{profile.email}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="bg-[#f3ebfa] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs border border-[#ccc3d8]/20">
              <CalendarIcon className="w-4 h-4 text-[#630ed4]" />
              <span className="text-xs font-semibold text-[#4a4455]/95">Joined {profile.joinedDate}</span>
            </div>
            
            <div className="bg-[#f3ebfa] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs border border-[#ccc3d8]/20">
              <Award className="w-4 h-4 text-[#630ed4]" />
              <span className="text-xs font-semibold text-[#4a4455]/95">{profile.tier}</span>
            </div>
            
            <div className="bg-[#f3ebfa] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs border border-[#ccc3d8]/20">
              <MapPin className="w-4 h-4 text-[#630ed4]" />
              <span className="text-xs font-semibold text-[#4a4455]/95">{profile.city}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Section: Stat Cards (Bento Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" id="bento_stats_grid">
        {/* Completed card */}
        <div className="bg-white border border-[#ccc3d8]/40 p-5 rounded-2xl group hover:border-[#630ed4] transition-all duration-300 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </span>
            <span className="bg-emerald-500/10 text-emerald-700 font-semibold text-[11px] px-2 py-0.5 rounded-full">
              +12% vs last month
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#4a4455]/70 uppercase tracking-widest mb-0.5">Completed Bookings</p>
          <h3 className="text-3xl font-extrabold text-[#1d1a24]">{completedCount}</h3>
          
          <div className="absolute -right-2 -bottom-2 opacity-5 text-emerald-500 pointer-events-none group-hover:scale-110 transition-transform">
            <CheckCircle className="w-24 h-24" />
          </div>
        </div>

        {/* Cancelled card */}
        <div className="bg-white border border-[#ccc3d8]/40 p-5 rounded-2xl group hover:border-[#630ed4] transition-all duration-300 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </span>
            <span className="bg-rose-500/10 text-rose-700 font-semibold text-[11px] px-2 py-0.5 rounded-full">
              -2% improvement
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#4a4455]/70 uppercase tracking-widest mb-0.5">Cancelled</p>
          <h3 className="text-3xl font-extrabold text-[#1d1a24]">{cancelledCount}</h3>
          
          <div className="absolute -right-2 -bottom-2 opacity-5 text-rose-500 pointer-events-none group-hover:scale-110 transition-transform">
            <XCircle className="w-24 h-24" />
          </div>
        </div>

        {/* Upcoming card */}
        <div className="bg-white border border-[#ccc3d8]/40 p-5 rounded-2xl group hover:border-[#630ed4] transition-all duration-300 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2.5 bg-[#f3ebfa] text-[#630ed4] rounded-xl">
              <Clock className="w-5 h-5" />
            </span>
            <div className="flex -space-x-2">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS4hUTLFx0E6J98uzd04i3YX6UOkhedlYUCmPnbrvti24Ue_CL6ri6q8vvcD63qahKE-7K_01ONMTOkm7IPXtgdV-TEaq37JuFM-5sjMu1ZaVI1rzD_8U8PNnuBFrixHoY11-QO-v2o22VH5iCzzuqXgzXh8ziXm5jJpj3gYs7mJICzXvnr61i7sCB6Q1do1IsZEgg-ruxOHu7mP4fkgIIXgkTMq0CfMnHZc29JZ51XanpLw0JXNLLrR0XIr2A_YvkkkTl4TVWVbs" className="w-5.5 h-5.5 rounded-full border border-white" alt="avatar" />
              <div className="w-5.5 h-5.5 rounded-full bg-[#eaddff] border border-white text-[8px] font-semibold text-[#630ed4] flex items-center justify-center">
                +4
              </div>
            </div>
          </div>
          <p className="text-[11px] font-bold text-[#4a4455]/70 uppercase tracking-widest mb-0.5">Upcoming Slots</p>
          <h3 className="text-3xl font-extrabold text-[#1d1a24]">{upcomingCount}</h3>
          
          <div className="absolute -right-2 -bottom-2 opacity-5 text-[#630ed4] pointer-events-none group-hover:scale-110 transition-transform">
            <Clock className="w-24 h-24" />
          </div>
        </div>
      </section>

      {/* Bottom Section: Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booking History Table */}
        <div className="lg:col-span-2 bg-white border border-[#ccc3d8]/40 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="px-6 py-4.5 border-b border-[#ccc3d8]/30 flex justify-between items-center bg-[#fef7ff]/50">
              <h3 className="font-semibold text-base text-[#25005a]">Booking History</h3>
              <button 
                onClick={() => onSetTab('bookings')}
                className="text-[#630ed4] font-semibold text-xs flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9f1ff] border-b border-[#ccc3d8]/25">
                    <th className="px-6 py-3 text-xs font-bold text-[#4a4455]/85 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#4a4455]/85 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#4a4455]/85 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#4a4455]/85 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#4a4455]/85 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ccc3d8]/20">
                  {bookings.slice(0, 5).map((bk) => (
                    <tr 
                      key={bk.id} 
                      className="hover:bg-[#fef7ff]/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedBookingForDetails(bk)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-[#1d1a24]">{bk.service}</p>
                        <p className="text-[10px] font-mono text-[#4a4455]/60 mt-0.5">{bk.ref}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#1d1a24]/90 whitespace-nowrap">
                        {bk.date}
                        <span className="block text-[9px] text-[#4a4455]/60 mt-0.5">{bk.timeSlot?.split(' - ')[0]}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#1d1a24]">
                        ${bk.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          bk.status === 'Confirmed' 
                            ? 'bg-emerald-100/80 text-emerald-800' 
                            : bk.status === 'Pending'
                            ? 'bg-amber-100/80 text-amber-800'
                            : 'bg-rose-100/80 text-rose-800'
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={(e) => handleToggleMenu(bk.id, e)}
                            className="p-1 rounded-full text-[#4a4455]/70 hover:bg-[#e8dfee]/50 hover:text-[#630ed4] transition-all cursor-pointer outline-none"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === bk.id && (
                            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-[#ccc3d8]/30 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in duration-100">
                              <div className="py-1">
                                <button
                                  onClick={() => handleStatusChange(bk.id, 'Confirmed', bk.service)}
                                  className="w-full px-3 py-2 text-xs text-left text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5 cursor-pointer font-medium"
                                >
                                  <Check className="w-3.5 h-3.5" /> Confirm Slot
                                </button>
                                <button
                                  onClick={() => handleStatusChange(bk.id, 'Pending', bk.service)}
                                  className="w-full px-3 py-2 text-xs text-left text-amber-700 hover:bg-amber-50 flex items-center gap-1.5 cursor-pointer font-medium"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Set Pending
                                </button>
                                <button
                                  onClick={() => handleStatusChange(bk.id, 'Cancelled', bk.service)}
                                  className="w-full px-3 py-2 text-xs text-left text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer font-medium border-t border-gray-100"
                                >
                                  <X className="w-3.5 h-3.5" /> Cancel Slot
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-[#fef7ff]/20 border-t border-gray-100 text-center">
            <p className="text-[11px] text-[#4a4455]/60">
              Interactive Row Action: Click any row to view complete booking files & remarks.
            </p>
          </div>
        </div>

        {/* Recent Notifications Feed */}
        <div className="bg-white border border-[#ccc3d8]/40 rounded-2xl flex flex-col shadow-sm justify-between">
          <div>
            <div className="px-6 py-4.5 border-b border-[#ccc3d8]/30 bg-[#fef7ff]/50 flex justify-between items-center">
              <h3 className="font-semibold text-base text-[#25005a]">Recent Activity</h3>
              <span className="text-[10px] uppercase font-bold text-[#630ed4] tracking-wider bg-[#eaddff]/50 px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="p-5 space-y-5 flex-grow overflow-y-auto max-h-[380px] custom-scrollbar">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <span className="p-3 bg-gray-50 rounded-full mb-3 text-gray-300">
                    <Info className="w-6 h-6" />
                  </span>
                  <p className="text-sm font-medium text-gray-400">No logs on file</p>
                  <p className="text-xs text-gray-400 mt-1">Actions you trigger will record automatically.</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={log.id} className="flex gap-3.5 relative">
                    {/* Line connection */}
                    {index < logs.length - 1 && (
                      <div className="absolute left-[15px] top-[30px] bottom-[-20px] w-0.5 bg-gray-100"></div>
                    )}
                    
                    {/* Log action icon badge */}
                    <div className={`z-10 p-1.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${getLogBg(log.type)}`}>
                      {getLogIcon(log.type)}
                    </div>
                    
                    <div className="text-left pt-0.5">
                      <p className="text-xs font-bold text-[#1d1a24]">{log.title}</p>
                      <p className="text-xs text-[#4a4455]/85 leading-relaxed mt-0.5">{log.subtitle}</p>
                      <p className="text-[9px] font-bold text-[#4a4455]/50 uppercase mt-1 tracking-wider">{log.timeText}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-[#ccc3d8]/20 bg-[#fef7ff]/10">
            <button 
              onClick={onClearLogs}
              className="w-full py-2 border border-[#ccc3d8] hover:border-[#630ed4] text-[#4a4455] hover:text-[#630ed4] font-semibold text-xs rounded-xl hover:bg-neutral-50 transition-all cursor-pointer active:scale-98"
            >
              Clear All Logs
            </button>
          </div>
        </div>

      </div>

      {/* Booking Detail Modal popup */}
      {selectedBookingForDetails && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs cursor-default"
          onClick={() => setSelectedBookingForDetails(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-[#ccc3d8]/30 max-w-md w-full shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedBookingForDetails(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-[#630ed4] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#630ed4] font-extrabold text-[10px] uppercase tracking-widest pl-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Booking File</span>
            </div>

            <h3 className="text-lg font-bold text-[#1d1a24]">{selectedBookingForDetails.service}</h3>
            <p className="font-mono text-xs text-[#4a4455]/70 mt-0.5 mb-4">Reference: {selectedBookingForDetails.ref}</p>

            <div className="space-y-3 pt-3 border-t border-[#f3ebfa] text-xs">
              <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-gray-50">
                <span className="text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px]">Client Name</span>
                <span className="font-bold text-[#1d1a24]">{selectedBookingForDetails.customerName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-gray-50">
                <span className="text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px]">Email</span>
                <span className="font-medium text-[#1d1a24] truncate" title={selectedBookingForDetails.customerEmail}>
                  {selectedBookingForDetails.customerEmail}
                </span>
              </div>
              {selectedBookingForDetails.phoneNumber && (
                <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-gray-50">
                  <span className="text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px]">Phone Number</span>
                  <span className="font-medium text-[#1d1a24]">{selectedBookingForDetails.phoneNumber}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-gray-50">
                <span className="text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px]">Target Date</span>
                <span className="font-semibold text-[#1d1a24]">{selectedBookingForDetails.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-gray-50">
                <span className="text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px]">Time Slot</span>
                <span className="font-semibold text-[#1d1a24]">{selectedBookingForDetails.timeSlot}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-gray-50">
                <span className="text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px]">Subtotal Value</span>
                <span className="font-bold text-[#630ed4] text-sm">${selectedBookingForDetails.amount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 py-1.5 border-b border-gray-50">
                <span className="text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px]">Workflow Status</span>
                <span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                    selectedBookingForDetails.status === 'Confirmed' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : selectedBookingForDetails.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedBookingForDetails.status}
                  </span>
                </span>
              </div>

              {/* Note details */}
              <div className="pt-2">
                <span className="block text-[#4a4455]/70 font-semibold uppercase tracking-wider text-[10px] mb-1">Administrative Notes</span>
                <p className="p-3 bg-neutral-50 rounded-lg text-neutral-600 leading-relaxed text-[11px] max-h-24 overflow-y-auto italic">
                  {selectedBookingForDetails.notes || "No custom remarks annotated for this slot."}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 flex gap-2 justify-end border-t border-[#f3ebfa]">
              <button 
                onClick={() => setSelectedBookingForDetails(null)}
                className="px-4 py-2 bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-semibold rounded-lg shadow cursor-pointer active:scale-95 transition-all"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
