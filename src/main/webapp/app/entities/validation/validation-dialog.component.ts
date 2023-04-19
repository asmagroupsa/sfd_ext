import {validation} from '../entity.module';
import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';
import {
    setCreateBy,
    setLastModifyBy,
    formatNumberToLocalString
} from '../../shared/model/functions';
import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {Validation} from './validation.model';
import {ValidationPopupService} from './validation-popup.service';
import {ValidationService} from './validation.service';
import {Dossier} from '../dossier';
import {ComityMber, ComityMberService} from '../comity-mber';
import {ResponseWrapper, sendSMS} from '../../shared';

import {Principal} from '../../shared/auth/principal.service';
import {ClientService} from '../client/client.service';
import {Client} from '../client/client.model';
import {CreditRequestService} from '../credit-request/credit-request.service';
import {CreditComityService} from '../credit-comity/credit-comity.service';
import {CreditComity} from '../credit-comity/credit-comity.model';
import {UserData} from '../../shared';
declare let select_init: any;

@Component({
    selector: 'jhi-validation-dialog',
    templateUrl: './validation-dialog.component.html',
    styles: [
        `
  td,th{
    white-space: nowrap;
  }
  `
    ]
})
export class ValidationDialogComponent implements OnInit {
    montants: any[] = [];
    montant: number = 0;
    member: number;
    creditComity: CreditComity;
    checkeds: number[] = [];
    comity: any;
    validation: Validation;
    authorities: any[];
    isSaving: boolean;
    dossiers: Dossier[];
    requests: any[];
    clients: any[];
    comitymbers: ComityMber[];
    createdDateDp: any;
    lastModifiedDateDp: any;
    valideResult: string = 'ACCEPTER';
    valideresult: string;
    result: any[] = [];
    @ViewChild('valide') valide: ElementRef;
    @ViewChild('attente') attente: ElementRef;
    validationAmount: string;
    isUpperMsg: string = '';

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private validationService: ValidationService,
        private clientService: ClientService,
        private comityMberService: ComityMberService,
        private creditComityService: CreditComityService,
        private creditRequestService: CreditRequestService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        public activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.comity = params['comity'];
        });
    }
    ngAfterViewInit() {
        select_init();
    }
    isUpper() {
        return false;
        /* if (!this.montants.length) return false;
        let result: boolean = false;
        let dossier: any = {};
        this.montants.forEach(montant => {
            if ((this.validation.amount > montant.detaillee || this.validation.amount < montant.produit) && this.valideResult == 'ACCEPTER') {
                dossier = montant;
                result = true;
            }
        });
        if (result) {
            this.isUpperMsg = `Le montant doit être compris entre le montant de l'étude détaillée(${dossier.detaillee}) et le montant minimum du produit(${dossier.produit})`;
        } else {
            this.isUpperMsg = '';
        }
        return result; */
    }
    getNom(id: any) {
        if (!this.clients || !this.requests) return new Client();
        let demande = this.requests.find(request => {
            return request.id == id;
        });
        return this.clients.find(client => {
            return client.id == demande.clientId;
        });
    }
    getRequests() {
        this.creditComityService
            .find(+this.comity)
            .subscribe((res: CreditComity) => {
                this.creditComity = res;
                if (!this.creditComity.ligneAccorde) {
                    this.alertService.error(`Aucune ligne de crédit accordée au comité ${this.creditComity.libelle}.Ses dossiers ne peuvent être valider`, null, null);
                    this.activeModal.dismiss({});
                    return;
                }
                let member = this.creditComity.delegationComity['delegatedMembers'].find(element => {
                    return element.status;
                });
                this.member = member ? member.id : 0;
                if (!this.member) alert("Tous les membres délégués sont désactivés");
                this.validationService
                    .queryValidations({
                        comite: this.comity,
                        member: this.member,
                        valide: false
                    })
                    .subscribe((res: ResponseWrapper) => {
                        this.dossiers = res.json;
                    });
            });
        this.creditRequestService.query().subscribe((res: ResponseWrapper) => {
            this.requests = res.json;
        });
        this.clientService.query().subscribe((res: ResponseWrapper) => {
            this.clients = res.json;
        });
    }
    onChange(ev: any, dossier: any) {
        this.result = [];
        this.checkeds = [];
        this.montants = [];
        
        if (ev.target.checked) {
            this.result.push(dossier);
            this.checkeds.push(+ev.target.id);
            this.montants.push({
                detaillee: dossier.amont_det,
                produit: dossier.amount_min,
            });
            if (dossier) {
                this.validation.amount = dossier.amount_valider;
                this.validationAmount = formatNumberToLocalString(this.validation.amount);
            }
        }
        else {
            this.validation.amount = null;
            this.validationAmount = '';
            this.result = this.result.filter(element => element.dossier != dossier.dossier);
            let index = this.checkeds.indexOf(+ev.target.id);
            if (index != -1) {
                this.montants.splice(index, 1);
                this.checkeds.splice(index, 1);
            }
        }
    }
    ngOnInit() {
        // if (this.validation.id) {
        //     this.validationAmount = formatNumberToLocalString(this.validation.amount);
        // }

        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.getRequests();
        this.comityMberService.query().subscribe(
            (res: ResponseWrapper) => {
                this.comitymbers = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save(invalid: boolean) {
        // if (this.valideResult === 'ACCEPTER' && this.validation.amount <= 0) {
        //     this.alertService.warning("Montant invalide.");
        //     return;
        // }

        if (!this.checkeds.length || this.isUpper()) {
            this.alertService.warning("Les champs ne sont pas bien renseignés");
            return;
        }
        if (invalid || !this.checkeds.length || this.isUpper()) return;
        this.isSaving = true;
        if (this.isUpper() || !this.checkeds.length) {
            this.isSaving = false;
            return;
        }
        // if (this.valideResult == 'ACCEPTER' && (!this.validation.amount || this.validation.amount <= 0)) {
        //     alert("Le montant est invalide");
        //     this.isSaving = false;
        //     return;
        // }
        this.principal.identity().then(
            (identity: any) => {
                this.validation.result = this.valide.nativeElement.checked;
                if (this.validation.id !== undefined) {
                    setLastModifyBy(this.validation, identity);
                    this.subscribeToSaveResponse(
                        this.validationService.update(this.validation),
                        false
                    );
                } else {
                    let result = [];
                    this.checkeds.forEach(el => {
                        if (result.indexOf(el) === -1) {
                            result.push(el);
                        }
                    });
                    setCreateBy(this.validation, identity);
                    let params: any = {
                        membre: this.member,
                        chainedossier: result.join('*'),
                        typeValide: 'GROUP',
                        montant: this.validation.amount ? this.validation.amount : 0,
                        explanation: this.validation.explanation,
                        result: this.valideResult
                    };
                    this.subscribeToSaveResponse(this.validationService.createValidations(params), true);
                }
            },
            () => {}
        );
    }

    private subscribeToSaveResponse(result: Observable<Validation>, isCreated: boolean) {
        result.subscribe(
            (res: Validation | any) => {
                this.onSaveSuccess(res, isCreated);
                if (res.resultat == 'OK') {
                    this.sendSMS();
                }
            },
            (res: Response) => {
                this.onSaveError(res);
            }
        );
    }

    private _updateDossiers() {
        this.dossiers = this.dossiers.filter((_dossier: any) => this.checkeds.indexOf(_dossier.dossier) === -1);
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        if(result.resultat == 'NON'){
            this.alertService.warning("Le dossier n'a pas été validé, une erreur s'est produite!!!");
            return ;
        }
        if(result.resultat == 'LIGNE_INSUFFISANT'){
            this.alertService.warning("Le dossier n'a pas été validé, Le solde de la ligne de crédit est insuffisant!!!");
            return ;
        }
        this.alertService.success(isCreated ? 'carmesfnmserviceApp.validation.created' : 'carmesfnmserviceApp.validation.updated', {param: result.id}, null);

        this.eventManager.broadcast({name: 'validationListModification', content: 'OK'});
        this.isSaving = false;
        this._updateDossiers();
        this.validationAmount = '';
        this.validation.amount = undefined;
        this.validation.explanation = '';
        // this.validation.amount = undefined;
        if (this.dossiers && !this.dossiers.length)
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

    trackDossierById(index: number, item: Dossier) {
        return item.id;
    }

    trackComityMberById(index: number, item: ComityMber) {
        return item.id;
    }
    sendSMS() {
        let msg = '';
        this.result.forEach(dossier => {
            if (this.valideResult == 'ATTENTE')
                msg =
                    "Cher(e) client(e), votre dossier est mis en attente pour complement de dossier, veuillez passer a notre agence pour plus d'informations.";
            else if (this.valideResult == 'ACCEPTER')
                msg =
                    'Bravo, Votre demande de crédit Numero ' +
                    dossier.reference +
                    'avec le montant ' +
                    dossier.amount +
                    ' a ete accorde.';
            else if (this.valideResult == 'REJETER')
                msg =
                    'Cher(e) client(e), votre dossier a ete rejete.Veuillez passer a notre agence pour plus amples informations';
            sendSMS(dossier.phone, msg, result => {

            });
        });
    }

    get accepter() {
        return this.valideResult === 'ACCEPTER';
    }
}

@Component({
    selector: 'jhi-validation-popup',
    template: ''
})
export class ValidationPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private validationPopupService: ValidationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.validationPopupService.open(
                    ValidationDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.validationPopupService.open(
                    ValidationDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
