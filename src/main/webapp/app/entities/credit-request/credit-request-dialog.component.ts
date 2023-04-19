import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { getUniqueId, ResponseWrapper, updateForm } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { formatNumberToLocalString, getNewItems, setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Client, ClientService } from '../client';
import { ConditionRequestService } from '../condition-request/condition-request.service';
import { CreditRequestStatus, CreditRequestStatusService } from '../credit-request-status';
import { Periodicity, PeriodicityService } from '../periodicity';
import { Produit, ProduitService } from '../produit';
import { RequestRaison, RequestRaisonService } from '../request-raison';
import { ServiceUser, ServiceUserService } from '../service-user';
import { TypeClientService } from '../type-client';
import { CreditRequestPopupService } from './credit-request-popup.service';
import { CreditRequest } from './credit-request.model';
import { CreditRequestService } from './credit-request.service';
import {PhaseService} from "../phase/phase.service";
import {Phase} from "../phase/phase.model";


declare let select_init: any;
declare let jQuery: any;

@Component({
    selector: 'jhi-credit-request-dialog',
    templateUrl: './credit-request-dialog.component.html'
})
export class CreditRequestDialogComponent implements OnInit {
    private _memberNumber: number;
    currentProduitAmountMax: number;
    currentProduitAmountMin: number;
    _typeClientGroupId: number;
    currentProduit: Produit;
    clientOK: boolean;
    creditRequest: CreditRequest;
    authorities: any[];
    isSaving: boolean;

    creditrequeststatuses: CreditRequestStatus[];

    requestraisons: RequestRaison[];

    produits: Produit[];

    periodicities: Periodicity[];

    clients: any[] = [];
    requestDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;
    clientsGroupId = [];

