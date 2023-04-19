import { BaseEntity } from '../../shared';

export class ZoneDepartement implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public reference?: string,
        public departements?: BaseEntity[],
    ) {
    }
}
