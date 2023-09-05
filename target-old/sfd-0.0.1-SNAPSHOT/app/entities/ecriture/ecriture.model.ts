
const enum Sens {
    'DEBIT',
    'CREDIT'
}
export class Ecriture {
    constructor(
        public id?: number,
        public codeTypeOperation?: string,
        public libelle?: string,
        public sens?: Sens,
        public ecritureCommissionId?: number,
        public operationsId?: number,
        public operationTypeId?: number,
    ) {
    }
}
