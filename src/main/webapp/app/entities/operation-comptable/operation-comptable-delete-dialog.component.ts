import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OperationComptable } from './operation-comptable.model';
import { OperationComptablePopupService } from './operation-comptable-popup.service';
import { OperationComptableService } from './operation-comptable.service';

@Component({
    selector: 'jhi-operation-comptable-delete-dialog',
    templateUrl: './operation-comptable-delete-dialog.component.html'
})
export class OperationComptableDeleteDialogComponent {

    operationComptable: OperationComptable;

    constructor(
        private operationComptableService: OperationComptableService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.operationComptableService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'operationComptableListModification',
                content: 'Deleted an operationComptable'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.operationComptable.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.operationComptable.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-operation-comptable-delete-popup',
    template: ''
})
export class OperationComptableDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private operationComptablePopupService: OperationComptablePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.operationComptablePopupService
                .open(OperationComptableDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
