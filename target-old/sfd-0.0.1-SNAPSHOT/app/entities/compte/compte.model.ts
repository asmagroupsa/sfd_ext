export class Compte {
    constructor(
        public id?: number,
        public numAccount?: string,
        public agenceReference?: string,
        public balance?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public creditsId?: number,
        public echeancesClientsId?: number,
        public operationsId?: number,
        public accountTypeId?: number,
        public clientId?: number,
    ) {
    }
}
