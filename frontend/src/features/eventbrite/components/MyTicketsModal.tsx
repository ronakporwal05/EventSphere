'use client';

import React from 'react';
import Link from 'next/link';
import { X, Ticket, QrCode, Download, Calendar, MapPin, CheckCircle2, Armchair, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export interface ConfirmedPass {
  id: string;
  ticketNumber: string;
  eventTitle: string;
  date: string;
  location: string;
  tier: string;
  seat?: string;
  price: number;
  status: string;
}

interface MyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: ConfirmedPass[];
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  isOpen,
  onClose,
  tickets,
}) => {
  if (!isOpen) return null;

  const handleDownload = (ticketNum: string) => {
    toast.success(`Downloading PDF pass for ${ticketNum}...`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white text-black rounded-3xl shadow-[10px_10px_0px_#000] border-3 border-black overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#f5ce32] border-b-3 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black text-[#f5ce32] border-2 border-black shadow-[2px_2px_0px_#000]">
              <Ticket className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 bg-black text-[#f5ce32] text-[9px] font-black uppercase rounded mb-0.5 border border-black">
                ATTENDEE WALLET
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight">
                My Passes & QR Tickets
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Passes Modal"
            className="p-2 rounded-xl bg-black hover:bg-neutral-800 text-white border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tickets List */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 bg-[#fbfbf9]">
          {tickets.length === 0 ? (
            <div className="p-10 text-center space-y-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
              <Ticket className="w-12 h-12 text-neutral-400 mx-auto" />
              <h4 className="text-lg font-black uppercase text-black">
                No tickets issued yet
              </h4>
              <p className="text-xs text-neutral-600 font-bold max-w-sm mx-auto">
                Explore the events catalog and book your passes using our fast Razorpay checkout.
              </p>
              <Link
                href="/pricing"
                onClick={onClose}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] transition-all"
              >
                <span>Browse Summit Passes</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          ) : (
            tickets.map((tck) => (
              <div
                key={tck.id}
                className="p-5 rounded-2xl border-2 border-black bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_#000]"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#f5ce32] text-black border border-black shadow-[1px_1px_0px_#000]">
                      {tck.status}
                    </span>
                    <span className="text-xs font-mono font-black text-black">
                      {tck.ticketNumber}
                    </span>
                  </div>

                  <h4 className="text-base font-black uppercase text-black leading-snug">
                    {tck.eventTitle}
                  </h4>

                  <div className="space-y-1 text-xs font-bold text-neutral-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                      <span>{tck.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                      <span className="truncate">{tck.location}</span>
                    </div>
                    {tck.seat && (
                      <div className="flex items-center gap-1.5 text-black font-black">
                        <Armchair className="w-3.5 h-3.5 text-black shrink-0" />
                        <span>Reserved Seat: {tck.seat}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1 text-xs font-black text-black">
                    Tier: <span className="underline decoration-[#f5ce32] decoration-2">{tck.tier}</span> &bull; Paid: ₹{tck.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* QR Code & Actions */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l-2 md:border-black md:pl-5">
                  <div className="p-2.5 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center">
                    <QrCode className="w-16 h-16 text-black" />
                    <span className="text-[9px] font-mono text-black mt-1 uppercase font-black">Fast Turnstile</span>
                  </div>

                  <button
                    onClick={() => handleDownload(tck.ticketNumber)}
                    className="px-4 py-2 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#000] transition-all"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-3 border-black bg-white flex items-center justify-between">
          <Link
            href="/portal"
            onClick={onClose}
            className="text-xs font-black uppercase tracking-wider text-black hover:text-neutral-700 flex items-center gap-1.5"
          >
            <span>Open Full Attendee Wallet</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#f5ce32]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
