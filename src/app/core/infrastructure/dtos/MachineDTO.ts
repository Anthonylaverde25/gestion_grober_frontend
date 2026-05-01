export interface MachineDTO {
  id: string;
  company_id: string;
  furnace_id: string;
  current_article: {
    id: string | null;
    name: string;
  };
  current_campaign: {
    id: string;
    client_name: string;
  } | null;
  name: string;
  status: "operational" | "maintenance" | "shutdown";
}
