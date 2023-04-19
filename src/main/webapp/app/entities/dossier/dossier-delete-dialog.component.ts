import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Dossier } from './dossier.model';
import { DossierPopupService } from './dossier-popup.service';
import { DossierService } from './dossier.service';

@Component({
    selector: 'jhi-dossier-delete-dialog',
    templateUrl: './dossier-delete-dialog.component.html'
})
export class DossierDeleteDialogComponent {

    dossier: Dossier;

    constructor(
        private dossierService: DossierService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.dossierService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'dossierListModification',
                content: 'Deleted an dossier'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.dossier.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.dossier.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-dossier-delete-popup',
    template: ''
})
export class DossierDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dossierPopupService: DossierPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.dossierPopupService
                .open(DossierDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
