export class CaisseNouvelle {
  constructor(
    public id?: number,
    public compteCarmes?: string,
    public libelle?: string,
    public etatCaisse?: string,
    public dateOuverture?: string,
    public retraitMaxAmount?: string,
    public soldetMaxAmount?: string,
    public firstname?: string,
    public username?: string,
    public telephone?: string,
    public email?: string,
    public password?: string,
    public agenceReference?: string,
  ) {}
}
