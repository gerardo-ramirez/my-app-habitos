'use client';

import { useState } from 'react';
import { useLogin } from '../hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface LoginFormProps {
  onToggleForm?: () => void;
}

export const LoginForm = ({ onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Por favor, completa todos los campos');
      return;
    }
    
    const result = await login.mutateAsync({ email, password });
    
    if (result?.error) {
      setFormError(result.error.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900/50 border-zinc-800/50 backdrop-blur-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-zinc-50">Iniciar Sesión</CardTitle>
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
            <label htmlFor="email" className="text-sm font-medium text-zinc-400">
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
              className={formError ? "border-red-500 focus-visible:ring-red-500" : "bg-zinc-900/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20"}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-400">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={formError ? "border-red-500 focus-visible:ring-red-500" : "bg-zinc-900/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20"}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-500 text-zinc-950 hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
            disabled={login.isPending}
          >
            {login.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button variant="ghost" onClick={onToggleForm}>
          ¿No tienes cuenta? Regístrate
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Si no recuerdas tu contraseña, regístrate con el mismo email para crear una nueva cuenta.
        </p>
      </CardFooter>
    </Card>
  );
};