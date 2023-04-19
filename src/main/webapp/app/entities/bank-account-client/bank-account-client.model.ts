import { BaseEntity } from '../../shared';

export class BankAccountClient implements BaseEntity {
    createdBy?: string;
    createdDate?: Date;
    lastModifiedBy?: string;
    lastModifiedDate?: Date;

    constructor(
        public id?: number,
        public numAccount?: string,
        public bankId?: number,
        public clientId?: number,
        public rib?: any,
        public codeAgence?: any,
        public codePays?: any,
        public codeBank?: any
    ) {}
}
