import React, { useState, useMemo } from 'react';
import { Download, UserPlus, Filter, Calendar, ArrowUpDown, RefreshCw, Eye, Edit, CheckCircle, X, Check, Mail, Phone, CalendarDays, BarChart, AlertTriangle, TrendingUp } from 'lucide-react';
import { UserThree, BookingThree } from '@/types';


interface UserManagementProps {
    users: UserThree[];
    bookings: BookingThree[];
    onAddUser: (user: UserThree) => void;
    onUpdateUser: (user: UserThree) => void;
    onDeleteUser: (userId: string) => void;
    searchQuery: string;
}

export default function UserManagement({
  users,
  bookings,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  searchQuery
}: UserManagementProps) {
  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState<'All Statuses' | 'Active' | 'Suspended' | 'Pending'>('All Statuses');
  const [sortBy, setSortBy] = useState<'Registration Date' | 'Name (A-Z)' | 'Most Bookings'>('Registration Date');
  const [dateFilter, setDateFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected User Modal States
  const [viewingUser, setViewingUser] = useState<UserThree | null>(null);
  const [editingUser, setEditingUser] = useState<UserThree | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Suspended' | 'Pending'>('Active');
  const [formAvatar, setFormAvatar] = useState('');

  // CSV Export animation/feedback
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Refresh trigger handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setStatusFilter('All Statuses');
      setSortBy('Registration Date');
      setDateFilter('');
    }, 600);
  };

  // Filtered & Sorted users list
  const processedUsers = useMemo(() => {
    return users
      .filter((user) => {
        // Search Query filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query);

        // Status filter
        const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;

        // Custom Date filter (e.g. Month name or date string)
        const matchesDate =
          !dateFilter ||
          user.registeredDate.toLowerCase().includes(dateFilter.toLowerCase().trim());

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === 'Name (A-Z)') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'Most Bookings') {
          return b.bookingsCount - a.bookingsCount;
        }
        // Default Sort by Date (assume ID order correlates to registration order for simplicity, or reverse chronological)
        return b.id.localeCompare(a.id);
      });
  }, [users, searchQuery, statusFilter, sortBy, dateFilter]);

  // Paginated partition
  const totalItems = processedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = useMemo(() => {
    return processedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [processedUsers, startIndex]);

  // Adjust page boundary on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy, dateFilter, searchQuery]);

  // Computed stats for quick insight cards
  const totalActiveCount = useMemo(() => users.filter(u => u.status === 'Active').length, [users]);
  const reportsPendingCount = useMemo(() => users.filter(u => u.status === 'Suspended' || u.status === 'Pending').length, [users]);

  // Export CSV simulation
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Registered Date', 'Registered Time', 'Bookings', 'Status'].join(',');
    const rows = processedUsers.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.registeredDate}","${u.registeredTime}",${u.bookingsCount},"${u.status}"`
    ).join('\n');
    
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `slotem-users-export-${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  // Setup form with current user values for editing
  const handleStartEdit = (user: UserThree) => {
      setEditingUser(user);
      setFormName(user.name);
      setFormEmail(user.email);
      setFormPhone(user.phone);
      setFormStatus(user.status);
      setFormAvatar(user.avatar);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    if (!formName.trim() || !formEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }
    const updated: UserThree = {
        ...editingUser,
        name: formName,
        email: formEmail,
        phone: formPhone,
        status: formStatus,
        avatar:
            formAvatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };
    onUpdateUser(updated);
    setEditingUser(null);
  };

  const handleStartAdd = () => {
    setIsAddingUser(true);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormStatus('Active');
    // Random beautiful placeholder avatar
    const randId = Math.floor(Math.random() * 100);
    setFormAvatar(`https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80`);
  };

  const handleSaveAdd = () => {
    if (!formName.trim() || !formEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }
    // Generate novel ID
    const newIdNum = 49200 + users.length + 1;
    const newUser: UserThree = {
        id: `SL-${newIdNum}`,
        name: formName,
        email: formEmail,
        phone: formPhone || '+1 (555) 000-0000',
        registeredDate: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }),
        registeredTime: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        bookingsCount: 0,
        status: formStatus,
        avatar:
            formAvatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };
    onAddUser(newUser);
    setIsAddingUser(false);
  };

  const handleToggleStatus = (user: UserThree) => {
      const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
      onUpdateUser({ ...user, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">User Management</h2>
          <p className="text-sm text-on-surface-variant mt-1 font-sans">
            Manage, monitor and moderate your customer base efficiently.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-sm text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer bg-white"
          >
            <Download className="w-4 h-4 text-outline" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-all cursor-pointer shadow-sm shadow-primary/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* CSV Export Success Toast/indicator */}
      {showExportSuccess && (
        <div className="bg-green-100 border border-green-200 text-green-800 text-xs px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-green-700" />
          <span>User roster successfully exported to local download directory as CSV.</span>
        </div>
      )}

      {/* Filter Toolbar controls */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-wrap items-center gap-4">
        {/* Status drop filter */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant flex-1 min-w-[190px]">
          <Filter className="text-outline w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-transparent border-none text-xs focus:ring-0 text-on-surface w-full cursor-pointer font-medium focus:outline-none"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending Verification</option>
          </select>
        </div>

        {/* Custom date range simple search */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant flex-1 min-w-[190px]">
          <Calendar className="text-outline w-4 h-4" />
          <input
            type="text"
            placeholder="Filter Date (e.g. Jan 15, 2024)"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-on-surface w-full focus:outline-none placeholder-outline/80"
          />
        </div>

        {/* Sort drop filter */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant flex-1 min-w-[200px]">
          <ArrowUpDown className="text-outline w-4 h-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none text-xs focus:ring-0 text-on-surface w-full cursor-pointer font-medium focus:outline-none"
          >
            <option value="Registration Date">Sort by: Registration Date</option>
            <option value="Name (A-Z)">Sort by: Name (A-Z)</option>
            <option value="Most Bookings">Sort by: Most Bookings</option>
          </select>
        </div>

        {/* Refresh clean triggers */}
        <button
          onClick={handleRefresh}
          className="p-2.5 hover:bg-surface-container-high rounded-lg transition-colors text-outline cursor-pointer bg-surface-container-low border border-outline-variant/60"
          title="Reset filters"
        >
          <RefreshCw className={`w-4 h-4 text-outline ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Table Segment */}
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-on-surface-variant/80">
                    No users matching your filter inputs found. Try resetting filters.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  // Bookings relative bar (let's assume out of 30 max Bookings list scale for design styling)
                  const relativeProgress = Math.min((user.bookingsCount / 30) * 100, 100);
                  
                  return (
                    <tr key={user.id} className="hover:bg-surface-container/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-outline-variant/40"
                            src={user.avatar}
                          />
                          <div>
                            <p className="text-xs font-bold text-on-surface">{user.name}</p>
                            <p className="text-[10px] text-on-surface-variant/80 font-mono tracking-wide">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-on-surface">{user.email}</p>
                        <p className="text-[10px] text-on-surface-variant">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface font-medium">{user.registeredDate}</p>
                        <p className="text-[10px] text-on-surface-variant">{user.registeredTime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-on-surface w-4">{user.bookingsCount}</span>
                          <span className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden block">
                            <span
                              className="block h-full bg-primary rounded-full"
                              style={{ width: `${relativeProgress}%` }}
                            ></span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === 'Active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800 border border-green-200">
                            Active
                          </span>
                        ) : user.status === 'Suspended' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 border border-red-200">
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Inline actions fade in on hover */}
                        <div className="flex items-center justify-end gap-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingUser(user)}
                            className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                            title="View Profile Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="p-1.5 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                            title="Edit Credentials"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              user.status === 'Active'
                                ? 'text-outline hover:text-red-600 hover:bg-red-50'
                                : 'text-outline hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={user.status === 'Active' ? 'Toggle Suspend' : 'Activate User'}
                          >
                            {user.status === 'Active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination selectors */}
        <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-t border-outline-variant/60">
          <p className="text-xs text-on-surface-variant font-medium">
            Showing <span className="font-bold text-on-surface">{Math.min(startIndex + 1, totalItems)}</span> to{' '}
            <span className="font-bold text-on-surface">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
            <span className="font-bold text-on-surface">{totalItems}</span> users
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer bg-white"
            >
              <span className="text-[11px] font-bold">Prev</span>
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer bg-white"
            >
              <span className="text-[11px] font-bold">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Insight Bento row underneath */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Total Active Clients</p>
            <h4 className="text-xl font-bold text-on-surface leading-tight">{totalActiveCount}</h4>
          </div>
        </div>

        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">New Registrations</p>
            <h4 className="text-xl font-bold text-on-surface leading-tight">+12.5% Month-over-Month</h4>
          </div>
        </div>

        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex items-center gap-4">
          <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center text-on-error-container">
            <AlertTriangle className="w-6 h-6 text-red-700" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Pending/Flags Raised</p>
            <h4 className="text-xl font-bold text-on-surface leading-tight">{reportsPendingCount} accounts</h4>
          </div>
        </div>
      </div>

      {/* view_file detail dialog */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-outline-variant shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-white relative">
              <button
                onClick={() => setViewingUser(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/25 p-1 rounded-full text-xs transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  alt={viewingUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-md"
                  src={viewingUser.avatar}
                />
                <div>
                  <h3 className="text-lg font-bold font-sans">{viewingUser.name}</h3>
                  <p className="text-xs text-white/80 font-mono">ID: {viewingUser.id}</p>
                  <p className="mt-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      viewingUser.status === 'Active' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                    }`}>
                      {viewingUser.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5 text-xs">
                  <Mail className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-outline text-[10px] uppercase font-bold">Email</p>
                    <p className="text-on-surface font-medium">{viewingUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Phone className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-outline text-[10px] uppercase font-bold">Phone</p>
                    <p className="text-on-surface font-medium">{viewingUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <CalendarDays className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-outline text-[10px] uppercase font-bold">Registered</p>
                    <p className="text-on-surface font-medium">
                      {viewingUser.registeredDate} @ {viewingUser.registeredTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <BarChart className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-outline text-[10px] uppercase font-bold">Total Reservations</p>
                    <p className="text-on-surface font-bold">{viewingUser.bookingsCount} slots filled</p>
                  </div>
                </div>
              </div>

              {/* Connected User Bookings Schedule */}
              <div className="border-t border-outline-variant/60 pt-4">
                <h4 className="text-xs font-bold text-on-surface mb-2.5 uppercase tracking-wide">
                  Schedule Feed ({bookings.filter(b => b.userId === viewingUser.id).length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {bookings.filter(b => b.userId === viewingUser.id).length === 0 ? (
                    <p className="text-[11px] text-on-surface-variant italic">No current bookings under this profile.</p>
                  ) : (
                    bookings
                      .filter(b => b.userId === viewingUser.id)
                      .map((book) => (
                        <div key={book.id} className="p-2 border border-outline-variant/50 rounded-lg text-xs flex justify-between items-center bg-surface-container-low">
                          <div>
                            <p className="font-semibold text-on-surface">{book.service}</p>
                            <p className="text-[10px] text-on-surface-variant font-mono">{book.date} @ {book.timeSlot}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                            book.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700' :
                            book.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {book.status}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-surface-container p-4 flex justify-end gap-2.5">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all cursor-pointer"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  const toEdit = viewingUser;
                  setViewingUser(null);
                  handleStartEdit(toEdit);
                }}
                className="px-4 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-all cursor-pointer"
              >
                Modify profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Form Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-outline-variant shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-sm text-on-surface">Edit User: {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Operational Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Avatar Image URL</label>
                  <input
                    type="text"
                    value={formAvatar}
                    onChange={(e) => setFormAvatar(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface font-mono text-[10px] focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-container px-6 py-4 flex justify-between">
              <button
                onClick={() => {
                  if (confirm(`Are you absolutely sure you want to delete client ${editingUser.name}? All history will be archived.`)) {
                    onDeleteUser(editingUser.id);
                    setEditingUser(null);
                  }
                }}
                className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all cursor-pointer"
              >
                Delete Client Profile
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg hover:bg-primary-container cursor-pointer shadow-sm shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Form Dialog */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-outline-variant shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-sm text-on-surface">Register New User</h3>
              <button onClick={() => setIsAddingUser(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Client Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Samantha Vance"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-outline/65"
                />
              </div>

              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Official Email *</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-outline/65"
                />
              </div>

              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Mobile Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder-outline/65"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  >
                    <option value="Active">Active / Approved</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Headshot Preset</label>
                  <select
                    onChange={(e) => setFormAvatar(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  >
                    <option value="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150">Professional Female A</option>
                    <option value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150">Professional Male A</option>
                    <option value="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150">Professional Female B</option>
                    <option value="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150">Professional Male B</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-surface-container px-6 py-4 flex justify-end gap-2.5">
              <button
                onClick={() => setIsAddingUser(false)}
                className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-lg cursor-pointer"
              >
                Abandon
              </button>
              <button
                onClick={handleSaveAdd}
                className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary-container transition-all cursor-pointer shadow-sm shadow-primary/20"
              >
                Register User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
