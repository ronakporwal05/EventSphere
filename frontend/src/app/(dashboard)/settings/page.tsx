'use client';

import React from 'react';
import { useSettingsData } from '@/features/settings/hooks/useSettingsData';
import { SystemIntegrationsForm } from '@/features/settings/components/SystemIntegrationsForm';
import { SecurityAuditLogTable } from '@/features/settings/components/SecurityAuditLogTable';
import { Settings, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { config, logs, isLoading, updateSettings, isUpdating } = useSettingsData();

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading System Settings & Tenant Configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & Security Audit Hub</h1>
          <p className="text-xs text-neutral-400 mt-0.5">SMTP email configuration, Stripe API keys, MFA enforcement, and audit logs</p>
        </div>
      </div>

      <SystemIntegrationsForm config={config} onSave={updateSettings} isUpdating={isUpdating} />

      <SecurityAuditLogTable logs={logs} />
    </div>
  );
}
