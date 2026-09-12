'use client';

import React from 'react';
import { ProtectedGuard } from '@/features/auth/components/ProtectedGuard';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { DashboardNavbar } from '@/features/dashboard/components/DashboardNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedGuard>
      <div className="min-h-screen bg-neutral-950 flex">
        {/* Sidebar Navigation */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardNavbar />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedGuard>
  );
}
