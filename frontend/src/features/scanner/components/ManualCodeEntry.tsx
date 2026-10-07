'use client';

import React, { useState } from 'react';
import { Keyboard, ArrowRight, Loader2 } from 'lucide-react';

interface ManualCodeEntryProps {
  onScan: (code: string) => void;
  isProcessing: boolean;
}

export const ManualCodeEntry: React.FC<ManualCodeEntryProps> = ({ onScan, isProcessing }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    onScan(code);
    setCode('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-3">
      <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
        <Keyboard className="w-4 h-4 text-indigo-400" />
        <span>Manual Barcode Entry (Hardware USB Gun Reader)</span>
      </div>

      <div className="flex items-center space-x-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Scan barcode or type serial code..."
          className="flex-1 px-4 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5 transition-all shrink-0"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          <span>Check In</span>
        </button>
      </div>
    </form>
  );
};
