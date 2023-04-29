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
import { ProduitPopupService } from './produit-popup.service';
import { Produit } from './produit.model';
import { ProduitService } from './produit.service';

declare let select_init: any;
@Component({
    selector: 'jhi-produit-dialog',
    templateUrl: './produit-dialog.component.html',
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
export class ProduitDialogComponent implements OnInit {
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
        activatedRoute: ActivatedRoute,
        private typeClientService: TypeClientService,
        private contratService: TypesContratService,
        private penalityService: PenalityService
    ) {
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }

    ngAfterViewInit() {
        select_init((query, id) => {
            switch (id) {
                case 'field_penalities':
                    this._loadPenalities({ 'libelle.contains': query });
                    break;
                case 'field_conditionAccess':
                    this._loadConditionAcces({ 'name.contains': query });
                    break;
            }
        });

        this.activeCondition = this.produit.activerConditionAcces ? true : false;
    }
    ngOnInit() {
        if (this.produit.id) {
            this.activeCondition = this.produit.activerConditionAcces ? true : false;

            for (let type of this.produit.typeClients) {
                this.typeClientIdArray.push(type.id);
            }

            if (this.produit.amountMin) {
                this.produitAmountMin = numberToLocalString(this.produit.amountMin.toString());
            }

            if (this.produit.amountMax) {
                this.produitAmountMax = numberToLocalString(this.produit.amountMax.toString());
            }

            if (this.produit.montantFrais) {
                this.produitMontantFrais = numberToLocalString(this.produit.montantFrais.toString());
            }
        }
        else {
            this.produit.preleverFrais = false;
            this.produit.preleverInteret = false;
        }

        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.loadingArray.typeClient = true;
        let types = ['MUTUEL', 'INDIVIDU', 'ENTREPRISE', 'MARCHAND'];
        this.typeClientService.query({ size: 1000, "code.in": types.join(',') }).subscribe(
            (res: ResponseWrapper) => {
                this.loadingArray.typeClient = false;
                this.typeClients = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.typeGaranties = true;
        this.typeGarantieService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.typegaranties = res.json;
                this.loadingArray.typeGaranties = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this._loadConditionAcces();

        this.loadingArray.frais = true;
        this.fraisService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.frais = res.json;
                this.loadingArray.frais = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.tranchePenals = true;
        this.tranchePenalService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.tranchepenals = res.json;
                this.loadingArray.tranchePenals = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.tauxService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.tauxes = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.periodicities = true;
        this.periodicityService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.periodicities = res.json;
                this.loadingArray.periodicities = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this._loadPenalities();

        this.loadingArray.contrats = true;
        this.contratService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.contrats = res.json;
                this.loadingArray.contrats = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save(editForm) {
        if (!this.onValidate(editForm)) {
            this.alertService.warning("Les champs obligatoires ne sont pas renseignés");
            return;
        }
        if (this.activeCondition) {
            if (!this.produit.conditionAccesses || !this.produit.conditionAccesses.length) {
                this.alertService.warning("Condition d'accès activée, Vous devez ajouter les conditions");
                return;
            }
        }
        this.isSaving = true;
        this.produit.differe = this.produit.differe || 0;
        this.produit.delaiGrace = this.produit.delaiGrace || 0;
        this.principal.identity().then(
            (identity: any) => {
                this.produit.amountMin = localStringToNumber(this.produit.amountMin);
                this.produit.amountMax = localStringToNumber(this.produit.amountMax);

                if (this.typeClientIdArray.length > 0) {
                    this.produit.typeClients = this.typeClients.filter(type => {
                        return this.typeClientIdArray.indexOf(type.id) !== -1;
                    });
                }

                if (this.produit.id !== undefined) {
                    this.produit.activerConditionAcces = this.activeCondition ? 1 : 0;
                    setLastModifyBy(this.produit, identity);
                    this.subscribeToSaveResponse(this.produitService.update(this.produit), false);
                } else {
                    this.produit.activerConditionAcces = this.activeCondition ? 1 : 0;
                    setCreateBy(this.produit, identity);
                    this.produit.code = 'xxx';
                    this.produit.categorieProduitId = +this.params['id'] || 1;
                    this.produit.eligibilite = false;
                    this.produit.creditable = this.produit.categorieProduitId == 2 ? true : false;
                    this.produit.interestRate = this.produit.interestRate ? this.produit.interestRate : 0;

                    if (!this.produit.preleverFrais) {
                        this.produit.montantFrais = 0;
                    }

                    if (!this.produit.preleverInteret) {
                        this.produit.interestRate = 0;
                    }

                    this.produit.sfdReference = UserData.getInstance().sfd_.code;
                    this.produit.typeProduit = 'CREDIT';
                    this.subscribeToSaveResponse(this.produitService.create(this.produit), true);
                }
            },
            () => { }
        );
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

    private onSaveSuccess(result: Produit, isCreated: boolean) {
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

    trackTypeGarantieById(item: TypeGarantie) {
        return item.id;
    }

    trackConditionsById(item: ConditionAcces) {
        return item.id;
    }

    trackFraisById(item: Frais) {
        return item.id;
    }

    trackTranchePenalById(item: TranchePenal) {
        return item.id;
    }

    trackTauxById(item: TauxEpargne) {
        return item.id;
    }

    trackPeriodicityById(item: Periodicity) {
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
    onValidate(editForm: NgForm) {
        if (
            !editForm ||
            !editForm.controls ||
            !editForm.controls.interestRate ||
            !editForm.controls.duration ||
            !editForm.controls.amountMin ||
            !editForm.controls.amountMax
        )
            return false;
        let statement: boolean =
            !editForm.controls.interestRate.value ||
            (editForm.controls.interestRate.value &&
                (editForm.controls.interestRate.value >= 1 &&
                    editForm.controls.interestRate.value <= 100));

        let statement2: boolean =
            !editForm.controls.duration.value ||
            (editForm.controls.duration.value &&
                editForm.controls.duration.value >= 1);
        // let statement3: boolean =
        //   editForm.controls.amountMin.value &&
        //   editForm.controls.amountMin.value > 1000;
        let statement4: boolean =
            editForm.controls.amountMax.value &&
            numberToLocalStringTonumber(editForm.controls.amountMax.value) >=
            numberToLocalStringTonumber(editForm.controls.amountMin.value);
        return statement && statement2 && statement4;
        // return statement && statement2 && statement3 && statement4;
    }

    /* amountChange(e, type: string) {
        if (type == 'min') {
            this.produit.amountMin = formatNumberToLocalString(e);
        } else {
            this.produit.amountMax = formatNumberToLocalString(e);
        }
    } */

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
    selector: 'jhi-produit-popup',
    template: ''
})
export class ProduitPopupComponent implements OnInit, OnDestroy {
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
                    ProduitDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.produitPopupService.open(
                    ProduitDialogComponent as Component
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
