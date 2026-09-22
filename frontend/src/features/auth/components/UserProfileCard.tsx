'use client';

import React from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { User, Mail, Shield, Building, Calendar, CheckCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';

export const UserProfileCard: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    toast.success('Signed out successfully.');
    router.push('/login');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl max-w-2xl w-full">
      <div className="flex items-start justify-between pb-6 border-b border-neutral-800">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {user.role}
              </span>
              {user.emailVerified && (
                <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 inline-flex items-center space-x-1.5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800/80">
          <div className="flex items-center text-neutral-400 text-xs font-medium mb-1">
            <Building className="w-4 h-4 mr-2 text-indigo-400" />
            Tenant Context
          </div>
          <p className="text-sm font-semibold text-white">{user.tenantId || 'Default Tenant'}</p>
        </div>

        <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800/80">
          <div className="flex items-center text-neutral-400 text-xs font-medium mb-1">
            <Shield className="w-4 h-4 mr-2 text-purple-400" />
            Security Level
          </div>
          <p className="text-sm font-semibold text-white">Enterprise Role Authorization</p>
        </div>
      </div>
    </div>
  );
};
