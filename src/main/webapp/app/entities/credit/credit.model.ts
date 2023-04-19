import { BaseEntity } from '../../shared';

const enum ModeEcheance {
    'DEGRESSIF',
    'LINEAIRE',
    'CONSTANT'
}

export class Credit implements BaseEntity {
    constructor(
        public id?: number,
        public endDate?: any,
        public amount?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public decaisser?: boolean,
        public modeEcheance?: string,
        public reference?: string,
        public rembourser?: boolean,
        public employee?: boolean,
        public apparente?: boolean,
        public startDate?: any,
        public client?: string,
        public agenceReference?: string,
        public notificationClientId?: number,
        public operations?: BaseEntity[],
        public garanties?: BaseEntity[],
        public echeancierClientId?: number,
        public accountId?: number,
        public ligneCreditId?: number,
        public differe?: any,
        public delaiGrace?: any,
        public option_id?: any,
        public tarif?: any,
    ) {
        this.decaisser = false;
        this.rembourser = false;
        this.employee = false;
        this.apparente = false;
        this.modeEcheance = 'LINEAIRE';
    }
}
