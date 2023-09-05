import { BaseEntity } from '../../shared';

export class Partner implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public phone?: string,
    public email?: string,
    public logo?: string,
    public picture: any = '',
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public ligneCredits?: BaseEntity[],
    public fundingRequests?: BaseEntity[]
  ) {}
}
