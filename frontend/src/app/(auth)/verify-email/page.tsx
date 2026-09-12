import React, { Suspense } from 'react';
import { VerifyEmailForm } from '@/features/auth/components/VerifyEmailForm';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Verify Email — EventSphere AI',
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="p-8 bg-neutral-900/90 rounded-2xl border border-neutral-800 flex items-center justify-center space-x-2 text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        <span className="text-xs font-medium">Loading Email Verification...</span>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
