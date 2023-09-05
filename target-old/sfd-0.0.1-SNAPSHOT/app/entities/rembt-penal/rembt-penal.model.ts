export class RembtPenal {
    constructor(
        public id?: number,
        public amount?: number,
        public rembPenalDate?: any,
        public rembPenalPayer?: boolean,
        public createdDate?: any,
        public createdBy?: string,
        public agenceReference?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public echeancesClientId?: number,
    ) {
        this.rembPenalPayer = false;
    }
}
