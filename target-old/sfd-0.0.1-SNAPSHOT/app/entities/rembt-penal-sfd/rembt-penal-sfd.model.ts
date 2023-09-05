export class RembtPenalSFD {
    constructor(
        public id?: number,
        public amount?: number,
        public rembPenalDate?: any,
        public rembPenalPayer?: boolean,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public sfdReference?: string,
        public lastModifiedDate?: any,
        public echeancesSFDId?: number,
    ) {
        this.rembPenalPayer = false;
    }
}
