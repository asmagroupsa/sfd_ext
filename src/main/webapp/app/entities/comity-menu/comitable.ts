export class Dossier {
  constructor(
    public id?: number,
    public createdBy?: string,
    public createdDate?: any,
    public creditComityId?: number,
    public creditRequestId?: number,
    public lastModifiedBy?: any,
    public lastModifiedDate?: any
  ) {}
}
