'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    // Mostrar un toast con el error
    toast({
      title: 'Ha ocurrido un error',
      description: error.message || 'Se ha producido un error inesperado.',
      variant: 'destructive',
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI alternativa
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-4">Algo salió mal</h2>
          <p className="text-red-600 mb-6 text-center">
            {this.state.error?.message || 'Se ha producido un error inesperado.'}
          </p>
          <Button 
            onClick={this.resetError}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            Intentar de nuevo
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;