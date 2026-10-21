'use client';

import React from 'react';
import { UserItem } from '../types/user.types';
import { User, Mail, Shield, Building, Calendar, CheckCircle, Clock, XCircle, X, Upload } from 'lucide-react';

interface UserProfileModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">User Directory Inspector</span>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <button className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
              <Upload className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">Avatar</span>
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-xs text-neutral-400">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                {user.role}
              </span>
              {user.status === 'ACTIVE' && (
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" /> Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/80">
            <span className="text-neutral-500 block mb-0.5">Department</span>
            <span className="font-semibold text-white">{user.department || 'Unassigned'}</span>
          </div>

          <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/80">
            <span className="text-neutral-500 block mb-0.5">Tenant Isolation</span>
            <span className="font-semibold text-indigo-400 font-mono">{user.tenantId}</span>
          </div>

          <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/80">
            <span className="text-neutral-500 block mb-0.5">Account Created</span>
            <span className="font-semibold text-white">{user.createdAt}</span>
          </div>

          <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/80">
            <span className="text-neutral-500 block mb-0.5">Last Login Session</span>
            <span className="font-semibold text-white">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleTimeString() : 'Never'}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
