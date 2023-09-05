import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ConditionAcces } from './condition-acces.model';
import { ConditionAccesPopupService } from './condition-acces-popup.service';
import { ConditionAccesService } from './condition-acces.service';

@Component({
    selector: 'jhi-condition-acces-delete-dialog',
    templateUrl: './condition-acces-delete-dialog.component.html'
})
export class ConditionAccesDeleteDialogComponent {

    conditionAcces: ConditionAcces;

    constructor(
        private conditionAccesService: ConditionAccesService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.conditionAccesService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'conditionAccesListModification',
                content: 'Deleted an conditionAcces'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.conditionAcces.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.conditionAcces.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-condition-acces-delete-popup',
    template: ''
})
export class ConditionAccesDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private conditionAccesPopupService: ConditionAccesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.conditionAccesPopupService
                .open(ConditionAccesDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
