import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { LOCAL_FLAG } from '../../shared';
import { RequestPartnerService } from './request-patner.service';
import { RequestPartner } from './request-patner.model';
import { RequestPartnerPopupService } from './request-patner-popup.service';

@Component({
    selector: 'jhi-request-patner-delete-dialog',
    templateUrl: './request-patner-delete-dialog.component.html'
})
export class RequestPartnerDeleteDialogComponent {
    requestPartner: RequestPartner;

    constructor(
        private produitService: RequestPartnerService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.produitService.delete(id).subscribe(
            response => {
                this.eventManager.broadcast({
                    name: 'produitListModification',
                    content: 'Deleted an produit'
                });
                this.activeModal.dismiss(true);
                this.alertService.success(
                    'sfdApp.carmesfnmserviceApp.produit.deleted',
                    { param: id },
                    null
                );
            },
            e => {
                this.alertService.error(
                    'sfdApp.carmesfnmserviceApp.produit.deleted',
                    { param: id },
                    null
                );
            }
        );
    }
}

@Component({
    selector: 'jhi-request-partner-delete-popup',
    template: ''
})
export class RequestPartnerDeletePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private produitPopupService: RequestPartnerPopupService
    ) {}

    ngOnInit() {
        // if (LOCAL_FLAG) return;
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.produitPopupService.open(
                RequestPartnerDeleteDialogComponent as Component,
                params['id']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
