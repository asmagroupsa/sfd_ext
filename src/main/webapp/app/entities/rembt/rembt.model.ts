export class Rembt {
    constructor(
        public id?: number,
        public rembDate?: any,
        public amount?: number,
        public createdDate?: any,
        public createdBy?: string,
        public agenceReference?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public echeancesClientId?: number,
        public typeRembtId?: number,
    ) {
    }
}
