import { ConditionGarantie } from "../condition-garantie/condition-garantie.model";
export class TypeGarantie {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public sfdReference?: string,
    public conditionGaranties?: ConditionGarantie[] /* public garantieId?: number,
    public produitTypeGarantiesId?: number */
  ) {}
}
