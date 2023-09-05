import { BaseEntity } from '../../shared';

const enum Unite {
  'JOUR',
  'SEMAINE',
  'MOIS',
  'ANNEE'
}

export class Periodicity implements BaseEntity {
  constructor(
    public id?: number,
    public denominateur?: number,
    public unite?: Unite,
    public codePeriodicite?: string,
    public constante?: number,
    public libPeriodicite?: string,
    public creditRequests?: BaseEntity[],
    public ligneCredits?: BaseEntity[],
    public produits?: BaseEntity[]
  ) {}
}
