import { z } from 'zod';

export const CampaignSchema = z.object({
  machineId: z.string().uuid('Debe seleccionar una máquina'),
  articleId: z.string().uuid('Debe seleccionar un artículo'),
  clientId: z.string().uuid('Debe seleccionar un cliente'),
  codigo: z.string().max(50, 'El código es demasiado largo').optional().or(z.literal('')),
});

export type CampaignFormData = z.infer<typeof CampaignSchema>;
