import { ConsortiumTypes } from '../types/ConsortiumTypes';

export class Consortium {
    public readonly id: string;
    public readonly name: string;
    public isActive: boolean;

    constructor(props: ConsortiumTypes) {
        this.id = props.id;
        this.name = props.name;
        this.isActive = props.isActive ?? true;
    }

    deactivate(): void {
        this.isActive = false;
    }

    activate(): void {
        this.isActive = true;
    }
}
