export class TranchePenalSFD {
    constructor(
        public id?: number,
        public minDay?: number,
        public maxDay?: number,
        public penalRate?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
    ) {
    }
}
