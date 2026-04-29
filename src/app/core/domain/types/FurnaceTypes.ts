import { Machine } from "../entities/Machine";

export interface FurnaceTypes {
    id: string;
    companyId: string;
    glassTypeId: number;
    name: string;
    maxCapacityTons: number;
    status?: 'operational' | 'maintenance' | 'shutdown';
    machines?: Machine[];
}
