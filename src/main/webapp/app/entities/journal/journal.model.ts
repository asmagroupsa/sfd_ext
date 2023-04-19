import { BaseEntity } from '../../shared';

export class Journal implements BaseEntity {
    constructor(
        public id?: number,
        public reference?: string,
        public libelle?: string,
        public caisses?: BaseEntity[],
    ) {
    }
}
