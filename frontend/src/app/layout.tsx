import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppProviders } from '@/providers/app-providers';
import { UniversalAiChatbot } from '@/components/UniversalAiChatbot';

export const metadata: Metadata = {
  title: 'Event Sphere AI — Enterprise Multi-Tenant Event & Intelligence Platform',
  description: 'Event Sphere AI is the next-generation event management, ticketing, turnstile operations, and predictive intelligence platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased min-h-screen bg-[#F8F7FA] text-[#1E0A3C] dark:bg-[#0A0A0C] dark:text-[#F3F4F6] selection:bg-[#F05537] selection:text-white transition-colors duration-200"
      >
        <AppProviders>
          {children}
          <UniversalAiChatbot />
        </AppProviders>
      </body>
    </html>
  );
}
