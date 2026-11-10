'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { hasHierarchyAccess, resolveHierarchyRole } from '@/features/auth/utils/hierarchy';
import { OrganizerWorkspaceBar } from '@/features/organizer/components/OrganizerWorkspaceBar';
import { OrganizerAccessGate } from '@/features/organizer/components/OrganizerAccessGate';
import {
  Scan,
  Camera,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  Users,
  Activity,
  ArrowRight,
  Sparkles,
  Ticket,
  Clock,
  DoorOpen,
  Send,
  Eye,
  SlidersHorizontal,
  Lock,
  Crown,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';

type ScanStatus = 'SUCCESS' | 'ALREADY_REDEEMED' | 'INVALID';

interface ScanEventRecord {
  id: string;
  ticketCode: string;
  attendeeName: string;
  tier: 'VIP All-Access' | 'Executive' | 'Attendee';
  seat: string;
  status: ScanStatus;
  timestamp: string;
  gate: string;
  message: string;
}

const INITIAL_SCAN_LOG: ScanEventRecord[] = [
  {
    id: 'sc-1',
    ticketCode: 'TCK-ES-9842',
    attendeeName: 'Ronak Verma',
    tier: 'VIP All-Access',
    seat: 'A-4',
    status: 'SUCCESS',
    timestamp: '09:41:20 AM',
    gate: 'Gate 1 (West Hall)',
    message: 'Turnstile Unlocked. Welcome to EventSphere AI 2026.',
  },
  {
    id: 'sc-2',
    ticketCode: 'TCK-ES-8120',
    attendeeName: 'Elena Rostova',
    tier: 'Executive',
    seat: 'B-1',
    status: 'SUCCESS',
    timestamp: '09:40:15 AM',
    gate: 'Gate 1 (West Hall)',
    message: 'Turnstile Unlocked. Welcome to EventSphere AI 2026.',
  },
  {
    id: 'sc-3',
    ticketCode: 'TCK-ES-7741',
    attendeeName: 'Marcus Sterling',
    tier: 'VIP All-Access',
    seat: 'A-5',
    status: 'SUCCESS',
    timestamp: '09:38:52 AM',
    gate: 'Gate 1 (West Hall)',
    message: 'Turnstile Unlocked. Welcome to EventSphere AI 2026.',
  },
  {
    id: 'sc-4',
    ticketCode: 'TCK-DUPLICATE-9842',
    attendeeName: 'Duplicate Scanned Badge',
    tier: 'VIP All-Access',
    seat: 'A-4',
    status: 'ALREADY_REDEEMED',
    timestamp: '09:37:10 AM',
    gate: 'Gate 1 (West Hall)',
    message: 'ENTRY DENIED! Badge previously checked in at 09:41 AM.',
  },
];

export default function TurnstileScannerPage() {
  const { user, isAuthenticated, loginAsRole } = useAuthStore();
  const canAccess = isAuthenticated && hasHierarchyAccess(user?.role, 'EVENT_MANAGER');

  const [activeGate, setActiveGate] = useState('Gate 1 (West Hall)');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScan, setLastScan] = useState<ScanEventRecord | null>(INITIAL_SCAN_LOG[0]);
  const [scanHistory, setScanHistory] = useState<ScanEventRecord[]>(INITIAL_SCAN_LOG);
  const [totalEntries, setTotalEntries] = useState(892);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Web Audio Synthesizer Beeps (No external audio file dependency)
  const playSound = (type: 'SUCCESS' | 'ERROR') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'SUCCESS') {
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch A5
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // Low pitch A3 error buzz
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {}
  };

  // Real Camera Handling
  useEffect(() => {
    if (useRealCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(null);
        })
        .catch((err) => {
          setCameraError('Camera access denied or webcam not connected. Switched to HUD Scanner mode.');
          setUseRealCamera(false);
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealCamera]);

  // Execute Ticket Scan
  const executeScan = async (code: string) => {
    if (!code.trim() || isProcessing) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 450));

    const clean = code.trim().toUpperCase();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let newRecord: ScanEventRecord;

    if (clean.includes('DUPLICATE') || clean.includes('REDEEMED')) {
      newRecord = {
        id: `sc-${Date.now()}`,
        ticketCode: clean,
        attendeeName: 'Duplicate Scanned Badge',
        tier: 'Attendee',
        seat: 'D-3',
        status: 'ALREADY_REDEEMED',
        timestamp: timeNow,
        gate: activeGate,
        message: 'ENTRY DENIED! Badge previously checked in.',
      };
      playSound('ERROR');
      toast.error(`ENTRY BLOCKED: Badge ${clean} is already marked as checked in!`);
    } else if (clean.includes('INVALID') || clean.length < 5) {
      newRecord = {
        id: `sc-${Date.now()}`,
        ticketCode: clean,
        attendeeName: 'Unverified Visitor',
        tier: 'Attendee',
        seat: 'N/A',
        status: 'INVALID',
        timestamp: timeNow,
        gate: activeGate,
        message: 'INVALID BADGE! Corrupted signature or counterfeit.',
      };
      playSound('ERROR');
      toast.error(`INVALID BARCODE: ${clean} is not a verified EventSphere AI pass.`);
    } else {
      // Valid Check-In
      const isVip = clean.includes('VIP') || clean.includes('9842') || clean.includes('7741');
      const isExec = clean.includes('EXEC') || clean.includes('8120') || clean.includes('4390');
      const name = isVip
        ? 'Ronak Verma'
        : isExec
        ? 'Elena Rostova'
        : 'Siddharth Sen';
      const tier = isVip ? 'VIP All-Access' : isExec ? 'Executive' : 'Attendee';
      const seat = isVip ? 'A-4' : isExec ? 'B-1' : 'D-3';

      newRecord = {
        id: `sc-${Date.now()}`,
        ticketCode: clean,
        attendeeName: name,
        tier,
        seat,
        status: 'SUCCESS',
        timestamp: timeNow,
        gate: activeGate,
        message: `TURNSTILE OPEN // Welcome, ${name}! (${tier})`,
      };
      playSound('SUCCESS');
      toast.success(`VERIFIED: Turnstile gate unlocked for ${name} [${seat}]`);
      setTotalEntries((prev) => prev + 1);
    }

    setLastScan(newRecord);
    setScanHistory((prev) => [newRecord, ...prev.slice(0, 19)]);
    setManualCode('');
    setIsProcessing(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!canAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
        <ConferioTicker />
        <ConferioNavbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <OrganizerAccessGate featureName="Turnstile Optical Scanner" />
        </main>
        <ConferioFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Ticker */}
      <ConferioTicker />

      {/* 2. Navbar */}
      <ConferioNavbar />

      {/* 2.5 Organizer Dedicated Workspace Bar */}
      <OrganizerWorkspaceBar activeTab="scanner" />

      {/* 3. Hero Header Strip */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-3 border border-black shadow-[2px_2px_0px_#fff]">
              <Scan className="w-3.5 h-3.5 text-[#f5ce32]" />
              <span>ON-SITE OPTICAL TERMINAL // TURNSTILE GATE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              TURNSTILE SCANNER KIOSK
            </h1>

            <p className="text-xs sm:text-sm font-bold text-black/80 mt-2">
              Optical QR code badge verification, duplicate redemption prevention, and live arrival telemetry.
            </p>
          </div>

          {/* Controls: Gate Selector, Audio Toggle, Fullscreen */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Gate Selector */}
            <select
              value={activeGate}
              onChange={(e) => setActiveGate(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-black uppercase text-black focus:outline-none shadow-[3px_3px_0px_#000]"
            >
              <option value="Gate 1 (West Hall)">Gate 1 (West Hall)</option>
              <option value="Gate 2 (VIP Skyway)">Gate 2 (VIP Skyway)</option>
              <option value="Gate 3 (Keynote Arena)">Gate 3 (Keynote Arena)</option>
              <option value="Gate 4 (Staff & Speakers)">Gate 4 (Staff & Speakers)</option>
            </select>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.info(`Turnstile audio chime ${!soundEnabled ? 'Enabled' : 'Muted'}`);
              }}
              title="Toggle Audio Feedback"
              className={`p-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] transition-colors ${
                soundEnabled ? 'bg-black text-[#f5ce32]' : 'bg-white text-neutral-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] flex items-center space-x-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5 text-black" />
              <span>Fullscreen Kiosk</span>
            </button>

            <Link
              href="/manage"
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#fff]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Scanner Engine & Telemetry Grid */}
      <main className="py-10 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Viewfinder & Result Card (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Viewfinder Card */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse border border-black" />
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    Optical Scanner Viewport · {activeGate}
                  </span>
                </div>

                {/* Camera / Simulator Toggle */}
                <button
                  onClick={() => setUseRealCamera(!useRealCamera)}
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase border border-black transition-all ${
                    useRealCamera
                      ? 'bg-emerald-400 text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{useRealCamera ? 'Live Webcam Active' : 'HUD Simulator'}</span>
                  </div>
                </button>
              </div>

              {cameraError && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-xl text-xs font-bold text-amber-900">
                  {cameraError}
                </div>
              )}

              {/* Viewport Box */}
              <div className="relative w-full h-72 sm:h-80 bg-neutral-950 border-3 border-black rounded-2xl overflow-hidden flex items-center justify-center shadow-inner group">
                {/* Optional WebCam Stream */}
                {useRealCamera ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Optical Simulation HUD */
                  <div className="text-center p-6 space-y-3 z-0">
                    <div className="relative w-28 h-28 mx-auto border-2 border-dashed border-[#f5ce32] rounded-2xl flex items-center justify-center">
                      <Scan className="w-12 h-12 text-[#f5ce32] animate-bounce" />
                      {/* Target corner reticles */}
                      <span className="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-[#f5ce32]" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 border-t-3 border-r-3 border-[#f5ce32]" />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-3 border-l-3 border-[#f5ce32]" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-[#f5ce32]" />
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase text-white tracking-wider">
                        Position Attendee QR Badge in Frame
                      </p>
                      <p className="text-[11px] text-neutral-400 font-mono mt-1">
                        60 FPS Optical Engine · Auto-Detection Active
                      </p>
                    </div>
                  </div>
                )}

                {/* Animated Scanning Laser Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#f5ce32] to-transparent shadow-[0_0_20px_#f5ce32] animate-pulse top-1/2 -translate-y-1/2 pointer-events-none z-10" />

                {/* Corner Status Stamp */}
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/80 text-emerald-400 font-mono text-[10px] rounded border border-emerald-500/50">
                  READY
                </div>
              </div>

              {/* 1-Click Fast Simulation Scans */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-2">
                  Instant Simulation Triggers:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    disabled={isProcessing}
                    onClick={() => executeScan('TCK-ES-9842-VIP')}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-black rounded-xl text-left transition-colors"
                  >
                    <p className="text-[10px] font-black uppercase text-emerald-800 leading-tight">
                      ✓ VIP Valid
                    </p>
                    <p className="text-[9px] text-neutral-600 font-bold truncate">Ronak (A-4)</p>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => executeScan('TCK-ES-8120-EXEC')}
                    className="p-2 bg-blue-50 hover:bg-blue-100 border-2 border-black rounded-xl text-left transition-colors"
                  >
                    <p className="text-[10px] font-black uppercase text-blue-800 leading-tight">
                      ✓ Exec Valid
                    </p>
                    <p className="text-[9px] text-neutral-600 font-bold truncate">Elena (B-1)</p>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => executeScan('TCK-DUPLICATE-9842')}
                    className="p-2 bg-amber-50 hover:bg-amber-100 border-2 border-black rounded-xl text-left transition-colors"
                  >
                    <p className="text-[10px] font-black uppercase text-amber-800 leading-tight">
                      ⚠ Duplicate
                    </p>
                    <p className="text-[9px] text-neutral-600 font-bold truncate">Already Scanned</p>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => executeScan('INVALID-CODE-FAKE')}
                    className="p-2 bg-rose-50 hover:bg-rose-100 border-2 border-black rounded-xl text-left transition-colors"
                  >
                    <p className="text-[10px] font-black uppercase text-rose-800 leading-tight">
                      ✕ Reject Fake
                    </p>
                    <p className="text-[9px] text-neutral-600 font-bold truncate">Bad Signature</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Turnstile Status & Result Banner */}
            {lastScan && (
              <div
                className={`border-4 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000] animate-in fade-in zoom-in-95 ${
                  lastScan.status === 'SUCCESS'
                    ? 'bg-emerald-400 text-black'
                    : lastScan.status === 'ALREADY_REDEEMED'
                    ? 'bg-amber-400 text-black'
                    : 'bg-rose-500 text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
                      {lastScan.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-400 stroke-[3]" />
                      ) : lastScan.status === 'ALREADY_REDEEMED' ? (
                        <AlertTriangle className="w-7 h-7 text-amber-300 stroke-[3]" />
                      ) : (
                        <XCircle className="w-7 h-7 text-rose-300 stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-black text-white rounded">
                        {lastScan.status === 'SUCCESS'
                          ? 'TURNSTILE UNLOCKED'
                          : lastScan.status === 'ALREADY_REDEEMED'
                          ? 'ACCESS DENIED'
                          : 'SIGNATURE REJECTED'}
                      </span>
                      <h2 className="text-2xl font-black uppercase tracking-tight mt-1 leading-tight">
                        {lastScan.attendeeName}
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black uppercase bg-black text-white px-2.5 py-1 rounded-lg">
                    {lastScan.timestamp}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t-2 border-black/30 grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 bg-white/70 border-2 border-black rounded-xl">
                    <p className="text-[9px] font-black uppercase opacity-75">Ticket ID</p>
                    <p className="text-xs font-mono font-black text-black truncate">{lastScan.ticketCode}</p>
                  </div>
                  <div className="p-2.5 bg-white/70 border-2 border-black rounded-xl">
                    <p className="text-[9px] font-black uppercase opacity-75">Pass Tier</p>
                    <p className="text-xs font-black text-black truncate">{lastScan.tier}</p>
                  </div>
                  <div className="p-2.5 bg-white/70 border-2 border-black rounded-xl">
                    <p className="text-[9px] font-black uppercase opacity-75">Reserved Seat</p>
                    <p className="text-xs font-black text-black">{lastScan.seat}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-black text-white rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2">
                  <DoorOpen className="w-4 h-4 text-[#f5ce32]" />
                  <span>{lastScan.message}</span>
                </div>
              </div>
            )}

            {/* Manual Barcode / Ticket ID Quick-Entry */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
              <span className="text-xs font-black uppercase text-neutral-500 tracking-wider block mb-2">
                Manual Barcode / Pass ID Override
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeScan(manualCode);
                }}
                className="flex items-center space-x-2"
              >
                <div className="relative flex-1">
                  <Ticket className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter Ticket ID (e.g. TCK-ES-9842)..."
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!manualCode.trim() || isProcessing}
                  className="px-6 py-3 bg-black hover:bg-neutral-800 disabled:opacity-50 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center space-x-1.5"
                >
                  <span>Verify</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Telemetry & Rolling Scan Feed (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Gate Telemetry Card */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <span className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-black" />
                  <span>Turnstile Gate Telemetry</span>
                </span>
                <span className="text-[10px] font-black uppercase bg-[#f5ce32] text-black px-2 py-0.5 rounded border border-black">
                  LIVE 60 FPS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#fbfbf9] border-2 border-black rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-neutral-500">Total Scanned</p>
                  <p className="text-3xl font-black text-black mt-0.5">{totalEntries}</p>
                  <p className="text-[10px] font-bold text-neutral-600 mt-1">out of 1,500 Registered</p>
                </div>

                <div className="p-4 bg-[#fbfbf9] border-2 border-black rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-neutral-500">Inflow Velocity</p>
                  <p className="text-3xl font-black text-emerald-600 mt-0.5">48 / min</p>
                  <p className="text-[10px] font-bold text-neutral-600 mt-1">Normal flow · No delays</p>
                </div>
              </div>

              {/* Attendance Progress Meter */}
              <div>
                <div className="flex justify-between text-[11px] font-black uppercase text-black mb-1">
                  <span>Turnout Progress</span>
                  <span>{Math.round((totalEntries / 1500) * 100)}% Capacity</span>
                </div>
                <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden border-2 border-black">
                  <div
                    className="bg-[#f5ce32] h-full transition-all duration-500"
                    style={{ width: `${Math.round((totalEntries / 1500) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rolling Scan Activity Audit Feed */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    Live Gate Entry Stream
                  </span>
                  <p className="text-[10px] text-neutral-500 font-bold">Latest badge check-ins at turnstiles</p>
                </div>
                <button
                  onClick={() => {
                    setScanHistory([]);
                    toast.info('Cleared local scan session history');
                  }}
                  className="text-[10px] font-black uppercase text-neutral-500 hover:text-black underline"
                >
                  Clear Feed
                </button>
              </div>

              {scanHistory.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
                  <p className="text-xs font-black uppercase text-neutral-500">No scans logged yet</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {scanHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-50 border-2 border-black rounded-2xl flex items-center justify-between hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-2.5 h-2.5 rounded-full border border-black shrink-0 ${
                            item.status === 'SUCCESS'
                              ? 'bg-emerald-500'
                              : item.status === 'ALREADY_REDEEMED'
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-black text-black leading-tight">
                            {item.attendeeName}
                          </p>
                          <p className="text-[10px] font-mono text-neutral-600">
                            {item.ticketCode} · <span className="font-bold">{item.seat}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-black ${
                            item.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'ALREADY_REDEEMED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status === 'SUCCESS' ? 'VERIFIED' : item.status === 'ALREADY_REDEEMED' ? 'DUPLICATE' : 'REJECTED'}
                        </span>
                        <p className="text-[9px] font-mono text-neutral-500 mt-0.5">{item.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <ConferioFooter />
    </div>
  );
}
