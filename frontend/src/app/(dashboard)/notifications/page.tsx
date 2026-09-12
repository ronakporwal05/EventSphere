'use client';

import React from 'react';
import { useNotificationData } from '@/features/notifications/hooks/useNotificationData';
import { NotificationTemplateBuilder } from '@/features/notifications/components/NotificationTemplateBuilder';
import { DeliveryStatusTracker } from '@/features/notifications/components/DeliveryStatusTracker';
import { InAppNotificationBell } from '@/features/notifications/components/InAppNotificationBell';
import { Bell, Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const { templates, inAppNotifications, stats, isLoading, dispatch, isDispatching, markAsRead } =
    useNotificationData();

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading Broadcast Notification Dispatcher...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notification & Communications Engine</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Automated broadcast templates, SMS alerts, delivery telemetry, and in-app feeds</p>
        </div>
        <InAppNotificationBell notifications={inAppNotifications} onMarkAsRead={markAsRead} />
      </div>

      {/* Delivery Telemetry Cards */}
      <DeliveryStatusTracker stats={stats} />

      {/* Template Builder & Dispatcher */}
      <NotificationTemplateBuilder templates={templates} onDispatch={dispatch} isDispatching={isDispatching} />
    </div>
  );
}
