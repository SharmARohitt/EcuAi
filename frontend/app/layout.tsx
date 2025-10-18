import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ecuAi - Decentralized AI Marketplace',
  description: 'Trust the AI you use — Powering Trusted Intelligence for the Next AI Economy',
  keywords: ['AI', 'blockchain', 'decentralized', 'marketplace', 'Web3', 'DKG'],
  authors: [{ name: 'ecuAi Team' }],
  openGraph: {
    title: 'ecuAi - Decentralized AI Marketplace',
    description: 'Verifiable AI models with blockchain-powered provenance',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-900 text-white antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E293B',
                color: '#fff',
                border: '1px solid #334155',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
