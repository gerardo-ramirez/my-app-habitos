'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export const SupabaseDiagnostic = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Verificar la URL y la clave anónima
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      const connectionInfo = {
        url: url ? url.substring(0, 15) + '...' : 'No configurado',
        key: key ? key.substring(0, 10) + '...' : 'No configurado',
        configured: !!(url && key)
      };

      // Intentar obtener la sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Intentar verificar si la autenticación por email está habilitada
      const { data: settingsData, error: settingsError } = await supabase.auth.getSettings();
      
      setResult({
        connectionInfo,
        session: sessionData,
        sessionError: sessionError ? {
          message: sessionError.message,
          status: sessionError.status
        } : null,
        settings: settingsData,
        settingsError: settingsError ? {
          message: settingsError.message,
          status: settingsError.status
        } : null
      });
    } catch (err: any) {
      console.error('Error en diagnóstico:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Diagnóstico de Supabase</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={testConnection} 
          className="w-full mb-4"
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Verificar conexión a Supabase'}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-zinc-900 rounded-md text-white text-sm">
            <h3 className="font-bold mb-2">Información de conexión:</h3>
            <pre className="whitespace-pre-wrap overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground">
        Esta herramienta ayuda a diagnosticar problemas con la conexión a Supabase
      </CardFooter>
    </Card>
  );
};