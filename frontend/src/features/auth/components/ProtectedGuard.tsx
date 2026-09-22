'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '../types/auth.types';
import { Loader2 } from 'lucide-react';

interface ProtectedGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedGuard: React.FC<ProtectedGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading, initialize } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Verifying Enterprise Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-6">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-md">
          <h2 className="text-lg font-bold text-rose-400">Access Restricted</h2>
          <p className="text-xs text-neutral-400 mt-2">
            Your current role (<span className="font-mono text-white">{user.role}</span>) does not have permission to view this resource.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
