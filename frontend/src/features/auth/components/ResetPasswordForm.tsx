'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordInput } from '../validation/auth.schema';
import { authService } from '../services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export const ResetPasswordForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    try {
      await authService.resetPassword(data);
      toast.success('Password reset successful! Please sign in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired token.');
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
          <ShieldCheck className="w-3 h-3 text-[#f5ce32]" />
          <span>SECURITY</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">Set New Password</h1>
          <p className="text-xs text-neutral-600 font-medium mt-1">Create a secure password for your summit account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                {...register('newPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-semibold text-black placeholder-neutral-400 focus:outline-none focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-rose-600 font-bold mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                {...register('confirmNewPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-semibold text-black placeholder-neutral-400 focus:outline-none focus:bg-white"
              />
            </div>
            {errors.confirmNewPassword && <p className="text-xs text-rose-600 font-bold mt-1">{errors.confirmNewPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Resetting...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-neutral-200 text-center">
          <Link
            href="/login"
            className="text-xs font-black uppercase tracking-wider text-black hover:text-neutral-600 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
