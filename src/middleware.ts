import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // Si ya estamos en el servidor, no podemos establecer cookies en la respuesta
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // Si ya estamos en el servidor, no podemos eliminar cookies de la respuesta
          response.cookies.delete(name);
        },
      },
    }
  );

  // Opcional: Verificar la sesión y redirigir según sea necesario
  // const { data: { session } } = await supabase.auth.getSession();

  return response;
}

// Opcional: Configurar las rutas que deben usar el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto:
     * 1. Todas las rutas que comienzan con /api, _next, _vercel, _static, favicon.ico, robots.txt
     * 2. Todas las rutas que terminan con archivos estáticos como imágenes, fuentes, iconos, etc.
     */
    '/((?!api|_next|_vercel|_static|favicon.ico|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font|manifest)).*)',
  ],
};