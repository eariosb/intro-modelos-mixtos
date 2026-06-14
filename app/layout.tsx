import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WebRProvider } from '@/components/WebRProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Introducción a los Modelos Mixtos | Curso Interactivo',
  description:
    'Curso interactivo sobre modelos lineales mixtos (LMM) y modelos lineales mixtos generalizados (GLMM), con código R ejecutable en el navegador vía WebR.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <WebRProvider>{children}</WebRProvider>
      </body>
    </html>
  );
}
