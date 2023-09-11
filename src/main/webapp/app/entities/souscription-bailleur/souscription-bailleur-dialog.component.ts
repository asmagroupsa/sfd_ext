import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SouscriptionBailleur } from './souscription-bailleur.model';
import { SouscriptionBailleurPopupService } from './souscription-bailleur-popup.service';
import { ResponseWrapper, setCreateBy, setLastModifyBy, Principal } from '../../shared';
import { Client, ClientService } from '../client';
import { Periodicity, PeriodicityService } from '../periodicity';
import { getNewItems } from '../../shared/model/functions';
import { Country, CountryService } from '../country';
import { SouscriptionBailleurService } from './souscription-bailleur.service';
declare let select_init: any;


@Component({
    selector: 'jhi-souscription-bailleur-dialog',
    templateUrl: './souscription-bailleur-dialog.component.html',
    styles: [
       `
       input {
        padding: 0px;
       }
       `
    ]
})
export class SouscriptionBailleurDialogComponent implements OnInit {
    souscriptionBailleur: SouscriptionBailleur;
    authorities: any[];
    isSaving: boolean;
    clients: Client[];
    createdDateDp: any;
    lastModifiedDateDp: any;
    carmesAcountIsValid = false;
    periodicities: Periodicity[] = [];
    countries: Country[] = [];

    ipv = false;
    loading = {
        compteCarmes: false,
        ip: false
    };
    private _ip: string;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private SouscriptionBailleurService: SouscriptionBailleurService,
        private clientService: ClientService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private periodicityService: PeriodicityService,
        private countryService: CountryService,

    ) {}

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this._loadPeridicities();
        this._loadCountry();
        // console.log('id -> ' + this.souscriptionBailleur.id != null ? this.souscriptionBailleur.id : 0);

        this.isSaving = false;
        if (this.souscriptionBailleur.id) {
            this.carmesAcountIsValid = true;
            this.ipv = true;
            this._ip = this.souscriptionBailleur.indicePrestataire;
        }

        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.clientService.query().subscribe(
            (res: ResponseWrapper) => { this.clients = res.json; },
            (res: ResponseWrapper) => { this.onError(res.json) }
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        this.principal.identity().then(async (identity) => {
            //console.log(identity);
            try {
                let result = await this.SouscriptionBailleurService.checkIndicePrestataire(this.souscriptionBailleur.indicePrestataire)
            .toPromise();
            if(result['Resultat'] != 1){
                this.isSaving = false;
                this.alertService.error("L'indice prestataire est invalide", null, null);
                return ;
            }
            } catch (e) {
                this.isSaving = false;
                this.alertService.error("Vérification de l'indice prestataire échouée", null, null);
                return ;  
            }
            if (this.souscriptionBailleur.id !== undefined) {
                setLastModifyBy(this.souscriptionBailleur, identity);
                this.subscribeToSaveResponse(this.SouscriptionBailleurService.update(this.souscriptionBailleur), false);
            } else {
                setCreateBy(this.souscriptionBailleur, identity);
                this.souscriptionBailleur.code = `${Date.now()}`;
                this.souscriptionBailleur.createdBy = identity.id || identity.login;
                this.subscribeToSaveResponse(this.SouscriptionBailleurService.create(this.souscriptionBailleur), true);
            }
        });
    }

    private subscribeToSaveResponse(result: Observable<SouscriptionBailleur>, isCreated: boolean) {
        result.subscribe(
            (res: SouscriptionBailleur) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: SouscriptionBailleur, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.SouscriptionBailleur.created' : 'carmesfnmserviceApp.SouscriptionBailleur.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({ name: 'SouscriptionBailleurListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackClientById(index: number, item: Client) {
        return item.id;
    }

    trackPeriodicityById(index: number, item: Periodicity) {
        return item.id;
    }

    trackPaysById(index: number, item: Country) {
        return item.id;
    }

    checkCARMESAccount() {
        if (!this.souscriptionBailleur.compteCarmes) return;
        this.loading.compteCarmes = true;

        this.SouscriptionBailleurService
        .checkCARMESAccount(this.souscriptionBailleur.compteCarmes)
        .subscribe((res) => {
            this.loading.compteCarmes = false;
            this.carmesAcountIsValid = res.json.resultat === 'OK';

            if (!this.carmesAcountIsValid) {
                if (res.json.resultat === 'NON') this.alertService.error('carmesfnmserviceApp.carmesVerification.non');
                else if (res.json.resultat === 'ERROR_CARMES_REQUEST') this.alertService.error('carmesfnmserviceApp.carmesVerification.errorCarmesRequest');
                else if (res.json.resultat === 'NON_CARMES') this.alertService.error('carmesfnmserviceApp.carmesVerification.nonCarmes');
            }
        },() => {
            this.loading.compteCarmes = false;
            this.carmesAcountIsValid = false;
            this.alertService.error('carmesfnmserviceApp.carmesVerification.httpError');
        });
    }

    cip() {
        if  (!this.souscriptionBailleur.indicePrestataire) return;
        if  (this.souscriptionBailleur.id && this.souscriptionBailleur.indicePrestataire === this._ip) {
            this.ipv = true;
            return;
        }
        this.loading.ip = true;

        this.SouscriptionBailleurService.query({'indicePrestataire.equals': this.souscriptionBailleur.indicePrestataire})
        .subscribe((r) => {
            this.loading.ip = false;
            this.ipv = r.json.length === 0;

            if (!this.ipv)
                this.alertService.error('carmesfnmserviceApp.ip.use');
        }, () => {
            this.loading.ip = false;
            this.ipv = false;
            this.alertService.error('carmesfnmserviceApp.ip.httpError');
        });
    }

    private _loadPeridicities(req?: any) {
        this.periodicityService.query(req).subscribe(
            (res: ResponseWrapper) => {
                this.periodicities = this.periodicities.concat(getNewItems(this.periodicities, res.json));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private _loadCountry(req?: any) {
        this.countryService.query(req).subscribe(
            (res: ResponseWrapper) => {
                this.countries = this.countries.concat(getNewItems(this.countries, res.json));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-souscription-bailleur-popup',
    template: ''
})
export class SouscriptionBailleurPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private SouscriptionBailleurPopupService: SouscriptionBailleurPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                console.log("edition sous-bail");

                this.modalRef = this.SouscriptionBailleurPopupService.open(
                    SouscriptionBailleurDialogComponent,
                    params['id']
                );
            } else {
                console.log("Creation sous-bail");

                setTimeout(() => {
                    this.modalRef = this.SouscriptionBailleurPopupService.open(SouscriptionBailleurDialogComponent as Component);
                }, 0);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
