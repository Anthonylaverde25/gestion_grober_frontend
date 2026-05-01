import { z } from 'zod';

/**
 * ClientSchema
 * Validates the client form data using Zod.
 */
export const ClientSchema = z.object({
  commercialName: z.string().min(1, "Commercial name is required"),
  businessName: z.string().min(1, "Business name is required"),
  taxId: z.string().min(11, "Tax ID (CUIT) must be at least 11 digits"),
  technicalContact: z.string().optional().or(z.literal('')),
  email: z.string().email("Must be a valid email").optional().or(z.literal('')),
});

export type ClientFormData = z.infer<typeof ClientSchema>;
