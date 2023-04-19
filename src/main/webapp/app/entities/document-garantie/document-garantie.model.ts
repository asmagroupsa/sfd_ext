export class DocumentGarantie {
    constructor(
        public id?: number,
        public reference?: string,
        public filePath?: string,
        public name?: string,
        public agenceReference?: string,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public garantieId?: number,
    ) {
    }
}
