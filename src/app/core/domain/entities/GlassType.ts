import { GlassTypeTypes } from '../types/GlassTypeTypes';

export class GlassType {
    public readonly id: number;
    public readonly name: string;

    constructor(props: GlassTypeTypes) {
        this.id = props.id;
        this.name = props.name;
    }
}
