import { ConditionAccesService } from '../condition-acces/condition-acces.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response, Http } from '@angular/http';
import { CurrencyPipe } from '@angular/common';
import {
    setCreateBy,
    setLastModifyBy,
    formatNumberToLocalString,
    localStringToNumber,
    numberToLocalString,
    numberToLocalStringTonumber,
    getNewItems
} from '../../shared/model/functions';
import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Produit } from './produit.model';
import { ProduitPopupService } from './produit-popup.service';
import { ProduitService } from './produit.service';
import { TypeGarantie, TypeGarantieService } from '../type-garantie';
import { Frais, FraisService } from '../frais';
import { TranchePenal, TranchePenalService } from '../tranche-penal';
import { Periodicity, PeriodicityService } from '../periodicity';
import { ResponseWrapper, LOCAL_FLAG, HOST, createRequestOption, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { TauxEpargne } from '../taux-epargne/taux-epargne.model';
import { TauxEpargneService } from '../taux-epargne/taux-epargne.service';
import { ConditionAcces } from '../condition-acces/condition-acces.model';
import { NgForm } from '@angular/forms';
import { TypeClientService } from '../type-client';
import { TypesContratService } from '../types-contrat/types-contrat.service';
import { PenalityService } from '../penality';
declare let select_init: any;
@Component({
    selector: 'jhi-produit-taux-commission-dialog',
    templateUrl: './produit-taux-commission-dialog.component.html',
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
export class ProduitTauxCommissionDialogComponent {
    typeClientIdArray: any[] = [];
    activeCondition: boolean = true;
    produit: Produit;
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
    typeClients: any[];
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
model:any;
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private produitService: ProduitService,
        private typeGarantieService: TypeGarantieService,
        private conditionsService: ConditionAccesService,
        private fraisService: FraisService,
        private tranchePenalService: TranchePenalService,
        private tauxService: TauxEpargneService,
        private periodicityService: PeriodicityService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private typeClientService: TypeClientService,
        private contratService: TypesContratService,
        private http: Http,
        private penalityService: PenalityService
    ) {
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save(invalid) {
        if (invalid) {
            this.alertService.warning("Les champs obligatoires ne sont pas renseignés");
            return;
        }
        this.isSaving = true;
        this.subscribeToSaveResponse(this.produitService.updateTauxCommission(this.model), true);
    }

    amountMaxIsSuperiorToAmountMax() {
        return (
            localStringToNumber(this.produit.amountMax) >
            localStringToNumber(this.produit.amountMin)
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Produit>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Produit) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        if(result.resultat !== 'OK'){
            this.alertService.error(
            "Une erreur s'est produite lors de la mise à jour du taux",
            null,
            null
        );
            return ;
        }
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.produit.created'
                : 'carmesfnmserviceApp.produit.updated',
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

    trackTypeGarantieById(index: number, item: TypeGarantie) {
        return item.id;
    }

    trackConditionsById(index: number, item: ConditionAcces) {
        return item.id;
    }

    trackFraisById(index: number, item: Frais) {
        return item.id;
    }

    trackTranchePenalById(index: number, item: TranchePenal) {
        return item.id;
    }

    trackTauxById(index: number, item: TauxEpargne) {
        return item.id;
    }

    trackPeriodicityById(index: number, item: Periodicity) {
        return item.id;
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

    private _loadPenalities(queries: any = {}) {
        this.loadingArray.penalities = true;
        this.penalityService.query(queries)
        // this.http.get(HOST + '/api/penalites', createRequestOption({ NO_QUERY: true }))
        .subscribe(
            (r) => {
                this.penalities = this.penalities.concat(r.json);
                this.loadingArray.penalities = false;
            },
            () => {
                this.loadingArray.penalities = false;
            }
        );
    }

    private _loadConditionAcces(queries: any = {}) {
        this.loadingArray.conditionAccess = true;
        this.conditionsService.query(queries).subscribe(
            (res: ResponseWrapper) => {
                this.conditions = this.conditions.concat(getNewItems(this.conditions, res.json));
                this.loadingArray.conditionAccess = false;
            },
            (res: ResponseWrapper) => {
                this.loadingArray.conditionAccess = false;
                this.onError(res.json);
            }
        );
    }
}

@Component({
    selector: 'jhi-produit-taux-commission-popup',
    template: ''
})
export class ProduitTauxCommissionPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private produitPopupService: ProduitPopupService
    ) { }

    ngOnInit() {
        // if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.produitPopupService.open(
                        ProduitTauxCommissionDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.produitPopupService.open(
                        ProduitTauxCommissionDialogComponent as Component
                    );
                }
            });
        // } else {
        //     window.history.back();
        // }
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
    }
}
