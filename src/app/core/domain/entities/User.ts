import { UserTypes } from '../types/UserTypes';
import { Company } from './Company';

export class User {
    public readonly id: number;
    public readonly name: string;
    public readonly email: string;
    public readonly roles: string[];
    public readonly companies: Company[];
    public readonly lastActiveCompanyId: string | null;
    public isActive: boolean;
    public readonly modules: string[];

    constructor(props: UserTypes) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.roles = props.roles ?? [];
        this.companies = props.companies ?? [];
        this.lastActiveCompanyId = props.lastActiveCompanyId ?? null;
        this.isActive = props.isActive ?? true;
        this.modules = props.modules ?? [];
    }
}
