// src/app/layout.tsx
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';

export const metadata = {
  title: 'Meli-Style Boilerplate',
  description: 'Arquitectura limpia con Next.js 15',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <header className="bg-white border-b p-4">
            <nav className="container mx-auto">
              <span className="font-bold text-blue-600">APP BOILERPLATE</span>
            </nav>
          </header>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}