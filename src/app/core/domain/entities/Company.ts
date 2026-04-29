import { CompanyTypes } from '../types/CompanyTypes';

export class Company {
    public readonly id: string;
    public readonly consortiumId: string;
    public readonly name: string;
    public managerId: string | null;
    public isActive: boolean;

    constructor(props: CompanyTypes) {
        this.id = props.id;
        this.consortiumId = props.consortiumId;
        this.name = props.name;
        this.managerId = props.managerId ?? null;
        this.isActive = props.isActive ?? true;
    }

    assignManager(managerId: string): void {
        this.managerId = managerId;
    }
}
