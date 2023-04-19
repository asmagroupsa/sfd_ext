import { BaseEntity } from '../../shared';

export class Etude implements BaseEntity {
    constructor(
        public id?: number,
        public userReference?: string,
        public agenceReference?: string,
        public visitDate?: any,
        public etudeDate?: any,
        public procesVerbal?: any,
        public result?: boolean,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public geoLat?: number,
        public geoLong?: number,
        public amount?: any,
        public duration?: number,
        public client?: string,
        public adress?: string,
        public reference?: string,
        public etudeTypeId?: number,
        public creditRequestId?: number,
        public lieu?: string
    ) {
        this.result = true;
    }
}
