import { BaseEntity } from '../../shared';

export class Bank implements BaseEntity {
    constructor(
        public id?: number,
        public libelle?: string,
        public phone?: string,
        public bankAccounts?: BaseEntity[],
        public sfdReference?: string,
    ) {
    }
}
