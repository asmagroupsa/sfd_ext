import {BaseEntity} from '../../shared';

export class DelegatedMember implements BaseEntity {
    constructor(
        public id?: number,
        public status?: boolean,
        public nominationDate?: any,
        public endNominationDate?: any,
        public user?: string,
        public sfdReference?: string,
        public agenceReference?: string,
        public disponibilites?: BaseEntity[],
        public validations?: BaseEntity[],
        public delegationComityId?: number,
        public comityMberId?: number,
        public roleDelegatedMemberId?: number,
    ) {
        this.status = true;
    }
}
