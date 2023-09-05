import { Component, OnDestroy, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { LOCAL_FLAG, READFILEURL, ResponseWrapper, UserData, UserService } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { numberToLocalString } from '../../shared/model/functions';
import { SPUtilService } from '../../shared/sp-util.service';
import { BankAccountService } from '../bank-account';
import { Client, ClientService } from '../client';
import { CompensationType, CompensationTypeService } from '../compensation-type';
import { CompensationPopupService } from './compensation-popup.service';
import { Compensation } from './compensation.model';
import { CompensationService } from './compensation.service';
import { SPFNMService } from "../../shared/sp-fnm.service";
import { PartnerService } from '../partner';

declare let select_init: any;

@Component({
    selector: 'jhi-compensation-dialog',
    templateUrl: './compensation-dialog.component.html'
})
export class CompensationDialogComponent implements OnInit {
    partner;
    gichetiers = [];
    hasSolde = false;
    montant: string;
    compensation: any;
    authorities: any[];
    isSaving: boolean;
    clients: Client[];
    agences: any[] = [];
    compensationtypes: CompensationType[];
    createdDateDp: any;
    lastModifiedDateDp: any;
    compensationAmount: string;
    checkeds: any[] = [];
    model: any = {
        modePaiement: '',
        agence_reference: '',
        comptecarmes: '',
        numerocheque: '',
        bankaccount: '',
        bank_libelle: '',
        //typecompensation:'',
        intituleOrdre: '',//'VEUILLEZ VIREZ A L’ORDRE DE ',
        nomBeneficiaire: '',
        motifPaiement: '',
        partner_id: '',
        cpte_emetteur: '',
        num_cpte_donneur_order: ''
    };
    emetteurs = [];
    emetteur;

    loading = {
        verifierSoldeCompensation: false,
        save: false,
    };
    isGuichetier = false;
    showDetails = false;
    sfdbanks: any[] = [];
    operations = [];
    bankAccounts = [];
    infos: any[];
    LOCAL_FLAG = LOCAL_FLAG;
    infosCarmes: any[];
    amountACompenser: number = 0;
    partners: any[] = [];
    actor = 'm';
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private compensationService: CompensationService,
        private userService: UserService,
        private clientService: ClientService,
        private compensationTypeService: CompensationTypeService,
        private eventManager: JhiEventManager,
        private bankAccountService: BankAccountService,
        private _spUtilService: SPUtilService,
        private _spFNMService: SPFNMService,
        public principal: Principal,
        private _activatedRoute: ActivatedRoute,
        private partnerService: PartnerService,
    ) { }

    ngAfterViewInit() {
        this.model = Object.assign(this.model, this.compensation);
        select_init();
    }
    getDoc(url: string): string {
        return READFILEURL + `${url}`;
    }
    ngOnInit() {
        this.partnerService.queryBySfd({
            "code": UserData.getInstance().currentSfdReference,
            "type": "SFD"
        }).subscribe(
            (res: ResponseWrapper) => {
                this.partners = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        const type: string = this._activatedRoute.snapshot.queryParams.type;
        this.onIsGuichetierChange(type === 'COMPENSATION' ? 'GUICHETIER' : 'ORDRE');

        if (!this.isGuichetier && !UserData.getInstance().sfd_.compteCarmes) {
            this.clear();
        }

        if (!this.isGuichetier) {
            this.model.comptecarmes = UserData.getInstance().sfd_.compteCarmes;
            this._getBankAccounts();
        }

        if (this.compensation.id && this.compensation.amount) {
            this.compensationAmount = numberToLocalString(this.compensation.amount.toString());
        }

        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        // this.bankAccountService.query({ size: 1000 }).subscribe(
        //     (res: ResponseWrapper) => {
        //         this.sfdbanks = this.formatBankAccounts(res.json);
        //     },
        //     (res: ResponseWrapper) => this.onError(res.json)
        // );
        this.compensationTypeService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.compensationtypes = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.agences = UserData.getInstance().listeAgences;
        if (!this.agences && UserData.getInstance().currentAgence) {
            this.agences = [UserData.getInstance().currentAgence];
        }
        this.agences = this.agences || [];
        if (this.agences.length == 1) {
            this.model.agence_reference = this.agences[0].codeAgence;
        }
        this.userService.listeUtilisateursProfil('GUICHETIER_SFD_AMBULANT')
            .subscribe(
                (r) => {
                    this.gichetiers = r;
                }
            );
    }

    loadEmetteur() {
        this.compensationService.getAllEmetteur(this.model.partner_id).subscribe(
            (emetteurs) => {
                this.emetteurs = emetteurs;
            },
            () => {

            }
        );
    }

    onTypeChange() {
        if (!this.isGuichetier) {
            this.hasSolde = false;
        } else {
            this.getRequestDetails();
        }
    }
    getRequestDetails() {
        let ids = (this.infos || []).map((info) => {
            return info.id_request;
        });
        // || !this.model.typecompensation
        if (!ids.length) return;
        this.compensationService.detailsRequestCompensation(ids, this.model.typecompensation).subscribe(
            (operations) => {
                this.operations = operations;
            },
            () => {

            }
        );
    }
    requestAgentIdentity() {
        if (this.isGuichetier && `${this.model.comptecarmes}`.length >= 3) {
            this.queryCarmes();
        }
    }
    queryCarmes() {
        this.clientService.queryCarmesInfos(`${this.model.comptecarmes}`).subscribe((res: any) => {
            res = JSON.parse(`${res}`);
            res = res.message;
            if (/^AUCUNE INFORMATION COMPLEMENTAIRE POUR CE COMPTE CARMES/i.test(res)) {
                this.alertService.warning("Aucune information complémentaire pour ce compte carmes", null, null);
            } else if (res === 'NON_CARMES') {
                this.alertService.error(`CE COMPTE CARMES N' EXISTE PAS`);
            } else if (/^[0-9]+\* ?/.test(res)) {
                this.infosCarmes = res.split('*');
            }
        }, (err) => {
            this.alertService.error(`IMPOSSIBLE DE VERIFIER LE COMPTE CARMES`);
        });
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (!this.hasSolde) {
            this.alertService.warning('Veuillez vérifier le solde', null, null);
            //return ;
        }
        this.isSaving = true;

        const bank = this.bankAccounts.find((b) => b.numAccount === this.model.bankNumber);

        if (bank) {
            this.model.bank = { libelle: bank.libelle };
        }

        this.model.bankaccount = this.model.bankNumber;

        // if (!this.model.bankNumber && this.model.bank && this.model.bank.accounts)
        //     this.model.bankNumber = this.model.bank.accounts[0].bankNumber;
        // this.principal.identity().then(
        //     (identity: any) => {
        if (!this.isGuichetier) {
            this.compensationService.insertionOrdreVirement(this.model).subscribe(
                (res) => {
                    this.loading.save = false;
                    this.isSaving = false;
                    if (res.resultat == 'OK' || res.resultat.indexOf('*') != -1 || !isNaN(res.resultat)) {
                        this.alertService.success('Ordre de virement émis', null, null);
                        this.eventManager.broadcast({
                            name: 'compensationListModification',
                            content: 'OK'
                        });
                        /*  this.activeModal.dismiss(res); */
                        this.activeModal.close(['/entity', 'compensation', res.resultat, 'print-ordre-virement']);
                    } else {
                        this.alertService.error("Une erreur s'est produite", null, null);
                    }
                }, (err) => {
                    this.loading.save = false;
                    this.isSaving = false;
                    this.alertService.error("Une erreur s'est produite", null, null);
                });
        } else {
            this.loading.save = true;
            this.compensationService.validationRequestCompensation(this.checkeds, this.model, this.actor).subscribe(
                (res) => {
                    let echecs = 0, reussis = 0;
                    res.forEach(element => {
                        if (['NON', 'AUCUNE_OPERATION'].indexOf(element.resultat) !== -1)
                            echecs++;
                        else
                            reussis++;
                    });
                    let message = `${reussis} demandes de compensation validées ${echecs ? echecs + ', demandes non compensées' : ''}`;
                    this.loading.save = false;

                    if (echecs > 0) {
                        this.alertService.warning(message, null, null);
                        this.isSaving = false;
                        this.eventManager.broadcast({
                            name: 'compensationListModification',
                            content: 'OK'
                        });
                        this.isSaving = false;
                        this.activeModal.dismiss(res);
                    } else {
                        this.alertService.success(message, null, null);
                        this.isSaving = false;
                        this.eventManager.broadcast({
                            name: 'compensationListModification',
                            content: 'OK'
                        });
                        this.isSaving = false;
                        this.activeModal.dismiss(res);
                    }

                    if (['AUCUNE_COMMISSION', 'COMPTE_ERRONEE', 'AUCUNE_OPERATION'].indexOf(res.resultat) === -1) {
                        let obj = this.compensationtypes.find((callback) => callback.code == this.model.typecompensation);

                        if (obj && obj.code == this.model.typecompensation) {
                            res.typeCompensation = obj.name
                            res.route = ['/entity', 'compensation', 'print']
                            UserData.getInstance().compensationData[0] = res
                        }
                        this.activeModal.close(['/entity', 'compensation', 'print']);
                    }
                    else if (res.resultat === 'AUCUNE_COMMISSION') {
                        this.alertService.success('AUCUNE COMMISSION', null, null);
                        this.isSaving = false;
                    } else if (res.resultat === 'COMPTE_ERRONEE') {
                        this.alertService.warning('COMPTE ERRONEE', null, null);
                        this.isSaving = false;
                    } else if (res.resultat === 'AUCUNE_OPERATION') {
                        this.alertService.warning('AUCUNE OPERATION', null, null);
                        this.isSaving = false;
                    }
                },
                () => {
                    this.isSaving = false;
                    this.loading.save = false;
                    this.alertService.error('ERREUR DE VERIFICATION DU SOLDE', null, null);
                }
            );
        }
        //     }
        // );
    }

    private subscribeToSaveResponse(
        result: Observable<any>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Compensation) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.compensation.created' : 'carmesfnmserviceApp.compensation.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'compensationListModification',
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
        this.activeModal.dismiss();
    }

    onChange(ev: any, info: any) {
        if (ev.target.checked) {
            this.checkeds.push(info.id_request);
            this.amountACompenser += +info.montant;
        } else {
            let index = this.checkeds.indexOf(info.id_request);
            if (index !== -1) {
                this.checkeds.splice(index, 1);
                this.amountACompenser -= +info.montant;
                if (this.amountACompenser < 0)
                    this.amountACompenser = 0;
            }
        }
    }
    verifierSoldeCompensation() {
        // || !this.model.typecompensation
        if ((!this.model.comptecarmes)) return;

        this.loading.verifierSoldeCompensation = true;
        let req;
        if (!this.isGuichetier)
            req = this.compensationService.verifierSoldeCompensation(this.model, this.isGuichetier ? '' : '-sfd', this.model.partner_id);
        else {
            req = this.actor === 'm' ? this.compensationService.verifierCompensation(this.model) : this._spFNMService.verifierInfosSousTraitant(this.model);
        }
        req.then((r) => {
            this.loading.verifierSoldeCompensation = false;
            if (this.isGuichetier) {
                r = Array.isArray(r) ? r : [r];
                this.infos = r.filter((dem) => {
                    return dem.id_request && dem.code_guichet && dem.montant;
                });
                if (!this.infos.length) {
                    this.alertService.warning('AUCUNE DEMANDE', null, null);
                    return;
                }
                this.getRequestDetails();
            }
            this.loading.verifierSoldeCompensation = false;

            if (['AUCUNE_COMMISSION', 'COMPTE_ERRONEE', 'AUCUNE_OPERATION'].indexOf(r) === -1) {
                this.montant = r;
                this.model.montantVirement = this.montant;
                this.hasSolde = true;
                select_init();
                this._getOperations();
            } else if (r === 'AUCUNE_COMMISSION') {
                this.hasSolde = false;
                this.alertService.warning('AUCUNE COMMISSION', null, null);
            } else if (r === 'COMPTE_ERRONEE') {
                this.hasSolde = false;
                this.alertService.warning('COMPTE ERRONE', null, null);
            } else if (r === 'AUCUNE_OPERATION') {
                this.hasSolde = false;
                this.alertService.warning('AUCUNE OPERATION', null, null);
            } else {
                this.hasSolde = false;
                this.alertService.error('ERREUR DE VERIFICATION DE LA DEMANDE', null, null);
            }
        })
            .catch(() => {
                this.hasSolde = false;
                this.loading.verifierSoldeCompensation = false;
                this.alertService.error('ERREUR DE VERIFICATION DE LA DEMANDE', null, null);
            });
    }

    onIsGuichetierChange(type: string) {
        this.isGuichetier = type !== 'ORDRE';
        // if (this.isGuichetier) {
        //     this.model.typecompensation = 'COMMISSION';
        // }
        select_init();
    }
    formatBankAccounts(bankAccounts: any[]): any[] {
        if (!bankAccounts) return [];
        let banks = [];
        let obj = {};
        let currentIndex = -1;
        bankAccounts.forEach((element) => {
            if (element.bankId) {
                if (!obj.hasOwnProperty(element.bankId)) {
                    banks.push(Object.assign({}, element.bank, { accounts: [element] }));
                    obj[element.bankId] = banks.length - 1;
                    if (element.bank.libelle == this.compensation.bankLibelle) {
                        currentIndex = banks.length - 1;
                    }
                } else {
                    banks[obj[element.bankId]].accounts.push(element);
                }
            }
        });
        if (currentIndex != -1) {
            this.model.bank = banks[currentIndex];
        }
        return banks;
    }

    private _getOperations() {
        this._spUtilService.detailCommissionOperation(this.model.comptecarmes, this.model.typecompensation, this.isGuichetier ? '' : '-sfd', this.partner)
            .subscribe(
                (operations) => {
                    this.operations = operations;
                },
                () => {

                }
            );
    }

    private _getBankAccounts() {
        this._spUtilService.listeCompteBankActeur(this.model.comptecarmes)
            .subscribe(
                (bankAccounts) => {
                    this.bankAccounts = bankAccounts;
                },
                () => {

                }
            );
    }

    isSousTraitant() {
        return UserData.getInstance().isSousTraitant();
    }
}

@Component({
    selector: 'jhi-compensation-popup',
    template: ''
})
export class CompensationPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private compensationPopupService: CompensationPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.compensationPopupService.open(
                    CompensationDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.compensationPopupService.open(
                    CompensationDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
