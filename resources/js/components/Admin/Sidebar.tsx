import { LayoutDashboard, Calendar, Clock, Settings, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('Bookings');

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Bookings', icon: Calendar },
        { name: 'Availability', icon: Clock },
        { name: 'Settings', icon: Settings },
    ];

    return (
        <aside className="bg-surface-container-low border-outline-variant fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r p-4">
            <div className="mb-8 px-2">
                <h2 className="text-primary text-lg font-bold">Slotem Admin</h2>

                <p className="text-on-surface-variant text-xs font-medium">
                    Business Manager
                </p>
            </div>

            <nav className="flex-grow space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveItem(item.name)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                            activeItem === item.name
                                ? 'bg-secondary-container text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container-highest'
                        }`}
                    >
                        <item.icon
                            size={20}
                            fill={
                                activeItem === item.name
                                    ? 'currentColor'
                                    : 'none'
                            }
                        />

                        {item.name}
                    </button>
                ))}
            </nav>

            <button className="bg-primary text-primary-foreground mt-auto flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold">
                <Plus size={20} />
                New Booking
            </button>
        </aside>
    );
}
