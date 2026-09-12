'use client';

import React, { useEffect, useState, use } from 'react';
import { certificateService } from '@/features/certificates/services/certificate.service';
import { CertificateItem } from '@/features/certificates/types/certificate.types';
import { Award, ShieldCheck, Download, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PublicCertificateVerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [cert, setCert] = useState<CertificateItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService.verifyCertificateById(resolvedParams.id).then((res) => {
      setCert(res);
      setLoading(false);
    });
  }, [resolvedParams.id]);

  if (loading || !cert) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Validating Cryptographic Certificate Signature...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative">
      <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        {/* Verification Status Banner */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>OFFICIALLY VERIFIED CERTIFICATE</span>
        </div>

        <div className="space-y-3">
          <Award className="w-16 h-16 text-amber-400 mx-auto" />
          <h1 className="text-2xl font-black tracking-tight">{cert.recipientName}</h1>
          <p className="text-xs text-neutral-400">
            Has successfully attended and fulfilled all requirements for:
          </p>
          <h2 className="text-lg font-bold text-indigo-400">{cert.eventTitle}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-left">
          <div>
            <span className="text-neutral-500 block mb-0.5">Certificate Serial Code</span>
            <span className="font-mono font-bold text-white">{cert.certificateNumber}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-0.5">Date Authorized</span>
            <span className="font-mono font-bold text-white">{cert.issueDate}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-center space-x-3">
          <button
            onClick={() => certificateService.downloadCertificatePDF(cert.certificateNumber)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Original PDF</span>
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
          Verified by <span className="text-neutral-300 font-semibold">EventSphere AI Multi-Tenant Trust Infrastructure</span>
        </div>
      </div>
    </div>
  );
}
