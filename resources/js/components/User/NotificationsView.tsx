import React from 'react';
import { NotificationItem } from '@/types';
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  AlertCircle,
  Megaphone
} from 'lucide-react';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onToggleRead: (id: string) => void;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationsView({ 
  notifications, 
  onToggleRead, 
  onClearAll, 
  onMarkAllAsRead 
}: NotificationsViewProps) {
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'system'>('all');

  const filtered = notifications.filter(item => {
    if (filter === 'unread') return !item.read;
    if (filter === 'system') return item.type === 'info';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Megaphone className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      
      {/* Top action header for filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-neutral-900 p-4 border border-outline-variant rounded-2xl shadow-xs">
        
        <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all' 
              ? 'bg-white dark:bg-neutral-900 text-primary shadow-xs' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'unread' 
              ? 'bg-white dark:bg-neutral-900 text-primary shadow-xs' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'system' 
              ? 'bg-white dark:bg-neutral-900 text-primary shadow-xs' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Broadcasts
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={notifications.filter(n => !n.read).length === 0}
            className="text-primary hover:underline flex items-center gap-1 disabled:opacity-50 disabled:no-underline"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
          
          <span className="text-gray-300">|</span>

          <button
            type="button"
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="text-red-600 hover:underline flex items-center gap-1 disabled:opacity-50 disabled:no-underline"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>

      </div>

      {/* Notifications stack */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-outline-variant p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center text-gray-400">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Quiet as a whisper</h4>
            <p className="text-xs text-gray-500 max-w-sm">
              You are completely caught up! We will ping you here when upcoming bookings are confirmed or need action.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleRead(item.id)}
              className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all ${
                item.read
                ? 'bg-white dark:bg-neutral-900 border-outline-variant opacity-75'
                : 'bg-primary/5 border-primary ring-1 ring-primary/10'
              }`}
            >
              <div className="pt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className={`text-xs font-bold text-gray-900 dark:text-white ${!item.read ? 'font-extrabold' : ''}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-300 leading-normal">
                  {item.message}
                </p>
                {!item.read && (
                  <span className="inline-block mt-1 text-[9px] font-extrabold uppercase bg-primary text-white px-2 py-0.5 rounded-full">
                    NEW alert
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
