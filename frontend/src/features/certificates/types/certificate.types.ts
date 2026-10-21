export interface CertificateItem {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientEmail: string;
  eventTitle: string;
  issueDate: string;
  signatureUrl?: string;
  verified: boolean;
  downloadUrl?: string;
}

export interface CertificateTemplateConfig {
  title: string;
  subtitle: string;
  primaryColor: string;
  accentColor: string;
  issuerName: string;
  issuerTitle: string;
  logoUrl?: string;
}
