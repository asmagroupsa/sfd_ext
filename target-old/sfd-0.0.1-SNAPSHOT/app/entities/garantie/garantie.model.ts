export class Garantie {
    constructor(
        public id?: number,
        public document?: string,
        public valeur?: string,
        public name?: string,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public agenceReference?: string,
        public lastModifiedDate?: any,
        public typeGarantiesId?: number,
        public documentGarantiesId?: number,
        public creditRequestId?: number,
    ) {
    }
}
