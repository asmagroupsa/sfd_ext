
export class Affectation {
  constructor(
    public id?: number,
    public to?: any,
    public from?: any,
     public type?: any,
     public client?: any,
    public dossier?: any,
     public agent?: any,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any
  ) {}
}
