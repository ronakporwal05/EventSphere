import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateService } from '../services/certificate.service';
import { toast } from 'sonner';

export const useCertificateData = () => {
  const queryClient = useQueryClient();

  const certificatesQuery = useQuery({
    queryKey: ['certificates'],
    queryFn: certificateService.getCertificates,
  });

  const bulkIssueMutation = useMutation({
    mutationFn: (eventId: string) => certificateService.issueBulkCertificates(eventId),
    onSuccess: () => {
      toast.success('Bulk certificates generated and emailed to attendees!');
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });

  return {
    certificates: certificatesQuery.data || [],
    isLoading: certificatesQuery.isLoading,
    issueBulk: bulkIssueMutation.mutate,
    isIssuing: bulkIssueMutation.isPending,
    downloadPDF: certificateService.downloadCertificatePDF,
  };
};
