'use client';

import React, { useState } from 'react';
import { InAppNotification } from '../types/notification.types';
import { Bell, Check, Info } from 'lucide-react';

interface InAppNotificationBellProps {
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
}

export const InAppNotificationBell: React.FC<InAppNotificationBellProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-neutral-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">In-App Notifications</h4>
            <span className="text-[10px] text-neutral-400">{unreadCount} Unread</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  n.read ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400' : 'bg-neutral-950 border-indigo-500/30 text-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-xs">{n.title}</span>
                  {!n.read && (
                    <button
                      onClick={() => onMarkAsRead(n.id)}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">{n.message}</p>
                <span className="text-[9px] text-neutral-500 block mt-1">{n.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
