'use client';

import React, { useState } from 'react';
import { CertificateTemplateConfig } from '../types/certificate.types';
import { Award, Palette, Save, Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateTemplateDesignerProps {
  onIssueBulk: (eventId: string) => void;
  isIssuing: boolean;
}

export const CertificateTemplateDesigner: React.FC<CertificateTemplateDesignerProps> = ({
  onIssueBulk,
  isIssuing,
}) => {
  const [config, setConfig] = useState<CertificateTemplateConfig>({
    title: 'CERTIFICATE OF ACHIEVEMENT',
    subtitle: 'This is proudly presented to',
    primaryColor: '#4f46e5',
    accentColor: '#9333ea',
    issuerName: 'Alexander Wright',
    issuerTitle: 'General Conference Director',
  });

  const handleSave = () => {
    toast.success('Certificate Template Configuration Saved!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Controls */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Certificate Designer & Issuer</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1 border border-neutral-700"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Template</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Certificate Title Header
            </label>
            <input
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Presentation Subtitle
            </label>
            <input
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Authorized Signatory Name
              </label>
              <input
                value={config.issuerName}
                onChange={(e) => setConfig({ ...config, issuerName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Signatory Title
              </label>
              <input
                value={config.issuerTitle}
                onChange={(e) => setConfig({ ...config, issuerTitle: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onIssueBulk('evt-101')}
            disabled={isIssuing}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
            <span>Generate & Issue Bulk Certificates to Attendees</span>
          </button>
        </div>
      </div>

      {/* Visual Certificate Live Canvas Preview */}
      <div className="p-6 bg-neutral-950 border-2 border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden space-y-4">
        {/* Ornate Gold Border Accent */}
        <div className="w-full h-2 bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 rounded-t-xl" />

        <div className="space-y-2 max-w-md my-auto">
          <Award className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-black text-white tracking-widest uppercase">{config.title}</h2>
          <p className="text-xs text-neutral-400 italic">{config.subtitle}</p>

          {/* Dynamic Placeholder */}
          <div className="py-2 border-b-2 border-indigo-500/40 my-3">
            <span className="text-2xl font-serif font-bold text-amber-300">Dr. Sarah Jenkins</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            For outstanding participation and completion of keynote workshops at <br />
            <strong className="text-white">EventSphere AI Global Keynote 2026</strong>
          </p>
        </div>

        <div className="w-full pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 px-4">
          <div>
            <span className="font-bold text-white block">{config.issuerName}</span>
            <span className="text-[10px] text-neutral-500">{config.issuerTitle}</span>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] text-indigo-400 block font-bold">CERT-2026-ES-9901</span>
            <span className="text-[10px] text-neutral-500">Verified Blockchain Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
