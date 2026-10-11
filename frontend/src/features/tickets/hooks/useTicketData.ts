import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticket.service';
import { toast } from 'sonner';

export const useTicketData = () => {
  const queryClient = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getTickets,
  });

  const regenerateMutation = useMutation({
    mutationFn: (ticketId: string) => ticketService.regenerateTicketQR(ticketId),
    onSuccess: () => {
      toast.success('Ticket QR token re-issued successfully!');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  return {
    tickets: ticketsQuery.data?.tickets || [],
    tiers: ticketsQuery.data?.tiers || [],
    isLoading: ticketsQuery.isLoading,
    regenerateQR: regenerateMutation.mutate,
    downloadPDF: ticketService.downloadTicketPDF,
    verifyTicket: ticketService.verifyTicketCode,
  };
};
