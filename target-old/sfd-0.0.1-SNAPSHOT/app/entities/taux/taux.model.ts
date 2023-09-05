export class Taux {
    constructor(
        public id?: number,
        public libelle?: string,
        public valeur?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public ecritureCommissionsId?: number,
        public produitsId?: number,
    ) {
    }
}
