import { BaseEntity } from '../../shared';

export class NotificationClient implements BaseEntity {
  constructor(
    public id?: number,
    public notificationDate?: any,
    public status?: boolean,
    public rate?: number,
    public nbrDiffere?: number,
    public amount?: number,
    public typeEcheancier?: string,
    public agenceReference?: string,
    public nbreEcheance?: number,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public creditRequestId?: number,
    public formations?: BaseEntity[],
    public creditId?: number
  ) {
    this.status = false;
  }
}
