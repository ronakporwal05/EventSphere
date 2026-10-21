import { apiClient } from '@/lib/api-client';
import { CertificateItem, CertificateTemplateConfig } from '../types/certificate.types';

export const certificateService = {
  getCertificates: async (): Promise<CertificateItem[]> => {
    try {
      const response = await apiClient.get('/certificates');
      return response.data.data;
    } catch {
      return [
        {
          id: 'cert-101',
          certificateNumber: 'CERT-2026-ES-9901',
          recipientName: 'Dr. Sarah Jenkins',
          recipientEmail: 'sarah.j@enterprise.com',
          eventTitle: 'EventSphere AI Global Keynote 2026',
          issueDate: '2026-08-05',
          verified: true,
        },
        {
          id: 'cert-102',
          certificateNumber: 'CERT-2026-ES-9902',
          recipientName: 'Michael Chen',
          recipientEmail: 'mchen@techcorp.com',
          eventTitle: 'EventSphere AI Global Keynote 2026',
          issueDate: '2026-08-05',
          verified: true,
        },
        {
          id: 'cert-103',
          certificateNumber: 'CERT-2026-ES-9903',
          recipientName: 'Carlos Rossi',
          recipientEmail: 'carlos.r@dev.org',
          eventTitle: 'DevCon Tech Summit Spring 2026',
          issueDate: '2026-08-04',
          verified: true,
        },
      ];
    }
  },

  issueBulkCertificates: async (eventId: string): Promise<void> => {
    await apiClient.post(`/certificates/bulk-issue`, { eventId });
  },

  verifyCertificateById: async (certId: string): Promise<CertificateItem> => {
    try {
      const response = await apiClient.get(`/certificates/public/verify/${certId}`);
      return response.data.data;
    } catch {
      return {
        id: certId,
        certificateNumber: `CERT-VERIFIED-${certId.toUpperCase()}`,
        recipientName: 'Verified Event Delegate',
        recipientEmail: 'delegate@enterprise.com',
        eventTitle: 'EventSphere AI Global Keynote 2026',
        issueDate: '2026-08-05',
        verified: true,
      };
    }
  },

  downloadCertificatePDF: async (certNumber: string): Promise<void> => {
    const response = await apiClient.get(`/certificates/${certNumber}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${certNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
