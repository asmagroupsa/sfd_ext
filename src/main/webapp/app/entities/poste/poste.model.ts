import { BaseEntity } from '../../shared';

export class Poste implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public clients?: BaseEntity[],
    ) {
    }
}
