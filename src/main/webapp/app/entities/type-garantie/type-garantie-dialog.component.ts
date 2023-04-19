import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TypeGarantie } from './type-garantie.model';
import { TypeGarantiePopupService } from './type-garantie-popup.service';
import { TypeGarantieService } from './type-garantie.service';
import {
    ConditionGarantie,
    ConditionGarantieService
} from '../condition-garantie';
import { Garantie, GarantieService } from '../garantie';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
declare let select_init: any;
@Component({
    selector: 'jhi-type-garantie-dialog',
    templateUrl: './type-garantie-dialog.component.html'
})
export class TypeGarantieDialogComponent implements OnInit {
    typeGarantie: TypeGarantie;
    authorities: any[];
    isSaving: boolean;

    conditiongaranties: ConditionGarantie[];

    garanties: Garantie[];

    produits: Produit[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private typeGarantieService: TypeGarantieService,
        private conditionGarantieService: ConditionGarantieService,
        private garantieService: GarantieService,
        private produitService: ProduitService,
        private eventManager: JhiEventManager
    ) { }
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.conditionGarantieService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.conditiongaranties = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.garantieService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.garanties = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.produitService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.produits = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        if (this.typeGarantie.id !== undefined) {
            this.subscribeToSaveResponse(
                this.typeGarantieService.update(this.typeGarantie),
                false
            );
        } else {
            this.typeGarantie.sfdReference = UserData.getInstance().getSFDReference();
            this.subscribeToSaveResponse(
                this.typeGarantieService.create(this.typeGarantie),
                true
            );
        }
    }

    private subscribeToSaveResponse(
        result: Observable<TypeGarantie>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: TypeGarantie) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: TypeGarantie, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'sfdApp.typeGarantie.created'
                : 'sfdApp.typeGarantie.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'typeGarantieListModification',
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

    trackConditionGarantieById(index: number, item: ConditionGarantie) {
        return item.id;
    }

    trackGarantieById(index: number, item: Garantie) {
        return item.id;
    }

    trackProduitById(index: number, item: Produit) {
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
}

@Component({
    selector: 'jhi-type-garantie-popup',
    template: ''
})
export class TypeGarantiePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private typeGarantiePopupService: TypeGarantiePopupService
    ) { }

    ngOnInit() {
        // if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.typeGarantiePopupService.open(
                        TypeGarantieDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.typeGarantiePopupService.open(
                        TypeGarantieDialogComponent as Component
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
