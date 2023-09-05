import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Client } from './client.model';
import { ClientPopupService } from './client-popup.service';
import { ClientService } from './client.service';

@Component({
    selector: 'jhi-client-delete-dialog',
    templateUrl: './client-delete-dialog.component.html'
})
export class ClientDeleteDialogComponent {
    client: Client;

    constructor(
        private clientService: ClientService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.clientService.delete(id).subscribe(
            response => {
                this.eventManager.broadcast({
                    name: 'clientListModification',
                    content: 'Deleted an client'
                });
                this.activeModal.dismiss(true);
                this.alertService.success(
                    'carmesfnmserviceApp.client.deleted',
                    { param: id },
                    null
                );
            },
            e => {
                this.alertService.error(
                    'carmesfnmserviceApp.client.deletedError',
                    { param: id },
                    null
                );
            }
        );
    }
}

@Component({
    selector: 'jhi-client-delete-popup',
    template: ''
})
export class ClientDeletePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private clientPopupService: ClientPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.clientPopupService.open(
                ClientDeleteDialogComponent,
                params['id']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
