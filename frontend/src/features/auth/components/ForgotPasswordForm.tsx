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
    <div className="w-full max-w-md p-8 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 mb-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Forgot Password?</h1>
        <p className="text-sm text-neutral-400 mt-1">
          {sent ? 'Check your inbox for the reset link.' : 'Enter your work email to reset your password.'}
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                {...register('email')}
                type="email"
                placeholder="admin@eventsphere.ai"
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Link...</span>
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-4 space-y-4">
          <p className="text-xs text-neutral-300 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
            If an account exists for that email, we have sent instructions to reset your password.
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-neutral-800/80 text-center">
        <Link href="/login" className="inline-flex items-center text-xs text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};