    @ViewChild('editForm') editForm: NgForm;
    private _creditRequestClientIsGroup: boolean = false;
    creditRequestAmount: string;
    loading = {
        produits: false,
        clients: false,
        phase: false,
    };
    phases: Phase[] = [];
    phase: Phase;
    invalidGroupLength = false;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private creditRequestService: CreditRequestService,
        private creditRequestStatusService: CreditRequestStatusService,
        private requestRaisonService: RequestRaisonService,
        private serviceUserService: ServiceUserService,
        private produitService: ProduitService,
        private periodicityService: PeriodicityService,
        private clientService: ClientService,
        private eventManager: JhiEventManager,
        private conditionRequestService: ConditionRequestService,
        public principal: Principal,
        private typeClientService: TypeClientService,
        private _phaseService: PhaseService,
    ) { }


    ngAfterViewInit() {
        select_init((search, id) => {
            if (id == 'field_produit') {
                this.produitService.getFnmAndSfdProduits({ NO_QUERY: false, 'libelle.contains': search })
                    .then((produits) => {
                        this.produits = this.produits.concat(getNewItems(this.produits, produits));
                    });
            } else if (id == 'field_client') {
                this.clientService.query({ NO_QUERY: false, 'name.contains': search, 'condition': 'OR', 'firstName.contains': search, 'denomination.contains': search }).subscribe(
                    (res: ResponseWrapper) => {
                        this.clients = this.clients.concat(getNewItems(this.clients, res.json));
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id == 'field_periodicity') {
                this.periodicityService.query({ NO_QUERY: false, 'libPeriodicite.contains': search }).subscribe(
                    (res: ResponseWrapper) => {
                        this.periodicities = this.periodicities.concat(getNewItems(this.periodicities, res.json));
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id == 'field_requestObject') {
                this.requestRaisonService.query({ NO_QUERY: false, 'name.contains': search }).subscribe(
                    (res: ResponseWrapper) => {
                        this.requestraisons = this.requestraisons.concat(getNewItems(this.requestraisons, res.json));
                    },
                    (res: ResponseWrapper) => { }
                );
            }
        });
        if (this.creditRequest.id) {
            updateForm(this.editForm);
        }
    }
    nom(id: any) {
        if (!this.clients) return '';
        let client = this.clients.find(value => {
            return value.id == id;
        });
        return client
            ? (client.name ? client.name : '') +
            ' ' +
            (client.first_name ? client.first_name : '')
            : '';
    }

    validateDurationPeriodicity() {
        if (!this.currentProduit) return true;
        if (!this.creditRequest.periodicityId) return true;
        let periodicite: Periodicity = this.currentProduit.periodicities.find(
            (periodicity: Periodicity) => {
                return periodicity.id == this.creditRequest.periodicityId;
            }
        );
        if (!periodicite) return false;
        let differe: number = parseInt('' + this.creditRequest.nbrDiffere, 10) || 0;
        if (this.creditRequest.duration <= 0) return false;
        if (periodicite && periodicite.constante) {
            let constante = periodicite.constante;
            if (
                periodicite.codePeriodicite == '15J' ||
                periodicite.codePeriodicite == '1J' ||
                periodicite.codePeriodicite == 'S'
            ) {
                constante = 1;
            }

            return this.creditRequest.duration - differe >= constante;
        }
        return false;
    }

    getCurrentProduit() {
        this.clients = [];
        jQuery('.periodicity .ui.dropdown div.text').html('');
        this.currentProduit = this.produits.find((produit: Produit) => {
            return produit.id == this.creditRequest.produitId;
        });

        if (this.currentProduit) {
            /* if (this.currentProduit.libelle == 'MCM')
                this.creditRequest.nbrDiffere = 1; */
            this.creditRequest.nbrDiffere = this.currentProduit.differe;
            this.creditRequest.delaiGrace = this.currentProduit.delaiGrace;
            this.creditRequest.duration = this.currentProduit.duration;

            if (this.currentProduit.phasable) {
                this._getPhases();
            }

            this.currentProduitAmountMin = this.currentProduit.amountMin;
            this.currentProduitAmountMax = this.currentProduit.amountMax;
        }
        let condition;
        if (
            this.currentProduit &&
            this.currentProduit.activerConditionAcces &&
            this.currentProduit.conditionAccesses.length
        ) {
            condition = 'AVEC_CONDITION_SANS_REQUEST';
        } else {
            condition = 'SANS_CONDITION';
        }
        if (!this.currentProduit) return;
        this.loading.clients = true;
        this.conditionRequestService
            .queryClientSansCondition(this.currentProduit.id, condition)
            .subscribe((res: ResponseWrapper) => {
                this.clients = res.json;
                this.loading.clients = false;
            });
        select_init();
    }

    private _getTypeClientGroupId() {
        this.typeClientService
            .query({ 'code.equals': 'MUTUEL' })
            .subscribe(res => {
                this._typeClientGroupId = res.json[0].id;
            });
    }

    onClientChange() {
        this.checkIfCreditRequestClientIsGroup();
    }

    checkIfCreditRequestClientIsGroup() {
        if (!this.creditRequest.clientId) return;
        // this._memberNumber;
        this.invalidGroupLength = false;
        this.clientService.find(this.creditRequest.clientId).subscribe(_client => {
            const group = (_client.groups || []).filter((i: any) => i.status);

            if ((group.length !== 3) && (group.length !== 5)) {
                this.invalidGroupLength = true;
                return;
            }

            this._creditRequestClientIsGroup = group.length > 0 || _client.typeClientId === this._typeClientGroupId;

            if (this._creditRequestClientIsGroup) {
                this._memberNumber = group.length || 0;

                if (this.phase) {
                    this.currentProduitAmountMin = this.phase.montant * this._memberNumber;
                }
                else {
                    this.currentProduitAmountMin = this.currentProduit.amountMin * this._memberNumber;
                }

                this.currentProduitAmountMax = this.currentProduit.amountMax * this._memberNumber;
                this.creditRequest.amount = this.currentProduitAmountMin;
                this.creditRequestAmount = formatNumberToLocalString(this.creditRequest.amount);
            }
            else {
                this.currentProduitAmountMin = this.currentProduit.amountMin;
                this.currentProduitAmountMax = this.currentProduit.amountMax;
            }
        });
    }

    controlMontant() {
        if (this.currentProduit && this.creditRequest.amount)
            return this.currentProduitAmountMin <= this.creditRequest.amount && this.creditRequest.amount <= this.currentProduitAmountMax;
        return false;
    }

    ngOnInit() {
        if (this.creditRequest.id)
            this.creditRequestAmount = formatNumberToLocalString(
                this.creditRequest.amount
            );

        this.isSaving = false;
        this.clientOK = this.creditRequest.clientId ? true : false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.creditRequestStatusService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.creditrequeststatuses = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.requestRaisonService.query().subscribe(
            (res: ResponseWrapper) => {
                this.requestraisons = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loading.produits = true;
        this.produitService.getFnmAndSfdProduits()
            // this.produitService.query().subscribe(
            .then((produits) => {
                this.produits = produits;
                // this.produits = res.json.filter((p) => p.categorieProduit.code === 'C');
                this.loading.produits = false;
                this.getCurrentProduit();
            })
            .catch((res: ResponseWrapper) => this.onError(res.json));

        this.periodicityService.query().subscribe(
            (res: ResponseWrapper) => {
                this.periodicities = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        /* this.clientService.query().subscribe(
            (res: ResponseWrapper) => {
                this.allClients = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        ); */

        this._getTypeClientGroupId();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (this.isSaving) {
            return;
        }

        if (!this.controlMontant() || !this.validateDurationPeriodicity()) {
            this.alertService.warning("Les champs obligatoires ne sont pas renseignés");
            return;
        }
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.creditRequest.id !== undefined) {
                    if (!this.creditRequest.requestStatusId)
                        this.creditRequest.requestStatusId = 10;
                    setLastModifyBy(this.creditRequest, identity);
                    this.subscribeToSaveResponse(
                        this.creditRequestService.update(this.creditRequest),
                        false
                    );
                } else {
                    this.creditRequest.interestRate = this.currentProduit.interestRate;
                    this.creditRequest.requestStatusId = 10;
                    this.creditRequest.reference = getUniqueId(
                        'REF-' + this.creditRequest.produitId,
                        this.creditRequest.clientId
                    );
                    setCreateBy(this.creditRequest, identity);
                    this.creditRequest.userReference = identity.id;
                    let client = this.clients.find(current => {
                        return current.id == this.creditRequest.clientId;
                    });
                    if (client) {
                        this.creditRequest.clientLib = client.name || '';
                    }
                    this.creditRequest.userInitial = this.creditRequest.createdBy;
                    this.creditRequestService
                        .hasNotCreditRequest(this.creditRequest.clientId, this.creditRequest.produitId)
                        .subscribe((res) => {
                            if (res.json == 'OK' || res.json.resultat == 'OK') {
                                const now = new Date();
                                this.creditRequest.requestDate = {
                                    day: now.getDate(),
                                    month: now.getMonth() + 1,
                                    year: now.getFullYear(),
                                };
                                this.subscribeToSaveResponse(
                                    this.creditRequestService.create(this.creditRequest),
                                    true
                                );
                            } else {
                                this.alertService.error("Le client à déjà un crédit en cours pour ce produit");
                                this.isSaving = false;
                            }
                        });
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<CreditRequest>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: CreditRequest) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: CreditRequest, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.creditRequest.created'
                : 'carmesfnmserviceApp.creditRequest.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'creditRequestListModification',
            content: 'OK'
        });
        this.isSaving = true;
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

    trackCreditRequestStatusById(index: number, item: CreditRequestStatus) {
        return item.id;
    }

    trackRequestRaisonById(index: number, item: RequestRaison) {
        return item.id;
    }

    trackServiceUserById(index: number, item: ServiceUser) {
        return item.id;
    }

    trackProduitById(index: number, item: Produit) {
        return item.id;
    }

    trackPeriodicityById(index: number, item: Periodicity) {
        return item.id;
    }

    trackClientById(index: number, item: Client) {
        return item.id;
    }

    onPhaseChange(q) {
        this.creditRequest.codePhase = q;

        this.phase = this.phases.find((i) => i.code === this.creditRequest.codePhase);

        if (this._creditRequestClientIsGroup && this._memberNumber) {
            this.currentProduitAmountMin = this.phase.montant * this._memberNumber;
            this.creditRequest.amount = this.currentProduitAmountMin;
            this.creditRequestAmount = formatNumberToLocalString(this.creditRequest.amount);
        }
    }

    private _getPhases() {
        this.loading.phase = true;
        this.phase = undefined;
        this.creditRequest.codePhase = undefined;

        this._phaseService.query({
            'produitId.equals': this.currentProduit.id,
            'sfdReference.equals': undefined,
        }).toPromise()
        .then((r) => {
            this.loading.phase = false;
            this.phases = r.json;
            select_init();
        })
        .catch(() => {
            this.loading.phase = false;
        });
    }
}

@Component({
    selector: 'jhi-credit-request-popup',
    template: ''
})
export class CreditRequestPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditRequestPopupService: CreditRequestPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.creditRequestPopupService.open(
                    CreditRequestDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.creditRequestPopupService.open(
                    CreditRequestDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
