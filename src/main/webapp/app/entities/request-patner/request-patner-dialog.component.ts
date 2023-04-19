import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { ResponseWrapper, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import {
    getNewItems,
    localStringToNumber,
    numberToLocalString,
    numberToLocalStringTonumber,
    setCreateBy,
    setLastModifyBy,
} from '../../shared/model/functions';
import { ConditionAcces } from '../condition-acces/condition-acces.model';
import { ConditionAccesService } from '../condition-acces/condition-acces.service';
import { Frais, FraisService } from '../frais';
import { PenalityService } from '../penality';
import { Periodicity, PeriodicityService } from '../periodicity';
import { TauxEpargne } from '../taux-epargne/taux-epargne.model';
import { TauxEpargneService } from '../taux-epargne/taux-epargne.service';
import { TranchePenal, TranchePenalService } from '../tranche-penal';
import { TypeClientService } from '../type-client';
import { TypeGarantie, TypeGarantieService } from '../type-garantie';
import { TypesContratService } from '../types-contrat/types-contrat.service';
import { RequestPartner } from './request-patner.model';
import { RequestPartnerService } from './request-patner.service';
import { RequestPartnerPopupService } from './request-patner-popup.service';

declare let select_init: any;
@Component({
    selector: 'jhi-request-patner-dialog',
    templateUrl: './request-patner-dialog.component.html',
    styles: [
        `
  .advervable{
position:relative;
  }
.advervable label{
  display: inline;
}
.advervable span.lever{
  position: absolute;
    right: 0;
}
  `
    ]
})
export class RequestPartnerDialogComponent implements OnInit {
    typeClientIdArray: any[] = [];
    activeCondition: boolean = true;
    requestPartner: RequestPartner;
    authorities: any[];
    isSaving: boolean;
    typegaranties: TypeGarantie[];
    conditions: ConditionAcces[] = [];
    frais: Frais[];
    tranchepenals: TranchePenal[];
    tauxes: TauxEpargne[];
    periodicities: Periodicity[];
    penalities = [];
    contrats = [];
    createdDateDp: any;
    lastModifiedDateDp: any;
    params: any;
    partenaires: any[];
    loadingArray = {
        typeClient: false,
        periodicities: false,
        typeGaranties: false,
        frais: false,
        conditionAccess: false,
        tranchePenals: false,
        contrats: false,
        penalities: false
    };
    produitAmountMin: string;
    produitAmountMax: string;
    produitMontantFrais: string;

    partnerId: number;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private requestPartnerService: RequestPartnerService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private http: Http,
    ) { }

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this.partenaires = [];
        const req = {
            code: UserData.getInstance().sfd_.id
        };
        this.requestPartnerService.queryPartner().subscribe(
            (res: ResponseWrapper) => {
                this.loadingArray.typeClient = false;
                this.partenaires = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.requestPartner.sens = "SFD";
        this.requestPartner.etat = "EN_ATTENTE";
        this.requestPartner.partner = {id: this.partnerId};
        this.requestPartner.sfd = {id: UserData.getInstance().sfdId};
        this.principal.identity().then(
            (identity: any) => {
                this.subscribeToSaveResponse(this.requestPartnerService.create(this.requestPartner), true);
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<RequestPartner>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: RequestPartner) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: RequestPartner, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'Demande de parteneriat effecteer avec succès'
                : 'demande modifié',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'produitListModification',
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
    selector: 'jhi-request-partner-popup',
    template: ''
})
export class RequestPartnerPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private produitPopupService: RequestPartnerPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.produitPopupService.open(
                    RequestPartnerDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.produitPopupService.open(
                    RequestPartnerDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
    }
}
