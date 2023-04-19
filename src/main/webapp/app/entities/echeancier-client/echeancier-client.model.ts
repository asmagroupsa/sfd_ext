export class EcheancierClient {
    constructor(
        public id?: number,
        public startDate?: any,
        public tauxEpargne?: number,
        public tauxInteret?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public agenceReference?: string,
        public lastModifiedDate?: any,
        public creditId?: number,
        public echeancesClientsId?: number,
    ) {
    }
}
