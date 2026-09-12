'use client';

import React from 'react';
import { useUserData } from '@/features/users/hooks/useUserData';
import { UserFilterBar } from '@/features/users/components/UserFilterBar';
import { UserListTable } from '@/features/users/components/UserListTable';
import { Users, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UserManagementPage() {
  const {
    users,
    total,
    page,
    totalPages,
    isLoading,
    params,
    setParams,
    updateUser,
    isUpdating,
    toggleStatus,
  } = useUserData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise User Directory</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Manage user access, role assignments, avatar profiles, and account statuses</p>
        </div>
        <Link
          href="/organization?tab=members"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New User</span>
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <UserFilterBar params={params} setParams={setParams} />

      {/* User Data Table */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-neutral-400 font-medium">Querying User Directory...</p>
        </div>
      ) : (
        <UserListTable
          users={users}
          total={total}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          params={params}
          setParams={setParams}
          onUpdateUser={updateUser}
          isUpdating={isUpdating}
          onToggleStatus={toggleStatus}
        />
      )}
    </div>
  );
}
