import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ValidationPopupService } from './validation-popup.service';
import { ValidationService } from './validation.service';

@Component({
    selector: 'jhi-validation-observation-dialog',
    templateUrl: './validation-observation-dialog.html',
    styles: [`
    strong{
        font-weight:bold !important;
    }
    `]
})
export class ValidationObservationDialogComponent {

    validation: any;

    constructor(
        private validationService: ValidationService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }
}

@Component({
    selector: 'jhi-validation--observation-popup',
    template: ''
})
export class ValidationObservationPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private validationPopupService: ValidationPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.validationPopupService
                .open(ValidationObservationDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
