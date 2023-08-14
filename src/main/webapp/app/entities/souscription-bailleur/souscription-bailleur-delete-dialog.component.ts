import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { SouscriptionBailleur } from './souscription-bailleur.model';
import { SouscriptionBailleurService } from './souscription-bailleur.service';
import { SouscriptionBailleurPopupService } from './souscription-bailleur-popup.service';

@Component({
    selector: 'jhi-souscription-bailleur-delete-dialog',
    templateUrl: './souscription-bailleur-dialog.component.html'
})
export class SouscriptionBailleurDeleteDialogComponent {

    souscriptionBailleur: SouscriptionBailleur;

    constructor(
        private souscriptionBailleurService: SouscriptionBailleurService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.souscriptionBailleurService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'SouscriptionBailleurListModification',
                content: 'Deleted an SouscriptionBailleur'
            });
            this.activeModal.dismiss(true);
        }, () => {
            this.alertService.error('carmesfnmserviceApp.SouscriptionBailleur.deleted');
        });
    }
}

@Component({
    selector: 'jhi-souscriptionBailleur-delete-popup',
    template: ''
})
export class SouscriptionBailleurDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private souscriptionBailleurPopupService: SouscriptionBailleurPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.souscriptionBailleurPopupService
                .open(SouscriptionBailleurDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
