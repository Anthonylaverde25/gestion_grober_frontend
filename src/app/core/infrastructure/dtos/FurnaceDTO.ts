import { MachineDTO } from "./MachineDTO";

export interface FurnaceDTO {
    id: string;
    company_id: string;
    glass_type_id: number;
    name: string;
    max_capacity_tons: number;
    status: 'operational' | 'maintenance' | 'shutdown';
    machines?: MachineDTO[];
}
