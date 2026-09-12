import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AppProviders } from '@/providers/app-providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EventSphere AI — Enterprise Intelligence & Event Management',
  description: 'AI-driven multi-tenant event management and intelligence platform',
};

import { UniversalAiChatbot } from '@/components/UniversalAiChatbot';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-neutral-950 text-neutral-100 antialiased min-h-screen selection:bg-orange-500 selection:text-white`}>
        <AppProviders>
          {children}
          <UniversalAiChatbot />
        </AppProviders>
      </body>
    </html>
  );
}
