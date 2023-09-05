import { BaseEntity } from "../../../shared";

export class EcheancesClient implements BaseEntity {
  constructor(
    public id?: number,
    public libelle?: string,
    public agenceReference?: string,
    public numEcheance?: number,
    public echeanceDate?: any,
    public capital?: number,
    public interet?: number,
    public epargne?: number,
    public total?: number,
    public payer?: boolean,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public capitalPayer?: boolean,
    public interetPayer?: boolean,
    public epargnePayer?: boolean,
    public remboursements?: BaseEntity[],
    public rembtPenalId?: number,
    public echeancierClientId?: number
  ) {
    this.payer = false;
    this.capitalPayer = false;
    this.interetPayer = false;
    this.epargnePayer = false;
  }
}
