import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProduitTypeGarantie } from './produit-type-garantie.model';
import { ProduitTypeGarantiePopupService } from './produit-type-garantie-popup.service';
import { ProduitTypeGarantieService } from './produit-type-garantie.service';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Principal } from '../../shared/auth/principal.service';
import { setCreateBy, setLastModifyBy, numberToLocalString } from '../../shared/model/functions';
import { TypeGarantieService } from '../type-garantie/type-garantie.service';
declare let select_init: any;

@Component({
    selector: 'jhi-produit-type-garantie-dialog',
    templateUrl: './produit-type-garantie-dialog.component.html'
})
export class ProduitTypeGarantieDialogComponent implements OnInit {
    produitTypeGarantie: ProduitTypeGarantie;
    authorities: any[];
    isSaving: boolean;
    createdDateDp: any;
    lastModifiedDateDp: any;
    produitTypeGarantieAmount: String;
    produits = [];
    typeGaranties = [];
    loading = {
        produit: false,
        typeGarantie: false
    };

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private penalityService: ProduitTypeGarantieService,
        private eventManager: JhiEventManager,
        private produitService: ProduitService,
        private typeGarantieService: TypeGarantieService,
        public langue: LanguesService,
        public principal: Principal
    ) {}

    ngAfterViewInit() {
        select_init((query, id) => {
            switch (id) {
                case 'field_produit':
                    this._loadProduits({'libelle.contains': query});
                    break;
                case 'field_typeGarantie':
                    this._loadTypeGaranties({'name.contains': query});
                    break;
            }
        });
    }

    ngOnInit() {
        if (this.produitTypeGarantie.amount) {
            this.produitTypeGarantieAmount = numberToLocalString(this.produitTypeGarantie.amount.toString());
        }

        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];

        this._loadProduits();
        this._loadTypeGaranties();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.produitTypeGarantie.id !== undefined) {
                    setLastModifyBy(this.produitTypeGarantie, identity);
                    this.subscribeToSaveResponse(this.penalityService.update(this.produitTypeGarantie), false);
                } else {
                    setCreateBy(this.produitTypeGarantie, identity);
                    this.produitTypeGarantie.sfdReference = UserData.getInstance().getSFDReference();
                    this.subscribeToSaveResponse(this.penalityService.create(this.produitTypeGarantie), true);
                }
            },
            () => {}
        );
    }

    private subscribeToSaveResponse(
        result: Observable<ProduitTypeGarantie>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: ProduitTypeGarantie) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: ProduitTypeGarantie, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.produitTypeGarantie.created'
                : 'carmesfnmserviceApp.produitTypeGarantie.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'tranchePenalListModification',
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

    trackProduitById(index: number, item: Produit) {
        return item.id;
    }

    private _loadProduits(queries: any = {}) {
        this.loading.produit = true;
        this.produitService.query(queries)
        .subscribe(
            (res: ResponseWrapper) => {
                this.produitTypeGarantie.produitId = null;
                this.produits = this.produits.concat(res.json);
                this.loading.produit = false;
            },
            (res: ResponseWrapper) => {
                this.loading.produit = false;
                this.onError(res.json)
            }
        );
    }

    private _loadTypeGaranties(queries: any = {}) {
        this.loading.typeGarantie = true;
        this.typeGarantieService.query(queries)
        .subscribe(
            (res: ResponseWrapper) => {
                this.produitTypeGarantie.typeGarantieId = null;
                this.typeGaranties = this.typeGaranties.concat(res.json);
                this.loading.typeGarantie = false;
            },
            (res: ResponseWrapper) => {
                this.loading.typeGarantie = false;
                this.onError(res.json)
            }
        );
    }
}

@Component({
    selector: 'jhi-produit-type-grantie-popup',
    template: ''
})
export class ProduitTypeGarantiePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private penalityPopupService: ProduitTypeGarantiePopupService
    ) {}

    ngOnInit() {
        // if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.penalityPopupService.open(
                        ProduitTypeGarantieDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.penalityPopupService.open(
                        ProduitTypeGarantieDialogComponent as Component
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
