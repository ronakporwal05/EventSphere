import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { volunteerService } from '../services/volunteer.service';
import { VolunteerShiftStatus } from '../types/volunteer.types';
import { toast } from 'sonner';

export const useVolunteerData = () => {
  const queryClient = useQueryClient();

  const volunteersQuery = useQuery({
    queryKey: ['volunteers'],
    queryFn: volunteerService.getVolunteers,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: VolunteerShiftStatus }) =>
      volunteerService.updateShiftStatus(id, status),
    onSuccess: () => {
      toast.success('Volunteer duty status updated!');
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: (message: string) => volunteerService.broadcastEmergencyAlert(message),
    onSuccess: () => {
      toast.success('Emergency broadcast dispatched to all active volunteer terminals!');
    },
  });

  return {
    volunteers: volunteersQuery.data?.volunteers || [],
    logs: volunteersQuery.data?.logs || [],
    isLoading: volunteersQuery.isLoading,
    updateStatus: statusMutation.mutate,
    broadcastEmergency: broadcastMutation.mutate,
  };
};
