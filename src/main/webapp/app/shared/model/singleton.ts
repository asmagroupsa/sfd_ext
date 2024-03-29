import { Subject } from 'rxjs/Subject';
import { LIENS, CODES } from './code-ressources';
import { SFD } from '../../entities/s-fd/sfd.model';


export class UserData {
    isPrintSheet: any = { cle: false };
    sfdName: string = null;
    ressources: any[] = [];
    sfd: any = null;
    sfdId: number = null;
    sfd_: SFD;
    zoneAgence: any = null;
    agence: any = null;
    agencesReference: any[] = undefined;
    userReference: any = null;
    listeAgences: any[] = [];
    listeStatistique: any[] = [0,0,0,0,0,0,0,0];
    listeZones: any[] = [];
    listeAgencesState = new Subject<any>();
    listeRessourcesState = new Subject<any>();
    currentAgence: any = null;
    compensationData:any[]=[];
    penaliteData:any={montant:"",other:""};
    activerClientData:any={amount:"",other:""};
    currentSfdReference: string = null;
    liens: string[] = LIENS;
    codeRessources: string[] = CODES;
    infos: boolean = false;
    private static _instance: UserData;
    account;
    partner_id: number;
    user_reference: string;
    countryId;
    country_id;

    getSFDReference() {
        return this.currentSfdReference || this.sfd || (this.sfd_ ? this.sfd_.code : null);
    }

    private constructor() { }
    static getInstance() {
        if (!this._instance) {
            this._instance = new UserData();
        }
        return this._instance;
    }
   
    getCurrentOrFirstAgence(){
        //console.log(this.listeAgences);
        if(this.currentAgence != null) return this.currentAgence;
        if(this.listeAgences.length){
            return this.listeAgences[0];
        }
        if(UserData.getInstance().listeAgences.length){
            return UserData.getInstance().listeAgences[0];
        }else if(UserData.getInstance().agence){
           return  {'codeAgence':UserData.getInstance().agence}; 
        }
        return null;
    }

    initialize() {
        this.ressources = [];
        this.listeRessourcesState.next(null);
        this.sfd = null;
        this.sfdId = null;
        this.sfdName = null;
        this.zoneAgence = null;
        this.agence = null;
        this.agencesReference = [];
        this.userReference = null;
        this.listeAgences = [];
        this.listeZones = [];
        this.listeAgencesState.next(null);
        this.currentAgence = null;
        this.currentSfdReference = null;
        this.countryId = null;
        UserData._instance = null;
    }
    loadData(obj) {
        if (!obj) return;
        this.ressources = obj.ressources;
        this.listeRessourcesState = new Subject<any>();
        this.listeRessourcesState.next(this.ressources);
        this.sfd = obj.sfd;
        this.sfdId = obj.sfdId;
        this.sfdName = obj.sfdName;
        this.zoneAgence = obj.zoneAgence;
        this.agence = obj.agence;
        this.agencesReference = obj.agencesReference;
        this.userReference = obj.userReference;
        this.listeAgences = obj.listeAgences;
        this.listeZones = obj.listeZones;
        this.listeAgencesState.next(this.listeAgences);
        this.currentAgence = obj.currentAgence;
        this.currentSfdReference = obj.currentSfdReference;
        this.countryId = obj.country_id || obj.countryId || 1;
    }
    getListeAgencesState() {
        return this.listeAgencesState.asObservable();
    }

    getSFD(): SFD {
        return  this.sfd_;
    }

    isSousTraitant() {
        return this.account && this.account.authorities ? this.account.authorities.indexOf('SOUS_TRAITANT') !== -1 : false;
    }
}
