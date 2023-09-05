import { BaseEntity } from "../../shared";

const enum TypeValidation {
  "INDIVIDUAL",
  "GROUP"
}

export class CreditComity implements BaseEntity {
  constructor(
    public id?: number,
    public code?: string,
    public agenceReference?: string,
    public sfdReference?: string,
    public startDate?: any,
    public endDate?: any,
    public nbrDossierAssigne?: number,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public typeValidation?: TypeValidation,
    public closed?: boolean,
    public dossierComplets?: boolean,
    public ligneAccorde?: boolean,
    public nonDisponible?: boolean,
    public closedDate?: any,
    public libelle?: string,
    public place?: string,
    public typeComiteId?: number,
    public disponibilites?: BaseEntity[],
    public dossiers?: BaseEntity[],
    public delegationComityId?: number,
    public delegationComity?: any,
    public agences?: BaseEntity[],
     public documentUrl?: string,
          public documentTitre?: string
  ) {
    this.closed = false;
  }
}
