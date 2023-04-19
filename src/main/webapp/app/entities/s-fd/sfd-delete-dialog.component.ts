import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { SFD } from './sfd.model';
import { SFDPopupService } from './sfd-popup.service';
import { SFDService } from './sfd.service';

@Component({
    selector: 'jhi-sfd-delete-dialog',
    templateUrl: './sfd-delete-dialog.component.html'
})
export class SFDDeleteDialogComponent {

    sFD: SFD;

    constructor(
        private sFDService: SFDService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.sFDService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sFDListModification',
                content: 'Deleted an sFD'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.sFD.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.sFD.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-sfd-delete-popup',
    template: ''
})
export class SFDDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sFDPopupService: SFDPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.sFDPopupService
                .open(SFDDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
