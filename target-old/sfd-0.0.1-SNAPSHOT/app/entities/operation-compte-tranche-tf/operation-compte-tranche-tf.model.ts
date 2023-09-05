export class OperationCompteTrancheTF {
    constructor(
        public id?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public accountTypeId?: number,
        public operationTypeId?: number,
        public francheTauxFraisId?: number,
    ) {
    }
}
