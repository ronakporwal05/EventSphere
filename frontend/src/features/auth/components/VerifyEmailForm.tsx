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
    <div className="w-full max-w-md bg-white text-black border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden text-center">
      {/* Top Header Strip */}
      <div className="bg-[#f5ce32] border-b-2 border-black p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black uppercase tracking-tighter hover:opacity-80">
          EVENT SPHERE AI
        </Link>
        <div className="flex items-center space-x-1 px-2 py-0.5 bg-black text-[#f5ce32] rounded-full text-[10px] font-black uppercase">
          <span>VERIFICATION</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {status === 'verifying' && (
          <div className="py-6 flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 text-black animate-spin" />
            <h2 className="text-xl font-black uppercase text-black">Verifying Credentials</h2>
            <p className="text-xs text-neutral-600 font-medium">Please wait while we confirm your email token...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#f5ce32] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <CheckCircle2 className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase text-black">Email Confirmed!</h2>
            <p className="text-xs text-neutral-600 font-medium max-w-xs">{message}</p>
            <Link
              href="/login"
              className="mt-4 px-6 py-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] inline-flex items-center space-x-2 transition-all"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6 flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-200 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <XCircle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase text-black">Verification Failed</h2>
            <p className="text-xs text-neutral-600 font-medium max-w-xs">{message}</p>
            <Link
              href="/login"
              className="mt-4 px-6 py-3 bg-white hover:bg-neutral-50 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] inline-flex items-center space-x-2 transition-all"
            >
              <span>Return to Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
