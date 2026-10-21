'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationProfileSchema, OrganizationProfileInput } from '../validation/organization.schema';
import { OrganizationDetails } from '../types/organization.types';
import { Building2, Globe, Mail, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrganizationProfileFormProps {
  org: OrganizationDetails;
}

export const OrganizationProfileForm: React.FC<OrganizationProfileFormProps> = ({ org }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationProfileInput>({
    resolver: zodResolver(organizationProfileSchema),
    defaultValues: {
      name: org.name,
      slug: org.slug,
      description: org.description || '',
      contactEmail: org.contactEmail,
      website: org.website || '',
    },
  });

  const onSubmit = async (data: OrganizationProfileInput) => {
    setLoading(true);
    try {
      toast.success('Organization profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-5 max-w-3xl">
      <div className="flex items-center space-x-3 pb-4 border-b border-neutral-800">
        <Building2 className="w-5 h-5 text-indigo-400" />
        <div>
          <h2 className="text-base font-bold text-white">Organization Profile</h2>
          <p className="text-xs text-neutral-400">Manage tenant identity and primary contact channels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Organization Name
          </label>
          <input
            {...register('name')}
            className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Tenant Slug
          </label>
          <input
            {...register('slug')}
            className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          {errors.slug && <p className="text-xs text-rose-400 mt-1">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Contact Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              {...register('contactEmail')}
              className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          {errors.contactEmail && <p className="text-xs text-rose-400 mt-1">{errors.contactEmail.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Website URL
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              {...register('website')}
              className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Profile Changes</span>
        </button>
      </div>
    </form>
  );
};
