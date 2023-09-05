export class RemboursementSFD {
    constructor(
        public id?: number,
        public rembDate?: any,
        public amount?: number,
        public createdDate?: any,
        public createdBy?: string,
        public sfdReference?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public echeancesSFDId?: number,
    ) {
    }
}
