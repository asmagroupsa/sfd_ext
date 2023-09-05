
const enum TauxFraisType {
    'FRAIS',
    'TAUX',
    'AUCUN'

};
export class TrancheTauxFrais {
    constructor(
        public id?: number,
        public minInterval?: number,
        public maxInterval?: number,
        public valeur?: number,
        public type?: TauxFraisType,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public opCompteTrancheTFsId?: number,
    ) {
    }
}
