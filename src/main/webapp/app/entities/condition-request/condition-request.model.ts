export class ConditionRequest {
  constructor(
    public id?: number,
    public produitId?: number,
    public clientId?: number,
    public libelle?: string,
    public name?: string,
    public note?: any,
    public valeur?: number,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public produitsId?: number
  ) {}
}
