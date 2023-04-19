import {Component, OnDestroy, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';
import {Observable} from 'rxjs';

import {ResponseWrapper} from '../../shared';
import {Principal} from '../../shared/auth/principal.service';
import {formatNumberToLocalString, setCreateBy, setLastModifyBy} from '../../shared/model/functions';
import {getUniqueId} from '../../shared/model/request-util';
import {CreditComity, CreditComityService} from '../credit-comity';
import {CreditRequest, CreditRequestService} from '../credit-request';
import {DossierPopupService} from './dossier-popup.service';
import {Dossier} from './dossier.model';
import {DossierService} from './dossier.service';
import {LigneRequestService} from '../ligne-request/ligne-request.service';

declare let select_init: any;

@Component({
    selector: 'jhi-dossier-dialog',
    templateUrl: './dossier-dialog.component.html'
})
export class DossierDialogComponent implements OnInit {
    fragment: boolean;
    params: {[key: string]: any;};
    dossier: Dossier;
    requests: any;
    authorities: any[];
    isSaving: boolean;
    dossierMontantAccorder: string;
    creditcomity: CreditComity;
    creditrequests: any[] = [];
    createdDateDp: any;
    lastModifiedDateDp: any;
    requestAmount = 0;
    request: any;
    canAdd = false;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private dossierService: DossierService,
        private creditComityService: CreditComityService,
        private creditRequestService: CreditRequestService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        public _ligneRequestService: LigneRequestService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
        activatedRoute.fragment.subscribe(fragment => {
            this.fragment = fragment == 'attente' ? true : false;
        });
    }
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this._checkCanAdd();
    }

    private _checkCanAdd() {
        const creditComityId = this.activatedRoute.snapshot.queryParams.comity;

        if (creditComityId) {
            this._ligneRequestService.creditComityInLigneRequest(creditComityId)
                .then((i) => {
                    this.canAdd = !i;

                    if (!this.canAdd) {
                        this._canTAddAlert();
                    }
                    else {
                        this.getComity();
                    }
                })
                .catch(() => {
                    this.canAdd = false;
                    this._canTAddAlert();
                });
        }
    }

    getComity() {
        this.creditComityService.find(+this.params['comity']).subscribe(
            (res: CreditComity) => {
                this.creditcomity = res;
                if (this.creditcomity.dossierComplets && !this.fragment) {
                    this.alertService.error(`Les dossiers du comité ${this.creditcomity.libelle} sont complets.Vous ne pouvez plus ajouter de nouveaux dossiers`, null, null);
                    alert(`Les dossiers du comité ${this.creditcomity.libelle} sont complets.Vous ne pouvez plus ajouter de nouveaux dossiers`);
                    this.activeModal.dismiss({});
                    return;
                }
                let chaineAgences: any[] = this.creditcomity.agences.map((agence: any) => {
                    return agence.codeAgence;
                });
                this.creditRequestService.queryComitable("", chaineAgences).subscribe(
                    (res: ResponseWrapper) => {
                        let maxAmount = 0;
                        if (this.creditcomity.delegationComity) {
                            maxAmount = this.creditcomity.delegationComity.maxAmount;
                        }
                        this.creditrequests = res.json.map(element => {
                            //element.amount
                            if (element.amountetape >= maxAmount && maxAmount)
                                element.amountIsGreater = true;
                            return element;
                        });
                    },
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (!this.canAdd || !this.amountIsValid()) {
            return;
        }
        this.isSaving = true;
        this.principal.identity().then(
            async (identity: any) => {
                if (this.dossier.id !== undefined) {
                    setLastModifyBy(this.dossier, identity);
                    this.subscribeToSaveResponse(
                        this.dossierService.update(this.dossier),
                        false
                    );
                } else {
                    setCreateBy(this.dossier, identity);
                    // [this.requests].forEach((requestId, index) => {
                    this.dossier.creditRequestId = this.requests;
                    let request = this.creditrequests.find(request => request.credit_request_id == this.dossier.creditRequestId);
                    this.dossier.client = request ? request.name : '';

                    this.dossier.reference = getUniqueId();
                    this.subscribeToSaveResponse(this.dossierService.create(this.dossier), true, 0);

                    this.dossierService.verificationActivationCarmes(request.chaine_compte_carmes).toPromise()
                    .then((res) => {
                        let carmesNotActive = res.filter((i: any) => i.etatActivation === 0).map((i) => i.compteCarmes);
                        // carmesNotActive = [];

                        if (carmesNotActive.length !== 0) {
                            let msg: string;

                            if (carmesNotActive.length > 1) {
                                msg = `Les comptes CARMES ${carmesNotActive.join(', ')} ne sont pas activés`
                            }
                            else {
                                msg = `Le compte CARMES ${carmesNotActive[0]} n' est pas activé`
                            }

                            this.alertService.warning(msg);
                            this.isSaving = false;
                            return;
                        }

                        this.dossier.reference = getUniqueId();
                        this.subscribeToSaveResponse(this.dossierService.create(this.dossier), true, 0);
                    });
                }
            },
            () => {}
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Dossier>,
        isCreated: boolean,
        index?: number
    ) {
        result.subscribe(
            (res: Dossier) => this.onSaveSuccess(res, isCreated, index),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Dossier, isCreated: boolean, index?: number) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.dossier.created'
                : 'carmesfnmserviceApp.dossier.updated',
            {param: result.id},
            null
        );
        // if (index + 1 == [this.requests].length) {
        this.eventManager.broadcast({
            name: 'dossierListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
        // }
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

    trackCreditComityById(index: number, item: CreditComity) {
        return item.id;
    }

    trackCreditRequestById(index: number, item: CreditRequest) {
        return item.id;
    }

    onRequestChange() {
        this.request = this.creditrequests.find((r) => r.credit_request_id === this.requests);

        if (!this.request) {
            return;
        }

        this.requestAmount = this.request.amountetape;

        if (this.request.produit !== 'MCM') {
            return;
        }

        this.dossier.montantAccorder = this.request.amountetape;
        this.dossierMontantAccorder = formatNumberToLocalString(this.dossier.montantAccorder);
    }

    amountIsValid() {
        // if (!this.dossier.montantAccorder) {
        //     return true;
        // }
        if (this.request && this.request.amount_min > this.dossier.montantAccorder) {
            return false;
        }
        return (0 < this.dossier.montantAccorder) && (this.dossier.montantAccorder <= this.requestAmount);
    }

    private _canTAddAlert() {
        this.alertService.warning('Vous ne pouvez pas ajouter de dossier au comité');
        // this.activeModal.dismiss();
    }
}

@Component({
    selector: 'jhi-dossier-popup',
    template: ''
})
export class DossierPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dossierPopupService: DossierPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.dossierPopupService.open(
                    DossierDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.dossierPopupService.open(
                    DossierDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
