import { createBrowserClient } from '@supabase/ssr';
import { type Database } from '@/lib/database.types';

// Creamos una instancia del cliente de Supabase para el navegador
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Cliente de Supabase para el navegador (singleton)
export const supabase = createClient();

// Helper para obtener el usuario actual
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// Helper para obtener el ID del usuario actual
export const getCurrentUserId = async () => {
  const user = await getCurrentUser();
  return user?.id;
};

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Error detallado para depuración
  console.log('Error detallado:', {
    message: error.message,
    code: error.code,
    status: error.status,
    details: error.details,
    hint: error.hint,
    name: error.name,
    stack: error.stack
  });
  
  // Manejar específicamente el error de credenciales inválidas
  if (error.message && error.message.includes('Invalid login credentials')) {
    return {
      message: 'El email o la contraseña son incorrectos. Por favor, verifica tus datos e intenta nuevamente.',
      status: 401,
    };
  }
  
  // Manejar específicamente el error de "invalid input syntax for type uuid"
  if (error.message && error.message.includes('invalid input syntax for type uuid')) {
    return {
      message: 'Error de autenticación: ID de usuario inválido. Por favor, inicia sesión nuevamente.',
      status: 401,
    };
  }
  
  // Manejar otros errores comunes de Supabase
  if (error.code === 'PGRST116') {
    return {
      message: 'No tienes permiso para acceder a este recurso.',
      status: 403,
    };
  }
  
  if (error.code === '23505') {
    return {
      message: 'Ya existe un registro con estos datos.',
      status: 409,
    };
  }
  
  // Manejar errores de email ya en uso
  if (error.message && error.message.includes('User already registered')) {
    return {
      message: 'Este email ya está registrado. Por favor, utiliza otro email o intenta iniciar sesión.',
      status: 409,
    };
  }
  
  // Manejar errores de formato de email inválido
  if (error.message && error.message.includes('invalid email')) {
    return {
      message: 'El formato del email es inválido. Por favor, verifica que sea un email correcto.',
      status: 400,
    };
  }
  
  // Manejar errores de contraseña débil
  if (error.message && error.message.includes('password')) {
    return {
      message: 'La contraseña no cumple con los requisitos de seguridad. Debe tener al menos 6 caracteres.',
      status: 400,
    };
  }
  
  // Manejar mensajes de confirmación de email
  if (error.message && (
      error.message.includes('Email confirmation') || 
      error.message.includes('email confirmation') ||
      error.message.includes('confirm your email')
    )) {
    return {
      message: '¡Casi listo! Revisá tu bandeja de entrada para confirmar tu cuenta.',
      status: 200, // No es realmente un error, sino un paso del proceso
      isEmailConfirmation: true
    };
  }
  
  // Manejar errores de red
  if (error.message && (error.message.includes('network') || error.message.includes('fetch'))) {
    return {
      message: 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.',
      status: 503,
    };
  }
  
  return {
    message: error.message || 'Ha ocurrido un error con la base de datos',
    status: error.status || 500,
    originalError: JSON.stringify(error), // Incluir el error original para depuración
  };
};