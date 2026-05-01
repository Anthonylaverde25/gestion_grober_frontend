export interface ArticleTypes {
    id: string;
    companyId: string;
    clientId?: string;
    client?: {
        id: string;
        name: string;
    } | null;
    name: string;
}
