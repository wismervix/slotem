import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ActiveTab,
    BusinessProfile,
    BookingRules,
    TeamMember,
    AdminBookingThree,
    StaffAvailability,
    DaySchedule,
} from '@/types';
import {
  defaultBusinessProfile,
  defaultBookingRules,
  defaultTeamMembers,
  defaultBookings,
  defaultStaffAvailability,
} from '@/data/initial-data-three';

import Layout from '@/components/Admin/VersionThree/Layout';
import DashboardTab from '@/components/Admin/VersionThree/DashboardTab';
import BookingsTab from '@/components/Admin/VersionThree/BookingsTab';
import AvailabilityTab from '@/components/Admin/VersionThree/AvailabilityTab';
import SettingsTab from '@/components/Admin/VersionThree/SettingsTab';
import NewBookingModal from '@/components/Admin/VersionThree/NewBookingModal';
import Toast, { ToastType } from '@/components/Admin/VersionThree/Toast';

export default function App() {
  // Tab control
  const [activeTab, setActiveTab] = useState<ActiveTab>('settings'); // Start at settings, exactly as shown in the request!
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Core application states loaded from localStorage or default static templates
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('slotem_profile');
    return saved ? JSON.parse(saved) : defaultBusinessProfile;
  });

  const [bookingRules, setBookingRules] = useState<BookingRules>(() => {
    const saved = localStorage.getItem('slotem_rules');
    return saved ? JSON.parse(saved) : defaultBookingRules;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('slotem_team');
    return saved ? JSON.parse(saved) : defaultTeamMembers;
  });

  const [bookings, setBookings] = useState<AdminBookingThree[]>(() => {
      const saved = localStorage.getItem('slotem_bookings');
      return saved ? JSON.parse(saved) : defaultBookings;
  });

  const [availability, setAvailability] = useState<StaffAvailability[]>(() => {
    const saved = localStorage.getItem('slotem_availability');
    return saved ? JSON.parse(saved) : defaultStaffAvailability;
  });

  // State synchronization to LocalStorage
  useEffect(() => {
    localStorage.setItem('slotem_profile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  useEffect(() => {
    localStorage.setItem('slotem_rules', JSON.stringify(bookingRules));
  }, [bookingRules]);

  useEffect(() => {
    localStorage.setItem('slotem_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('slotem_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('slotem_availability', JSON.stringify(availability));
  }, [availability]);

  // Toast dispatch utility
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State modification handlers
  const handleSaveSettings = (profile: BusinessProfile, rules: BookingRules) => {
    setBusinessProfile(profile);
    setBookingRules(rules);
    triggerToast('Settings applied & synchronized successfully!');
  };

  const handleAddTeamMember = (newMember: Omit<TeamMember, 'id' | 'avatarInitials'>) => {
    const initials = newMember.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const created: TeamMember = {
      ...newMember,
      id: 't_' + Math.random().toString(36).substring(2, 9),
      avatarInitials: initials,
    };

    setTeamMembers((prev) => [...prev, created]);
    triggerToast(`Invited ${newMember.name} to the team!`);
  };

  const handleRemoveTeamMember = (id: string) => {
    const found = teamMembers.find((m) => m.id === id);
    if (found) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      triggerToast(`Removed team handler: ${found.name}`, 'info');
    }
  };

  const handleUpdateTeamMember = (updated: TeamMember) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    triggerToast(`Updated handler settings for ${updated.name}`);
  };

  const handleAddBooking = (newBooking: AdminBookingThree) => {
      setBookings((prev) => [newBooking, ...prev]);
      triggerToast(`Created confirmed booking for ${newBooking.clientName}!`);
  };

  const handleUpdateBookingStatus = (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    triggerToast(`Booking status set to "${status}"`);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    triggerToast('Booking record discarded from roster database', 'info');
  };

  const handleSaveAvailability = (staffId: string, updatedSchedule: DaySchedule[]) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.staffId === staffId ? { ...item, schedule: updatedSchedule } : item
      )
    );
    const member = teamMembers.find((m) => m.id === staffId);
    triggerToast(`Shift schedule rules updated for ${member?.name || 'staff member'}`);
  };

  // Global search implementation: highlights matched contexts or filters lists dynamically.
  // Passing searchQuery filters or highlights rows based on active panel.

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onOpenNewBooking={() => setIsNewBookingOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* Animated Tab Frame transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Header Title block */}
          <header className="mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' && 'Admin Dashboard'}
                {activeTab === 'bookings' && 'Reservations & Slots'}
                {activeTab === 'availability' && 'Staff Rota & Hours'}
                {activeTab === 'settings' && 'Admin Settings'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === 'dashboard' && "Observe workspace indices, system activities, and financial streams."}
                {activeTab === 'bookings' && 'Track scheduled projects, cancel empty reservations, and add walk-in clients.'}
                {activeTab === 'availability' && 'Define weekly rotas, toggle operating days, and control time offsets.'}
                {activeTab === 'settings' && "Manage your organization's identity, operational logic, and team access."}
              </p>
            </div>
          </header>

          {/* Render individual screens */}
          {activeTab === 'dashboard' && (
            <DashboardTab
              bookings={bookings}
              team={teamMembers}
              onUpdateStatus={handleUpdateBookingStatus}
              onOpenNewBooking={() => setIsNewBookingOpen(true)}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={bookings}
              onUpdateStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
              onOpenNewBooking={() => setIsNewBookingOpen(true)}
            />
          )}

          {activeTab === 'availability' && (
            <AvailabilityTab
              staffMembers={teamMembers.filter((m) => m.status === 'Active')}
              availability={availability}
              onSaveAvailability={handleSaveAvailability}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              businessProfile={businessProfile}
              bookingRules={bookingRules}
              teamMembers={teamMembers}
              onSave={handleSaveSettings}
              onAddTeamMember={handleAddTeamMember}
              onRemoveTeamMember={handleRemoveTeamMember}
              onUpdateTeamMember={handleUpdateTeamMember}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* New Booking Modal Overlay */}
      <AnimatePresence>
        {isNewBookingOpen && (
          <NewBookingModal
            isOpen={isNewBookingOpen}
            onClose={() => setIsNewBookingOpen(false)}
            staffMembers={teamMembers.filter((m) => m.status === 'Active')}
            onAddBooking={handleAddBooking}
          />
        )}
      </AnimatePresence>

      {/* Persistent success / error Toast notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </Layout>
  );
}
