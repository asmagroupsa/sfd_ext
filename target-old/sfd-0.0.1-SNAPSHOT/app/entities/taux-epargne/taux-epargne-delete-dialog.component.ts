import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TauxEpargne } from './taux-epargne.model';
import { TauxEpargnePopupService } from './taux-epargne-popup.service';
import { TauxEpargneService } from './taux-epargne.service';

@Component({
    selector: 'jhi-taux-epargne-delete-dialog',
    templateUrl: './taux-epargne-delete-dialog.component.html'
})
export class TauxEpargneDeleteDialogComponent {

    tauxEpargne: TauxEpargne;

    constructor(
        private tauxEpargneService: TauxEpargneService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.tauxEpargneService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'tauxEpargneListModification',
                content: 'Deleted an tauxEpargne'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.tauxEpargne.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.tauxEpargne.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-taux-epargne-delete-popup',
    template: ''
})
export class TauxEpargneDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tauxEpargnePopupService: TauxEpargnePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.tauxEpargnePopupService
                .open(TauxEpargneDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
