import { BaseEntity } from '../../shared';

const enum ModeEcheance {
    'DEGRESSIF',
    'LINEAIRE',
    'CONSTANT'
}
export class Produit implements BaseEntity {
    constructor(
        public id?: number,
        public ageMin?: number,
        public code?: string,
        public libelle?: string,
        public duration?: number,
        public modeEcheance?: string,
        public etudiable?: boolean,
        // public etudiable?: boolean,
        public differe?: any,
        public delaiGrace?: any,
        public createdDate?: any,
        public createdBy?: string,
        public lastModifiedBy?: string,
        public sfdReference?: string,
        public typeProduit?: string,
        public durationMin?: number,
        public lastModifiedDate?: any,
        public comitable?: boolean,
        public formable?: boolean,
        public notifiable?: boolean,
        public creditable?: boolean,
        public contractable?: boolean,
        public penalitable?: boolean,
        public eligibilite?: boolean,
        public amountMax?: any,
        public amountMin?: any,
        public interestRate?: number,
        public noteMinConditionAcces?: number,
        public activerConditionAcces?: number,
        public creditRequests?: BaseEntity[],
        public contrats?: BaseEntity[],
        public ligneRequests?: BaseEntity[],
        public eligibles?: BaseEntity[],
        public produitTypeGaranties?: BaseEntity[],
        public tauxEpargnes?: BaseEntity[],
        public conditionsses?: BaseEntity[],
        public fraisses?: BaseEntity[],
        public tranchePenals?: BaseEntity[],
        public tauxs?: BaseEntity[],
        public accountTypes?: BaseEntity[],
        public periodicities?: BaseEntity[],
        public categorieProduitId?: number,
        public conditionAccesses?: BaseEntity[],
        public typeClients?: any[],
        public materiel?: boolean,
        public preleverFrais?: boolean,
        public preleverInteret?: boolean,
        public carmes?: boolean,
        public montantFrais?: number,
        public contratProduits?: any[],
        public phasable = false,
    ) // public typeClientIdArray?:number[]
    {
        this.etudiable = false;
        this.comitable = false;
        this.formable = false;
        this.notifiable = false;
        this.creditable = false;
        this.contractable = false;
        this.penalitable = false;
        this.eligibilite = false;
        this.materiel = false;
        this.activerConditionAcces = 1;
    }
}
