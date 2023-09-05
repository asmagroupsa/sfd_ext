export class GroupMember {
  constructor(
    public id?: number,
    public status?: boolean,
    public memberRole?: string,
    public agenceReference?: string,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public clientId?: number,
    public cltId?: number
  ) {
    this.status = true;
  }
}
