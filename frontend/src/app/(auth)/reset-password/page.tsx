import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Reset Password — EventSphere AI',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="p-8 bg-neutral-900/90 rounded-2xl border border-neutral-800 flex items-center justify-center space-x-2 text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        <span className="text-xs font-medium">Loading Password Reset...</span>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
