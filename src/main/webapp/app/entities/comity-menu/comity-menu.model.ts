export class ComityMber {
  constructor(
    public id?: number,
    public status?: boolean,
    public nominationDate?: any,
    public endNominationDate?: any,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public assDmdMbreCmteCditsId?: number,
    public sfdUsersId?: number,
    public typeMembreId?: number
  ) {
    this.status = false;
  }
}
