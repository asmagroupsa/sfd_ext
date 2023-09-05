import { CreditComity } from "../credit-comity/credit-comity.model";

export class LigneRequest {
    constructor(
        public id?: number,
        public requestDate?: any,
        public amount?: number,
        public nbreBenef?: number,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public sfdReference?: string,
        public lastModifiedDate?: any,
        public notificationSFDId?: number,
        public produitId?: number,
        public sfdId?: number,
        public affectedTo?: string,
        public partnerId?: number,
        public creditComitys?: CreditComity[],
    ) {
    }
}
