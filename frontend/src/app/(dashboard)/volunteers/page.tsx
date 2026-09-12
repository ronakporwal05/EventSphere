'use client';

import React, { useState } from 'react';
import { useVolunteerData } from '@/features/volunteers/hooks/useVolunteerData';
import { VolunteerRosterTable } from '@/features/volunteers/components/VolunteerRosterTable';
import { VolunteerAuditLog } from '@/features/volunteers/components/VolunteerAuditLog';
import { EmergencyBroadcastModal } from '@/features/volunteers/components/EmergencyBroadcastModal';
import { Users, AlertTriangle, Loader2 } from 'lucide-react';

export default function VolunteersPage() {
  const { volunteers, logs, isLoading, updateStatus, broadcastEmergency } = useVolunteerData();
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading Staff & Volunteer Operations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff & Volunteer Operations Workspace</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Turnstile staffing assignments, shift status management, and emergency broadcasts</p>
        </div>
        <button
          onClick={() => setIsBroadcastOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-rose-600/20 transition-all"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Emergency Gate Broadcast</span>
        </button>
      </div>

      {/* Roster Directory Table */}
      <VolunteerRosterTable volunteers={volunteers} onUpdateStatus={updateStatus} />

      {/* Gate Audit Log Feed */}
      <VolunteerAuditLog logs={logs} />

      {/* Emergency Modal */}
      <EmergencyBroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onBroadcast={broadcastEmergency}
      />
    </div>
  );
}
