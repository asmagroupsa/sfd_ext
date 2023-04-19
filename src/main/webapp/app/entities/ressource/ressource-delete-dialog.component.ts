import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Ressource } from './ressource.model';
import { RessourcePopupService } from './ressource-popup.service';
import { RessourceService } from './ressource.service';

@Component({
    selector: 'jhi-ressource-delete-dialog',
    templateUrl: './ressource-delete-dialog.component.html'
})
export class RessourceDeleteDialogComponent {

    ressource: Ressource;

    constructor(
        private ressourceService: RessourceService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.ressourceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'ressourceListModification',
                content: 'Deleted an ressource'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.ressource.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.ressource.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-ressource-delete-popup',
    template: ''
})
export class RessourceDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private ressourcePopupService: RessourcePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.ressourcePopupService
                .open(RessourceDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
