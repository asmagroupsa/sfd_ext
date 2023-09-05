import { BaseEntity } from '../../shared';

export class BankAccount implements BaseEntity {
    constructor(
        public id?: number,
        public bankNumber?: string,
        public managerName?: string,
        public managerContact?: string,
        public sfdReference?: string,
        public date?: any,
        public bankId?: number,
    ) {
    }
}
