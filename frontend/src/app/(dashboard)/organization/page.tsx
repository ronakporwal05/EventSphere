'use client';

import React, { useState } from 'react';
import { useOrganizationData } from '@/features/organization/hooks/useOrganizationData';
import { OrganizationTabNav, OrganizationTab } from '@/features/organization/components/OrganizationTabNav';
import { OrganizationProfileForm } from '@/features/organization/components/OrganizationProfileForm';
import { BrandingSettingsForm } from '@/features/organization/components/BrandingSettingsForm';
import { MemberListTable } from '@/features/organization/components/MemberListTable';
import { DepartmentList } from '@/features/organization/components/DepartmentList';
import { RolesPermissionsMatrix } from '@/features/organization/components/RolesPermissionsMatrix';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<OrganizationTab>('profile');
  const { organization, members, departments, isLoading, inviteMember, isInviting } = useOrganizationData();

  if (isLoading || !organization) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading Organization Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization & Multi-Tenant Management</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Manage organization profile, team members, departments, branding, and role matrix</p>
      </div>

      {/* Tab Navigation */}
      <OrganizationTabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'profile' && <OrganizationProfileForm org={organization} />}
      {activeTab === 'branding' && <BrandingSettingsForm org={organization} />}
      {activeTab === 'members' && (
        <MemberListTable
          members={members}
          departments={departments}
          onInvite={inviteMember}
          isInviting={isInviting}
        />
      )}
      {activeTab === 'departments' && <DepartmentList departments={departments} />}
      {activeTab === 'roles' && <RolesPermissionsMatrix />}
      {activeTab === 'settings' && (
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl max-w-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-neutral-800">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Tenant Advanced Governance</h3>
              <p className="text-xs text-neutral-400">Configure isolation boundaries and data retention policies</p>
            </div>
          </div>
          <p className="text-xs text-neutral-300">
            Multi-Tenant Isolation is enforced at database schema and API interceptor layers. Tenant Identifier: <span className="font-mono text-indigo-400 font-bold">{organization.id}</span>
          </p>
        </div>
      )}
    </div>
  );
}
