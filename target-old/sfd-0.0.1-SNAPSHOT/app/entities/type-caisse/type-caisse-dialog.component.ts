import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TypeCaisse } from './type-caisse.model';
import { TypeCaissePopupService } from './type-caisse-popup.service';
import { TypeCaisseService } from './type-caisse.service';

@Component({
    selector: 'jhi-type-caisse-dialog',
    templateUrl: './type-caisse-dialog.component.html'
})
export class TypeCaisseDialogComponent implements OnInit {

    typeCaisse: TypeCaisse;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private typeCaisseService: TypeCaisseService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.typeCaisse.id !== undefined) {
            this.subscribeToSaveResponse(
                this.typeCaisseService.update(this.typeCaisse));
        } else {
            this.subscribeToSaveResponse(
                this.typeCaisseService.create(this.typeCaisse));
        }
    }

    private subscribeToSaveResponse(result: Observable<TypeCaisse>) {
        result.subscribe((res: TypeCaisse) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: TypeCaisse) {
        this.eventManager.broadcast({ name: 'typeCaisseListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-type-caisse-popup',
    template: ''
})
export class TypeCaissePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private typeCaissePopupService: TypeCaissePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.typeCaissePopupService
                    .open(TypeCaisseDialogComponent as Component, params['id']);
            } else {
                this.typeCaissePopupService
                    .open(TypeCaisseDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
