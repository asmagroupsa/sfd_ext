import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ZoneSfd } from './zone-sfd.model';
import { ZoneSfdPopupService } from './zone-sfd-popup.service';
import { ZoneSfdService } from './zone-sfd.service';

@Component({
    selector: 'jhi-zone-sfd-delete-dialog',
    templateUrl: './zone-sfd-delete-dialog.component.html'
})
export class ZoneSfdDeleteDialogComponent {

    zoneSfd: ZoneSfd;

    constructor(
        private zoneSfdService: ZoneSfdService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.zoneSfdService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'zoneSfdListModification',
                content: 'Deleted an zoneSfd'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.zoneSfd.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.zoneSfd.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-zone-sfd-delete-popup',
    template: ''
})
export class ZoneSfdDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private zoneSfdPopupService: ZoneSfdPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.zoneSfdPopupService
                .open(ZoneSfdDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
