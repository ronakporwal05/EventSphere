'use client';

import React from 'react';
import { useCertificateData } from '@/features/certificates/hooks/useCertificateData';
import { CertificateTemplateDesigner } from '@/features/certificates/components/CertificateTemplateDesigner';
import { CertificateListTable } from '@/features/certificates/components/CertificateListTable';
import { Award, Loader2 } from 'lucide-react';

export default function CertificatesPage() {
  const { certificates, isLoading, issueBulk, isIssuing, downloadPDF } = useCertificateData();

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading Certificate Credentials Studio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Certificates & Credentials Engine</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Design, issue, and publicly verify automated certificates of attendance</p>
        </div>
      </div>

      {/* Designer & Live Canvas */}
      <CertificateTemplateDesigner onIssueBulk={issueBulk} isIssuing={isIssuing} />

      {/* Issued Certificates Table */}
      <CertificateListTable certificates={certificates} onDownloadPDF={downloadPDF} />
    </div>
  );
}
