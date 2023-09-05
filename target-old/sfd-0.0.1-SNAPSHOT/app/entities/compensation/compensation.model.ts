export class Compensation {
    constructor(
        public id?: number,
        public amount?: number,
        public bankAccount?: string,
        public consommer?: boolean,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public agenceReference?: string,
        public lastModifiedDate?: any,
        public operationsId?: number,
        public commissionsId?: number,
        public clientId?: number,
        public compensationTypeId?: number,
        public partnerId?: number,
        public emetteurId?: number,
    ) {
        this.consommer = false;
    }
}
