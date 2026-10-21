'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editUserSchema, EditUserFormInput } from '../validation/user.schema';
import { UserItem } from '../types/user.types';
import { UserCog, X, Loader2 } from 'lucide-react';

interface UserEditModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, input: EditUserFormInput) => void;
  isUpdating: boolean;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  isUpdating,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormInput>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department || '',
        status: user.status,
      });
    }
  }, [user, reset]);

  if (!isOpen || !user) return null;

  const onSubmit = (data: EditUserFormInput) => {
    onSave(user.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <UserCog className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Edit User Profile & Role</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">First Name</label>
              <input
                {...register('firstName')}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.firstName && <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">Last Name</label>
              <input
                {...register('lastName')}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.lastName && <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">Role</label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="SYSTEM_ADMIN">System Admin</option>
                <option value="ORGANIZATION_ADMIN">Org Admin</option>
                <option value="EVENT_MANAGER">Event Manager</option>
                <option value="STAFF">Staff</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ATTENDEE">Attendee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="INACTIVE">Inactive</option>
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
              disabled={isUpdating}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5"
            >
              {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
