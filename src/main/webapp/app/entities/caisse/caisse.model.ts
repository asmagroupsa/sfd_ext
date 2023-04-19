import { BaseEntity } from '../../shared';

export const enum ModeCaisse {
    'EXTERNE',
    'INTERNE',
    'AUCUN'
}

export class Caisse implements BaseEntity {
    constructor(
        public id?: number,
        public reference?: string,
        public libelle?: string,
        public retraitMaxAmount?: number,
        public soldeMaxAmount?: number,
        public solde?: number,
        public dateOuverture?: any,
        public modeCaisse?: ModeCaisse,
        public agenceReference?: string,
        public compteComptableId?: number,
        public journalId?: number,
        public typeCaisse?: string,
    ) {
    }
}
