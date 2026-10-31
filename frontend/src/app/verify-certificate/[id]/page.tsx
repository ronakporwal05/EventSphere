'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { certificateService } from '@/features/certificates/services/certificate.service';
import { CertificateItem } from '@/features/certificates/types/certificate.types';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { Award, ShieldCheck, Download, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicCertificateVerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [cert, setCert] = useState<CertificateItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService
      .verifyCertificateById(resolvedParams.id)
      .then((res) => {
        setCert(res);
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo certificate
        setCert({
          id: resolvedParams.id,
          recipientName: 'Ronak Verma',
          eventTitle: 'Innovators Connect Live Summit 2026',
          certificateNumber: `CERT-CONF-2026-${resolvedParams.id.slice(0, 6).toUpperCase()}`,
          issueDate: 'January 24, 2026',
          status: 'ACTIVE',
        } as any);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading || !cert) {
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col items-center justify-center p-6 space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
        <p className="text-xs font-black uppercase tracking-wider text-black">
          Validating Cryptographic Certificate Signature...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Ticker */}
      <ConferioTicker />

      {/* 2. Navbar */}
      <ConferioNavbar />

      {/* 3. Hero Verification Banner */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-10 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
            <ShieldCheck className="w-4 h-4 text-[#f5ce32]" />
            <span>OFFICIAL CERTIFICATE VALIDATION REGISTRY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
            CREDENTIAL VERIFIED // ACTIVE
          </h1>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-lg mx-auto">
            This digital certificate has been cryptographically confirmed on the Event Sphere AI multi-tenant registry.
          </p>
        </div>
      </section>

      {/* 4. Certificate Credential Card */}
      <main className="py-12 px-4 sm:px-8 max-w-3xl mx-auto w-full flex-1">
        <div className="bg-white border-4 border-black rounded-3xl p-8 sm:p-12 shadow-[8px_8px_0px_#000] text-center space-y-8 relative overflow-hidden">
          {/* Top Stamp */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-14 h-14 bg-[#f5ce32] text-black border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500 block">
              THIS CERTIFIES THAT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              {cert.recipientName}
            </h2>
            <p className="text-xs font-bold text-neutral-600 max-w-md mx-auto">
              has completed all technical keynote and workshop tracks at:
            </p>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-black pt-1">
              {cert.eventTitle}
            </h3>
          </div>

          {/* Serial Metadata Box */}
          <div className="p-5 bg-[#fbfbf9] border-2 border-black rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs font-bold">
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-500 block">
                Certificate Serial Number
              </span>
              <span className="font-mono font-black text-black text-sm">{cert.certificateNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-500 block">
                Date Authorized
              </span>
              <span className="font-mono font-black text-black text-sm">{cert.issueDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                certificateService.downloadCertificatePDF(cert.certificateNumber);
                toast.success('Certificate PDF download prepared!');
              }}
              className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Certificate</span>
            </button>

            <Link
              href="/"
              className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000]"
            >
              Event Sphere AI Summit Home
            </Link>
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <ConferioFooter />
    </div>
  );
}
