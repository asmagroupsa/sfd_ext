import {BaseEntity} from '../../shared';

export class CompteComptable implements BaseEntity {
    id: number;
    agenceReference: string;
    sfdReference: string;
    numAccount: string;
    libelle: string;
    nature: string;
    typePlan: string;
}
