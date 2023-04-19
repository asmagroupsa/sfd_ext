import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ClientService } from '../client';
import { UserData, ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { SinistrePopupService, SinistreService, Sinistre } from '.';
import { DatePipe } from '@angular/common';
import { AssuranceService } from '../assurances';
declare let select_init: any;

@Component({
    selector: 'jhi-sinistre-dialog',
    templateUrl: './sinistre-dialog.component.html',
    styles: [ ]
})
export class SinistreDialogComponent implements OnInit {
    sinistre = new Sinistre();
    authorities: any[];
    isSaving: boolean;
    allAssuranceInfo: any[] = [];
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


    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sinistreService: SinistreService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private assuranceService: AssuranceService,
        private _datePipe: DatePipe,
    ) { }

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.loadAllAssure();
    }

    clear() {
        this.activeModal.dismiss('cancel');
        this.loadAllAssure();
    }

    loadAllAssure() {
        this.loading = false;
        this.assuranceService
            .query({
                NO_QUERY: false,
                'sfd_reference': (UserData.getInstance().sfd || UserData.getInstance().currentSfdReference),
                'agence_reference': (UserData.getInstance().currentAgence.codeAgence),
            })
            .subscribe(
                (res: ResponseWrapper) => this.onSuccessLoadAssure(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    async save() {
        if (this.sinistre.typeSinistre === 'BENEFICIAIRE') {
            this.sinistre.nomPrenomDeces = this.Assuree.first_name + ' ' + this.Assuree.name;
            this.sinistre.adressDeces = this.Assuree.adresse;
        } else {
            this.sinistre.nomPrenomDeces = this.ayantDroit.first_name + ' ' + this.ayantDroit.name;
            this.sinistre.beneficiaireId = this.ayantDroit.id;
            this.sinistre.adressDeces = this.ayantDroit.adresse;
        }

        this.sinistre.createdBy = UserData.getInstance().userReference;


        this.sinistre.numPolice = this.Assuree.num_police;
        this.sinistre.dateDeces = this.sinistre.dateDeces + ':00Z';
        this.sinistre.sfdReference = UserData.getInstance().currentSfdReference || UserData.getInstance().sfd;
        this.isSaving = true;
        this.subscribeToSaveResponse(
            this.sinistreService.create(this.sinistre),
            true
        );
    }

    formatDate = (date) => {
        if (!date) return null;
        return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
    };


    private subscribeToSaveResponse(result: Observable<Sinistre>, isCreated: boolean) {
        result.subscribe(
            (res: Sinistre) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Sinistre, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'Sinistre crréer avec succes' : 'Sinistre mise à jour avec succes',
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

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    getAllAyantDroit() {
        this.sinistre.professionDeces = this.Assuree.profession;
        this.sinistre.agenceReference = UserData.getInstance().currentAgence.codeAgence;
        this.loading = false;
        this.sinistreService.getAyantDroit(this.Assuree.num_police).subscribe((data: any) => {
            console.log(data);
            this.listAyantDroit = data;
            this.loading = true;
        })
    }

    choiseType() {
        if (this.sinistre.typeSinistre === 'BENEFICIAIRE') {
            this.showAyantDroit = false;
            this.sinistre.clientId = this.Assuree.id;
        } else if (this.sinistre.typeSinistre === 'AYANT_DROIT') {
            this.showAyantDroit = true;
            this.getAllAyantDroit();
        }
    }

    choiceAyantDroit() {

    }



    private onSuccessLoadAssure(data, headers) {
        this.assurance = data;
        this.loading = true;
        select_init();
    }
}

@Component({
    selector: 'jhi-sinistre-popup',
    template: ''
})
export class SinistrePopupComponent implements OnInit, OnDestroy {
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
                    SinistreDialogComponent as Component,
                    params['sinistre']
                );
            } else {
                this.modalRef = this.sinistrePopupService.open(
                    SinistreDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
