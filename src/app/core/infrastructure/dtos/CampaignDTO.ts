export interface CampaignDTO {
  id: string;
  company_id: string;
  codigo: string;
  machine_id: string;
  article_id: string;
  client_id: string;
  operator_id?: string;
  status: 'ACTIVE' | 'PAUSED' | 'FINISHED' | 'CANCELLED';
  started_at: string;
  finished_at?: string;
  total_yield_records: number;
  observaciones?: string;
  client_name?: string;
  article_name?: string;
  machine?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
  article?: {
    id: string;
    name: string;
  };
}
