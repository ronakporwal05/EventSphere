'use client';

import React, { useState } from 'react';
import { UserItem, UserQueryParams, EditUserInput } from '../types/user.types';
import { CheckCircle, Clock, XCircle, Edit, Eye, Power, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { UserEditModal } from './UserEditModal';
import { UserProfileModal } from './UserProfileModal';

interface UserListTableProps {
  users: UserItem[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  params: UserQueryParams;
  setParams: React.Dispatch<React.SetStateAction<UserQueryParams>>;
  onUpdateUser: (data: { userId: string; input: EditUserInput }) => void;
  isUpdating: boolean;
  onToggleStatus: (data: { userId: string; currentStatus: string }) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({
  users,
  total,
  page,
  totalPages,
  isLoading,
  params,
  setParams,
  onUpdateUser,
  isUpdating,
  onToggleStatus,
}) => {
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [inspectingUser, setInspectingUser] = useState<UserItem | null>(null);

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-bold text-white">Platform Users Directory ({total})</h2>
          <p className="text-xs text-neutral-400">Multi-tenant role assignments, status management, and session logs</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">User Details</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 font-bold text-white flex items-center justify-center">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[10px] text-neutral-400 block">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-neutral-300">{user.department || '—'}</td>
                <td className="py-3 px-4">
                  {user.status === 'ACTIVE' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </span>
                  )}
                  {user.status === 'PENDING' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Clock className="w-3 h-3 mr-1" /> Pending
                    </span>
                  )}
                  {user.status === 'INACTIVE' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <XCircle className="w-3 h-3 mr-1" /> Inactive
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">{user.createdAt}</td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => setInspectingUser(user)}
                    title="View Inspector"
                    className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setEditingUser(user)}
                    title="Edit User"
                    className="p-1.5 text-neutral-400 hover:text-indigo-400 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleStatus({ userId: user.id, currentStatus: user.status })}
                    title={user.status === 'ACTIVE' ? 'Deactivate User' : 'Reactivate User'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      user.status === 'ACTIVE'
                        ? 'text-neutral-400 hover:text-rose-400 bg-neutral-800 hover:bg-neutral-700'
                        : 'text-neutral-400 hover:text-emerald-400 bg-neutral-800 hover:bg-neutral-700'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-3 text-xs text-neutral-400">
        <span>
          Showing page <span className="text-white font-semibold">{page}</span> of{' '}
          <span className="text-white font-semibold">{totalPages}</span>
        </span>
        <div className="flex items-center space-x-2">
          <button
            disabled={page <= 1}
            onClick={() => setParams((p) => ({ ...p, page: p.page! - 1 }))}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setParams((p) => ({ ...p, page: p.page! + 1 }))}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <UserEditModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(userId, input) => onUpdateUser({ userId, input })}
        isUpdating={isUpdating}
      />

      <UserProfileModal
        user={inspectingUser}
        isOpen={!!inspectingUser}
        onClose={() => setInspectingUser(null)}
      />
    </div>
  );
};
