export class Commission {
    constructor(
        public id?: number,
        public taux?: number,
        public valeur?: number,
        public amount?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public agenceReference?: string,
        public lastModifiedDate?: any,
        public compenser?: boolean,
        public carmesAccount?: string,
        public compensationId?: number,
        public operationId?: number,
    ) {
        this.compenser = false;
    }
}
