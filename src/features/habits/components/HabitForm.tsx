'use client';

import { useState, useEffect } from 'react';
import { useCreateHabit } from '../hooks';
import { HabitCreate } from '../types';
import { habitCreateSchema, HabitCreateInput } from '../schemas';
import { toast } from '@/components/ui/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { getDistinctHabitTitles, toPascalCase } from '../services';

interface HabitFormProps {
  onSuccess?: () => void;
}

export const HabitForm = ({ onSuccess }: HabitFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [titleOptions, setTitleOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const createHabit = useCreateHabit();
  
  // Cargar las opciones de títulos al montar el componente
  useEffect(() => {
    const loadTitleOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const titles = await getDistinctHabitTitles();
        const options = titles.map(title => ({
          value: title,
          label: title
        }));
        setTitleOptions(options);
      } catch (error) {
        console.error('Error al cargar títulos:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    
    loadTitleOptions();
  }, []);

  const validateForm = (): boolean => {
    try {
      // Validar los datos con Zod
      habitCreateSchema.parse({
        title: title.trim(),
        description: description.trim() || null,
      });
      
      // Si no hay errores, limpiar el estado de errores
      setErrors({});
      return true;
    } catch (error: any) {
      // Si hay errores, actualizar el estado de errores
      if (error.errors) {
        const formattedErrors: { [key: string]: string } = {};
        
        error.errors.forEach((err: any) => {
          const path = err.path[0];
          formattedErrors[path] = err.message;
        });
        
        setErrors(formattedErrors);
      }
      
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar el formulario antes de enviar
    if (!validateForm()) {
      // Mostrar un toast con el error
      toast({
        title: 'Error de validación',
        description: 'Por favor, corrige los errores en el formulario',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const newHabit: HabitCreateInput = {
      title: toPascalCase(title.trim()), // Convertir a PascalCase antes de guardar
      description: description.trim() || null,
    };
    
    try {
      await createHabit.mutateAsync(newHabit);
      
      // Limpiar el formulario
      setTitle('');
      setDescription('');
      
      // Mostrar un toast de éxito
      toast({
        title: 'Hábito creado',
        description: 'El hábito se ha creado correctamente',
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al crear el hábito:', error);
      
      // Mostrar un toast con el error
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error al crear el hábito',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/50 glassmorphism rounded-lg shadow-md p-6 mb-6 border border-indigo-500/30">
      <h2 className="text-xl font-semibold mb-4 text-indigo-400">Crear nuevo hábito</h2>
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
          Título
        </label>
        {titleOptions.length > 0 ? (
          // Mostrar Combobox si hay opciones disponibles
          <>
            <Combobox
              options={titleOptions}
              value={title}
              onValueChange={(value) => {
                setTitle(value);
                // Limpiar el error cuando el usuario selecciona una opción
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: '' }));
                }
              }}
              placeholder="Selecciona o escribe un título..."
              emptyMessage="No se encontraron coincidencias."
              className={`w-full border ${
                errors.title ? 'border-red-500' : 'border-zinc-700'
              }`}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Se guardará en formato PascalCase (ej: "BailarSalsa")
            </p>
          </>
        ) : (
          // Mostrar input normal si no hay opciones
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Limpiar el error cuando el usuario empieza a escribir
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: '' }));
              }
            }}
            className={`w-full px-3 py-2 border bg-zinc-800/70 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-zinc-700'
            }`}
            placeholder="Ej: Beber 2L de agua"
            required
            disabled={isSubmitting}
          />
        )}
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            // Limpiar el error cuando el usuario empieza a escribir
            if (errors.description) {
              setErrors(prev => ({ ...prev, description: '' }));
            }
          }}
          className={`w-full px-3 py-2 border bg-zinc-800/70 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder="Describe tu hábito..."
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className={`w-full py-2 px-4 rounded-md font-medium text-zinc-900 
          ${!title.trim() || isSubmitting 
            ? 'bg-zinc-600 cursor-not-allowed text-zinc-400' 
            : 'bg-indigo-500 hover:bg-indigo-600 text-zinc-900'}`}
      >
        {isSubmitting ? 'Creando...' : 'Crear hábito'}
      </button>
    </form>
  );
};