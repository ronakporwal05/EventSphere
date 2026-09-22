'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const VerifyEmailForm: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const verify = useCallback(async () => {
    if (!token) {
      setStatus('error');
      setMessage('Missing email verification token.');
      return;
    }
    try {
      await authService.verifyEmail(token);
      setStatus('success');
      setMessage('Your email address has been successfully verified.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The token may be expired.');
    }
  }, [token]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="w-full max-w-md p-8 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl text-center">
      {status === 'verifying' && (
        <div className="py-6 flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
          <p className="text-xs text-neutral-400">Please wait while we confirm your credentials.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="py-6 flex flex-col items-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Email Verified!</h2>
          <p className="text-xs text-neutral-400 max-w-xs">{message}</p>
          <Link
            href="/login"
            className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl inline-flex items-center space-x-2 transition-all"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="py-6 flex flex-col items-center space-y-3">
          <XCircle className="w-12 h-12 text-rose-400" />
          <h2 className="text-xl font-bold text-white">Verification Failed</h2>
          <p className="text-xs text-neutral-400 max-w-xs">{message}</p>
          <Link
            href="/login"
            className="mt-4 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-xl inline-flex items-center space-x-2 transition-all"
          >
            <span>Return to Sign In</span>
          </Link>
        </div>
      )}
    </div>
  );
};
