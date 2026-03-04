'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

const Breadcrumbs = () => {
  const pathname = usePathname();
  
  // No mostrar breadcrumbs en la página principal
  if (pathname === '/') {
    return null;
  }
  
  // Crear la estructura de migas de pan basada en la ruta actual
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    
    // Siempre comenzar con la página de inicio
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Inicio',
        href: '/',
        isCurrentPage: paths.length === 0
      }
    ];
    
    // Construir el resto de las migas de pan
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Convertir el segmento de ruta a un nombre legible
      let label = '';
      switch (path) {
        case 'stats':
          label = 'Estadísticas';
          break;
        case 'habits':
          label = 'Hábitos';
          break;
        default:
          // Capitalizar primera letra y reemplazar guiones por espacios
          label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      }
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: index === paths.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <nav className="container mx-auto px-4 py-4 mt-16">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index === 0 ? (
              <Link 
                href={breadcrumb.href}
                className="flex items-center text-zinc-400 hover:text-zinc-50 transition-colors"
                aria-label={breadcrumb.label}
                tabIndex={0}
              >
                <Home size={16} />
              </Link>
            ) : (
              <>
                <ChevronRight size={16} className="text-zinc-600 mx-1" />
                {breadcrumb.isCurrentPage ? (
                  <span className="text-indigo-400">{breadcrumb.label}</span>
                ) : (
                  <Link 
                    href={breadcrumb.href}
                    className="text-zinc-400 hover:text-zinc-50 transition-colors"
                    aria-label={breadcrumb.label}
                    tabIndex={0}
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;