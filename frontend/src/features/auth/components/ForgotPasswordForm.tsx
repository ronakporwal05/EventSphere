'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordInput } from '../validation/auth.schema';
import { authService } from '../services/auth.service';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export const ForgotPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data);
      setSent(true);
      toast.success('Password reset instructions sent to your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white text-black border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden">
      {/* Top Header Strip */}
      <div className="bg-[#f5ce32] border-b-2 border-black p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black uppercase tracking-tighter hover:opacity-80">
          EVENT SPHERE AI
        </Link>
        <div className="flex items-center space-x-1 px-2 py-0.5 bg-black text-[#f5ce32] rounded-full text-[10px] font-black uppercase">
          <KeyRound className="w-3 h-3 text-[#f5ce32]" />
          <span>RECOVERY</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">Forgot Password</h1>
          <p className="text-xs text-neutral-600 font-medium mt-1">
            {sent ? 'Check your inbox for the reset link.' : 'Enter your registered email to receive reset instructions.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@eventsphere.ai"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-semibold text-black placeholder-neutral-400 focus:outline-none focus:bg-white"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 font-bold mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Instructions</span>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <p className="text-xs font-bold text-neutral-800 bg-[#f5ce32]/20 p-4 rounded-xl border-2 border-black">
              If an account exists for that email, we have sent instructions to reset your password.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t-2 border-neutral-200 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-black uppercase tracking-wider text-black hover:text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1 stroke-[3]" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
