import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { LOCAL_FLAG, ResponseWrapper, UserData } from '../../shared';
import { getNewItems } from '../../shared/model/functions';
import { Produit, ProduitService } from '../produit';
import { TauxEpargnePopupService } from './taux-epargne-popup.service';
import { TauxEpargne } from './taux-epargne.model';
import { TauxEpargneService } from './taux-epargne.service';

declare let select_init: any;

@Component({
    selector: 'jhi-taux-epargne-dialog',
    templateUrl: './taux-epargne-dialog.component.html'
})
export class TauxEpargneDialogComponent implements OnInit {
    params: { [key: string]: any };
    tauxEpargne: TauxEpargne;
    authorities: any[];
    isSaving: boolean;
    produits: Produit[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private tauxEpargneService: TauxEpargneService,
        private produitService: ProduitService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute
    ) {
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }
    ngAfterViewInit() {
        select_init((query, id) => {
            if (id === 'field_produit') {
                this._loadProduits({ 'libelle.contains': query });
            }
        });
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this._loadProduits({ size: 5 });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.tauxEpargne.id !== undefined) {
            this.subscribeToSaveResponse(
                this.tauxEpargneService.update(this.tauxEpargne),
                false
            );
        } else {
            if (this.params && this.params.produit)
                this.tauxEpargne.produitId = +this.params.produit;

            this.tauxEpargne.sfdReference = UserData.getInstance().getSFDReference();
            this.subscribeToSaveResponse(
                this.tauxEpargneService.create(this.tauxEpargne),
                true
            );
        }
    }

    private subscribeToSaveResponse(
        result: Observable<TauxEpargne>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: TauxEpargne) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: TauxEpargne, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'sfdApp.tauxEpargne.created'
                : 'sfdApp.tauxEpargne.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'tauxEpargneListModification',
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
    controlForm(editForm: NgForm) {
        /* if(this.tauxEpargne.typeValeur == 'TAUX' && (this.tauxEpargne.valeur < 0 || this.tauxEpargne.valeur >100)) return true;
    else if(this.tauxEpargne.typeValeur == 'FRAIS' && this.tauxEpargne.valeur < 0)  return true;
    else return false */
        if (
            !editForm ||
            !editForm.controls ||
            !editForm.controls.typeValeur ||
            !editForm.controls.valeur
        )
            return false;
        if (
            editForm.controls.typeValeur.value == 'TAUX' &&
            (editForm.controls.valeur.value >= 0 &&
                editForm.controls.valeur.value <= 100)
        )
            return true;
        else if (
            editForm.controls.typeValeur.value == 'FRAIS' &&
            editForm.controls.valeur.value > 0
        )
            return true;
        else if (editForm.controls.typeValeur.value == 'AUCUN') return true;
        else return false;
    }

    private _loadProduits(queries?: any) {
        this.produitService.query(queries).subscribe(
            (res: ResponseWrapper) => {
                this.produits = this.produits.concat(getNewItems(this.produits, res.json));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
}

@Component({
    selector: 'jhi-taux-epargne-popup',
    template: ''
})
export class TauxEpargnePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tauxEpargnePopupService: TauxEpargnePopupService
    ) { }

    ngOnInit() {
        // if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.tauxEpargnePopupService.open(
                        TauxEpargneDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.tauxEpargnePopupService.open(
                        TauxEpargneDialogComponent as Component
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
