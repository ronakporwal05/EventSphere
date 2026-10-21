'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteMemberSchema, InviteMemberFormInput } from '../validation/organization.schema';
import { Mail, UserPlus, X, Loader2 } from 'lucide-react';
import { UserRole } from '@/features/auth/types/auth.types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (input: { email: string; role: UserRole; department: string }) => void;
  isInviting: boolean;
  departments: { name: string }[];
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  isInviting,
  departments,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'STAFF',
      department: departments[0]?.name || 'Event Operations',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: InviteMemberFormInput) => {
    onInvite(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Invite Team Member</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                {...register('email')}
                type="email"
                placeholder="colleague@enterprise.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Role Assignment
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ORGANIZATION_ADMIN">Org Admin</option>
                <option value="EVENT_MANAGER">Event Manager</option>
                <option value="STAFF">Staff Member</option>
                <option value="VOLUNTEER">Volunteer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <select
                {...register('department')}
                className="w-full px-3 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {departments.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInviting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5"
            >
              {isInviting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
