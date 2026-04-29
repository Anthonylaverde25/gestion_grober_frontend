export interface MachineTypes {
  id: string;
  companyId: string;
  furnaceId: string;
  currentArticleId: string | null;
  currentArticleName?: string;
  name: string;
  status?: "operational" | "maintenance" | "shutdown";
}
