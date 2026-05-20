import React, { useState, useEffect } from 'react';
import { Appointment, NotificationItem, UserProfile, ViewTab } from '@/types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  User, 
  Bell, 
  Search, 
  Plus, 
  Menu, 
  X,
  Stethoscope, 
  Sparkles, 
  Smile, 
  ArrowUpRight,
  Info,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Ban,
  AlertCircle
} from 'lucide-react';

// Sub components
import DashboardView from '@/components/User/DashboardView';
import CalendarView from '@/components/User/CalendarView';
import ListView from '@/components/User/ListView';
import ProfileView from '@/components/User/ProfileView';
import NotificationsView from '@/components/User/NotificationsView';
import BookModal from '@/components/User/BookModal';

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    title: 'Dental Consultation',
    provider: 'Smile Clinic West',
    date: '2023-10-24',
    time: '09:30 AM',
    duration: 45,
    category: 'dental',
    status: 'Confirmed',
    notes: 'Standard bi-annual checkup and deep cleaning.',
    price: 120
  },
  {
    id: 'appt-2',
    title: 'Deep Tissue Massage',
    provider: 'Zen Wellness Center',
    date: '2023-10-28',
    time: '02:00 PM',
    duration: 60,
    category: 'wellness',
    status: 'Confirmed',
    notes: 'Focus on thoracic muscles and posture release.',
    price: 95
  }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Dental Consultation Confirmed',
    message: 'Your slot at Smile Clinic West with Dr. Sarah Jenkins is verified. Please bring your health policy credential.',
    timestamp: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-2',
    title: 'Reminder: Deep Tissue Massage',
    message: 'Upcoming session at Zen Wellness Center on Oct 28, 02:00 PM is coming up. Drink lots of water.',
    timestamp: '1 day ago',
    read: false,
    type: 'reminder'
  },
  {
    id: 'notif-3',
    title: 'Welcome to Slotem Management Suite',
    message: 'Welcome! Organize your visits, search, and schedule appointments instantly.',
    timestamp: '3 days ago',
    read: true,
    type: 'info'
  }
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'John Doe',
  email: 'etangdgm001@gmail.com',
  phone: '+1 (555) 019-2834',
  preferredClinic: 'Smile Clinic West',
  memberSince: 'October 2022',
  marketingConsent: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('bookings');
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('slotem_appointments');
    return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
  });
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('slotem_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('slotem_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [selectedDate, setSelectedDate] = useState<string>('2023-10-26');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subView, setSubView] = useState<'calendar' | 'list'>('calendar');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('slotem_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('slotem_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('slotem_profile', JSON.stringify(profile));
  }, [profile]);

  // Handler functions
  const handleAddNewAppointment = (newAppt: {
    title: string;
    provider: string;
    date: string;
    time: string;
    duration: number;
    category: 'dental' | 'wellness' | 'consultation' | 'general';
    notes: string;
    price: number;
  }) => {
    const id = `appt-${Date.now()}`;
    const added: Appointment = {
      ...newAppt,
      id,
      status: 'Confirmed'
    };

    setAppointments(prev => [added, ...prev]);

    // Push interactive notification
    const alert: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Scheduled: ${added.title}`,
      message: `Your booking for ${added.title} with ${added.provider} on ${added.date} at ${added.time} was scheduled successfully.`,
      timestamp: 'Just now',
      read: false,
      type: 'success'
    };

    setNotifications(prev => [alert, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' as const } : a));
    
    const cancelled = appointments.find(a => a.id === id);
    if (cancelled) {
      const alert: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Cancelled: ${cancelled.title}`,
        message: `Your appointment for ${cancelled.title} on ${cancelled.date} has been successfully cancelled. Co-payments will be refunded.`,
        timestamp: 'Just now',
        read: false,
        type: 'reminder'
      };
      setNotifications(prev => [alert, ...prev]);
    }
  };

  const handleToggleReadNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleMarkAllReadNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
  };

  // Direct quick schedule helper from Dashboard recommendations
  const handleScheduleQuickSlot = (presetIdx: number, forcedDate: string) => {
    setSelectedDate(forcedDate);
    setIsBookModalOpen(true);
  };

  // Quick helper to format selected date nicely, e.g. "Tuesday, Oct 24"
  const formatSelectedDateHeading = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const yearVal = parseInt(parts[0]);
      const monthVal = parseInt(parts[1]) - 1;
      const dayVal = parseInt(parts[2]);
      const d = new Date(yearVal, monthVal, dayVal);
      // Wait: To match the exact localized Thursday, Oct 26 mockup label
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      return d.toLocaleDateString('en-US', options);
    }
    return dateStr;
  };

  // Find active bookings on the selected calendar date to display on right Details Sidebar
  const selectedDateBookings = appointments.filter(a => a.date === selectedDate && a.status !== 'Cancelled');
  
  // Future active appointments for upcoming right section (Oct 24, Oct 28 etc)
  const upcomingAppointments = appointments
    .filter(a => a.status === 'Confirmed')
    .sort((a, b) => a.date.localeCompare(b.date));

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#fef7ff] dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 font-sans flex flex-col md:flex-row antialiased transition-colors duration-200">
      
      {/* Mobile top navigation header bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#f9f1ff] dark:bg-neutral-900 border-b border-outline-variant dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm select-none">
            S
          </span>
          <div>
            <h1 className="text-base font-black text-primary dark:text-primary-fixed leading-tight">Slotem</h1>
            <p className="text-[10px] text-gray-500 leading-none">Management Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications micro badge */}
          <button 
            onClick={() => setActiveTab('notifications')}
            className="relative p-1 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center scale-90 ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-gray-700 dark:text-neutral-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar navigation */}
      <aside className={`w-64 h-screen bg-[#f9f1ff] dark:bg-neutral-900 border-r border-outline-variant dark:border-neutral-800 p-4 flex flex-col gap-2 shrink-0 fixed top-0 bottom-0 left-0 z-40 md:relative transition-transform duration-300 md:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-primary dark:text-primary-fixed tracking-tight">Slotem</h1>
            <p className="text-xs text-secondary font-medium tracking-wide opacity-80">Management Suite</p>
          </div>
          
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Buttons bar */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-secondary hover:bg-[#ede5f4] dark:hover:bg-neutral-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setActiveTab('bookings'); setMobileSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'bookings'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-secondary hover:bg-[#ede5f4] dark:hover:bg-neutral-800'
            }`}
          >
            <CalendarDays className="w-5 h-5 shrink-0" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setMobileSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-secondary hover:bg-[#ede5f4] dark:hover:bg-neutral-800'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => { setActiveTab('notifications'); setMobileSidebarOpen(false); }}
            className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'notifications'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-secondary hover:bg-[#ede5f4] dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 shrink-0" />
              <span>Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                activeTab === 'notifications' 
                ? 'bg-white text-primary' 
                : 'bg-primary text-white'
              }`}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Button at bottom */}
        <button
          onClick={() => { setIsBookModalOpen(true); setMobileSidebarOpen(false); }}
          className="mt-auto bg-primary text-white py-3.5 px-6 rounded-full font-bold hover:shadow-lg active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
        >
          <Plus className="w-4 h-4 shrink-0" />
          Book New Appointment
        </button>
      </aside>

      {/* Backdrop for mobile navigation drawer */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-30"
        />
      )}

      {/* Main Container screen area */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        
        {/* Main top header bar with search and title matching the layout */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 gap-4 border-b border-outline-variant dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
              {activeTab === 'bookings' ? 'My Bookings' : activeTab}
            </h2>
            <div className="flex items-center text-secondary font-semibold text-xs gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary shrink-0" />
              {activeTab === 'bookings' ? (
                <span>October 2023</span>
              ) : activeTab === 'dashboard' ? (
                <span>Overview Analytics</span>
              ) : activeTab === 'profile' ? (
                <span>Demographics and Preferences</span>
              ) : (
                <span>Activity Broadcast alerts</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Real Search Input bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appointments..."
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-outline-variant dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
              />
            </div>

            {/* View Switcher is renderable only on the bookings tab */}
            {activeTab === 'bookings' && (
              <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setSubView('list')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs ${
                    subView === 'list'
                    ? 'bg-white dark:bg-neutral-900 text-primary shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  List View
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('calendar')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs ${
                    subView === 'calendar'
                    ? 'bg-white dark:bg-neutral-900 text-primary shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Calendar View
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Central screen content viewport */}
        <div className="flex-grow flex overflow-hidden">
          
          <section className="flex-grow overflow-y-auto p-6 bg-[#fcf8ff] dark:bg-neutral-950/20">
            {activeTab === 'bookings' && (
              subView === 'calendar' ? (
                <CalendarView
                  appointments={appointments}
                  selectedDate={selectedDate}
                  searchQuery={searchQuery}
                  onSelectDate={setSelectedDate}
                  onOpenBookingModal={() => setIsBookModalOpen(true)}
                />
              ) : (
                <ListView
                  appointments={appointments}
                  searchQuery={searchQuery}
                  onCancelAppointment={handleCancelAppointment}
                  onNavigateToTab={setActiveTab}
                />
              )
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                appointments={appointments}
                userName={profile.name}
                onNavigateToTab={setActiveTab}
                onScheduleQuickSlot={handleScheduleQuickSlot}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                profile={profile}
                onSaveProfile={handleSaveProfile}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onToggleRead={handleToggleReadNotification}
                onClearAll={handleClearAllNotifications}
                onMarkAllAsRead={handleMarkAllReadNotifications}
              />
            )}
          </section>

          {/* Right Sidebar Details panel (Shown on 'bookings' tab to match the screenshot layout exactly) */}
          {activeTab === 'bookings' && (
            <aside className="hidden xl:flex w-80 flex-col border-l border-outline-variant dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 gap-6 overflow-y-auto shrink-0">
              
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Details</h3>
                <p className="text-xs text-secondary font-bold mt-1 tracking-wider uppercase">
                  {formatSelectedDateHeading(selectedDate)}
                </p>
              </div>

              {/* Day selection bookings/empty states panel */}
              <div className="space-y-3">
                {selectedDateBookings.length === 0 ? (
                  <div className="bg-[#f9f1ff] dark:bg-neutral-800/50 rounded-xl p-5 flex flex-col items-center justify-center text-center py-8 border border-outline-variant dark:border-transparent">
                    <div className="w-10 h-10 bg-white dark:bg-neutral-900 text-gray-400 rounded-full flex items-center justify-center shadow-xs mb-3">
                      <Info className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs font-bold text-gray-800 dark:text-neutral-200">No bookings today</p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[150px] leading-relaxed">
                      Enjoy your free time or schedule something new.
                    </p>
                  </div>
                ) : (
                  selectedDateBookings.map((appt) => (
                    <div 
                      key={appt.id}
                      className="p-4 rounded-xl border border-outline-variant bg-gray-50/50 dark:bg-neutral-800/30 space-y-3"
                    >
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg select-none font-bold font-mono">
                          {appt.category === 'dental' ? <Smile className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">{appt.title}</h4>
                          <p className="text-[10px] text-gray-500 font-medium">{appt.provider}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-[10px] font-semibold text-secondary leading-normal">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{appt.time} ({appt.duration} mins)</span>
                        </div>
                        
                        {appt.notes && (
                          <p className="text-gray-400 dark:text-neutral-400 mt-1 italic pl-1 border-l border-outline-variant">
                            "{appt.notes}"
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 font-bold text-[10px] py-1.5 rounded-lg border border-red-200/40 dark:border-transparent flex items-center justify-center gap-1 transition-colors"
                      >
                        <Ban className="w-3 h-3" />
                        Cancel Appointment
                      </button>
                    </div>
                  ))
                )}
              </div>

              <hr className="border-outline-variant dark:border-neutral-800" />

              {/* Upcoming Appointments matches the screenshot exactly */}
              <div className="space-y-3 flex-grow max-h-[300px] overflow-y-auto pr-1">
                <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider">Upcoming Appointments</h3>
                
                <div className="flex flex-col gap-3">
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-[10px] text-gray-400 font-bold italic text-center py-4">
                      No future sessions scheduled.
                    </p>
                  ) : (
                    upcomingAppointments.slice(0, 3).map((appt) => (
                      <div 
                        key={appt.id}
                        onClick={() => setSelectedDate(appt.date)}
                        className="p-3.5 border border-outline-variant dark:border-neutral-800 rounded-xl hover:border-primary cursor-pointer group bg-white dark:bg-neutral-900 transition-all flex flex-col justify-between shadow-xs hover:shadow-xs"
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              appt.category === 'dental' ? 'bg-primary/10 text-primary' : 'bg-tertiary-fixed text-tertiary'
                            }`}>
                              {appt.category === 'dental' ? <Smile className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-extrabold text-xs text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-[130px]">
                                {appt.title}
                              </p>
                              <p className="text-[9px] text-gray-500 font-semibold truncate max-w-[130px]">
                                {appt.provider}
                              </p>
                            </div>
                          </div>

                          <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200/50">
                            Confirmed
                          </span>
                        </div>

                        <div className="text-[10px] text-secondary font-semibold flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1 text-[9px]">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {appt.date}, {appt.time}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* View Availability Checkup Promotion Matches the card at the bottom of the screenshot */}
              <div className="mt-auto">
                <div className="relative overflow-hidden rounded-2xl h-32 w-full bg-primary-container text-on-primary-container flex items-center justify-center p-4">
                  <div className="relative z-10 text-center space-y-1.5">
                    <p className="font-extrabold text-xs text-white">Need a dynamic checkup?</p>
                    <p className="text-[9px] text-indigo-200">Instant slots available for this week</p>
                    <button 
                      onClick={() => {
                        setSelectedDate('2023-10-27');
                        setIsBookModalOpen(true);
                      }}
                      className="bg-white hover:bg-neutral-100 text-primary px-4 py-2 rounded-xl text-[10px] font-black shadow-sm transition-all"
                    >
                      View Availability
                    </button>
                  </div>
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                </div>
              </div>

            </aside>
          )}

        </div>
      </main>

      {/* Floating Action Button for mobile screens */}
      <button 
        onClick={() => setIsBookModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-container text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Schedule appointment popup"
      >
        <Plus className="w-6 h-6 shrink-0" />
      </button>

      {/* Multi-step appointment wizard modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSave={handleAddNewAppointment}
        preselectedDate={selectedDate}
      />

    </div>
  );
}
