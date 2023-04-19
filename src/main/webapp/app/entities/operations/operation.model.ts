export class Operation {
    constructor(
        public id?: number,
        public title?: string,
        public amount?: number,
        public observation?: string,
        public compenser?: boolean,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public commissionsId?: number,
        public accountId?: number,
        public creditId?: number,
        public compensationId?: number,
        public operationTypeId?: number,
        public ecritureId?: number,
    ) {
        this.compenser = false;
    }
}
