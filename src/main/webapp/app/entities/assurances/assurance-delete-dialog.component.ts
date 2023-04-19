import { Assurance } from './assurance.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { AssuranceService } from './assurance.service';
import { AssurancePopupService } from './assurance-popup.service';


@Component({
    selector: 'jhi-address-delete-dialog',
    templateUrl: './assurance-delete-dialog.component.html'
})
export class AssuranceDeleteDialogComponent {
    address: Assurance;

    constructor(
        private addressService: AssuranceService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) { }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.addressService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'addressListModification',
                content: 'Deleted an address'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.address.deleted', { param: id }, null);
        }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.address.deleted', { param: id }, null);
        });

    }
}

@Component({
    selector: 'jhi-address-delete-popup',
    template: ''
})
export class AssuranceDeletePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private addressPopupService: AssurancePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.addressPopupService.open(
                AssuranceDeleteDialogComponent as Component,
                params['id']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
