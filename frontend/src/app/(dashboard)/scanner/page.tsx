'use client';

import React from 'react';
import { useScannerLogic } from '@/features/scanner/hooks/useScannerLogic';
import { CameraQrScanner } from '@/features/scanner/components/CameraQrScanner';
import { ManualCodeEntry } from '@/features/scanner/components/ManualCodeEntry';
import { ScanResultAlert } from '@/features/scanner/components/ScanResultAlert';
import { LiveAttendanceTelemetry } from '@/features/scanner/components/LiveAttendanceTelemetry';
import { Scan, Maximize2, ShieldCheck } from 'lucide-react';

export default function LiveScannerPage() {
  const { lastResult, isProcessing, stats, scanCode, clearResult } = useScannerLogic();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Live On-Site QR Scanner Terminal</h1>
          <p className="text-xs text-neutral-400 mt-0.5">High-speed turnstile barcode scanner, duplicate check-in prevention, and gate telemetry</p>
        </div>
        <button
          onClick={() => {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            }
          }}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 border border-neutral-700 transition-all"
        >
          <Maximize2 className="w-4 h-4 text-indigo-400" />
          <span>Turnstile Kiosk Mode</span>
        </button>
      </div>

      {/* Result Alert Overlay */}
      <ScanResultAlert result={lastResult} onClear={clearResult} />

      {/* Main Grid: Left Scanner / Right Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CameraQrScanner onScan={scanCode} isProcessing={isProcessing} />
          <ManualCodeEntry onScan={scanCode} isProcessing={isProcessing} />
        </div>

        <div>
          <LiveAttendanceTelemetry stats={stats} />
        </div>
      </div>
    </div>
  );
}
