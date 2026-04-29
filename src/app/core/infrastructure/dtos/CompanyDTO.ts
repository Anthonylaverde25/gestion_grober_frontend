export interface CompanyDTO {
    id: string;
    consortium_id: string;
    name: string;
    manager_id: string | null;
    is_active: boolean;
}
