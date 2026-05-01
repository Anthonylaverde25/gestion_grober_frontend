export interface ArticleDTO {
    id: string;
    company_id: string;
    client_id?: string;
    client?: {
        id: string;
        name: string;
    } | null;
    name: string;
}
