import { z } from 'zod';

export const ArticleSchema = z.object({
  name: z.string().min(1, 'El nombre del artículo es obligatorio').max(100, 'El nombre es demasiado largo'),
});

export type ArticleFormData = z.infer<typeof ArticleSchema>;
