import { z } from 'zod';

// Esquema para la creación de hábitos
export const habitCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .nullable()
    .optional(),
});

// Esquema para la actualización de hábitos
export const habitUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(100, 'El título no puede tener más de 100 caracteres')
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .nullable()
    .optional(),
  is_completed: z.boolean().optional(),
  last_completed_at: z.string().nullable().optional(),
});

// Tipos inferidos de los esquemas
export type HabitCreateInput = z.infer<typeof habitCreateSchema>;
export type HabitUpdateInput = z.infer<typeof habitUpdateSchema>;