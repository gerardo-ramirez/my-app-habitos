// Configuración de cookies para la autenticación

// Opciones para cookies de autenticación
export const authCookieOptions = {
  // httpOnly: true evita que el JavaScript del cliente acceda a la cookie
  // Esto protege contra ataques XSS (Cross-Site Scripting)
  httpOnly: true,
  
  // secure: true asegura que la cookie solo se envíe a través de HTTPS
  // En desarrollo, podemos desactivarlo para usar HTTP
  secure: process.env.NODE_ENV === 'production',
  
  // sameSite: 'lax' protege contra ataques CSRF (Cross-Site Request Forgery)
  sameSite: 'lax' as const,
  
  // path: '/' hace que la cookie esté disponible en toda la aplicación
  path: '/',
  
  // maxAge: 30 días en segundos
  maxAge: 30 * 24 * 60 * 60,
};

// Nombres de cookies importantes para Supabase Auth
export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: 'sb-access-token',
  REFRESH_TOKEN: 'sb-refresh-token',
};

// Función para determinar si una cookie debe ser httpOnly
export function shouldBeHttpOnly(name: string): boolean {
  return name.includes('access_token') || name.includes('refresh_token');
}