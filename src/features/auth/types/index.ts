import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  // Campos adicionales del usuario si los hubiera
}

export interface AuthSession extends Session {
  // Campos adicionales de la sesión si los hubiera
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  // Campos adicionales para el registro si los hubiera
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: AuthError | null;
}