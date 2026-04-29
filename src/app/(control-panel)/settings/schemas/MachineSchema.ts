import { z } from "zod";

export const MachineSchema = z.object({
  furnaceId: z.string().min(1, "Debe seleccionar un horno"),
  name: z.string().min(1, "El nombre de la máquina es obligatorio").max(100),
  status: z.enum(["operational", "maintenance", "shutdown"]),
});

export type MachineFormData = z.infer<typeof MachineSchema>;
