import { CompanyDTO } from "./CompanyDTO";

export interface UserDTO {
    id: number;
    name: string;
    email: string;
    roles: string[];
    is_active: boolean;
    last_active_company_id?: string | null;
    companies?: CompanyDTO[];
    modules?: string[];
}
