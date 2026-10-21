'use client';

import React, { useState } from 'react';
import { OrganizationMember } from '../types/organization.types';
import { UserPlus, Search, Shield, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react';
import { InviteMemberModal } from './InviteMemberModal';
import { UserRole } from '@/features/auth/types/auth.types';

interface MemberListTableProps {
  members: OrganizationMember[];
  departments: { name: string }[];
  onInvite: (input: { email: string; role: UserRole; department: string }) => void;
  isInviting: boolean;
}

export const MemberListTable: React.FC<MemberListTableProps> = ({
  members,
  departments,
  onInvite,
  isInviting,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-bold text-white">Organization Members ({members.length})</h2>
          <p className="text-xs text-neutral-400">Manage user authorization and department affiliations</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-indigo-600/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search members by name, email, or department..."
          className="w-full pl-9 pr-4 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {filtered.map((member) => (
              <tr key={member.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/20">
                      {member.name[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{member.name}</span>
                      <span className="text-[10px] text-neutral-400 block">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                    {member.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-neutral-300">{member.department}</td>
                <td className="py-3 px-4">
                  {member.status === 'ACTIVE' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </span>
                  )}
                  {member.status === 'INVITED' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Clock className="w-3 h-3 mr-1" /> Invited
                    </span>
                  )}
                  {member.status === 'DEACTIVATED' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <XCircle className="w-3 h-3 mr-1" /> Inactive
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="p-1 text-neutral-500 hover:text-white rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={onInvite}
        isInviting={isInviting}
        departments={departments}
      />
    </div>
  );
};
