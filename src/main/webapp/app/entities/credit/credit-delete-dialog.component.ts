import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Credit } from './credit.model';
import { CreditPopupService } from './credit-popup.service';
import { CreditService } from './credit.service';

@Component({
    selector: 'jhi-credit-delete-dialog',
    templateUrl: './credit-delete-dialog.component.html'
})
export class CreditDeleteDialogComponent {
    credit: Credit;

    constructor(
        private creditService: CreditService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.creditService.delete(id).subscribe(
            response => {
                this.eventManager.broadcast({
                    name: 'creditListModification',
                    content: 'Deleted an credit'
                });
                this.activeModal.dismiss(true);
                this.alertService.success(
                    'carmesfnmserviceApp.credit.deleted',
                    { param: id },
                    null
                );
            },
            e => {
                this.alertService.error(
                    'carmesfnmserviceApp.credit.deleted',
                    { param: id },
                    null
                );
            }
        );
    }
}

@Component({
    selector: 'jhi-credit-delete-popup',
    template: ''
})
export class CreditDeletePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditPopupService: CreditPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.creditPopupService.open(
                CreditDeleteDialogComponent,
                params['id']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
