export interface MachineTypes {
  id: string;
  companyId: string;
  furnaceId: string;
  currentArticleId: string | null;
  currentArticleName?: string;
  currentCampaignId?: string | null;
  currentClientName?: string;
  name: string;
  status?: "operational" | "maintenance" | "shutdown";
}
