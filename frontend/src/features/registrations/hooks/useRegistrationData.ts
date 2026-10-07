import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService } from '../services/registration.service';
import { toast } from 'sonner';

export const useRegistrationData = (eventId?: string) => {
  const queryClient = useQueryClient();

  const regQuery = useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => registrationService.getRegistrations(eventId),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => registrationService.approveRegistration(id),
    onSuccess: () => {
      toast.success('Registration approved!');
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => registrationService.rejectRegistration(id),
    onSuccess: () => {
      toast.success('Registration rejected.');
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  const promoteMutation = useMutation({
    mutationFn: (id: string) => registrationService.promoteWaitlist(id),
    onSuccess: () => {
      toast.success('Attendee promoted from waitlist to approved status!');
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  return {
    registrations: regQuery.data?.items || [],
    metrics: regQuery.data?.metrics || { totalRegistrations: 0, pendingApprovals: 0, waitlisted: 0, checkedIn: 0 },
    isLoading: regQuery.isLoading,
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    promote: promoteMutation.mutate,
    exportCSV: registrationService.exportRegistrationsCSV,
  };
};
