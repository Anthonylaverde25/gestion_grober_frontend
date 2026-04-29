export interface MachineDTO {
  id: string;
  company_id: string;
  furnace_id: string;
  current_article: {
    id: string | null;
    name: string;
  };
  name: string;
  status: "operational" | "maintenance" | "shutdown";
}
