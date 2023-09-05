import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CreditComity } from './credit-comity.model';
import { CreditComityPopupService } from './credit-comity-popup.service';

@Component({
    selector: 'jhi-credit-comity-member-dialog',
    templateUrl: './credit-comity-member-dialog.component.html'
})
export class CreditComityMemberDialogComponent {
    public creditComity: CreditComity;

    constructor(
        public activeModal: NgbActiveModal,
    ) {
        this.creditComity = null;
    }

    public clear(): void {
        this.activeModal.dismiss('cancel');
    }
}

@Component({
    selector: 'jhi-credit-comity-member-popup',
    template: ''
})
export class CreditComityMemberPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditComityPopupService: CreditComityPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.creditComityPopupService.open(
                CreditComityMemberDialogComponent as Component,
                params['id']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
