export interface LineYieldDTO {
  id: string;
  company_id: string;
  campaign_id: string;
  forming_yield: number;
  packing_yield: number;
  recorded_at: string;
  notes?: string;
  user_alias_id?: string | null;
  alias?: {
    id: string;
    name: string;
    legajo: string;
  } | null;
}
