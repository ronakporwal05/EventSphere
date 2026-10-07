'use client';

import React from 'react';
import { ScanResult } from '../types/scanner.types';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

interface ScanResultAlertProps {
  result: ScanResult | null;
  onClear: () => void;
}

export const ScanResultAlert: React.FC<ScanResultAlertProps> = ({ result, onClear }) => {
  if (!result) return null;

  const isSuccess = result.type === 'SUCCESS';
  const isDuplicate = result.type === 'ALREADY_REDEEMED';

  return (
    <div
      className={`p-6 rounded-2xl border shadow-2xl flex items-start justify-between space-x-4 transition-all animate-in fade-in slide-in-from-top-4 ${
        isSuccess
          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50'
          : isDuplicate
          ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-amber-950/50'
          : 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-rose-950/50'
      }`}
    >
      <div className="flex items-start space-x-3">
        {isSuccess && <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />}
        {isDuplicate && <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />}
        {!isSuccess && !isDuplicate && <XCircle className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />}

        <div className="space-y-1">
          <h3 className="text-base font-extrabold tracking-tight uppercase">{result.message}</h3>
          {result.attendeeName && (
            <p className="text-sm font-semibold text-white">
              Attendee: <span className="underline">{result.attendeeName}</span> ({result.ticketType})
            </p>
          )}
          {result.ticketCode && (
            <p className="text-xs font-mono opacity-80">Serial Barcode: {result.ticketCode}</p>
          )}
          <span className="text-[10px] opacity-60 block">Timestamp: {result.scannedAt}</span>
        </div>
      </div>

      <button onClick={onClear} className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
