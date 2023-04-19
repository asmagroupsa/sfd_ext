import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorieCondition } from './categorie-condition.model';
import { CategorieConditionPopupService } from './categorie-condition-popup.service';
import { CategorieConditionService } from './categorie-condition.service';

@Component({
    selector: 'jhi-categorie-condition-dialog',
    templateUrl: './categorie-condition-dialog.component.html'
})
export class CategorieConditionDialogComponent implements OnInit {

    categorieCondition: CategorieCondition;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private categorieConditionService: CategorieConditionService,
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
        if (this.categorieCondition.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categorieConditionService.update(this.categorieCondition));
        } else {
            this.subscribeToSaveResponse(
                this.categorieConditionService.create(this.categorieCondition));
        }
    }

    private subscribeToSaveResponse(result: Observable<CategorieCondition>) {
        result.subscribe((res: CategorieCondition) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CategorieCondition) {
        this.eventManager.broadcast({ name: 'categorieConditionListModification', content: 'OK'});
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
}

@Component({
    selector: 'jhi-categorie-condition-popup',
    template: ''
})
export class CategorieConditionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorieConditionPopupService: CategorieConditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categorieConditionPopupService
                    .open(CategorieConditionDialogComponent as Component, params['id']);
            } else {
                this.categorieConditionPopupService
                    .open(CategorieConditionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
