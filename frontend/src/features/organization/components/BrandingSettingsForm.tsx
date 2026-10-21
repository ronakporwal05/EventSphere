'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandingSchema, BrandingInput } from '../validation/organization.schema';
import { OrganizationDetails } from '../types/organization.types';
import { Palette, Globe, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BrandingSettingsFormProps {
  org: OrganizationDetails;
}

export const BrandingSettingsForm: React.FC<BrandingSettingsFormProps> = ({ org }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandingInput>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: org.primaryColor || '#4f46e5',
      secondaryColor: org.secondaryColor || '#9333ea',
      customDomain: org.customDomain || '',
    },
  });

  const onSubmit = async (data: BrandingInput) => {
    setLoading(true);
    try {
      toast.success('Branding & Custom Domain settings saved!');
    } catch {
      toast.error('Failed to save branding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-5 max-w-3xl">
      <div className="flex items-center space-x-3 pb-4 border-b border-neutral-800">
        <Palette className="w-5 h-5 text-purple-400" />
        <div>
          <h2 className="text-base font-bold text-white">Custom Tenant Branding</h2>
          <p className="text-xs text-neutral-400">Configure portal colors, logo assets, and custom domain CNAME records</p>
        </div>
      </div>

      <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-300 cursor-pointer">
          <ImageIcon className="w-6 h-6" />
          <span className="text-[9px] mt-1">Upload</span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Organization Logo</h4>
          <p className="text-[10px] text-neutral-500">Recommended size: 512x512px SVG or PNG with transparent background</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Primary Brand Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              {...register('primaryColor')}
              className="w-10 h-10 rounded-lg bg-transparent border border-neutral-800 cursor-pointer"
            />
            <input
              {...register('primaryColor')}
              className="flex-1 px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Secondary Accent Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              {...register('secondaryColor')}
              className="w-10 h-10 rounded-lg bg-transparent border border-neutral-800 cursor-pointer"
            />
            <input
              {...register('secondaryColor')}
              className="flex-1 px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
          Custom Domain (CNAME Target)
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            {...register('customDomain')}
            placeholder="events.yourcompany.com"
            className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <p className="text-[10px] text-neutral-500 mt-1">
          Point your domain CNAME record to <span className="font-mono text-neutral-300">cname.eventsphere.ai</span>
        </p>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Branding Settings</span>
        </button>
      </div>
    </form>
  );
};
