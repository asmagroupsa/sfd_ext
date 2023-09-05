export class FraisGestion {
    constructor(
        public id?: number,
        public libelle?: string,
        public minPercent?: number,
        public maxPercent?: number,
        public valeur?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public fraisGestionAcoordesId?: number,
    ) {
    }
}
