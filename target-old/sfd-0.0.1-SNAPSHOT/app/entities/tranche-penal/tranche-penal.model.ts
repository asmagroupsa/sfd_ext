export class TranchePenal {
    constructor(
        public id?: number,
        public minDay?: number,
        public maxDay?: number,
        public penaliteId?: number,
        public penalRate?: number,
        public createdDate?: any,
        public createdBy?: string,
        public sfdReference?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public produitsId?: number,
    ) {
    }
}
