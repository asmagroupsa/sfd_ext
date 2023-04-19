import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable, Subscription } from 'rxjs';

import { getAgenceRef, getUniqueId, LOCAL_FLAG, ResponseWrapper, sendFileToServer } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Client } from '../client/client.model';
import { ClientService } from '../client/client.service';
import { Compte, CompteService } from '../compte';
import { EcheancierClient, EcheancierClientService } from '../echeancier-client';
import { LigneCredit } from '../ligne-credit';
import { NotificationClient, NotificationClientService } from '../notification-client';
import { OperationService } from '../operations/operation.service';
import { styles } from '../remboursement-sfd/remboursement-sfd.component.scss.shim.ngstyle';
import { CreditPopupService } from './credit-popup.service';
import { Credit } from './credit.model';
import { CreditService } from './credit.service';

declare let select_init: any;

@Component({
    selector: 'jhi-credit-dialog',
    templateUrl: './credit-dialog.component.html',
    styles: [`
    tr.active{
        background-color: #5f7d8b !important;
    }
     .label,
.camera {
  display: block;
  border: 1px solid lightblue;
  height: 150px;
  text-align: center;
  padding-top: 50px;
  cursor: pointer;
  position: relative;
}

.label {
  background: lightseagreen;
      background-size: cover;
    background-repeat: no-repeat;
}
    `]
})

export class CreditDialogComponent implements OnInit {
    hasCautionDoc: boolean = false;
    hasCautionclient: boolean = false;
    notification: any;
    error: string;
    credit: Credit;
    authorities: any[];
    isSaving: boolean;
    clients: Client[];
    notificationclients: any[];
    modes: string[] = [
        'LINEAIRE',
        'NOMINAL_CONSTANT',
        'DEGRESSIF',
        'NOMINAL_LIBRE',
        'ECHEANCIER_LIBRE'
    ];
    solde: any;
    commissions = [];
    model: any = {
        compteClient: '',
        client: '',
        differe:'',
        delaiGrace:''
    };
    compteInternes: any[] = [];
    searchCompteByFieldSubscription: Subscription;
    echeancierclients: EcheancierClient[];

