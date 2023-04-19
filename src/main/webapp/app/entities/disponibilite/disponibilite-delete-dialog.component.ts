import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Disponibilite } from './disponibilite.model';
import { DisponibilitePopupService } from './disponibilite-popup.service';
import { DisponibiliteService } from './disponibilite.service';

@Component({
    selector: 'jhi-disponibilite-delete-dialog',
    templateUrl: './disponibilite-delete-dialog.component.html'
})
export class DisponibiliteDeleteDialogComponent {

    disponibilite: Disponibilite;

    constructor(
        private disponibiliteService: DisponibiliteService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.disponibiliteService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'disponibiliteListModification',
                content: 'Deleted an disponibilite'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.disponibilite.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.disponibilite.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-disponibilite-delete-popup',
    template: ''
})
export class DisponibiliteDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private disponibilitePopupService: DisponibilitePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.disponibilitePopupService
                .open(DisponibiliteDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
