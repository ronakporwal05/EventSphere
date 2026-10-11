'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle, XCircle, X } from 'lucide-react';
import { TicketItem } from '../types/ticket.types';

interface TicketVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<{ valid: boolean; ticket?: TicketItem }>;
}

export const TicketVerificationModal: React.FC<TicketVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
}) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ checked: boolean; valid: boolean; ticket?: TicketItem } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    try {
      const res = await onVerify(code);
      setResult({ checked: true, valid: res.valid, ticket: res.ticket });
    } catch {
      setResult({ checked: true, valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Ticket Verification Inspector</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCheck} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Enter Ticket Serial / Barcode
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. TKT-AI-2026-VIP-9941"
                className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Verify Authenticity
          </button>
        </form>

        {result?.checked && (
          <div className="pt-3 border-t border-neutral-800">
            {result.valid ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 text-emerald-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold text-sm">AUTHENTIC TICKET</span>
                </div>
                <p className="text-xs text-neutral-300">Ticket code verified on multi-tenant blockchain ledger.</p>
              </div>
            ) : (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1 text-rose-400">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5" />
                  <span className="font-bold text-sm">INVALID OR REDEEMED</span>
                </div>
                <p className="text-xs text-neutral-300">Serial code could not be verified or has expired.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
