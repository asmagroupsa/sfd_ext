export class EcheancesSFD {
    constructor(
        public id?: number,
        public libelle?: string,
        public sfdReference?: string,
        public numEcheance?: number,
        public echeanceDate?: any,
        public capital?: number,
        public interet?: number,
        public epargne?: number,
        public total?: number,
        public payer?: boolean,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public remboursementsId?: number,
        public echeancierSFDId?: number,
    ) {
        this.payer = false;
    }
}
