export interface ExtractionDTO {
  id: string;
  machine_id: string;
  article_id: string;
  article_name?: string;
  article?: {
    id: string;
    name: string;
    company_id: string;
    [key: string]: any;
  };
  percentage: number;
  measured_at: string;
  is_active: boolean;
}
