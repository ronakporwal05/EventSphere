'use client';

import React, { useState } from 'react';
import { TicketItem } from '../types/ticket.types';
import { Search, QrCode, Download, CheckCircle, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { QrCodePreviewModal } from './QrCodePreviewModal';
import { TicketVerificationModal } from './TicketVerificationModal';

interface TicketListTableProps {
  tickets: TicketItem[];
  onRegenerate: (id: string) => void;
  onDownloadPDF: (code: string) => void;
  onVerify: (code: string) => Promise<{ valid: boolean; ticket?: TicketItem }>;
}

export const TicketListTable: React.FC<TicketListTableProps> = ({
  tickets,
  onRegenerate,
  onDownloadPDF,
  onVerify,
}) => {
  const [search, setSearch] = useState('');
  const [previewTicket, setPreviewTicket] = useState<TicketItem | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const filtered = tickets.filter(
    (t) =>
      t.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      t.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
      t.eventName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white">Issued Event Passes & QR Badges ({tickets.length})</h3>
          <p className="text-xs text-neutral-400">Manage digital pass distribution, seat allocations, and verification state</p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search serial, attendee..."
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setIsVerifyOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Ticket</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">Serial Code</th>
              <th className="py-3 px-4">Attendee</th>
              <th className="py-3 px-4">Event</th>
              <th className="py-3 px-4">Pass Tier</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {filtered.map((tkt) => (
              <tr key={tkt.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-[11px] text-indigo-400 font-semibold">{tkt.ticketCode}</td>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-semibold text-white block">{tkt.attendeeName}</span>
                    <span className="text-[10px] text-neutral-400 block">{tkt.attendeeEmail}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-300 truncate max-w-[180px]">{tkt.eventName}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {tkt.ticketType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {tkt.status === 'VALID' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Valid
                    </span>
                  )}
                  {tkt.status === 'REDEEMED' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Redeemed
                    </span>
                  )}
                  {tkt.status === 'EXPIRED' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Expired
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => setPreviewTicket(tkt)}
                    title="Preview QR Code"
                    className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDownloadPDF(tkt.ticketCode)}
                    title="Download PDF Badge"
                    className="p-1.5 text-neutral-400 hover:text-indigo-400 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QrCodePreviewModal
        ticket={previewTicket}
        isOpen={!!previewTicket}
        onClose={() => setPreviewTicket(null)}
        onRegenerate={onRegenerate}
        onDownloadPDF={onDownloadPDF}
      />

      <TicketVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onVerify={onVerify}
      />
    </div>
  );
};
