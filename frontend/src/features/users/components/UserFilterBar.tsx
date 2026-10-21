'use client';

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { UserQueryParams } from '../types/user.types';

interface UserFilterBarProps {
  params: UserQueryParams;
  setParams: React.Dispatch<React.SetStateAction<UserQueryParams>>;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({ params, setParams }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams((prev) => ({ ...prev, role: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleReset = () => {
    setParams({
      search: '',
      role: 'ALL',
      status: 'ALL',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          value={params.search || ''}
          onChange={handleSearchChange}
          placeholder="Search users by name, email..."
          className="w-full pl-9 pr-4 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-neutral-400">
          <Filter className="w-3.5 h-3.5" />
          <select
            value={params.role || 'ALL'}
            onChange={handleRoleChange}
            className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-neutral-900">All Roles</option>
            <option value="SYSTEM_ADMIN" className="bg-neutral-900">System Admin</option>
            <option value="ORGANIZATION_ADMIN" className="bg-neutral-900">Org Admin</option>
            <option value="EVENT_MANAGER" className="bg-neutral-900">Event Manager</option>
            <option value="STAFF" className="bg-neutral-900">Staff</option>
            <option value="VOLUNTEER" className="bg-neutral-900">Volunteer</option>
            <option value="ATTENDEE" className="bg-neutral-900">Attendee</option>
          </select>
        </div>

        <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-neutral-400">
          <select
            value={params.status || 'ALL'}
            onChange={handleStatusChange}
            className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-neutral-900">All Statuses</option>
            <option value="ACTIVE" className="bg-neutral-900">Active</option>
            <option value="PENDING" className="bg-neutral-900">Pending</option>
            <option value="INACTIVE" className="bg-neutral-900">Inactive</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          title="Reset Filters"
          className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
