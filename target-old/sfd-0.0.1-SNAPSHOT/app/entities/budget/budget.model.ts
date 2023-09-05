export class Budget {
    constructor(
        public id?: number,
        public amount?: number,
        public amountRequested?: number,
        public ammountReport?: number,
        public activeDate?: any,
        public carmesAccount?: string,
        public active?: boolean,
        public cloture?: boolean,
        public sommeTotalLigne?: number,
        public codeActivation?: string,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public montantActive?: number,
        public ligneCreditsId?: number,
        public compteCommissionsId?: number,
        public callResponsesId?: number,
        public clotureBudgetsId?: number,
        public activationsId?: number,
        public activeursId?: number,
        public anneeId?: number,
    ) {
        this.active = false;
        this.cloture = false;
    }
}
