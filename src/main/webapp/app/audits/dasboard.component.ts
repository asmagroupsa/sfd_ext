import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal, UserData } from '../shared';
import { Router, ActivatedRoute } from '@angular/router';
/* import { StateService } from '../shared/state/statistiques'; */
import { LanguesService } from '../shared/myTranslation/langues';
// import {UserData, EventBus} from '../shared';
import { AuditsService } from './audits.service';
import {
    nameSFD,
    nameZoneAgence,
    nameAgence
} from '../shared/model/functions';


@Component({
    selector: 'jhi-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['audits.scss', '../shared/state/state.scss']
})
export class DashboardComponent implements OnInit {
    time: string = 'JOUR';
    account: Account;
    modalRef: NgbModalRef;
    public randomColor: any[];
    public tab: string[] = [];
    public load: boolean;
    public clearTimeoutId;

    public agences: any[];
    public shortAgences: any[];
    public sfd_level: boolean;
    public agence_level: boolean;
    public user_level: boolean = false;
    public shortAgenceState: any[];
    public agenceReference;
    routeSub: any;
    public getEffectif: any;
    public userReference: any = '';
    public sfdReference: any = ''

    isSFDLevel = false;
    isZoneAgenceLevel = false;
    isAgenceLevel = false
    isUserLevel = false

    constructor(
        private route: ActivatedRoute,
        public homeService: AuditsService,
        public principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private router: Router,
       /*  private statistique: StateService, */
        public langue: LanguesService,
    ) {
        this.sfd_level = false;
        this.load = false;
        this.agence_level = false;
        this.user_level = false;
        this.shortAgenceState = [];
        this.agences = [];
        this.shortAgences = [];
        this.randomColor = ["#607d8b", "#e86b18", "#699480"]
        this.getEffectif = {};
    }

    getUserToken() {
        this.homeService.getUserToken()
            .subscribe(res => {
                let resp = res.id;
                this.getUserInfos(resp);
            })
    }

    getUserInfos(id) {
        this.homeService.userInfos(id)
            .subscribe(res => {
                const ressources: string = res.ressource;
                this.isSFDLevel = ressources.indexOf(nameSFD) !== -1;
                this.isZoneAgenceLevel = ressources.indexOf(nameZoneAgence) !== -1;
                this.isAgenceLevel = ressources.indexOf(nameAgence) !== -1;
                this.isUserLevel = !this.isSFDLevel && !this.isZoneAgenceLevel && !this.isAgenceLevel;

                this.userReference = res.user_reference;
                this.agenceReference = res.agence_reference;
                this.sfdReference = res.sfd_reference;
                UserData.getInstance().country_id = res.country_id;
                
                this.firstInit();

                if (this.clearTimeoutId) clearInterval(this.clearTimeoutId);
                this.clearTimeoutId = setInterval(() => {
                    if (this.router.url.indexOf('/sfd') != -1)
                        this.firstInit();
                }, 1000 * 60 * 2);
            })
    }

    ngOnInit() {

        this.getUserToken();
    }

    firstInit() {
        if (this.isSFDLevel) {
            this.sfd_level = true;
            if (this.sfdReference) {
                this.reportAgenceShortState()
            }

        }
        else if (this.isZoneAgenceLevel) { }
        else if (this.isAgenceLevel) {
            this.agence_level = true;
            if (this.agenceReference) {
                this.reportAgenceLevelState(this.agenceReference, undefined)
            } else {
                return;
            }
        }
        else {
            this.user_level = true;
            if (this.userReference) {
                this.reportAgenceLevelState(undefined, this.userReference)
            } else {
                return;
            }


        }
    }
    getEffectifValues(res) {
        this.getEffectif = res[0];
        this.getEffectif.taux_remb_individu = parseFloat(this.getEffectif.taux_remb_individu.toFixed(3))
        this.getEffectif.taux_remb_groupe = parseFloat(this.getEffectif.taux_remb_groupe.toFixed(3))
        this.getEffectif.taux_remb_entpse = parseFloat(this.getEffectif.taux_remb_entpse.toFixed(3))
        this.getEffectif.taux_remb_total = parseFloat(this.getEffectif.taux_remb_total.toFixed(3))
    }

    randomize() {
        for (let i in this.shortAgenceState) {
            for (let j in this.randomColor) {
                this.tab.push(this.randomColor[j]);
            }
        }
    }

    reportAgenceLevelState(chaineAgence, userReference) {
        this.homeService.reportSfdAgence(chaineAgence, userReference)
            .subscribe((res) => {
                this.getEffectifValues(res)
                this.load = true
            })
    }
    public reportAgenceShortState() {
        this.homeService.reportShortStateAgences(this.sfdReference)
            .subscribe((res) => {
                this.shortAgenceState = res
                this.randomize();
                this.load = true
            })
    }
}
