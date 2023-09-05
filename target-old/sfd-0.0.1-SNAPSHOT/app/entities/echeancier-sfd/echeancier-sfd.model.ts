export class EcheancierSFD {
    constructor(
        public id?: number,
        public startDate?: any,
        public tauxEpargne?: number,
        public tauxInteret?: number,
        public amount?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public ligneCreditId?: number,
        public echeancesSFDsId?: number,
    ) {
    }
}
