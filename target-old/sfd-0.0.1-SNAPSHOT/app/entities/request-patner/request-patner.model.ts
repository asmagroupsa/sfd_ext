import { BaseEntity } from '../../shared';

export class RequestPartner {
    constructor(
        public id?: number,
        public code?: string,
        public etat?: string,
        public createdDate?: any,
        public sens?: string,
        public nomSfd?: string,
        public nomPartenaire?: string,
        public sfd?: any,
        public partner?: any,
    ) { }
}


export class Partneriat {
    constructor(
        public id?: number,
        public code_sfd?: string,
        public code_partenaire?: string,
        public date?: any,
        public demandePartenariat?: any
    ) { }
}