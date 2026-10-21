'use client';

import React, { useState } from 'react';
import { CertificateItem } from '../types/certificate.types';
import { Search, Download, ShieldCheck, ExternalLink, Award } from 'lucide-react';
import Link from 'next/link';

interface CertificateListTableProps {
  certificates: CertificateItem[];
  onDownloadPDF: (certNumber: string) => void;
}

export const CertificateListTable: React.FC<CertificateListTableProps> = ({
  certificates,
  onDownloadPDF,
}) => {
  const [search, setSearch] = useState('');

  const filtered = certificates.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      c.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white">Issued Certificates Directory ({certificates.length})</h3>
          <p className="text-xs text-neutral-400">Track recipient credentials and public verification status</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificate or name..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">Certificate Serial</th>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Event Title</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {filtered.map((cert) => (
              <tr key={cert.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-[11px] text-indigo-400 font-bold">{cert.certificateNumber}</td>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-semibold text-white block">{cert.recipientName}</span>
                    <span className="text-[10px] text-neutral-400 block">{cert.recipientEmail}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-300 truncate max-w-[200px]">{cert.eventTitle}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">{cert.issueDate}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <Link
                    href={`/verify-certificate/${cert.id}`}
                    target="_blank"
                    className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors inline-block"
                    title="Public Verification Portal Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => onDownloadPDF(cert.certificateNumber)}
                    className="p-1.5 text-neutral-400 hover:text-indigo-400 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                    title="Download PDF Certificate"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
