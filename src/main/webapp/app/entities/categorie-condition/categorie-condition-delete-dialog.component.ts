import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorieCondition } from './categorie-condition.model';
import { CategorieConditionPopupService } from './categorie-condition-popup.service';
import { CategorieConditionService } from './categorie-condition.service';

@Component({
    selector: 'jhi-categorie-condition-delete-dialog',
    templateUrl: './categorie-condition-delete-dialog.component.html'
})
export class CategorieConditionDeleteDialogComponent {

    categorieCondition: CategorieCondition;

    constructor(
        private categorieConditionService: CategorieConditionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categorieConditionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categorieConditionListModification',
                content: 'Deleted an categorieCondition'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.categorieCondition.deleted', { param: id }, null)
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.categorieCondition.deleted', { param: id }, null)
          });
    }
}

@Component({
    selector: 'jhi-categorie-condition-delete-popup',
    template: ''
})
export class CategorieConditionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorieConditionPopupService: CategorieConditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.categorieConditionPopupService
                .open(CategorieConditionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
