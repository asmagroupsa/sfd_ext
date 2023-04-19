import { BaseEntity } from '../../shared';

export class Phase implements BaseEntity {
    constructor(
        public id?: number,
        public libelle?: string,
        public code?: string,
        public sfdReference?: string,
        public produitId?: number,
        public montant?: number,
    ) {
    }
}
