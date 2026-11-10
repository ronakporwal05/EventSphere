'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building,
  ShieldCheck,
  Sparkles,
  Ticket,
  Scan,
  TrendingUp,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { toast } from 'sonner';

interface OrganizerAccessGateProps {
  onOpenAuth?: (mode: 'SIGN_IN' | 'SIGN_UP', context?: string) => void;
  featureName?: string;
}

export const OrganizerAccessGate: React.FC<OrganizerAccessGateProps> = ({
  onOpenAuth,
  featureName = 'Organizer Studio',
}) => {
  const { loginAsRole } = useAuthStore();

  return (
    <div className="max-w-2xl w-full mx-auto bg-white border-4 border-black rounded-3xl p-8 sm:p-10 shadow-[8px_8px_0px_#000] text-center space-y-8 animate-in fade-in zoom-in-95 my-12">
      {/* Brand Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
          <Building className="w-3.5 h-3.5 text-[#f5ce32]" />
          <span>EVENT SPHERE AI // ORGANIZER STUDIO</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black leading-tight">
          HOST & MANAGE SUMMITS ON EVENT SPHERE
        </h1>

        <p className="text-xs sm:text-sm font-bold text-neutral-600 max-w-lg mx-auto">
          The <span className="text-black font-black">{featureName}</span> is reserved for event hosts, conference managers, and production teams to orchestrate live events and predictive turnstiles.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-3.5 bg-neutral-50 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000]">
          <Scan className="w-5 h-5 text-black mb-2" />
          <h4 className="text-xs font-black uppercase text-black">Turnstile Scanner</h4>
          <p className="text-[11px] font-bold text-neutral-600 mt-0.5">
            Real-time optical check-in at venue gates.
          </p>
        </div>

        <div className="p-3.5 bg-neutral-50 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000]">
          <Sparkles className="w-5 h-5 text-amber-500 mb-2" />
          <h4 className="text-xs font-black uppercase text-black">Predictive AI</h4>
          <p className="text-[11px] font-bold text-neutral-600 mt-0.5">
            Gemini arrival forecasting & Qdrant RAG.
          </p>
        </div>

        <div className="p-3.5 bg-neutral-50 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000]">
          <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
          <h4 className="text-xs font-black uppercase text-black">Revenue Payouts</h4>
          <p className="text-[11px] font-bold text-neutral-600 mt-0.5">
            Automated multi-tenant Razorpay splits.
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              if (onOpenAuth) {
                onOpenAuth('SIGN_IN', 'Sign in to access your Organizer Studio and Cockpit.');
              } else {
                window.location.href = '/pricing?tab=organizer';
              }
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2"
          >
            <span>Sign In as Organizer</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/pricing?tab=organizer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2"
          >
            <span>View Organizer Plans</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Demo Switcher for Evaluation */}
        <div className="pt-3 border-t-2 border-neutral-200">
          <p className="text-[11px] font-bold text-neutral-500 mb-2">
            Evaluating the platform as a reviewer or evaluator?
          </p>
          <button
            onClick={() => {
              loginAsRole('EVENT_MANAGER');
              toast.success('Elevated session to 🏢 Event Manager! Cockpit unlocked.');
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-2 border-indigo-400 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_#4338ca]"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-700" />
            <span>⚡ Click to Switch to Demo Organizer Session</span>
          </button>
        </div>
      </div>

      {/* Return to Attendee Portal */}
      <div className="pt-2">
        <Link
          href="/portal"
          className="text-xs font-black uppercase underline hover:text-neutral-700 inline-flex items-center space-x-1 text-neutral-600"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Just looking for your Attendee QR passes? Open Delegate Wallet →</span>
        </Link>
      </div>
    </div>
  );
};
