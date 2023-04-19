import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {UtilService} from "../../shared/util.service";
import {UserData} from "../../shared/index";
import { Subscription } from 'rxjs';
import { getAgenceRef, searchRessource, nameSFD, nameAgence } from '../../shared/model/functions';
import { agence } from '../../entities/entity.module';
import { account } from '../../app.module';

@Component({
    selector: 'jhi-etats',
    templateUrl: './etats.component.html',
})
export class EtatsComponent implements AfterViewInit, OnInit {
    date1: any;
    date2: any;
    loading = true;
    q: any = {};
    listAgences: any = [];
    selectedAgence: any;
    @ViewChild('iframe') private _iframe;
    public sfd_level: boolean;
    public agence_level: boolean;
    public user_level: boolean;
    public agences_users:any[];
    private _s: Subscription;
    selectedSate: boolean;
    _st: boolean[] = [false, true];

    constructor(
        private _spFNMService: UtilService,
        private _datePipe: DatePipe,
        private _activatedRoute: ActivatedRoute,
    ) {
        this.sfd_level = false;
        this.agence_level = false;
        this.user_level = false;
        this.agences_users=[]
    }

    ngOnInit() {
        const now = new Date();
        const now30 = new Date(+now - (1000*60*60*24*30));
        this.date1 = {
            year: now30.getFullYear(),
            month: now30.getMonth() + 1,
            day: now30.getDate()
        };
        this.date2 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
        this.q = this._activatedRoute.snapshot.queryParams;

       // console.log(this.q.path);

        this.listAgences = UserData.getInstance().listeAgences;

        this.userLevel();
    }

    ngAfterViewInit() {
        this._s = this._activatedRoute.queryParams.subscribe((q) => {
            this.q = q;
            this.getData();
        });
    }

    ngOnDestroy() {
        if (this._s) {
            this._s.unsubscribe();
        }
    }
    

    getData(isBenef:boolean = false) {

        //console.log(this.q.path);
        let stateUrl = "";

        if(isBenef) stateUrl = 'sfd/' + this.q.link + '-beneficiaires/file';
        else stateUrl = 'sfd/' + this.q.link + '/file';
        
        const formatDate = (date) => this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'MM/dd/y');
        
        this.loading = true;
        
        const req: any = {
            sfd_reference: UserData.getInstance().getSFDReference(),
            date2: formatDate(this.date2),            
        };

        if(this.agence_level) req.agence_reference = UserData.getInstance().currentAgence.codeAgence;

        if(this.sfd_level && this.selectedAgence !== null) req.agence_reference = this.selectedAgence;

        if(this.period) req.date1 = formatDate(this.date1);

        this._spFNMService.toFileRequest(stateUrl, req, this.isPaysage())
        .then((data) => {
            this.loading = false;
            this._iframe.nativeElement.src = data;
        })
        .catch(() => {
            this.loading = false;
        });
    }

    period() {
        return (this.q.link !== 'encours-credits' && this.q.link !== 'credits-impaye');
    }

    isPaysage(){
        /* return ( 
            this.q.link === 'credits-accordes-beneficiaires' ||
            this.q.link === 'credits-accordes' ||
            this.q.link === 'credits-remboursement' ||
            this.q.link === 'remboursement-attendu-retard' ||
            this.q.link === 'credits-impaye'
         ); */

         return true;
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


    
}
