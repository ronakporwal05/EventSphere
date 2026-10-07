import { useState } from 'react';
import { scannerService } from '../services/scanner.service';
import { ScanResult, TelemetryStats } from '../types/scanner.types';

export const useScannerLogic = () => {
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<TelemetryStats>({
    totalScanned: 3420,
    entryRatePerMinute: 42,
    recentScans: [],
  });

  const handleScanCode = async (code: string) => {
    if (isProcessing || !code.trim()) return;
    setIsProcessing(true);
    try {
      const result = await scannerService.processScan(code);
      setLastResult(result);
      if (result.type === 'SUCCESS') {
        setStats((prev) => ({
          ...prev,
          totalScanned: prev.totalScanned + 1,
          recentScans: [result, ...prev.recentScans.slice(0, 9)],
        }));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    lastResult,
    isProcessing,
    stats,
    scanCode: handleScanCode,
    clearResult: () => setLastResult(null),
  };
};
