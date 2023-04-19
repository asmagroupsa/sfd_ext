import { BaseEntity } from "../../shared";

export class ClientConditionValue implements BaseEntity {
  constructor(
    public id?: number,
    public produitId?: number,
    public clientId?: number,
    public conditionId?: number,
    public conditionValeur?: number,
    public codeNote?: string,
    public agenceReference?: string,
  ) {}
}
