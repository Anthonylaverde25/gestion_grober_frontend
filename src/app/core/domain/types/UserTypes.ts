import { Company } from "../entities/Company";

export interface UserTypes {
    id: number;
    name: string;
    email: string;
    roles?: string[];
    isActive?: boolean;
    lastActiveCompanyId?: string | null;
    companies?: Company[];
}
