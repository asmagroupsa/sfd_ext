import { BaseEntity } from '../../shared';

export class DelegationComity implements BaseEntity {
    constructor(
        public id?: number,
        public nbMember?: number,
        public maxAmount?: number,
        public globalMaxAmount?: number,
        public delegationSignatureFileUrl?: string,
        public reference?: string,
        public agenceReference?: string,
        public sfdReference?: string,
        public libelle?: string,
        public creditComities?: BaseEntity[],
        public delegatedMembers?: BaseEntity[],
    ) {
    }
}
