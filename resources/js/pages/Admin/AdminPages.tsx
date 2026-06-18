import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarCheck, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  HelpCircle, 
  Sparkles,
  Download,
  X,
  User,
  Mail,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import { SidebarTab, WeeklySchedule, BookingWindow, HolidayOverride, DailySlots, BookingTwo } from '@/types';
import { 
  INITIAL_WEEKLY_SCHEDULE, 
  INITIAL_BOOKING_WINDOW, 
  INITIAL_HOLIDAY_OVERRIDES, 
  INITIAL_DAILY_SLOTS, 
  INITIAL_BOOKINGS 
} from '@/data/initial-data-two';

// Subcomponents imports
import DashboardView from '@/components/Admin/AdminOne/DashboardView';
import BookingsView from '@/components/Admin/AdminOne/BookingsView';
import AvailabilityView from '@/components/Admin/AdminOne/AvailabilityView';
import SettingsView from '@/components/Admin/AdminOne/SettingsView';

export default function App() {
  // 1. Sidebar Tab Navigation State
  const [currentTab, setCurrentTab] = useState<SidebarTab>('Availability');

  // 2. State & localStorage synchronization
  const [weeklySchedule, setWeeklyScheduleState] = useState<WeeklySchedule>(() => {
    const saved = localStorage.getItem('slotem_weekly_schedule');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_SCHEDULE;
  });

  const [bookingWindow, setBookingWindowState] = useState<BookingWindow>(() => {
    const saved = localStorage.getItem('slotem_booking_window');
    return saved ? JSON.parse(saved) as BookingWindow : INITIAL_BOOKING_WINDOW;
  });

  const [holidays, setHolidaysState] = useState<HolidayOverride[]>(() => {
    const saved = localStorage.getItem('slotem_holidays');
    return saved ? JSON.parse(saved) : INITIAL_HOLIDAY_OVERRIDES;
  });

  const [dailySlots, setDailySlotsState] = useState<DailySlots>(() => {
    const saved = localStorage.getItem('slotem_daily_slots');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_SLOTS;
  });

  const [bookings, setBookingsState] = useState<BookingTwo[]>(() => {
      const saved = localStorage.getItem('slotem_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // State persist triggers
  const setWeeklySchedule = (sched: WeeklySchedule) => {
    setWeeklyScheduleState(sched);
    localStorage.setItem('slotem_weekly_schedule', JSON.stringify(sched));
  };

  const setBookingWindow = (win: BookingWindow) => {
    setBookingWindowState(win);
    localStorage.setItem('slotem_booking_window', win);
  };

  const setHolidays = (hols: HolidayOverride[]) => {
    setHolidaysState(hols);
    localStorage.setItem('slotem_holidays', JSON.stringify(hols));
  };

  const setDailySlots = (slots: DailySlots) => {
    setDailySlotsState(slots);
    localStorage.setItem('slotem_daily_slots', JSON.stringify(slots));
  };

  const setBookings = (bks: BookingTwo[]) => {
      setBookingsState(bks);
      localStorage.setItem('slotem_bookings', JSON.stringify(bks));
  };

  // 3. Modals and Notifications states
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Floating Toast function helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        setIsToastVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible]);

  // Save All changes micro-interactions
  const handleSaveAllChanges = () => {
    setIsSavingAll(true);
    setTimeout(() => {
      setIsSavingAll(false);
      triggerToast('All customized parameters, overrides, and calendar rules synchronized to Slotem backend successfully!');
    }, 1200);
  };

  // Export current rules as JSON file download
  const handleExportRules = () => {
    const ruleSet = {
      weeklySchedule,
      bookingWindow,
      holidaysCount: holidays.length,
      holidays,
      slotsExported: Object.keys(dailySlots).length,
      dailySlots
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ruleSet, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `slotem_availability_rules.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerToast('JSON Availability Schema exported successfully.');
  };

  // Add individual Holiday Override 
  const handleAddHoliday = (override: HolidayOverride) => {
    setHolidays([...holidays, override]);
  };

  // Delete Holiday Override
  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  // Update Daily Slots representation
  const handleUpdateDailySlots = (dateStr: string, slots: string[]) => {
    setDailySlots({
      ...dailySlots,
      [dateStr]: slots
    });
  };

  // Bulk generator for standard 90 days allocation
  const handleBulkGenerate = (bufferMinutes: number) => {
    // Generate dates starting today up to window selection limits
    const generated: DailySlots = { ...dailySlots };
    const today = new Date();
    
    // Default hours based on Mon-Fri setup
    const defaultHoursList = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    // Generate for next 90 days
    for (let i = 0; i < 90; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const isSat = targetDate.getDay() === 6;
      const isSun = targetDate.getDay() === 0;

      // Skip is Saturday/Sunday disabled
      if (isSat && !weeklySchedule.saturdayEnabled) continue;
      if (isSun && !weeklySchedule.sundayEnabled) continue;

      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const dStr = `${yyyy}-${mm}-${dd}`;

      // Check if it's already masked by blocked holiday
      const isBlocked = holidays.some(h => {
        const hStart = new Date(h.startDate);
        const hEnd = new Date(h.endDate);
        hStart.setHours(0,0,0,0);
        hEnd.setHours(0,0,0,0);
        const tDate = new Date(targetDate);
        tDate.setHours(0,0,0,0);
        return tDate >= hStart && tDate <= hEnd && h.type === 'Blocked';
      });

      if (!isBlocked) {
        generated[dStr] = defaultHoursList;
      }
    }

    setDailySlots(generated);
  };

  // Approve pending Booking
  const handleApproveBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'Confirmed' as const } : b);
    setBookings(updated);
    triggerToast('Appointment verified and marked active.');
  };

  // Cancel Booking
  const handleCancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' as const } : b);
    setBookings(updated);
    triggerToast('Appointment cancelled successfully.');
  };

  // Delete Booking
  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    triggerToast('Booking logs record deleted.');
  };

  // --- NEW APPOINTMENT FORM STATES ---
  const [newBClientName, setNewBClientName] = useState('');
  const [newBClientEmail, setNewBClientEmail] = useState('');
  const [newBDate, setNewBDate] = useState('2024-09-06'); // Match mock focus
  const [newBTime, setNewBTime] = useState('');
  const [newBService, setNewBService] = useState('Technical Strategy Consultation');

  // Compute available slots dynamically for selected Booking creation date
  const getFreeSlotsForBookingDate = (dateStr: string) => {
    // Look up custom configured slots
    const dayConfig = dailySlots[dateStr] || [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];
    // Filter out already booked hours
    const alreadyBookedTimes = bookings
      .filter(b => b.date === dateStr && b.status !== 'Cancelled')
      .map(b => b.time);

    return dayConfig.filter(time => !alreadyBookedTimes.includes(time));
  };

  const currentAvailableBookingTimes = getFreeSlotsForBookingDate(newBDate);

  // Auto-set the first available slot when date changes
  useEffect(() => {
    if (currentAvailableBookingTimes.length > 0) {
      setNewBTime(currentAvailableBookingTimes[0]);
    } else {
      setNewBTime('');
    }
  }, [newBDate, dailySlots, bookings]);

  const handleSaveNewBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!newBClientName.trim() || !newBClientEmail.trim() || !newBTime) {
      triggerToast('Please provide valid details and choose an available time slot.');
      return;
    }

    const newBookingItem: BookingTwo = {
      id: 'b_' + Date.now(),
      clientName: newBClientName,
      clientEmail: newBClientEmail,
      date: newBDate,
      time: newBTime,
      serviceName: newBService,
      status: 'Confirmed'
    };

    setBookings([newBookingItem, ...bookings]);
    setIsNewBookingModalOpen(false);

    // Reset fields
    setNewBClientName('');
    setNewBClientEmail('');
    
    triggerToast(`Success: Custom appointment booked for ${newBookingItem.clientName} on ${newBookingItem.date}.`);
  };

  // Global search simulated trigger
  const handleGlobalSearchFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGlobalSearchTerm(val);
    if (val !== '' && currentTab !== 'Bookings') {
      // Redirect to Bookings Register to show filter outcomes automatically! Focus and smart UX
      setCurrentTab('Bookings');
    }
  };

  return (
    <div id="slotem-admin-root" className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row antialiased">
      
      {/* Side Navigation Anchor Drawer */}
      <aside className="w-full md:w-64 flex flex-col bg-white border-b md:border-r border-outline-variant py-8 px-0 flex-shrink-0 relative z-30">
        
        {/* Brand Header */}
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            Slotem
          </h2>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">
            Admin Suite
          </p>
        </div>

        {/* Dynamic Navigation Options */}
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setCurrentTab('Dashboard')}
            className={`w-full flex items-center px-6 py-3.5 text-xs font-bold transition-all border-r-4 text-left cursor-pointer ${
              currentTab === 'Dashboard' 
                ? 'bg-surface-container-low border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:bg-surface-container/30 hover:text-on-surface'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>

          <button 
            onClick={() => setCurrentTab('Bookings')}
            className={`w-full flex items-center px-6 py-3.5 text-xs font-bold transition-all border-r-4 text-left cursor-pointer ${
              currentTab === 'Bookings' 
                ? 'bg-surface-container-low border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:bg-surface-container/30 hover:text-on-surface'
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Bookings
          </button>

          <button 
            onClick={() => setCurrentTab('Availability')}
            className={`w-full flex items-center px-6 py-3.5 text-xs font-bold transition-all border-r-4 text-left cursor-pointer ${
              currentTab === 'Availability' 
                ? 'bg-surface-container-low border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:bg-surface-container/30 hover:text-on-surface'
            }`}
          >
            <CalendarCheck className="w-5 h-5 mr-3" />
            Availability
          </button>

          <button 
            onClick={() => setCurrentTab('Settings')}
            className={`w-full flex items-center px-6 py-3.5 text-xs font-bold transition-all border-r-4 text-left cursor-pointer ${
              currentTab === 'Settings' 
                ? 'bg-surface-container-low border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:bg-surface-container/30 hover:text-on-surface'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>

        {/* "New Booking" Bottom Button Option */}
        <div className="px-6 mt-6 md:mt-auto pt-6 border-t border-outline-variant/35">
          <button 
            onClick={() => setIsNewBookingModalOpen(true)}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>

      </aside>

      {/* Main Core View Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER COMPONENT */}
        <header className="h-16 px-6 md:px-8 border-b border-outline-variant bg-white flex items-center justify-between sticky top-0 z-20">
          
          {/* Quick Filter Search Box */}
          <div className="relative w-80 max-w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-on-surface-variant/70" />
            <input 
              type="text" 
              placeholder="Search bookings or availability..."
              value={globalSearchTerm}
              onChange={handleGlobalSearchFilter}
              className="w-full pl-9 pr-4 py-1.5 border-none focus:ring-0 text-xs text-on-surface font-medium bg-surface-container hover:bg-surface-container-low transition-colors rounded-full"
            />
          </div>

          {/* User actions and Profile icon */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => triggerToast('Status log checker: No new notification reports.')}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95 hover:bg-gray-55 rounded-lg cursor-pointer"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => triggerToast('Open Slotem detailed Admin Docs guidelines.')}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95 hover:bg-gray-55 rounded-lg cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            
            {/* Horizontal partition separator */}
            <span className="w-px h-6 bg-outline-variant" />

            <div className="flex items-center gap-2.5">
              <span className="hidden sm:block text-right">
                <p className="text-xs font-bold text-on-surface">Etang Dgm</p>
                <p className="text-[9px] font-semibold text-on-surface-variant">etangdgm001@gmail.com</p>
              </span>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant shadow-xs">
                <img 
                  alt="Slotem Admin Profile Avatar"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADe6djAW235rzQlXuktm4TJHzkfTDsZYhkzNzmKhyNx1KupqNUAi8IkZ9qB5yZzgwEa1VMnbMa6ne9RRjbj30XPsxRl0HlWK_8GkE8U2pnaQHdWZefXWYBY-VspLXImS7MROozqONL4sqwvxKa_1Ox49mjh2R_G6K7-ER7yc0_AUGRqulJC6Oc5bmh29C9XdiEq4aRDNu__ITYvMMUguoIxtEGkcxeMiH_RjCCKlYoOeO5Cu4XIUM2xLolwgqVptSA-I5mLhmgsao"
                />
              </div>
            </div>
          </div>

        </header>

        {/* INNER CORE DENSE WORKSPACE */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar max-w-7xl w-full mx-auto space-y-gutter">
          
          {/* Dashboard Header banner action row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/15 pb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                {currentTab === 'Dashboard' && 'Slotem Analytics'}
                {currentTab === 'Bookings' && 'Bookings Database'}
                {currentTab === 'Availability' && 'Availability Management'}
                {currentTab === 'Settings' && 'Configuration Suite'}
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                {currentTab === 'Dashboard' && 'View reservation growth patterns, capacity logs, and service occupancy statistics.'}
                {currentTab === 'Bookings' && 'Scan, reject, cancel, or manually add general customer reservations.'}
                {currentTab === 'Availability' && 'Configure active booking rules, weekly schedule routines, overrides and time slot generating constraints.'}
                {currentTab === 'Settings' && 'Set custom communications rules, system preferences, notification triggers, and sync modules.'}
              </p>
            </div>

            {/* Sync Save All & Export rule controls (rendered on headers matching the mockup layout) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button 
                onClick={handleExportRules}
                className="px-4 py-2 border border-outline hover:bg-surface-container-low transition-colors rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1.5 cursor-pointer bg-white"
              >
                <Download className="w-3.5 h-3.5" /> Export Rules
              </button>
              
              <button 
                onClick={handleSaveAllChanges}
                disabled={isSavingAll}
                className="px-4 py-2 bg-primary hover:bg-primary-container disabled:bg-primary/75 text-on-primary transition-all rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer min-w-[124px] justify-center"
              >
                {isSavingAll ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synchronizing...
                  </>
                ) : (
                  'Save All Changes'
                )}
              </button>
            </div>
          </div>

          {/* DYNAMIC INNER SCREEN INTERFACE MOUNTER */}
          <div className="min-h-[460px] relative">
            {currentTab === 'Dashboard' && (
              <DashboardView 
                bookings={bookings} 
                holidays={holidays}
                dailySlots={dailySlots}
                setCurrentTab={setCurrentTab}
                onNewBookingClick={() => setIsNewBookingModalOpen(true)}
              />
            )}

            {currentTab === 'Bookings' && (
              <BookingsView 
                bookings={bookings}
                onApproveBooking={handleApproveBooking}
                onCancelBooking={handleCancelBooking}
                onDeleteBooking={handleDeleteBooking}
                onNewBookingClick={() => setIsNewBookingModalOpen(true)}
              />
            )}

            {currentTab === 'Availability' && (
              <AvailabilityView 
                weeklySchedule={weeklySchedule}
                onSetWeeklySchedule={setWeeklySchedule}
                bookingWindow={bookingWindow}
                onSetBookingWindow={setBookingWindow}
                holidays={holidays}
                onAddHoliday={handleAddHoliday}
                onDeleteHoliday={handleDeleteHoliday}
                dailySlots={dailySlots}
                onUpdateDailySlots={handleUpdateDailySlots}
                onBulkGenerate={handleBulkGenerate}
                showToast={triggerToast}
              />
            )}

            {currentTab === 'Settings' && (
              <SettingsView 
                userEmail="etangdgm001@gmail.com"
                showToast={triggerToast}
              />
            )}
          </div>

        </main>
      </div>

      {/* FLOAT CUSTOM NOTIFICATION SUCCESS TOAST */}
      <div 
        id="toast-notifier"
        className={`fixed bottom-6 right-6 z-55 flex items-center gap-3 bg-neutral-900 border border-neutral-800 text-white px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 transform max-w-sm ${
          isToastVisible 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-xs font-semibold leading-relaxed text-neutral-100">
          {toastMessage || 'All scheduling preferences updated successfully.'}
        </p>
      </div>

      {/* GLOBAL MODAL COMPONENT: CREATE GENERAL BOOKING */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-outline-variant max-w-md w-full rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            
            {/* Modal Title bar */}
            <div className="flex justify-between items-center pb-2.5 border-b border-outline-variant/35">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-on-surface text-base">Make a New Reservation</h3>
              </div>
              <button 
                onClick={() => setIsNewBookingModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Entry Form */}
            <form onSubmit={handleSaveNewBooking} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Client Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/70" />
                    <input 
                      type="text" 
                      placeholder="e.g. Liam Parker"
                      value={newBClientName}
                      onChange={(e) => setNewBClientName(e.target.value)}
                      required
                      className="w-full pl-9 text-xs font-semibold border border-outline-variant p-2.5 rounded-lg focus:border-primary focus:ring-1 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/70" />
                    <input 
                      type="email" 
                      placeholder="e.g. liam@domain.com"
                      value={newBClientEmail}
                      onChange={(e) => setNewBClientEmail(e.target.value)}
                      required
                      className="w-full pl-9 text-xs font-semibold font-mono border border-outline-variant p-2.5 rounded-lg focus:border-primary focus:ring-1 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Select Advisory Service</label>
                <div className="relative">
                  <FileSpreadsheet className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/70" />
                  <select
                    value={newBService}
                    onChange={(e) => setNewBService(e.target.value)}
                    className="w-full pl-9 text-xs font-semibold border border-outline-variant p-2.5 rounded-lg focus:border-primary focus:ring-1 bg-white cursor-pointer"
                  >
                    <option value="Technical Strategy Consultation">Technical Strategy Consultation (60m)</option>
                    <option value="Product Architecture Review">Product Architecture Review (60m)</option>
                    <option value="UX/UI Design & Audit">UX/UI Design & Audit (60m)</option>
                    <option value="General Consultation">General Consultation (30m)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Appointment Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant/70" />
                    <input 
                      type="date"
                      value={newBDate}
                      onChange={(e) => setNewBDate(e.target.value)}
                      required
                      className="w-full pl-9 text-xs font-mono font-semibold border border-outline-variant p-2.5 rounded-lg focus:border-primary focus:ring-1 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Select Free Time Slot</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant/70" />
                    {currentAvailableBookingTimes.length === 0 ? (
                      <span className="w-full block bg-red-50 text-error border border-red-200 rounded-lg p-2.5 text-xs font-bold">
                        No slots available
                      </span>
                    ) : (
                      <select
                        value={newBTime}
                        onChange={(e) => setNewBTime(e.target.value)}
                        required
                        className="w-full pl-9 text-xs font-mono font-semibold border border-outline-variant p-2.5 rounded-lg focus:border-primary focus:ring-1 bg-white cursor-pointer"
                      >
                        {currentAvailableBookingTimes.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button 
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-on-surface-variant font-semibold text-xs rounded-lg transition-transform cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={currentAvailableBookingTimes.length === 0}
                  className="px-5 py-2 bg-primary hover:bg-primary-container disabled:bg-primary/50 text-white font-bold text-xs rounded-lg active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  Confirm Appointment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
