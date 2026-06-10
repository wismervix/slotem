import { Users, Calendar, DollarSign, Activity, CheckCircle2, ListFilter, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { AdminBookingThree, TeamMember } from '@/types';

interface DashboardTabProps {
    bookings: AdminBookingThree[];
    team: TeamMember[];
    onUpdateStatus: (
        id: string,
        status: 'Confirmed' | 'Completed' | 'Cancelled',
    ) => void;
    onOpenNewBooking: () => void;
}

export default function DashboardTab({ bookings, team, onUpdateStatus, onOpenNewBooking }: DashboardTabProps) {
  // Statistics calculations
  const totalRevenue = bookings
    .filter((b) => b.status === 'Completed' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.price, 0);

  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const activeStaffCount = team.filter((t) => t.status === 'Active').length;
  const pendingCount = bookings.filter((b) => b.status === 'Confirmed').length;

  // Let's create mock data points for our SVG area chart representing recent daily revenue
  const revenueTrendData = [
    { label: 'Mon', value: 2400 },
    { label: 'Tue', value: 3100 },
    { label: 'Wed', value: 1800 },
    { label: 'Thu', value: 4500 },
    { label: 'Fri', value: 5200 },
    { label: 'Sat', value: 3800 },
    { label: 'Sun', value: 4100 }
  ];

  const maxVal = Math.max(...revenueTrendData.map((d) => d.value));
  const chartHeight = 120;
  const chartWidth = 500;
  
  // Create beautiful SVG points
  const points = revenueTrendData
    .map((d, index) => {
      const x = (index / (revenueTrendData.length - 1)) * chartWidth;
      const y = chartHeight - (d.value / maxVal) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${points} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  return (
    <div className="space-y-6">
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 bg-red-500/5 w-16 h-16 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</span>
            <span className="p-2 bg-red-50 rounded-xl text-red-600">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-green-600 font-bold flex items-center bg-green-50 px-1.5 py-0.5 rounded-md gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +14.2%
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Adjusted from current active bookings</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 bg-purple-500/5 w-16 h-16 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Sessions</span>
            <span className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{completedCount}</span>
            <span className="text-xs text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded-md">80.2% Rate</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Finished sessions with invoices</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 bg-blue-500/5 w-16 h-16 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Handlers</span>
            <span className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{activeStaffCount}</span>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md">/ {team.length} total</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Verified staff ready for booking Slots</p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-3.5 top-3.5 bg-amber-500/5 w-16 h-16 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bookings Scheduled</span>
            <span className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Calendar className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">{bookings.filter(b => b.status === "Cancelled").length} cancelled</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Active slots reserved in next 30 days</p>
        </div>
      </div>

      {/* Grid of Chart & Quick Calendar List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex argue-end justify-between items-center pb-2 border-b border-gray-50">
            <div>
              <h3 className="text-md font-bold text-slate-800">Revenue Stream Analysis</h3>
              <p className="text-xs text-gray-400 mt-0.5">Simulated weekly revenue flow for Slotem creative projects</p>
            </div>
            <span className="text-xs bg-slate-50 border border-slate-100 px-2 py-1 rounded-md font-mono text-gray-500 font-semibold">
              Weekly view
            </span>
          </div>

          {/* SVG Sparkline Area Chart */}
          <div className="w-full relative h-[150px] overflow-hidden mt-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Guides */}
              <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#f1f5f9" strokeDasharray="3,3" />
              <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="#e2e8f0" />

              {/* Area */}
              <polygon points={areaPoints} fill="url(#chartGrad)" />
              
              {/* Line */}
              <polyline points={points} fill="none" stroke="#630ed4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Circular Dots */}
              {revenueTrendData.map((d, i) => {
                const x = (i / (revenueTrendData.length - 1)) * chartWidth;
                const y = chartHeight - (d.value / maxVal) * (chartHeight - 20) - 10;
                return (
                  <g key={i} className="group/dot cursor-pointer">
                    <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#630ed4" strokeWidth="2.5" />
                    <circle cx={x} cy={y} r="9" fill="#630ed4" className="opacity-0 group-hover/dot:opacity-20 transition-opacity" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Legends */}
          <div className="flex justify-between text-xs font-semibold text-gray-400 pt-2 px-1">
            {revenueTrendData.map((d, i) => (
              <div key={i} className="text-center">
                <p className="text-slate-700 font-bold">${d.value}</p>
                <p className="text-gray-400 text-[10px] uppercase font-mono mt-0.5">{d.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions & Live availability panel */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-gray-50 mb-4 text-purple-700">
              <Activity className="w-5 h-5 text-purple-700" />
              <h3 className="text-md font-bold text-slate-800">Operational Health</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Platform Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Fully Active
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">HMR Hot-Fix State</span>
                <span className="text-xs text-slate-500 bg-slate-100 rounded-md px-1.5 py-0.5 font-mono">
                  DISABLE_HMR=true
                </span>
              </div>

              <div className="flex justify-between items-end text-sm pt-2">
                <div>
                  <span className="text-gray-500 block font-medium">Average Project Value</span>
                  <span className="text-xs text-gray-400">Total revenue / Confirmed slots</span>
                </div>
                <span className="text-base font-bold text-slate-800">
                  ${Math.round(totalRevenue / (bookings.length || 1)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onOpenNewBooking}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity / Active Bookings Stream */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-md font-bold text-slate-800">Upcoming Schedule Agenda</h3>
            <p className="text-xs text-gray-400 mt-0.5">Quick lookup of the next scheduled bookings within the system.</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md font-semibold font-sans">
            <Clock className="w-4 h-4 text-purple-700" />
            Live schedule update
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Client Detail</th>
                <th className="px-6 py-4">Assigned Service</th>
                <th className="px-6 py-4">Date/Time</th>
                <th className="px-6 py-4 font-center">Handler</th>
                <th className="px-6 py-4">Booking Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {bookings.slice(0, 4).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{b.clientName}</p>
                      <p className="text-xs text-gray-400">{b.clientEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-700">{b.service}</p>
                      <p className="text-xs text-purple-700 font-bold font-mono">
                        ${b.price.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-600 font-mono text-xs">{b.date}</span>
                      <span className="text-xs text-gray-400 font-mono">{b.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">
                    {b.staffName}
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
                  <td className="px-6 py-4 text-right">
                    {b.status === 'Confirmed' ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => onUpdateStatus(b.id, 'Completed')}
                          className="px-2.5 py-1 text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => onUpdateStatus(b.id, 'Cancelled')}
                          className="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No actions needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
