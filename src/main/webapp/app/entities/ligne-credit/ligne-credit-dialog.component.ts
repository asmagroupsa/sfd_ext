import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy, numberToLocalString, localStringToNumber, formatNumberToLocalString, getNewItems } from '../../shared/model/functions';
import { LigneCredit } from './ligne-credit.model';
import { LigneCreditPopupService } from './ligne-credit-popup.service';
import { LigneCreditService } from './ligne-credit.service';
import { NotificationSFD, NotificationSFDService } from '../notification-sfd';
import { EcheancierSFD, EcheancierSFDService } from '../echeancier-sfd';
import { Periodicity, PeriodicityService } from '../periodicity';
import { Partner, PartnerService } from '../partner';
import { TauxSFD, TauxSFDService } from '../taux-sfd';
import { ResponseWrapper, UserData, LOCAL_FLAG } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { ProduitService } from '../produit';
import { CreditComityService } from '../credit-comity';
import { LigneRequestService } from '../ligne-request';


declare let modal: any;
declare let modalHide: any;
declare let select_init: any;
@Component({
    selector: 'jhi-ligne-credit-dialog',
    templateUrl: './ligne-credit-dialog.component.html'
})
export class LigneCreditDialogComponent implements OnInit {
    isPartner: boolean = false;
    ligneCredit: LigneCredit;
    authorities: any[];
    isSaving: boolean;

    notificationsfds: NotificationSFD[];

