import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Kanari Docs',
    template: '%s | Kanari Docs',
  },
  description: 'Official documentation for Kanari Network - A High-Performance Event-Driven Ledger for Web5 Infrastructure. Powered by MoveVM and Post-Quantum Cryptography (PQC), providing a sub-0.1s secure data plane for Web2 integration and verifiable resource management.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
