'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircledIcon, EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons';

interface EmailConfirmationStatusProps {
  email?: string;
  onBackToLogin: () => void;
}

export const EmailConfirmationStatus = ({ email, onBackToLogin }: EmailConfirmationStatusProps) => {
  const handleResendEmail = () => {
    // Aquí podríamos implementar la lógica para reenviar el correo de confirmación
    // Por ahora, solo redirigimos al login
    onBackToLogin();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <EnvelopeOpenIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle>¡Casi listo!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">
          Hemos enviado un correo de confirmación a{' '}
          <span className="font-semibold">{email || 'tu dirección de correo'}</span>.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Por favor, revisa tu bandeja de entrada y haz clic en el enlace de confirmación para activar tu cuenta.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <CheckCircledIcon className="h-4 w-4 text-green-500" />
          <span>El correo puede tardar unos minutos en llegar</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleResendEmail}
        >
          <ReloadIcon className="mr-2 h-4 w-4" />
          No recibí el correo
        </Button>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={onBackToLogin}
        >
          Volver al inicio de sesión
        </Button>
      </CardFooter>
    </Card>
  );
};