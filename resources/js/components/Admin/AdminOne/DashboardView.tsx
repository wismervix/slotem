import React, { useMemo } from 'react';
import { ServiceTwo, BookingTwo } from '@/types';
import { TrendingUp, Calendar, DollarSign, Award, ArrowUpRight, ArrowDownRight, UserCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface DashboardViewProps {
    services: ServiceTwo[];
    bookings: BookingTwo[];
    onCreateBookingClick: () => void;
    onCreateServiceClick: () => void;
    onNavigateToTab: (
        tab: 'dashboard' | 'bookings' | 'availability' | 'settings',
    ) => void;
}

export default function DashboardView({
  services,
  bookings,
  onCreateBookingClick,
  onCreateServiceClick,
  onNavigateToTab
}: DashboardViewProps) {

  // Dynamic calculations based on state
  const totalRevenue = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'Completed' || b.status === 'Confirmed')
      .reduce((sum, b) => sum + b.price, 0);
  }, [bookings]);

  const activeServicesCount = useMemo(() => {
    return services.filter((s) => s.status === 'Active').length;
  }, [services]);

  // Chart Data compilation (e.g. Booking stats)
  const chartData = useMemo(() => {
    // Generate mock stats for the past 7 days up to today (2026-06-17)
    return [
      { date: 'Jun 11', bookings: 12, revenue: 1540, cancelled: 1 },
      { date: 'Jun 12', bookings: 19, revenue: 2320, cancelled: 2 },
      { date: 'Jun 13', bookings: 15, revenue: 1980, cancelled: 0 },
      { date: 'Jun 14', bookings: 25, revenue: 3820, cancelled: 3 },
      { date: 'Jun 15', bookings: 32, revenue: 4200, cancelled: 1 },
      { date: 'Jun 16', bookings: 28, revenue: 3950, cancelled: 2 },
      { date: 'Jun 17', bookings: bookings.length + 22, revenue: totalRevenue + 120, cancelled: 1 },
    ];
  }, [bookings, totalRevenue]);

  // Category distribution calculation
  const categoryChartData = useMemo(() => {
    const cats: Record<string, number> = {};
    services.forEach((s) => {
      cats[s.category] = (cats[s.category] || 0) + 1;
    });
    return Object.keys(cats).map((cat) => ({
      name: cat,
      count: cats[cat]
    }));
  }, [services]);

  // Recent 4 bookings
  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 4);
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div>
        <h2 className="font-sans text-3xl font-bold text-on-background tracking-tight">Executive Dashboard</h2>
        <p className="text-on-surface-variant mt-1 text-sm md:text-base">Real-time analytical overview of your bookings, revenue, and client satisfaction metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold text-on-background">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight size={12} />
              +14.2% <span className="text-outline font-normal">this month</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <DollarSign size={22} strokeWidth={2.5} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Active Bookings</p>
            <h3 className="text-2xl font-bold text-on-background">{bookings.filter(b => b.status === 'Confirmed').length}</h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight size={12} />
              +8.3% <span className="text-outline font-normal">since yesterday</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Calendar size={22} strokeWidth={2.5} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Active Services</p>
            <h3 className="text-2xl font-bold text-on-background">{activeServicesCount} / {services.length}</h3>
            <span className="text-[11px] text-rose-500 font-bold flex items-center gap-0.5">
              <ArrowDownRight size={12} />
              -2.1% <span className="text-outline font-normal">deactivated catalog</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
            <TrendingUp size={22} strokeWidth={2.5} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Client Rating</p>
            <h3 className="text-2xl font-bold text-on-background">4.92 / 5.0</h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight size={12} />
              +0.2% <span className="text-outline font-normal">from CSAT reviews</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <Award size={22} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Area Chart */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-on-surface">Weekly Booking Trends</h4>
              <p className="text-xs text-outline mt-0.5">Displays client appointments set over past 7 cycles.</p>
            </div>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">Live Activity</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#630ed4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#630ed4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} stroke="#7b7487" tickLine={false} />
                <YAxis fontSize={11} stroke="#7b7487" tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#630ed4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                <Area type="monotone" dataKey="cancelled" stroke="#ba1a1a" strokeWidth={1.5} fillOpacity={0} name="Cancelled" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Categories */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-on-surface">Catalog Distribution</h4>
              <p className="text-xs text-outline mt-0.5">Services count relative to specific sectors.</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} stroke="#7b7487" tickLine={false} />
                <YAxis fontSize={11} stroke="#7b7487" tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={35} name="Total Services" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Recent Bookings & Core Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-on-surface">Recent Booking Actions</h4>
              <p className="text-xs text-outline mt-0.5">Recently added client meetings.</p>
            </div>
            <button
              onClick={() => onNavigateToTab('bookings')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {booking.clientName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{booking.clientName}</p>
                    <p className="text-[10px] text-outline">{booking.serviceName} • {booking.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-on-surface">${booking.price.toFixed(2)}</p>
                  <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 ${
                    booking.status === 'Confirmed'
                      ? 'bg-amber-100 text-amber-800'
                      : booking.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-on-surface">Shortcut Diagnostics</h4>
            <p className="text-xs text-outline mt-0.5">Execute priority processes directly from the cockpit.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onCreateBookingClick}
              className="p-4 rounded-xl border border-outline-variant text-left hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Calendar size={16} />
              </div>
              <p className="text-xs font-bold text-on-surface mt-3">Book New Appointment</p>
              <p className="text-[10px] text-outline mt-0.5">Schedule slots for existing clients instantly.</p>
            </button>

            <button
              onClick={onCreateServiceClick}
              className="p-4 rounded-xl border border-outline-variant text-left hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <UserCheck size={16} />
              </div>
              <p className="text-xs font-bold text-on-surface mt-3">Add Custom Service</p>
              <p className="text-[10px] text-outline mt-0.5">Define new hourly rates and catalogs.</p>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-3">
            <span className="text-lg">🛎️</span>
            <div>
              <p className="text-[11px] font-bold text-on-surface">Proactive Alert: High Demand Season</p>
              <p className="text-[10px] text-outline mt-0.5">Booking utilization is currently running at 94% on Tuesdays. Consider activating additional Styling shifts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
