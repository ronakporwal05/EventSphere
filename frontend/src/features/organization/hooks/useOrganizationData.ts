import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '../services/organization.service';
import { InviteMemberInput } from '../types/organization.types';
import { toast } from 'sonner';

export const useOrganizationData = () => {
  const queryClient = useQueryClient();

  const orgQuery = useQuery({
    queryKey: ['organization'],
    queryFn: organizationService.getOrganization,
  });

  const membersQuery = useQuery({
    queryKey: ['organization', 'members'],
    queryFn: organizationService.getMembers,
  });

  const departmentsQuery = useQuery({
    queryKey: ['organization', 'departments'],
    queryFn: organizationService.getDepartments,
  });

  const inviteMemberMutation = useMutation({
    mutationFn: (input: InviteMemberInput) => organizationService.inviteMember(input),
    onSuccess: () => {
      toast.success('Invitation sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization', 'members'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to send invitation.');
    },
  });

  return {
    organization: orgQuery.data,
    members: membersQuery.data || [],
    departments: departmentsQuery.data || [],
    isLoading: orgQuery.isLoading || membersQuery.isLoading,
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
  };
};
