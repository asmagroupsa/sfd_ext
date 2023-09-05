import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { SinistreService } from './sinistre.service';
import { Principal, ResponseWrapper, UserData } from '../../shared';
import { AssuranceService } from '../assurances';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SinistrePopupService } from './sinistre-popup.service';
import { Sinistre } from './sinistre';
import { CARMESService } from '../../shared/carmes.service';
import { Observable } from 'rxjs';
declare let select_init: any;

@Component({
    selector: 'jhi-app-name',
    templateUrl: './sinistre-reglement-dialog.component.html',
})
export class SinistreReglementComponent implements OnInit {
    authorities: any[];
    isSaving: boolean;
    params: { [key: string]: any };
    createdDateDp: any;
    lastModifiedDateDp: any;
    maxDate = { year: new Date().getFullYear() - 18, month: 12, day: 31 };
    minDate = { year: this.maxDate.year - 82, month: 1, day: 1 };
    listAyantDroit: any[] = [];
    Assuree: any;
    assurance: any;
    loading = false;
    showAyantDroit = false;
    ayantDroit: any;
    sinistre = new Sinistre();
    seeOther = false;

    reglementSinistre = {
        montant: '',
        observation: '',
        createdBy: '',
        sinistreId: 0,
        compteCarmes: ''
    };

    compteCarmes;
    libele;
    carmesAyantDroit;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sinistreService: SinistreService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private assuranceService: AssuranceService,
        private _datePipe: DatePipe,
        private _carmesService: CARMESService
    ) { }

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];

        /* this.cityService.query({ size: 100 }).subscribe(
            (res: ResponseWrapper) => {
                this.communes = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.townShipService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.arrondissements = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.districtService.query({ size: 100000000 }).subscribe(
            (res: ResponseWrapper) => {
                this.districts = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        ); */
        this.sinistreService.find(this.sinistre.id).subscribe(
            (res: Sinistre) => {
                this.sinistre = res;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    async save() {
        let data;
        try {
            data = await this._carmesService.transfertToOrder(this.compteCarmes, this.libele, this.sinistre.montantApayer, this.carmesAyantDroit);
            console.log(data);
            if (data) {
                this.saveReglementSinistre();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async saveReglementSinistre() {
        this.reglementSinistre.montant = this.sinistre.montantApayer;
        this.reglementSinistre.sinistreId = this.sinistre.id;
        this.reglementSinistre.compteCarmes = this.carmesAyantDroit;
        this.reglementSinistre.createdBy = UserData.getInstance().userReference;
        this.subscribeToSaveResponse(
            this.sinistreService.saveReglementSinistre(this.reglementSinistre),
            true
        );
    }

    private subscribeToSaveResponse(result: Observable<any>, isCreated: boolean) {
        result.subscribe(
            (res: Sinistre) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Sinistre, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'Reglement éffectué avec succes' : 'Sinistre mise à jour avec succes',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'assuranceListModification',
            content: 'OK'
        });
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
}

@Component({
    selector: 'jhi-sinistre-popup',
    template: ''
})
export class ReglementSinistrePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sinistrePopupService: SinistrePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['sinistre']) {
                this.modalRef = this.sinistrePopupService.open(
                    SinistreReglementComponent as Component,
                    params['sinistre']
                );
            } else {
                this.modalRef = this.sinistrePopupService.open(
                    SinistreReglementComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
