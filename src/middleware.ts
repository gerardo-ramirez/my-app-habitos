import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este middleware solo se ejecutará en las rutas que coincidan con el matcher
export async function middleware(request: NextRequest) {
  let response = NextResponse.next();
  
  // Crear un cliente de Supabase específico para el middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // Verificar si hay una sesión activa
  const { data: { session } } = await supabase.auth.getSession();
  
  // Si no hay sesión y la ruta está bajo /habits, redirigir a /auth
  if (!session && request.nextUrl.pathname.startsWith('/habits')) {
    const redirectUrl = new URL('/auth', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return response;
}

// Configurar el middleware para que solo se ejecute en las rutas bajo /habits
export const config = {
  matcher: ['/habits/:path*'],
};