import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ElementCondition } from './element-condition.model';
import { ElementConditionPopupService } from './element-condition-popup.service';
import { ElementConditionService } from './element-condition.service';

@Component({
    selector: 'jhi-element-condition-delete-dialog',
    templateUrl: './element-condition-delete-dialog.component.html'
})
export class ElementConditionDeleteDialogComponent {

    elementCondition: ElementCondition;

    constructor(
        private elementConditionService: ElementConditionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.elementConditionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'elementConditionListModification',
                content: 'Deleted an elementCondition'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.elementCondition.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.elementCondition.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-element-condition-delete-popup',
    template: ''
})
export class ElementConditionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private elementConditionPopupService: ElementConditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.elementConditionPopupService
                .open(ElementConditionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
