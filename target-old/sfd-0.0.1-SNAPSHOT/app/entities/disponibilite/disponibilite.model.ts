import { BaseEntity } from "../../shared";

export class Disponibilite implements BaseEntity {
  constructor(
    public id?: number,
    public presence?: boolean,
    public creditComityId?: number,
    public delegatedMemberId?: number,
    public agenceReference?: string,
    public sfdReference?: string,
  ) {
    this.presence = true;
  }
}
