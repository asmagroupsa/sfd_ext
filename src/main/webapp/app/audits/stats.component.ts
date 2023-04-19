import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, ResponseWrapper, getRandomIntInclusive } from '../shared';
import { LanguesService } from '../shared/myTranslation/langues';
import { StateService } from '../shared/state/statistiques';
import { StatsService } from './stats.service';
import { UserData } from '../shared';
import { PhaseService } from '../entities/phase';
import { DatePipe } from '@angular/common';
declare let select_init:any;

@Component({
    selector: 'jhi-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['stats.component.css', 'stats.scss']
    //, '../shared/state/state.scss',
})
export class StatsComponent implements OnInit {
    routeSub: any;
    global: any;
    lignes: any[];
    credits: any[];
    currentLigne: any;
    currentCredit: any;
    creditsIndividu: any[];
    listeAgences:any[];
    currentAgence:any;
    agenceCredits:any[];
    agenceGlobal:any;
    comites:any[];
    comityCredits:any[];
    currentLigneComity:any;
    currentComity:any;
    date2: any;
    selectedPhase: any;
    phaseList: any[];
    loading: boolean = false;

    listeSituationData: any[] = [];
    breadcumbs: any[] = [
    ];
    level = 'liste-ligne-situation';
    //Taux global des 
    agName = (this.currentAgence) ? this.currentAgence.name : "";
    label = {        
        'liste-ligne-situation': 'Lignes de crédit',
        'liste-credit-situation-by-ligne': 'Crédit',
        'liste-comite-situation': 'Comité',
        'liste-credit-situation-by-comite': 'Crédit',
        'liste-credit-membre-situation': 'Membres de groupe',
        'liste-credit-situation-by-agence': `Crédit de l'agence ${this.agName}`,
    };
    situation: any = {name: 'Lignes de crédit'};
   // bgcs = ['rgb(96, 125, 139)', 'rgb(105, 148, 128)'];
    bgcs = ["rgb(96,125,139)","rgb(57, 100, 121)","rgb(45, 110, 49)"];

    constructor(
        private route: ActivatedRoute,
        public homeService: StatsService,
        public principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private router: Router,
        private statistique: StateService,
        public langue: LanguesService,
        private _datePipe: DatePipe,
        private phaseService: PhaseService,
    ) {
    }
    ngAfterViewInt(){
        select_init();
        setTimeout(()=>{
        select_init();
        },3000);
    }
    ngOnDestroy() {
      //  this.routeSub.unsubscribe();
    }
    ngOnInit() {
        const now = new Date();
        this.date2 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };   

        this.listeAgences = UserData.getInstance().listeAgences;
        select_init();
        
        this.loadPhase();
        this.getData();  
    }
    
    randomBack(){
        ["#b0bec5","rgba(96,125,139,0.52)","rgba(2,117,216,0.33)","rgba(211,2,216,0.33)"];
        return 
    }
    

    reqfn(){
        const formatDate = (date) => this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'MM/dd/y');

        const req: any = {
            code_phase: this.selectedPhase,
            date2: formatDate(this.date2),
            sfd_reference: UserData.getInstance().getSFDReference()
        };

        return req;
    }
    
    loadPhase() {
        this.loading = true;
        this.phaseService.queryAll({
            'sfdReference.equals': 'FNM',
        }).subscribe(
            (res: ResponseWrapper) => {
                this.phaseList = res.json;
                this.loading = false;
            },
            (res: ResponseWrapper) => {
              //  this.alertService.error(error.message, null, null);
              this.loading = false;
            }
        );
    }

    getData(){
        if(this.currentAgence)
            this.getGlobalAgenceData();
        else
            this.getGlobalData();
        this.listeSituation(this.situation, this.level);        
    }

    getGlobalData(){
        this.loading = true;
        this.currentAgence = null;
        this.homeService.listeSituation('liste-sfd-situation', this.reqfn()).subscribe((res) => {
            this.loading = false;
            this.global = res.length ? res[0] : undefined;
        });
    }

    getGlobalAgenceData(){
        this.loading = true;
        const req = this.reqfn();
        req.agence_reference = this.currentAgence.codeAgence;
        this.homeService.listeSituation('liste-agence-situation', req).subscribe((res) => {
            this.loading = false;
           this.agenceGlobal = res.length ? res[0] : undefined;
        });
    }

    getByAgence(agence){
        this.currentAgence = agence;
        this.breadcumbs = [];
        this.level = 'liste-credit-situation-by-agence';
        this.situation = {name: 'Crédit de l\'agence'};
        this.getData();
    }

    getBySfd(){
        this.currentAgence = null;
        this.breadcumbs = [];
        this.level = 'liste-ligne-situation';
        this.situation = {name: 'Lignes de crédit'};
        this.getData();
    }

    listeSituation(i, level?, b = false, a = true) {
        if (!a) {
            return;
        }       

        this.level = level || (() => {
            switch (this.level) {
                /* case 'liste-sfd-situation':
                    return 'liste-ligne-situation'; */
                case 'liste-comite-situation':
                    return 'liste-credit-situation-by-comite';
                case 'liste-credit-situation-by-ligne':
                case 'liste-credit-situation-by-comite':
                case 'liste-credit-situation-by-agence':
                    return 'liste-credit-membre-situation';
                default: return this.level;
            }
        })();
        console.log(this.level);
        console.log(level);
        this.situation = i;

        if (!b) {
            console.log(this.breadcumbs);
            console.log(this.breadcumbs[this.breadcumbs.length - 1]);
            
            if(this.breadcumbs.length > 0 && this.isInBr(this.level)){
                console.log("deja la");
            }else{
                this.breadcumbs.push({
                    level: this.level,
                    situation: i
                });
            }
            
            
            
        }

        this._loadListeSituation(this.situation, this.level);
    }

    private _loadListeSituation(i, level) {
        this.loading = true;
        this.listeSituationData = [];
        //const formatDate = (date) => this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'MM/dd/y');

        const req = this.reqfn();

        this.homeService.listeSituation(level, (() => {
            switch (level) {
                case 'liste-ligne-situation':
                    //req.sfd_reference = i.reference;
                    return req;
                case 'liste-credit-situation-by-ligne':
                    req.ligne_credit_id = i.id;
                    return req;
                case 'liste-comite-situation':
                    req.ligne_credit_id = i.id;
                    return req;
                case 'liste-credit-situation-by-agence':
                    req.agence_reference = this.currentAgence.codeAgence;
                    return req;
                case 'liste-credit-situation-by-comite':
                    req.credit_comity_id = i.id;
                    return req;
                case 'liste-credit-membre-situation':
                    req.credit_id = i.id;
                    return req;
                default:
                    return req;
            }
        })()).subscribe(
            (liste) => {
                this.loading = false;
                this.listeSituationData = liste.map((i) => {
                    i.bg = this.bgcs[getRandomIntInclusive(0, 1)];
                    return i;
                });
            },
            () => {
                this.loading = false;
            }
        );
    }

    bn(b, last) {
        if (last) {
            return;
        }

        let breadcumbs = [];

        for (const _b of this.breadcumbs) {
            breadcumbs.push(_b);

            if (_b.level === b.level) {
                break;
            }
        }

        this.breadcumbs = breadcumbs;

        this.listeSituation(b.situation, b.level, true);
    }

    isInBr(level){
        let found = false;
        for (const _b of this.breadcumbs) {            
            if (_b.level === level) {
                found = true;
                break;
            }
        }
        return found;
    }
}
