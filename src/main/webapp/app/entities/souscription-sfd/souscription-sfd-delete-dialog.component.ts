import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { SouscriptionSfd } from './souscription-sfd.model';
import { SouscriptionSfdService } from './souscription-sfd.service';
import { SouscriptionSfdPopupService } from './souscription-sfd-popup.service';

@Component({
    selector: 'jhi-souscription-sfd-delete-dialog',
    templateUrl: './souscription-sfd-dialog.component.html'
})
export class SouscriptionSfdDeleteDialogComponent {

    souscriptionSfd: SouscriptionSfd;

    constructor(
        private souscriptionSfdService: SouscriptionSfdService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.souscriptionSfdService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'SouscriptionBailleurListModification',
                content: 'Deleted an SouscriptionSfd'
            });
            this.activeModal.dismiss(true);
        }, () => {
            this.alertService.error('carmesfnmserviceApp.SouscriptionSfd.deleted');
        });
    }
}

@Component({
    selector: 'jhi-souscriptionSfd-delete-popup',
    template: ''
})
export class SouscriptionSfdDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private souscriptionSfdPopupService: SouscriptionSfdPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.souscriptionSfdPopupService
                .open(SouscriptionSfdDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
