'use client';

import React, { useState, useEffect } from 'react';
import { SystemSettingsConfig } from '../types/settings.types';
import { Settings, Shield, Key, Mail, CreditCard, Save, Lock } from 'lucide-react';

interface SystemIntegrationsFormProps {
  config?: SystemSettingsConfig;
  onSave: (data: Partial<SystemSettingsConfig>) => void;
  isUpdating: boolean;
}

export const SystemIntegrationsForm: React.FC<SystemIntegrationsFormProps> = ({
  config,
  onSave,
  isUpdating,
}) => {
  const [formData, setFormData] = useState<Partial<SystemSettingsConfig>>({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    stripePublicKey: '',
    webhookSecret: '',
    enforceMfa: true,
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Tenant System Configuration & API Keys</h3>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* SMTP Email Server */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          <Mail className="w-4 h-4 text-indigo-400" />
          <span>SMTP Email Provider Credentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] text-neutral-400 mb-1">SMTP Host Hostname</label>
            <input
              value={formData.smtpHost || ''}
              onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Port</label>
            <input
              type="number"
              value={formData.smtpPort || 587}
              onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) || 587 })}
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Stripe Payment Integration */}
      <div className="space-y-3 pt-3 border-t border-neutral-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Stripe Payment Gateway Key Settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Publishable Key</label>
            <input
              value={formData.stripePublicKey || ''}
              onChange={(e) => setFormData({ ...formData, stripePublicKey: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Webhook Secret Signature</label>
            <input
              type="password"
              value={formData.webhookSecret || ''}
              onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Security Policies */}
      <div className="space-y-3 pt-3 border-t border-neutral-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Tenant Security & MFA Governance</span>
        </div>

        <label className="flex items-center space-x-3 text-xs text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.enforceMfa || false}
            onChange={(e) => setFormData({ ...formData, enforceMfa: e.target.checked })}
            className="w-4 h-4 rounded bg-neutral-950 border-neutral-700 text-indigo-600 focus:ring-indigo-500"
          />
          <span>Enforce Mandatory 2FA / MFA authentication for all Organization Administrators</span>
        </label>
      </div>
    </form>
  );
};
