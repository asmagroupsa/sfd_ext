import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Validation } from './validation.model';
import { ValidationPopupService } from './validation-popup.service';
import { ValidationService } from './validation.service';

@Component({
    selector: 'jhi-validation-delete-dialog',
    templateUrl: './validation-delete-dialog.component.html'
})
export class ValidationDeleteDialogComponent {

    validation: Validation;

    constructor(
        private validationService: ValidationService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.validationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'validationListModification',
                content: 'Deleted an validation'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.validation.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.validation.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-validation-delete-popup',
    template: ''
})
export class ValidationDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private validationPopupService: ValidationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.validationPopupService
                .open(ValidationDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
