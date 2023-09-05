import { BaseEntity } from '../../shared';

export class ZoneAgence implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public reference?: string,
        public agences?: BaseEntity[],
        public sfdId?: number,
    ) {
    }
}
