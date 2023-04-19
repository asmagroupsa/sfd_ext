
const enum TauxFraisType {
    'FRAIS',
    'TAUX',
    'AUCUN'

};
export class TauxEpargne {
    constructor(
        public id?: number,
        public libelle?: string,
        public sfdReference?: string,
        public valeur?: number,
        public typeValeur?: TauxFraisType,
        public produitId?: number,
    ) {
    }
}
