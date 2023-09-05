import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Penality } from './tranche-penal.model';
import { PenalityPopupService } from './tranche-penal-popup.service';
import { PenalityService } from './penality.service';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Principal } from '../../shared/auth/principal.service';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
declare let select_init: any;

@Component({
    selector: 'jhi-penality-dialog',
    templateUrl: './penality-dialog.component.html'
})
export class PenalityDialogComponent implements OnInit {
    penality: Penality;
    authorities: any[];
    isSaving: boolean;

    createdDateDp: any;
    lastModifiedDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private penalityService: PenalityService,
        private eventManager: JhiEventManager,
        public langue: LanguesService,
        public principal: Principal
    ) {}
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.penality.id !== undefined) {
                    setLastModifyBy(this.penality, identity);
                    this.subscribeToSaveResponse(
                        this.penalityService.update(this.penality),
                        false
                    );
                } else {
                    setCreateBy(this.penality, identity);
                    this.penality.sfdReference = UserData.getInstance().getSFDReference();
                    this.subscribeToSaveResponse(
                        this.penalityService.create(this.penality),
                        true
                    );
                }
            },
            () => {}
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Penality>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Penality) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Penality, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.tranchePenal.created'
                : 'carmesfnmserviceApp.tranchePenal.updated',
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

    /* getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    } */
    /* controlForm() {
        return (
            this.penality.minDay >= 0 &&
            this.penality.maxDay > this.penality.minDay &&
            (this.penality.penalRate >= 0 &&
                this.penality.penalRate <= 100)
        );
    } */
}

@Component({
    selector: 'jhi-penality-popup',
    template: ''
})
export class PenalityPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private penalityPopupService: PenalityPopupService
    ) {}

    ngOnInit() {
        // if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.penalityPopupService.open(
                        PenalityDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.penalityPopupService.open(
                        PenalityDialogComponent as Component
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
