export class FraisGestionAccorde {
    constructor(
        public id?: number,
        public amount?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public sfdReference?: string,
        public lastModifiedDate?: any,
        public ligneCreditId?: number,
        public fraisGestionId?: number,
    ) {
    }
}
