import { FurnaceTypes } from '../types/FurnaceTypes';
import { Machine } from './Machine';

export class Furnace {
    public readonly id: string;
    public readonly companyId: string;
    public readonly glassTypeId: number;
    public readonly name: string;
    public readonly maxCapacityTons: number;
    public status: 'operational' | 'maintenance' | 'shutdown';
    public machines: Machine[];

    private constructor(props: FurnaceTypes) {
        this.id = props.id;
        this.companyId = props.companyId;
        this.glassTypeId = props.glassTypeId;
        this.name = props.name;
        this.maxCapacityTons = props.maxCapacityTons;
        this.status = props.status ?? 'operational';
        this.machines = props.machines ?? [];
    }

    /**
     * Factory Method para creación con validación de dominio.
     */
    static create(props: FurnaceTypes): Furnace {
        if (props.maxCapacityTons <= 0) {
            throw new Error("La capacidad del horno debe ser mayor a cero.");
        }

        if (!props.name || props.name.trim().length === 0) {
            throw new Error("El nombre del horno no puede estar vacío.");
        }

        return new Furnace(props);
    }

    /**
     * Factory Method para reconstitución desde persistencia.
     */
    static reconstitute(props: FurnaceTypes): Furnace {
        return new Furnace(props);
    }

    updateStatus(newStatus: 'operational' | 'maintenance' | 'shutdown'): void {
        const validStatuses = ['operational', 'maintenance', 'shutdown'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Estado de horno inválido: ${newStatus}`);
        }
        this.status = newStatus;
    }

    setMachines(machines: Machine[]): void {
        this.machines = machines;
    }
}
