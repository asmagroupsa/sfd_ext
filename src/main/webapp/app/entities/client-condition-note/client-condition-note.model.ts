import { BaseEntity } from "../../shared";

export class ClientConditionNote implements BaseEntity {
  constructor(
    public id?: number,
    public produitId?: number,
    public clientId?: number,
    public noteMin?: number,
    public note?: number,
    public code?: string,
    public agenceReference?: string,
  ) {}
}
