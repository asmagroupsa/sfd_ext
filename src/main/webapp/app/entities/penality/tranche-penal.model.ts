export class Penality {
    constructor(
        public id?: number,
        public valeur?: number,
        public libelle?: String,
        public type?: String,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public sfdReference?: string,
        public lastModifiedDate?: any,
    ) {
    }
}
