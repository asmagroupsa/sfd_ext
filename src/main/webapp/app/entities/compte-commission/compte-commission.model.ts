export class CompteCommission {
    constructor(
        public id?: number,
        public title?: string,
        public amount?: number,
        public taux?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public budgetId?: number,
    ) {
    }
}
