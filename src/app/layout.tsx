import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import Menu from '@/components/layout/Menu';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'App de Hábitos',
  description: 'Una aplicación para hacer seguimiento de tus hábitos diarios',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-zinc-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950 min-h-screen`}>
        <Providers>
          <Menu />
          <Breadcrumbs />
          <main className="container mx-auto px-4 pb-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}