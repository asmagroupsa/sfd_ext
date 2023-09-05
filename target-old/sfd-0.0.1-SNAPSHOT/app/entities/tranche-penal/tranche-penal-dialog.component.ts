import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TranchePenal } from './tranche-penal.model';
import { TranchePenalPopupService } from './tranche-penal-popup.service';
import { TranchePenalService } from './tranche-penal.service';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Principal } from '../../shared/auth/principal.service';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { PenalityService } from '../penality';
declare let select_init: any;

@Component({
    selector: 'jhi-tranche-penal-dialog',
    templateUrl: './tranche-penal-dialog.component.html'
})
export class TranchePenalDialogComponent implements OnInit {
    tranchePenal: TranchePenal;
    authorities: any[];
    isSaving: boolean;

    produits: Produit[];
    createdDateDp: any;
    lastModifiedDateDp: any;
    penalities = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private tranchePenalService: TranchePenalService,
        private produitService: ProduitService,
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
        this.produitService.query().subscribe(
            (res: ResponseWrapper) => {
                this.produits = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.penalityService.query().subscribe(
            (res: ResponseWrapper) => {
                this.penalities = res.json.filter((p) => p.type === 'TRANCHE');
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.tranchePenal.id !== undefined) {
                    setLastModifyBy(this.tranchePenal, identity);
                    this.subscribeToSaveResponse(
                        this.tranchePenalService.update(this.tranchePenal),
                        false
                    );
                } else {
                    setCreateBy(this.tranchePenal, identity);
                    this.tranchePenal.sfdReference = UserData.getInstance().getSFDReference();
                    this.subscribeToSaveResponse(
                        this.tranchePenalService.create(this.tranchePenal),
                        true
                    );
                }
            },
            () => {}
        );
    }

    private subscribeToSaveResponse(
        result: Observable<TranchePenal>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: TranchePenal) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: TranchePenal, isCreated: boolean) {
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
    controlForm() {
        return (
            this.tranchePenal.minDay >= 0 &&
            this.tranchePenal.maxDay > this.tranchePenal.minDay &&
            (this.tranchePenal.penalRate >= 0 &&
                this.tranchePenal.penalRate <= 100)
        );
    }
}

@Component({
    selector: 'jhi-tranche-penal-popup',
    template: ''
})
export class TranchePenalPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tranchePenalPopupService: TranchePenalPopupService
    ) {}

    ngOnInit() {
        // if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.tranchePenalPopupService.open(
                        TranchePenalDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.tranchePenalPopupService.open(
                        TranchePenalDialogComponent as Component
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
