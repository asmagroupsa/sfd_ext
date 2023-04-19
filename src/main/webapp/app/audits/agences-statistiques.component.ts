import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { Router, ActivatedRoute } from '@angular/router';
/* import { StateService } from '../shared/state/statistiques'; */

import { UserData, EventBus } from '../shared';
import { AuditsService } from './audits.service';
import {
    searchRessource,
    nameSFD,
    nameZoneAgence,
    nameAgence
} from '../shared/model/functions';
import { Subscription } from 'rxjs';

@Component({
    selector: 'jhi-agences-statistiques',
    templateUrl: './agences-statistiques.component.html',
    styleUrls: ['audits.scss', '../shared/state/state.scss']
})
export class AgencesStatistiquesComponent implements OnInit, OnDestroy{
    private subscription: Subscription;
    public getEffectif: any;
    public sfd_level: boolean;
    public agence_level: boolean;
    public user_level: boolean;
    public agences_users:any[];
    public load:boolean=false;
    @Input() param;
    arg:string;
    agence_name: any;
    constructor(private route: ActivatedRoute,
        public homeService: AuditsService,
        public principal:Principal
        ){
        this.getEffectif = {};
        this.sfd_level = false;
        this.agence_level = false;
        this.user_level = false;
        this.agences_users=[]
    }
    ngOnInit(){
        this.subscription = this.route.params.subscribe((params) => {
            if (params['id']==undefined){
                 this.arg=this.param
                 
            }else{
                this.arg = params['id'];
                this.agence_name = params['name']
            }
            this.homeService.reportSfdAgence(this.arg)
                .subscribe((res) => {
                     this.getEffectif = res[0];
                    this.getEffectif.taux_remb_individu = parseFloat(this.getEffectif.taux_remb_individu.toFixed(3))
                    this.getEffectif.taux_remb_groupe = parseFloat(this.getEffectif.taux_remb_groupe.toFixed(3))
                    this.getEffectif.taux_remb_entpse = parseFloat(this.getEffectif.taux_remb_entpse.toFixed(3))
                    this.getEffectif.taux_remb_total = parseFloat(this.getEffectif.taux_remb_total.toFixed(3))
                    this.userLevel();
                    this.listUserByAgence(this.arg)
                    this.load=true;
            })
        })
        
    }

    public userLevel(): boolean {
        if (
            searchRessource(UserData.getInstance(), nameSFD)
        ) {
            this.agence_level = false
            this.user_level = false;
            return this.sfd_level = true;
        } else if (searchRessource(UserData.getInstance(), nameAgence)) {
            this.sfd_level = false
            this.user_level = false;
            return this.agence_level = true;
        } else {
            this.sfd_level = false;
            this.agence_level = false;
            return this.user_level = true;
        }
    }

    public listUserByAgence(agence_ref){
        this.homeService
            .listUserAgence(agence_ref)
            .subscribe((res) => {
                this.agences_users=res;
            });
    }

    public onUserChange(evalue) {
        /*  this.load=false */
        this.homeService.reportSfdAgence(undefined,evalue)
            .subscribe((res) => {
                this.getEffectif = res[0];
                this.getEffectif.taux_remb_individu = parseFloat(this.getEffectif.taux_remb_individu.toFixed(3))
                this.getEffectif.taux_remb_groupe = parseFloat(this.getEffectif.taux_remb_groupe.toFixed(3))
                this.getEffectif.taux_remb_entpse = parseFloat(this.getEffectif.taux_remb_entpse.toFixed(3))
                this.getEffectif.taux_remb_total = parseFloat(this.getEffectif.taux_remb_total.toFixed(3))
            })
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}
