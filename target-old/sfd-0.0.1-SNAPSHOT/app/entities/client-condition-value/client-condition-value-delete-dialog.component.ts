import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ClientConditionValue } from './client-condition-value.model';
import { ClientConditionValuePopupService } from './client-condition-value-popup.service';
import { ClientConditionValueService } from './client-condition-value.service';

@Component({
    selector: 'jhi-client-condition-value-delete-dialog',
    templateUrl: './client-condition-value-delete-dialog.component.html'
})
export class ClientConditionValueDeleteDialogComponent {

    clientConditionValue: ClientConditionValue;

    constructor(
        private clientConditionValueService: ClientConditionValueService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.clientConditionValueService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'clientConditionValueListModification',
                content: 'Deleted an clientConditionValue'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.clientConditionValue.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.clientConditionValue.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-client-condition-value-delete-popup',
    template: ''
})
export class ClientConditionValueDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private clientConditionValuePopupService: ClientConditionValuePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.clientConditionValuePopupService
                .open(ClientConditionValueDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
