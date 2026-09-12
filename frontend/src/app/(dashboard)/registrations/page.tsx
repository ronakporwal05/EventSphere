'use client';

import React, { useState } from 'react';
import { useRegistrationData } from '@/features/registrations/hooks/useRegistrationData';
import { RegistrationDashboardOverview } from '@/features/registrations/components/RegistrationDashboardOverview';
import { AttendeeListTable } from '@/features/registrations/components/AttendeeListTable';
import { ApprovalQueueTable } from '@/features/registrations/components/ApprovalQueueTable';
import { WaitlistManager } from '@/features/registrations/components/WaitlistManager';
import { RegistrationFormBuilder } from '@/features/registrations/components/RegistrationFormBuilder';
import { Users, Clock, Sparkles, FormInput, Loader2 } from 'lucide-react';

export default function RegistrationsPage() {
  const [activeTab, setActiveTab] = useState<'attendees' | 'approval' | 'waitlist' | 'builder'>('attendees');
  const { registrations, metrics, isLoading, approve, reject, promote, exportCSV } = useRegistrationData();

  const pendingList = registrations.filter((r) => r.status === 'PENDING');
  const waitlistedList = registrations.filter((r) => r.status === 'WAITLISTED');

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading Registration Operations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview Cards */}
      <RegistrationDashboardOverview metrics={metrics} onExportCSV={exportCSV} />

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-neutral-800 pb-px overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('attendees')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center space-x-2 transition-all border-b-2 ${
            activeTab === 'attendees'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Attendee List ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approval')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center space-x-2 transition-all border-b-2 ${
            activeTab === 'approval'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Approval Queue ({pendingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('waitlist')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center space-x-2 transition-all border-b-2 ${
            activeTab === 'waitlist'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Waitlist Queue ({waitlistedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center space-x-2 transition-all border-b-2 ${
            activeTab === 'builder'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/40'
          }`}
        >
          <FormInput className="w-4 h-4" />
          <span>Checkout Form Builder</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'attendees' && <AttendeeListTable registrations={registrations} />}
      {activeTab === 'approval' && <ApprovalQueueTable pendingList={pendingList} onApprove={approve} onReject={reject} />}
      {activeTab === 'waitlist' && <WaitlistManager waitlistedList={waitlistedList} onPromote={promote} />}
      {activeTab === 'builder' && <RegistrationFormBuilder />}
    </div>
  );
}
