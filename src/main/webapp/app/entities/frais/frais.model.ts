const enum TauxFraisType {
  "FRAIS",
  "TAUX",
  "AUCUN"
}
export class Frais {
  constructor(
    public id?: number,
    public libelle?: string,
    public amount?: number,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public typeValeur?: TauxFraisType,
    public typeFrais?: String,
    public sfdReference?: String,
    public produitsId?: number
  ) { }
}