    periodicities: Periodicity[];
    modes: string[] = [
        'LINEAIRE',
        'NOMINAL_CONSTANT',
        'DEGRESSIF',
        'NOMINAL_LIBRE',
        'ECHEANCIER_LIBRE'
    ];
    partners: Partner[];
    localModel: any = {
        chaine_comite: []
    };
    createdDateDp: any;
    lastModifiedDateDp: any;
    ligneCreditAmount: string;
    localFlag: boolean;
    produits = [];
    creditComities = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private ligneCreditService: LigneCreditService,
        private notificationSFDService: NotificationSFDService,
        private echeancierSFDService: EcheancierSFDService,
        private periodicityService: PeriodicityService,
        private partnerService: PartnerService,
        private tauxSFDService: TauxSFDService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private produitService: ProduitService,
        private ligneRequestService: LigneRequestService,
        private creditComityService: CreditComityService
    ) { }
    ngAfterViewInit() {
        select_init((query, id) => {
            if (id === 'field_produit') {
                this.produitService.query({ NO_QUERY: false, 'libelle.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.produits = this.produits.concat(getNewItems(this.produits, res.json));
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id === 'field_periodicity') {
                this.periodicityService.query({ NO_QUERY: true, 'libPeriodicite.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.periodicities = this.periodicities.concat(getNewItems(this.periodicities, res.json));
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id === 'field_partner') {
                this.partnerService.query({ NO_QUERY: true, 'name.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.partners = this.partners.concat(getNewItems(this.partners, res.json));
                    },
                    (res: ResponseWrapper) => { }
                );
            }
        });
    }
    partner(id: any) {
        if (!this.partners) return new Partner();
        return this.partners.find(partner => {
            return partner.id == id;
        });
    }
    ngOnInit() {
        this.localFlag = LOCAL_FLAG;
        if (this.ligneCredit.id && this.ligneCredit.amount)
            this.ligneCreditAmount = numberToLocalString(this.ligneCredit.amount.toString());

        this.isSaving = false;
        if (this.ligneCredit.partnerId) this.isPartner = true;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.notificationSFDService
            .query({ filter: 'lignecredit-is-null' })
            .subscribe(
                (res: ResponseWrapper) => {
                    if (!this.ligneCredit.notificationSFDId) {
                        this.notificationsfds = res.json;
                    } else {
                        this.notificationSFDService
                            .find(this.ligneCredit.notificationSFDId)
                            .subscribe(
                                (subRes: NotificationSFD) => {
                                    this.notificationsfds = [subRes].concat(
                                        res.json
                                    );
                                },
                                (subRes: ResponseWrapper) =>
                                    this.onError(subRes.json)
                            );
                    }
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.periodicityService.query().subscribe(
            (res: ResponseWrapper) => {
                this.periodicities = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.partnerService.query().subscribe(
            (res: ResponseWrapper) => {
                this.partners = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        // this.produitService.produitsEligibles().subscribe(
        //     (res: ResponseWrapper) => {
        //         this.produits = res.json;
        //     },
        //     (res: ResponseWrapper) => this.onError(res.json)
        // );
        this.produitService.query().subscribe(
            (res: ResponseWrapper) => {
                this.produits = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.creditComityService.query({
            'dossierComplets.equals': 'true',
            'nonDisponible.equals': 'false'
        })
            .subscribe((r) => {
                this.creditComities = r.json;
            });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (!confirm("Confirmer l'enregistrement de la ligne de credit!")) {
            return;
        }

        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {

                if (this.ligneCredit.id !== undefined) {
                    setLastModifyBy(this.ligneCredit, identity);
                    this.subscribeToSaveResponse(
                        this.ligneCreditService.update(this.ligneCredit),
                        false
                    );
                } else {
                    this.ligneCredit.sfdReference = UserData.getInstance().currentSfdReference;
                    setCreateBy(this.ligneCredit, identity);
                    this.ligneCredit.code = 'xLxxCode';
                    if (this.localFlag) {
                        this.localModel.libelle = this.ligneCredit.libelle;
                        this.localModel.amount = this.ligneCredit.amount;
                        this.localModel.duree = this.ligneCredit.duration;
                        this.localModel.taux = this.ligneCredit.tauxInteret;
                        this.localModel.mode_calcul = this.ligneCredit.modeEcheance;
                        this.localModel.preiodicite = this.ligneCredit.periodicityId;
                        this.localModel.bailleur = this.ligneCredit.partnerId;
                        this.localModel.differe = this.ligneCredit.differe;
                        this.localModel.created_by = this.ligneCredit.createdBy;
                        this.localModel.sdf_id = UserData.getInstance().sfd_.id;
                        this.ligneCreditService.insertLigneCreditLocal(this.localModel)
                            .subscribe(
                                (r) => {
                                    if (r.json().resultat == 'OK') {
                                        this.onSaveSuccess(r, true);
                                    }
                                    else {
                                        this.onSaveError(r);
                                    }
                                },
                                (e) => {
                                    this.onSaveError(e);
                                }
                            );
                    } else {
                        this.subscribeToSaveResponse(this.ligneCreditService.create(this.ligneCredit), true);
                    }
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<any>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: LigneCredit) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.ligneCredit.created'
                : 'carmesfnmserviceApp.ligneCredit.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'ligneCreditListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
        // this.closeModal();
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

    trackNotificationSFDById(index: number, item: NotificationSFD) {
        return item.id;
    }

    trackEcheancierSFDById(index: number, item: EcheancierSFD) {
        return item.id;
    }

    trackPeriodicityById(index: number, item: Periodicity) {
        return item.id;
    }

    trackPartnerById(index: number, item: Partner) {
        return item.id;
    }

    trackTauxSFDById(index: number, item: TauxSFD) {
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

    onCreditComitiesChange() {
        this.ligneRequestService.comityMontantDossier(this.localModel.chaine_comite.join('*'))
            .subscribe((r) => {
                const data = r.json()[0];
                this.ligneCreditAmount = formatNumberToLocalString(data.montantDossier);
                this.ligneCredit.amount = data.montantDossier;
            });
    }
    /* 
        confirm() {
            modal('#confirm');
        }
    
        closeModal() {
            modalHide('#confirm');
        } */

    isValidTaux() {
        return (0 <= this.ligneCredit.tauxInteret) && (this.ligneCredit.tauxInteret <= 100)
    }
}

@Component({
    selector: 'jhi-ligne-credit-popup',
    template: ''
})
export class LigneCreditPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private ligneCreditPopupService: LigneCreditPopupService
    ) { }

    ngOnInit() {
        // if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.ligneCreditPopupService.open(
                        LigneCreditDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.ligneCreditPopupService.open(
                        LigneCreditDialogComponent as Component
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
