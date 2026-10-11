'use client';

import React from 'react';
import { TicketItem } from '../types/ticket.types';
import { QrCode, X, Download, RefreshCw, ShieldCheck } from 'lucide-react';

interface QrCodePreviewModalProps {
  ticket: TicketItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (id: string) => void;
  onDownloadPDF: (code: string) => void;
}

export const QrCodePreviewModal: React.FC<QrCodePreviewModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onRegenerate,
  onDownloadPDF,
}) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Encrypted QR Badge</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Simulated QR Canvas */}
        <div className="p-6 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner my-2">
          <div className="w-44 h-44 bg-neutral-900 p-2 rounded-xl flex items-center justify-center border-4 border-indigo-600">
            <QrCode className="w-36 h-36 text-white" />
          </div>
          <span className="mt-3 font-mono text-[11px] font-bold text-neutral-900 tracking-wider">
            {ticket.ticketCode}
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white">{ticket.attendeeName}</h4>
          <p className="text-neutral-400">{ticket.eventName}</p>
          <span className="inline-block px-2.5 py-0.5 mt-1 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
            {ticket.ticketType}
          </span>
        </div>

        <div className="pt-2 flex items-center justify-center space-x-2">
          <button
            onClick={() => onRegenerate(ticket.id)}
            title="Re-issue Token"
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownloadPDF(ticket.ticketCode)}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Badge (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
