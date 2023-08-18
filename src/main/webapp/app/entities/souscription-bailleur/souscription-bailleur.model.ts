export class SouscriptionBailleur {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public address?: string,
        public phone?: string,
        public email?: string,
        public fax?: string,
        public bp?: string,
        public city?: string,
        public indicePrestataire?: string,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public contratsId?: number,
        public agencesId?: number,
        public eligiblesId?: number,
        public ligneRequestsId?: number,
        public compteCarmes?: string,
        public logo?: string,
        public typeAbonnement?: string,
        public password?: string,
        public periodicityId?: number,
        public paysId?: number,

    ) {
    }
}
