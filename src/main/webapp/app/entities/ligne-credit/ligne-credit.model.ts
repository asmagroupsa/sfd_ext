import { BaseEntity } from "../../shared";

export class LigneCredit implements BaseEntity {
    differe: any;
    tauxInteret: any;
  constructor(
    public id?: number,
    public amount?: number,
    public libelle?: string,
    public code?: string,
    public duration?: number,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public remboursement?: number,
    public notificationSFDId?: number,
    public credits?: BaseEntity[],
    public phases?: BaseEntity[],
    public revolvingRequests?: BaseEntity[],
    public echeancierSFDId?: number,
    public budgetId?: number,
    public periodicityId?: number,
    public partnerId?: number,
    public modeEcheance?: string,
    public sfdReference?: string,
    public tauxSFDs?: BaseEntity[]
  ) {}
}
