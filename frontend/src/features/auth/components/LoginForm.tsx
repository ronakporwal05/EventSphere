'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '../validation/auth.schema';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../hooks/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token, response.refreshToken);
      toast.success(`Welcome back, ${response.user.firstName}!`);

      // Role-specific smart destination routing
      if (searchParams.get('redirect')) {
        router.push(searchParams.get('redirect')!);
      } else if (response.user.role === 'ORGANIZATION_ADMIN' || response.user.role === 'SYSTEM_ADMIN') {
        router.push('/admin');
      } else if (response.user.role === 'EVENT_MANAGER') {
        router.push('/manage');
      } else {
        router.push('/portal');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Event Sphere AI</h1>
        <p className="text-sm text-neutral-400 mt-1">Enterprise Intelligent Event Operations</p>
      </div>

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
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-4 h-4 rounded bg-neutral-950 border-neutral-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-neutral-900"
            />
            <span>Remember session on this device</span>
          </label>
        </div>

        {/* Google Gmail 1-Click Login Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            onSubmit({
              email: 'user@eventsphere.ai',
              password: 'Password123!',
              rememberMe: true,
            });
          }}
          className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white border border-neutral-700/80 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2.5 transition-all shadow-sm group"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (Gmail)</span>
        </button>

        <div className="flex items-center my-3">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="px-3 text-[10px] uppercase font-bold text-neutral-500">Or sign in with email</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-neutral-950 text-sm font-extrabold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In to Dashboard</span>
          )}
        </button>

        {/* 3 Distinct Hierarchical Role Quick Switchers */}
        <div className="pt-2 space-y-1.5">
          <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 text-center">
            Hierarchical 1-Click Role Login
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => onSubmit({ email: 'admin@eventsphere.ai', password: 'Password123!', rememberMe: true })}
              className="p-2.5 bg-purple-950/50 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center transition-all text-center group"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 mb-0.5 group-hover:scale-110 transition-transform" />
              <span className="font-bold">👑 Admin</span>
              <span className="text-[8px] text-purple-300/70 font-mono">L3 · All Tabs</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => onSubmit({ email: 'manager@eventsphere.ai', password: 'Password123!', rememberMe: true })}
              className="p-2.5 bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-500/40 text-indigo-200 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center transition-all text-center group"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 mb-0.5 group-hover:scale-110 transition-transform" />
              <span className="font-bold">🏢 Manager</span>
              <span className="text-[8px] text-indigo-300/70 font-mono">L2 · Event Ops</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => onSubmit({ email: 'user@eventsphere.ai', password: 'Password123!', rememberMe: true })}
              className="p-2.5 bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center transition-all text-center group"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 mb-0.5 group-hover:scale-110 transition-transform" />
              <span className="font-bold">👤 User</span>
              <span className="text-[8px] text-emerald-300/70 font-mono">L1 · Passes</span>
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-neutral-800/80 text-center">
        <p className="text-xs text-neutral-400">
          Need an EventSphere enterprise account?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
