import {BaseEntity} from '../../shared';

export class Dossier implements BaseEntity {
    constructor(
        public id?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public client?: string,
        public amountProposed?: number,
        public durationProposed?: number,
        public amountSolicited?: number,
        public durationSolicited?: number,
        public reference?: string,
        public validations?: BaseEntity[],
        public creditComityId?: number,
        public creditRequestId?: number,
        public montantAccorder?: number,
    ) {}
}