    comptes: any[];
    label: string = 'Selectionnez un document';
    clientPhotoHasBeenSend: boolean = false;
    isSavingPicture: boolean = false;
    @ViewChild('file') file: ElementRef;
    @ViewChild('labelPhoto') labelPhoto: ElementRef;
    lignecredits: LigneCredit[];
    creditDateDp: any;
    startDateDp: any;
    endDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;
    @ViewChild('parente') parente: ElementRef;
    @ViewChild('valide') valide: ElementRef;
    pictureUrl: string = null;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private creditService: CreditService,
        private notificationClientService: NotificationClientService,
        private echeancierClientService: EcheancierClientService,
        private compteService: CompteService,
        private clientService: ClientService,
        public langue: LanguesService,
        private operationService: OperationService,
        private eventManager: JhiEventManager,
        public principal: Principal
    ) { }

    ngAfterViewInit() {
        select_init();
    }

    onNameBlur(name) {
        if (name.length >= 3) {
            if (this.searchCompteByFieldSubscription) this.searchCompteByFieldSubscription.unsubscribe();
            this.searchCompteByFieldSubscription = this.operationService.searchCompteByField('nom', name)
                .subscribe(
                    (cs) => {
                        this.compteInternes = cs.filter((c) => {
                            if (!c.num_account) return false;
                            return c.num_account.indexOf('E') != -1;
                        });
                    }
                );
        }
    }
    selectCompte(compte: any) {
        this.model.client = compte;
        this.model.compteClient = compte.num_account;
        this.solde = null;
    }
    client(id: any) {
        if (!this.clients) return new Client();
        return this.clients.filter(client => {
            return client.id == id;
        });
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.notificationClientService
            .queryNonDebloquer()
            .subscribe((res: ResponseWrapper) => {
                this.notificationclients = res.json;
            });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (this.hasCautionDoc && !this.clientPhotoHasBeenSend) {
            this.alertService.warning("le document n'est pas encore attaché");
            return;
        }
        if (!this.credit.amount || this.credit.amount <= 0) {
            this.alertService.warning("le montant du crédit n'est pas valide,zéro franc ne peut pas être accordé");
            return;
        }
        this.isSaving = true;
        this.credit.reference = getUniqueId('CRED', this.credit.ligneCreditId);

        this.principal.identity().then(
            (identity: any) => {
                if (this.credit.id !== undefined) {
                    setLastModifyBy(this.credit, identity);
                    this.subscribeToSaveResponse(
                        this.creditService.update(this.credit),
                        false
                    );
                } else {
                    const now = new Date();
                    this.credit.startDate = {
                        day: now.getDate(),
                        month: now.getMonth() + 1,
                        year: now.getFullYear(),
                    };
                    if (!LOCAL_FLAG) {
                        setCreateBy(this.credit, identity);
                        this.credit.decaisser = false;
                        this.credit.rembourser = false;
                        this.credit.ligneCreditId = null;
                        this.credit.differe = this.model.differe || 0;
        this.credit.delaiGrace = this.model.delaiGrace || 0;
                        this.subscribeToSaveResponse(
                            this.creditService.create(this.credit),
                            true
                        );
                    } else {
                        let agenceRef = getAgenceRef();
                        let params = {
                            amount: this.credit.amount,
                            notification_client_id: this.credit.notificationClientId,
                            ligne_credit_id: 0,
                            mode_echeance: '',
                            agence_reference: agenceRef,
                            num_account: this.model.compteClient.trim(),
                            file_path: this.pictureUrl,
                            differe:this.model.differe || 0,
        delaiGrace:this.model.delaiGrace || 0
                        };
                        setCreateBy(params, identity);
                        this.subscribeToSaveResponse(
                            this.creditService.accordCredit(params),
                            true
                        );

                    }
                }
            },
            () => {
            }
        );
    }
    onChangeFile(labelPhoto) {
        if (
            this.file.nativeElement.files &&
            this.file.nativeElement.files.length
        ) {
            if (
                !/\.(docx|pdf)$/i.test(
                    this.file.nativeElement.files[0].name
                )
            ) {
                alert('Veuillez sélectionner un document pdf ou word');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target && e.target.result) labelPhoto.style.backgroundImage = 'url(' + e.target.result + ')';
                this.isSavingPicture = true;
                this.label = "Document en cours d'envoi...";
                sendFileToServer(this.file.nativeElement.files[0], resp => {
                    if (resp != 'NONE') {
                        this.pictureUrl = resp;
                        this.isSavingPicture = false;
                        this.label = "Document envoyé";
                        this.clientPhotoHasBeenSend = true;
                    } else alert('le fichier a échoué. Veuillez réessayer');
                });
            };
            reader.readAsDataURL(this.file.nativeElement.files[0]);
            this.label = '';
        } else this.label = 'Selectionnez un document';
    }
    private subscribeToSaveResponse(
        result: Observable<any>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: any) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        if (result.resultat) {
            if (result.resultat == 'OK') {
                this.alertService.success(
                    'Le crédit a été accordé',
                    null
                );
                this.eventManager.broadcast({
                    name: 'creditListModification',
                    content: 'OK'
                });
                this.isSaving = false;
                this.activeModal.dismiss(result);
            } else {
                this.alertService.error(
                    "Une erreur s'est produite,veuillez réessayer",
                    null
                );
            }
            return;
        }
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.credit.created'
                : 'carmesfnmserviceApp.credit.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'creditListModification',
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

    trackNotificationClientById(index: number, item: NotificationClient) {
        return item.id;
    }

    trackEcheancierClientById(index: number, item: EcheancierClient) {
        return item.id;
    }

    trackCompteById(index: number, item: Compte) {
        return item.id;
    }

    trackLigneCreditById(index: number, item: LigneCredit) {
        return item.id;
    }
    notificationChange() {
        this.notification = this.notificationclients.find(notification => {
            return notification.id == this.credit.notificationClientId;
        });
        if(this.notification){
        this.model.delaiGrace = this.notification.delai_grace;
        this.model.differe = this.notification.differe;
        }
        if (this.notification && this.notification.type_garantie && this.notification.type_garantie.indexOf('DOC') != -1) {
            this.hasCautionDoc = true;
            this.clientPhotoHasBeenSend = false;
        } else {
            this.hasCautionDoc = false;
            this.clientPhotoHasBeenSend = true;
        }
        if (this.notification && this.notification.type_garantie && this.notification.type_garantie.indexOf('CAUT') != -1) {
            this.model.compteClient = '';
            this.model.client = '';
            this.hasCautionclient = true;
        } else {
            this.hasCautionclient = false;
            this.model.compteClient = ' ';
            this.model.client = '';
        }
        /* this.creditService
            .querySFDValideLigne(notification.amount)
            .subscribe(res => {
                this.lignecredits = res.json;
            }); */
        this.creditService.queryCompte(this.notification.id).subscribe(res => {
            this.comptes = res.json;
            if (this.comptes[0])
                this.credit.accountId = this.comptes[0].id;
        });
        this.credit.amount = this.notification.amount || 0;
    }
}

@Component({
    selector: 'jhi-credit-popup',
    template: ''
})
export class CreditPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditPopupService: CreditPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.creditPopupService.open(
                    CreditDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.creditPopupService.open(
                    CreditDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
