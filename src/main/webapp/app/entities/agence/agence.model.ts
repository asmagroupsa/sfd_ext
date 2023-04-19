import { BaseEntity } from '../../shared';

export class Agence implements BaseEntity {
    constructor(
        public id?: number,
        public userReference?: string,
        public name?: string,
        public codeAgence?: string,
        public address?: string,
        public email?: string,
        public bp?: string,
        public fax?: string,
        public phone?: string,
        public geoLat?: string,
        public geoLong?: string,
        public pictureUrl?: string,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public clients?: BaseEntity[],
        public creditComities?: BaseEntity[],
        public sfdId?: number,
        public zoneId?: number,
        public zone?: any,
        public sfdReference?: string,
        public initiale?: string
    ) { }
}
