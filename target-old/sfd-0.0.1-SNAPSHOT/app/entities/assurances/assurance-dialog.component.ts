import { Departement } from '../departement/departement.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AssuranceService } from './assurance.service';
import { Client, ClientService } from '../client';
import { ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { Assurance } from './assurance.model';
import { AssurancePopupService } from './assurance-popup.service';
import { DatePipe } from '@angular/common';
declare let select_init: any;

@Component({
    selector: 'jhi-address-dialog',
    templateUrl: './assurance-dialog.component.html',
    styles: [
        `
  #myAddressLabel span{
    font-size:19px !important;
  }
  `
    ]
})
export class AssuranceDialogComponent implements OnInit {
    assurance = new Assurance();
    authorities: any[];
    isSaving: boolean;
    allAssuranceInfo: any[] = [];
    params: { [key: string]: any };

    InfosPere = new Assurance();
    InfosMere = new Assurance();
    InfosConjoint = new Assurance();
    InfosPereConjoint = new Assurance();
    InfosMereconjoint = new Assurance();
    InfosEnfant1 = new Assurance();
    InfosEnfant2 = new Assurance();
    InfosEnfant3 = new Assurance();
    InfosEnfant4 = new Assurance();

    client: Client;
    createdDateDp: any;
    lastModifiedDateDp: any;
    maxDate = { year: new Date().getFullYear() - 18, month: 12, day: 31 };
    minDate = { year: this.maxDate.year - 82, month: 1, day: 1 };

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private assuranceService: AssuranceService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private clientService: ClientService,
        private activatedRoute: ActivatedRoute,
        private _datePipe: DatePipe,
    ) {

        activatedRoute.queryParams.subscribe((params) => {
            console.log(params)
            this.params = params;
        });
        this.assurance.clientId = this.params["client"];
    }
    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.clientService.find(this.assurance.clientId).subscribe(
            (res: Client) => {
                this.client = res;
                console.log(res);
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    async save() {

        // const formatDate = (date) => {
        //     if(!date) return null;
        //     return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
        // };

        if (this.InfosConjoint.nomPrenom) {
            this.InfosConjoint.clientId = this.assurance.clientId;
            this.InfosConjoint.typeBeneficiaire = 'CONJOINT';
            // this.InfosConjoint.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosConjoint);
        }
        if (this.InfosPereConjoint.nomPrenom) {
            this.InfosPereConjoint.clientId = this.assurance.clientId;
            this.InfosPereConjoint.typeBeneficiaire = 'PERE_CONJOINT';
            // this.InfosPereConjoint.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosPereConjoint);
        }
        if (this.InfosMereconjoint.nomPrenom) {
            this.InfosMereconjoint.clientId = this.assurance.clientId;
            this.InfosMereconjoint.typeBeneficiaire = 'MERE_CONJOINT';
            // this.InfosMereconjoint.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosMereconjoint);
        }
        if (this.InfosEnfant1.nomPrenom) {
            this.InfosEnfant1.clientId = this.assurance.clientId;
            this.InfosEnfant1.typeBeneficiaire = 'ENFANT';
            // this.InfosEnfant1.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosEnfant1);
        }
        if (this.InfosEnfant2.nomPrenom) {
            this.InfosEnfant2.clientId = this.assurance.clientId;
            this.InfosEnfant2.typeBeneficiaire = 'ENFANT';
            // this.InfosEnfant2.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosEnfant2);
        }
        if (this.InfosEnfant3.nomPrenom) {
            this.InfosEnfant3.clientId = this.assurance.clientId;
            this.InfosEnfant3.typeBeneficiaire = 'ENFANT';
            // this.InfosEnfant3.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosEnfant3);
        }
        if (this.InfosEnfant4.nomPrenom) {
            this.InfosEnfant4.clientId = this.assurance.clientId;
            this.InfosEnfant4.typeBeneficiaire = 'ENFANT';
            // this.InfosEnfant4.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosEnfant4);
        }
        if (this.InfosMere.nomPrenom) {
            this.InfosMere.clientId = this.assurance.clientId;
            this.InfosMere.typeBeneficiaire = 'MERE';
            // this.InfosMere.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosMere);
        }
        if (this.InfosPere.nomPrenom) {
            this.InfosPere.clientId = this.assurance.clientId;
            this.InfosPere.typeBeneficiaire = 'PERE';
            // this.InfosPere.createdBy = UserData.getInstance().userReference;
            this.allAssuranceInfo.push(this.InfosPere);
        }

        await this.allAssuranceInfo.forEach((element) => {
            this.isSaving = true;
            this.subscribeToSaveResponse(
                this.assuranceService.create(element),
                true
            );
        });
    }


    private subscribeToSaveResponse(result: Observable<Assurance>, isCreated: boolean) {
        result.subscribe(
            (res: Assurance) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Assurance, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'Assurance crréer avec succes' : 'Assurance mise à jour avec succes',
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
}

@Component({
    selector: 'jhi-address-popup',
    template: ''
})
export class AssurancePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private addressPopupService: AssurancePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.addressPopupService.open(
                    AssuranceDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.addressPopupService.open(
                    AssuranceDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
