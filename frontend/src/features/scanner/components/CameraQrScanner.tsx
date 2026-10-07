'use client';

import React, { useState } from 'react';
import { Camera, Scan, Sparkles, RefreshCw } from 'lucide-react';

interface CameraQrScannerProps {
  onScan: (code: string) => void;
  isProcessing: boolean;
}

export const CameraQrScanner: React.FC<CameraQrScannerProps> = ({ onScan, isProcessing }) => {
  const [cameraActive, setCameraActive] = useState(true);

  // Simulated scan trigger for browser environments without webcams
  const simulateScan = (sampleCode: string) => {
    onScan(sampleCode);
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <Camera className="w-4 h-4 text-indigo-400" />
        <span>Optical Camera Scanner Terminal</span>
      </div>

      {/* Simulated Scanner Viewport View */}
      <div className="relative w-full max-w-sm h-64 bg-neutral-950 rounded-2xl border-2 border-dashed border-indigo-500/40 flex items-center justify-center overflow-hidden shadow-inner group">
        {/* Animated Scanning Laser Line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-pulse top-1/2 -translate-y-1/2 z-10" />

        <div className="text-center p-4 space-y-2 z-0">
          <Scan className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
          <p className="text-xs text-neutral-400 font-medium">Position Attendee QR Badge inside Frame</p>
          <span className="text-[10px] text-neutral-600 block">Auto-detection active • 60 FPS Optical Engine</span>
        </div>
      </div>

      {/* Quick Test Trigger Buttons */}
      <div className="pt-2 flex flex-wrap justify-center gap-2">
        <button
          disabled={isProcessing}
          onClick={() => simulateScan('TKT-AI-2026-VIP-9941')}
          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold rounded-xl transition-all"
        >
          Simulate Valid Scan
        </button>

        <button
          disabled={isProcessing}
          onClick={() => simulateScan('TKT-DUPLICATE-9941')}
          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[11px] font-semibold rounded-xl transition-all"
        >
          Simulate Duplicate Scan
        </button>

        <button
          disabled={isProcessing}
          onClick={() => simulateScan('INVALID-CODE')}
          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-semibold rounded-xl transition-all"
        >
          Simulate Invalid Scan
        </button>
      </div>
    </div>
  );
};
