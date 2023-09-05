export class ComityMber {
    constructor(
        public id?: number,
        public status?: boolean,
        public nominationDate?: any,
        public endNominationDate?: any,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public agenceReference?: string,
        public sfdReference?: string,
        public lastModifiedDate?: any,
        public disponibilitesId?: number,
        public validationsId?: number,
        public assDmdMbreCmteCditsId?: number,
        public user?: string,
        public userReference?: any,
        public typeMembreId?: number,
        public roleComityId?: number
    ) {
        this.status = true;
    }
}
