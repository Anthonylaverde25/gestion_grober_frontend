import { z } from 'zod';

export const FurnaceSchema = z.object({
  name: z.string().min(1, 'El nombre del horno es obligatorio').max(100),
  glassTypeId: z.number().min(1, 'Debe seleccionar un tipo de vidrio'),
  maxCapacityTons: z.number().min(0.1, 'La capacidad debe ser mayor a 0'),
});

export type FurnaceFormData = z.infer<typeof FurnaceSchema>;
