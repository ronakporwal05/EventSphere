import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { UserQueryParams, EditUserInput } from '../types/user.types';
import { toast } from 'sonner';

export const useUserData = () => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<UserQueryParams>({
    search: '',
    role: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const usersQuery = useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: EditUserInput }) =>
      userService.updateUser(userId, input),
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user.');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, currentStatus }: { userId: string; currentStatus: string }) =>
      userService.toggleUserStatus(userId, currentStatus),
    onSuccess: () => {
      toast.success('User status updated!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    },
  });

  return {
    users: usersQuery.data?.users || [],
    total: usersQuery.data?.total || 0,
    page: usersQuery.data?.page || 1,
    totalPages: usersQuery.data?.totalPages || 1,
    isLoading: usersQuery.isLoading,
    params,
    setParams,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    toggleStatus: toggleStatusMutation.mutate,
  };
};
