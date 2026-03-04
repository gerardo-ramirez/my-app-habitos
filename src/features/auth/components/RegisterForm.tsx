'use client';

import { useState, useEffect } from 'react';
import { useRegister } from '../hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { toast } from '@/components/ui/use-toast';

interface RegisterFormProps {
  onToggleForm?: () => void;
  onRegisterSuccess?: (email: string) => void;
}

export const RegisterForm = ({ onToggleForm, onRegisterSuccess }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const register = useRegister();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Efecto para manejar la limpieza de la consola
  useEffect(() => {
    // Guardar la función original de console.error
    const originalConsoleError = console.error;
    
    // Reemplazar console.error con nuestra versión personalizada
    console.error = function(...args) {
      // Filtrar errores de autenticación de Supabase para evitar que aparezcan en la consola
      const errorString = args.join(' ');
      if (
        errorString.includes('Supabase') || 
        errorString.includes('auth') || 
        errorString.includes('email confirmation') ||
        errorString.includes('User already registered')
      ) {
        // No mostrar estos errores en la consola
        return;
      }
      
      // Para otros errores, usar la función original
      originalConsoleError.apply(console, args);
    };
    
    // Restaurar la función original cuando el componente se desmonte
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password || !confirmPassword) {
      setFormError('Por favor, completa todos los campos');
      return;
    }
    
    if (validatePassword()) {
      try {
        // Intentar registrar al usuario
        const result = await register.mutateAsync({ email, password });
        
        if (result?.error) {
          // Verificar si es un mensaje de confirmación de email
          if (result.error.isEmailConfirmation) {
            // Mostrar un toast informativo en lugar de un error
            toast({
              title: '¡Casi listo!',
              description: '¡Casi listo! Revisá tu bandeja de entrada para confirmar tu cuenta.',
              variant: 'default',
              icon: <CheckCircledIcon className="h-4 w-4 text-green-500" />
            });
            
            // Notificar registro exitoso si se proporcionó la función
            if (onRegisterSuccess) {
              onRegisterSuccess(email);
            } else {
              // Limpiar el formulario después de un registro exitoso
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }
          } else {
            // Es un error real, mostrar en el formulario
            setFormError(result.error.message);
          }
        } else if (result?.user) {
          // Usuario creado exitosamente
          if (!result.session) {
            // Si no hay sesión, es porque necesita confirmar su email
            toast({
              title: '¡Casi listo!',
              description: '¡Casi listo! Revisá tu bandeja de entrada para confirmar tu cuenta.',
              variant: 'default',
              icon: <CheckCircledIcon className="h-4 w-4 text-green-500" />
            });
            
            // Notificar registro exitoso si se proporcionó la función
            if (onRegisterSuccess) {
              onRegisterSuccess(email);
            } else {
              // Limpiar el formulario después de un registro exitoso
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }
          }
        }
      } catch (error: any) {
        // Capturar cualquier otro error no manejado
        setFormError(error?.message || 'Error desconocido al crear la cuenta');
        
        // Mostrar un toast para errores inesperados
        toast({
          title: 'Error',
          description: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900/50 border-zinc-800/50 backdrop-blur-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Crear Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className={formError && !email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className={passwordError || (formError && !password) ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              La contraseña debe tener al menos 6 caracteres
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar Contraseña
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className={passwordError || (formError && !confirmPassword) ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={register.isPending || !email || !password || !confirmPassword}
          >
            {register.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={onToggleForm}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </CardFooter>
    </Card>
  );
};