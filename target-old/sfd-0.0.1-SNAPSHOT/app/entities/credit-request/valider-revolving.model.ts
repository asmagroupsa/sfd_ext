import { BaseEntity } from '../../shared';


export class ValiderRevolving implements BaseEntity {
    constructor(
      public id?: number,
      public chainedossier?: string,
      public typeValide?: string,
      public montant?: number,
      public explanation?: string,
      public result?: string,
      public user_reference?: string
    ) { }
  }
