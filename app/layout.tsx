import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Blogger',
  description: 'Generated by AI',
};

import { ClerkProvider } from '@clerk/nextjs';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <ClerkProvider>
        <body className={inter.className}>
          <Header />
          <main>{children}</main>
          <Toaster position='top-right' theme='light' richColors />
        </body>
      </ClerkProvider>
    </html>
  );
}
