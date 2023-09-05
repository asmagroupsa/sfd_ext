import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LigneRequest } from './ligne-request.model';
import { LigneRequestPopupService } from './ligne-request-popup.service';
import { LigneRequestService } from './ligne-request.service';
import { NotificationSFD, NotificationSFDService } from '../notification-sfd';
import { setCreateBy, setLastModifyBy, formatNumberToLocalString } from '../../shared/model/functions';
import { Produit, ProduitService } from '../produit';
import { SFD, SFDService } from '../s-fd';
import { ResponseWrapper, Principal, UserData } from '../../shared';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import { DatePipe } from '@angular/common';
import { SPFNMService } from "../../shared/sp-fnm.service";
import { Partner, PartnerService } from '../partner';


declare let select_init: any;

@Component({
    selector: 'jhi-ligne-request-dialog',
    templateUrl: './ligne-request-dialog.component.html'
})
export class LigneRequestDialogComponent implements OnInit {
    ligneRequest: LigneRequest;
    authorities: any[];
    isSaving: boolean;
    notificationsfds: NotificationSFD[];
    produits: Produit[];
    sfds: SFD[];
    requestDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;
    public ligneRequestAmount: string;
    private _seletedProduit: Produit;
    creditComityIdArray = [];
    creditComities = [];
    hide = true;
    partners: any[] = [];
    partner: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private ligneRequestService: LigneRequestService,
        private notificationSFDService: NotificationSFDService,
        private produitService: ProduitService,
        private sFDService: SFDService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private creditComityService: CreditComityService,
        private _spFNMService: SPFNMService,
        private partnerService: PartnerService,

    ) { }

    async ngAfterViewInit() {
        if (!this.ligneRequest.id) {
            try {
                await this._spFNMService.verifierSoldeLigneAvantDemande();
                // this.hide = false;
            } catch (e) {
                console.error(e);
                this.clear();
                this.alertService.warning('Impossible de faire une nouvelle demande');
                return;
            }
        }

        select_init();
    }

    getProduit() {
        const req: any = {
            'sfdReference.equals': this.partner.code,
        };
        this.partnerService.queryProduitByPartber(req).subscribe(
            (res: ResponseWrapper) => {
                this.produits = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    
       /* this.produitService.produitsEligiblesByPatner(req).subscribe(
            async (res: ResponseWrapper) => {
                this.produits = await res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );*/
    }

    ngOnInit() {
        if (this.ligneRequest.id) {
            this.ligneRequestAmount = formatNumberToLocalString(this.ligneRequest.amount);
            for (const c of this.ligneRequest.creditComitys) this.creditComityIdArray.push(c.id);
        }

        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.notificationSFDService.query().subscribe(
            (res: ResponseWrapper) => {
                this.notificationsfds = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        // this.produitService.query().subscribe(
        //     (res: ResponseWrapper) => {
        //         this.produits = res.json;
        //     },
        //     (res: ResponseWrapper) => this.onError(res.json)
        // );
        this.partnerService.queryBySfd({
            "code": UserData.getInstance().currentSfdReference,
            "type": "SFD"
        }).subscribe(
            (res: ResponseWrapper) => {
                this.partners = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.sFDService.query().subscribe(
            (res: ResponseWrapper) => {
                this.sfds = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.creditComityService.query({
            'dossierComplets.equals': 'true',
            'nonDisponible.equals': 'false',
            size: 1000
        })
            .subscribe((r) => {
                console.log(r);
                this.creditComities = r.json;
            });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.ligneRequest.partnerId = this.partner.id;
        if (!UserData.getInstance().sfdId || !UserData.getInstance().currentSfdReference) {
            this.alertService.warning("Le SFD de l'utilisateur n'est pas correct", null, null);
            return;
        }
        if (!this.ligneRequestAmount) {
            this.alertService.warning("Le montant de la demande est invalide", null, null);
            return;
        }
        if (!this.ligneRequest.nbreBenef) {
            this.alertService.warning("Le nombre de clients est incorrect", null, null);
            return;
        }
        this.isSaving = true;
        this.principal.identity().then(identity => {
            this.ligneRequest.creditComitys = this.creditComities.filter((c) => this.creditComityIdArray.indexOf(c.id) !== -1);

            for (const c of this.ligneRequest.creditComitys) delete c.delegationComity;

            if (this.ligneRequest.id !== undefined) {
                setLastModifyBy(this.ligneRequest, identity);
                this.subscribeToSaveResponse(this.ligneRequestService.update(this.ligneRequest), false);
            } else {
                this.ligneRequest.sfdId = UserData.getInstance().sfdId;
                this.ligneRequest.sfdReference = UserData.getInstance().currentSfdReference;
                setCreateBy(this.ligneRequest, identity);

                const now = new Date();
                this.ligneRequest.requestDate = {
                    day: now.getDate(),
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                };

                this.subscribeToSaveResponse(this.ligneRequestService.create(this.ligneRequest), true);
            }
        });
    }

    private subscribeToSaveResponse(result: Observable<LigneRequest>, isCreated: boolean) {
        result.subscribe(
            (res: LigneRequest) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: LigneRequest, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.ligneRequest.created'
                : 'carmesfnmserviceApp.ligneRequest.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'ligneRequestListModification',
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

    trackNotificationSFDById(index: number, item: NotificationSFD) {
        return item.id;
    }

    trackProduitById(index: number, item: Produit) {
        return item.id;
    }

    trackSFDById(index: number, item: SFD) {
        return item.id;
    }

    public onProduitChange(): void {
        this.produitService
            .find(this.ligneRequest.produitId)
            .subscribe((_produit: Produit) => {
                this._seletedProduit = _produit;
            });
    }

    get amountIsValid(): boolean {
        if (this._seletedProduit === undefined) {
            return false;
        }

        return (
            this._seletedProduit.amountMin <= this.ligneRequest.amount &&
            this.ligneRequest.amount <= this._seletedProduit.amountMax
        );
    }

    onCreditComitiesChange() {
        this.ligneRequestService.comityMontantDossier(this.creditComityIdArray.join('*'))
            .subscribe((r) => {
                const data = r.json()[0];
                this.ligneRequestAmount = formatNumberToLocalString(data.montantDossier);
                this.ligneRequest.amount = data.montantDossier;
                this.ligneRequest.nbreBenef = data.nombreDossier;
            });
    }
}


@Component({
    selector: 'jhi-ligne-request-popup',
    template: ''
})
export class LigneRequestPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private ligneRequestPopupService: LigneRequestPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.ligneRequestPopupService.open(
                    LigneRequestDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.ligneRequestPopupService.open(
                    LigneRequestDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
