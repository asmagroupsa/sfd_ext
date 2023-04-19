export class Eligible {
    constructor(
        public id?: number,
        public status?: boolean,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public sfdReference?: string,
        public lastModifiedDate?: any,
        public produitId?: number,
        public sfdId?: number,
        public departementId?: number,
    ) {
        this.status = false;
    }
}
