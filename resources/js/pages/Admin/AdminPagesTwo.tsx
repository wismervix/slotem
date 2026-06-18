import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Admin/AdminTwo/Sidebar';
import Header from '@/components/Admin/AdminTwo/Header';
import Dashboard from '@/components/Admin/AdminTwo/Dashboard';
import UserManagement from '@/components/Admin/AdminTwo/UserManagement';
import BookingsManagement from '@/components/Admin/AdminTwo/BookingsManagement';
import AvailabilityManager from '@/components/Admin/AdminTwo/AvailabilityManager';
import SettingsPanel from '@/components/Admin/AdminTwo/SettingsPanel';
import { UserThree, BookingThree, AvailabilityThree, AdminProfileThree } from '@/types';
import {
    INITIAL_USERS,
    INITIAL_BOOKINGS,
    INITIAL_AVAILABILITY,
    INITIAL_ADMIN,
    loadState,
    saveState,
} from '@/data/initial-data-three';

export default function App() {
    // Current active viewport tab. Maintain 'users' as initial to correspond exactly to user mockup screen!
    const [currentTab, setCurrentTab] = useState<string>('users');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Loaded database state (persisted dynamically to localStorage)
    const [users, setUsers] = useState<UserThree[]>([]);
    const [bookings, setBookings] = useState<BookingThree[]>([]);
    const [availability, setAvailability] = useState<AvailabilityThree[]>([]);
    const [admin, setAdmin] = useState<AdminProfileThree>(INITIAL_ADMIN);

    // Deeply nested sub-modules triggers
    const [globalNewBookingOpen, setGlobalNewBookingOpen] =
        useState<boolean>(false);

    // Populate data on mount
    useEffect(() => {
        setUsers(loadState<UserThree[]>('slotem_users', INITIAL_USERS));
        setBookings(loadState<BookingThree[]>('slotem_bookings', INITIAL_BOOKINGS));
        setAvailability(
            loadState<AvailabilityThree[]>(
                'slotem_availability',
                INITIAL_AVAILABILITY,
            ),
        );
        setAdmin(loadState<AdminProfileThree>('slotem_admin', INITIAL_ADMIN));
    }, []);

    // Sync state mutations cleanly back to localStorage
    const persistUsers = (data: UserThree[]) => {
        setUsers(data);
        saveState('slotem_users', data);
    };

    const persistBookings = (data: BookingThree[]) => {
        setBookings(data);
        saveState('slotem_bookings', data);
    };

    const persistAvailability = (data: AvailabilityThree[]) => {
        setAvailability(data);
        saveState('slotem_availability', data);
    };

    const persistAdminProfile = (data: AdminProfileThree) => {
        setAdmin(data);
        saveState('slotem_admin', data);
    };

    // State Action Handlers
    const handleAddUser = (newUser: UserThree) => {
        const updated = [newUser, ...users];
        persistUsers(updated);
    };

    const handleUpdateUser = (updatedUser: UserThree) => {
        const updated = users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u,
        );
        persistUsers(updated);
    };

    const handleDeleteUser = (userId: string) => {
        const updated = users.filter((u) => u.id !== userId);
        persistUsers(updated);
        // Also cancel bookings associated with deleted profiles
        const updatedBookings = bookings.map((b) =>
            b.userId === userId ? { ...b, status: 'Cancelled' as const } : b,
        );
        persistBookings(updatedBookings);
    };

    const handleAddBooking = (newBooking: BookingThree) => {
        const updated = [newBooking, ...bookings];
        persistBookings(updated);

        // Increment booking count on the respective user
        const updatedUsers = users.map((u) => {
            if (u.id === newBooking.userId) {
                return { ...u, bookingsCount: u.bookingsCount + 1 };
            }
            return u;
        });
        persistUsers(updatedUsers);
    };

    const handleUpdateBookingStatus = (
        bookingId: string,
        status: BookingThree['status'],
    ) => {
        const updated = bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b,
        );
        persistBookings(updated);
    };

    const handleDeleteBooking = (bookingId: string) => {
        const target = bookings.find((b) => b.id === bookingId);
        const updated = bookings.filter((b) => b.id !== bookingId);
        persistBookings(updated);

        if (target) {
            // Decrement booking count on the respective user
            const updatedUsers = users.map((u) => {
                if (u.id === target.userId) {
                    return {
                        ...u,
                        bookingsCount: Math.max(0, u.bookingsCount - 1),
                    };
                }
                return u;
            });
            persistUsers(updatedUsers);
        }
    };

    const handleToggleSlot = (dayName: string, time: string) => {
        const updated = availability.map((dayInfo) => {
            if (dayInfo.day === dayName) {
                return {
                    ...dayInfo,
                    slots: dayInfo.slots.map((s) =>
                        s.time === time
                            ? { ...s, isAvailable: !s.isAvailable }
                            : s,
                    ),
                };
            }
            return dayInfo;
        });
        persistAvailability(updated);
    };

    const handleApplyPreset = (presetType: 'office' | 'block' | 'open') => {
        const updated = availability.map((dayInfo) => {
            const isWeekend =
                dayInfo.day === 'Saturday' || dayInfo.day === 'Sunday';
            return {
                ...dayInfo,
                slots: dayInfo.slots.map((s) => {
                    if (presetType === 'block') {
                        return { ...s, isAvailable: false };
                    }
                    if (presetType === 'open') {
                        return { ...s, isAvailable: true };
                    }
                    // Default office hours target: available from 9am to 5pm on weekdays, unavailable on weekends & lunch hours (12pm/1pm)
                    const hour = parseInt(s.time.split(':')[0]);
                    const isLunch = hour === 12 || hour === 1;
                    const isOfficeHour = !isLunch && !isWeekend;
                    return { ...s, isAvailable: isOfficeHour };
                }),
            };
        });
        persistAvailability(updated);
    };

    const handleResetDatabase = () => {
        localStorage.removeItem('slotem_users');
        localStorage.removeItem('slotem_bookings');
        localStorage.removeItem('slotem_availability');
        localStorage.removeItem('slotem_admin');

        setUsers(INITIAL_USERS);
        setBookings(INITIAL_BOOKINGS);
        setAvailability(INITIAL_AVAILABILITY);
        setAdmin(INITIAL_ADMIN);
    };

    return (
        <div className="flex min-h-screen overflow-x-hidden bg-[#fef7ff] font-sans text-[#1d1a24] antialiased selection:bg-primary/20 selection:text-primary">
            {/* Absolute Side Navigation Bar */}
            <Sidebar
                currentTab={currentTab}
                onTabChange={(tab) => {
                    setCurrentTab(tab);
                    setSearchQuery('');
                }}
                onOpenNewBooking={() => {
                    // If already on bookings, open modal. Otherwise switch tab AND open modal cleanly!
                    setCurrentTab('bookings');
                    setGlobalNewBookingOpen(true);
                }}
            />

            {/* Main View Container */}
            <div className="ml-64 flex min-h-screen flex-1 flex-col">
                {/* Dynamic header row at top */}
                <Header
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    adminProfile={admin}
                    onNavigateToSettings={() => setCurrentTab('settings')}
                />

                {/* Inner Content Grid */}
                <main className="mx-auto w-full max-w-[1400px] flex-grow p-8 pb-16">
                    {/* Dashboard tab */}
                    {currentTab === 'dashboard' && (
                        <Dashboard
                            users={users}
                            bookings={bookings}
                            onNavigateToTab={(tab) => setCurrentTab(tab)}
                        />
                    )}

                    {/* Users List tab */}
                    {currentTab === 'users' && (
                        <UserManagement
                            users={users}
                            bookings={bookings}
                            onAddUser={handleAddUser}
                            onUpdateUser={handleUpdateUser}
                            onDeleteUser={handleDeleteUser}
                            searchQuery={searchQuery}
                        />
                    )}

                    {/* Bookings Scheduler tab */}
                    {currentTab === 'bookings' && (
                        <BookingsManagement
                            bookings={bookings}
                            users={users}
                            availability={availability}
                            onAddBooking={handleAddBooking}
                            onUpdateBookingStatus={handleUpdateBookingStatus}
                            onDeleteBooking={handleDeleteBooking}
                        />
                    )}

                    {/* Operational Availability tab */}
                    {currentTab === 'availability' && (
                        <AvailabilityManager
                            availability={availability}
                            onToggleSlot={handleToggleSlot}
                            onApplyPreset={handleApplyPreset}
                        />
                    )}

                    {/* Applet Settings Panel */}
                    {currentTab === 'settings' && (
                        <SettingsPanel
                            adminProfile={admin}
                            onUpdateAdmin={persistAdminProfile}
                            onResetDatabase={handleResetDatabase}
                        />
                    )}
                </main>
            </div>

            {/* Global New Booking Handler sync */}
            {globalNewBookingOpen && currentTab === 'bookings' && (
                <div className="hidden">
                    {/* Component instance will auto mount. We configure simulated click downstream: */}
                    {setTimeout(() => setGlobalNewBookingOpen(false), 200)}
                </div>
            )}
        </div>
    );
}
