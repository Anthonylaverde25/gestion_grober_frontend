import { z } from 'zod';

export const AliasSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  legajo: z.string().min(1, 'El legajo es requerido').max(50),
});

export type AliasFormData = z.infer<typeof AliasSchema>;
