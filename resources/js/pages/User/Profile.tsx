
import UserLayout from '@/layouts/User/UserLayout';
import ProfileHeader from '@/components/User/ProfileHeader';
import ProfilePage from '@/components/User/ProfilePage';
import { LayoutDashboard, CalendarDays, User, Bell } from 'lucide-react';
import { useState } from 'react';

export default function App() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <UserLayout>
            {/* Main Content Area */}
            <div className="flex min-h-screen flex-1 flex-col">
                {/* Top Header */}
                <ProfileHeader />

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {activeTab === 'profile' && <ProfilePage />}
                    {activeTab !== 'profile' && (
                        <div className="flex h-full items-center justify-center font-medium text-on-surface-variant">
                            Content for {activeTab} is coming soon.
                        </div>
                    )}
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t border-outline-variant bg-white px-4 md:hidden">
                    <MobileNavItem
                        id="dashboard"
                        label="Home"
                        icon={LayoutDashboard}
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <MobileNavItem
                        id="bookings"
                        label="Bookings"
                        icon={CalendarDays}
                        active={activeTab === 'bookings'}
                        onClick={() => setActiveTab('bookings')}
                    />
                    <MobileNavItem
                        id="profile"
                        label="Profile"
                        icon={User}
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <MobileNavItem
                        id="notifications"
                        label="Alerts"
                        icon={Bell}
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                    />
                </nav>
            </div>
        </UserLayout>
    );
}

function MobileNavItem({
    id,
    label,
    icon: Icon,
    active,
    onClick,
}: {
    id: string;
    label: string;
    icon: any;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-on-surface-variant'}`}
        >
            <Icon size={20} className={active ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    );
}
