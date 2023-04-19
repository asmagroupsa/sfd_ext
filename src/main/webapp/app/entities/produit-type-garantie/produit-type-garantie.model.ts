export class ProduitTypeGarantie {
    constructor(
        public id?: number,
        public amount?: number,
        public produitId?: number,
        public typeGarantieId?: number,
        public typeValeur?: string,
        public sfdReference?: string,
        // public createdDate?: any,
        // public createdBy?: string,
        // public lastModifiedBy?: string,
        // public lastModifiedDate?: any,
    ) {}
}
