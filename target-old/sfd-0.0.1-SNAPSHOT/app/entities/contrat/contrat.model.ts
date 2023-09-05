const enum Unite {
  "JOUR",
  "SEMAINE",
  "MOIS",
  "ANNEE"
}
export class Contrat {
  constructor(
    public id?: number,
    public code?: string,
    public contratDate?: any,
    public duree?: number,
    public unity?: Unite,
    public clotureDate?: any,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public sfdId?: number,
    public produitId?: number
  ) {}
}
