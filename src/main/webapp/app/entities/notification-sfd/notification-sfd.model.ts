export class NotificationSFD {
    constructor(
        public id?: number,
        public rate?: number,
        public notificationDate?: any,
        public status?: boolean,
        public nbrDiffere?: number,
        public amount?: number,
        public typeEcheancier?: string,
        public sfdReference?: string,
        public nbreEcheance?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public ligneRequestId?: number,
        public ligneCreditId?: number,
    ) {
        this.status = false;
    }
}
