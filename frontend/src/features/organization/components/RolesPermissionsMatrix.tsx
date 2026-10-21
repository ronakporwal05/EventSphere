'use client';

import React from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';

export const RolesPermissionsMatrix: React.FC = () => {
  const roles = ['SYSTEM_ADMIN', 'ORGANIZATION_ADMIN', 'EVENT_MANAGER', 'STAFF', 'VOLUNTEER'];

  const permissions = [
    { name: 'Manage Organization & Branding', admin: true, orgAdmin: true, manager: false, staff: false, volunteer: false },
    { name: 'Create & Edit Events', admin: true, orgAdmin: true, manager: true, staff: false, volunteer: false },
    { name: 'Manage Tickets & Capacity', admin: true, orgAdmin: true, manager: true, staff: true, volunteer: false },
    { name: 'Execute Live Scanner Check-in', admin: true, orgAdmin: true, manager: true, staff: true, volunteer: true },
    { name: 'Access AI Studio & RAG Docs', admin: true, orgAdmin: true, manager: true, staff: true, volunteer: false },
    { name: 'Issue Certificates', admin: true, orgAdmin: true, manager: true, staff: false, volunteer: false },
    { name: 'View Financial Analytics BI', admin: true, orgAdmin: true, manager: false, staff: false, volunteer: false },
  ];

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-3 pb-4 border-b border-neutral-800">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <div>
          <h2 className="text-base font-bold text-white">Role-Based Access Control Matrix</h2>
          <p className="text-xs text-neutral-400">Granular permission breakdown enforced by Spring Security & Next.js Guards</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">Permission Name</th>
              <th className="py-3 px-4 text-center">System Admin</th>
              <th className="py-3 px-4 text-center">Org Admin</th>
              <th className="py-3 px-4 text-center">Event Manager</th>
              <th className="py-3 px-4 text-center">Staff</th>
              <th className="py-3 px-4 text-center">Volunteer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {permissions.map((perm) => (
              <tr key={perm.name} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-neutral-200">{perm.name}</td>
                <td className="py-3.5 px-4 text-center">
                  <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                </td>
                <td className="py-3.5 px-4 text-center">
                  {perm.orgAdmin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {perm.manager ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {perm.staff ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {perm.volunteer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-600 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
