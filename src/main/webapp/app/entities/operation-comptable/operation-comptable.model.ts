import { BaseEntity } from '../../shared';

export class OperationComptable implements BaseEntity {
    constructor(
        public id?: number,
        public libelle?: string,
        public debit?: number,
        public credit?: number,
        public date?: any,
        public numPiece?: string,
        public comptabiliser?: boolean,
        public referenceCaisse?: string,
        public agenceReference?: string,
        public journalReference?: string,
        public userReference?: string,
        public compteComptableId?: number,
    ) {
        this.comptabiliser = false;
    }
}
