'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, LogOut } from 'lucide-react';
import { signOut } from '@/app/auth/actions';

const Menu = () => {
  const pathname = usePathname();

  // Eliminamos el manejador ya que usaremos formAction directamente

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800/50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Link 
            href="/"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              isActive('/') 
                ? 'bg-indigo-500/20 text-indigo-400' 
                : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50'
            }`}
          >
            <Home size={18} />
            <span>Inicio</span>
          </Link>
          
          <Link 
            href="/stats"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              isActive('/stats') 
                ? 'bg-indigo-500/20 text-indigo-400' 
                : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50'
            }`}
          >
            <BarChart2 size={18} />
            <span>Estadísticas</span>
          </Link>
        </div>
        
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 transition-colors"
            aria-label="Cerrar sesión"
            tabIndex={0}
          >
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Menu;