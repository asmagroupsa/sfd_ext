export class OperationCaisse {
  constructor(
    public id?: number,
    public comptecarmesclient?: string,
    public comptecarmescaisse?: string,
    public comptecarmescaisseenvoi?: string,
    public comptecarmescaisserecu?: string,
    public nomClient?: string,
    public birthDate?: any,
    public telephone?: string,
    public email?: string,
    public montant?: string,
    public sexe?: string,
    public agenceReference?: string,
    public professionId?: string,
    public produitId?: string,
    public typeClientId?: string,
    public nationalityId?: string,
    public motif?: string,
    public dateechu?:string
  ) {}
}
