import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Souscription } from './souscription.model';
import { SouscriptionPopupService } from './souscription-popup.service';
import { SouscriptionService } from './souscription.service';

@Component({
    selector: 'jhi-souscription-delete-dialog',
    templateUrl: './souscription-delete-dialog.component.html'
})
export class SouscriptionDeleteDialogComponent {

    souscription: Souscription;

    constructor(
        private souscriptionService: SouscriptionService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.souscriptionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'souscriptionListModification',
                content: 'Deleted an souscription'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.souscription.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.souscription.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-souscription-delete-popup',
    template: ''
})
export class SouscriptionDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private souscriptionPopupService: SouscriptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.souscriptionPopupService
                .open(SouscriptionDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
