export class ServiceUser {
    constructor(
        public id?: number,
        public reference?: string,
        public lastName?: string,
        public firstName?: string,
        public createdDate?: any,
        public createdBy?: string,
        public agenceReference?: string,
        public lastModifiedBy?: string,
        public sfdReference?: string,
        public lastModifiedDate?: any,
        public clientsId?: number,
        public agencesId?: number,
        public creditRequestsId?: number,
        public etudesId?: number,
        public comityMembersId?: number,
        public comityMberFNMsId?: number
    ) {}
}
