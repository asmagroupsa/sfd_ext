const enum TypesClient {
  "INDIVIDU",
  "ENTREPRISE",
  "GROUPE",
  "MARCHAND"
}

export class TypesContrat {
  constructor(
    public id?: number,
    public code?:string,
    private typeClient?: TypesClient,
    public libelle?: string,

  ) { }
}
