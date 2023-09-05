import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ZoneAgence } from './zone-agence.model';
import { ZoneAgencePopupService } from './zone-agence-popup.service';
import { ZoneAgenceService } from './zone-agence.service';

@Component({
    selector: 'jhi-zone-agence-delete-dialog',
    templateUrl: './zone-agence-delete-dialog.component.html'
})
export class ZoneAgenceDeleteDialogComponent {

    zoneAgence: ZoneAgence;

    constructor(
        private zoneAgenceService: ZoneAgenceService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.zoneAgenceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'zoneAgenceListModification',
                content: 'Deleted an zoneAgence'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.zoneAgence.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.zoneAgence.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-zone-agence-delete-popup',
    template: ''
})
export class ZoneAgenceDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private zoneAgencePopupService: ZoneAgencePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.zoneAgencePopupService
                .open(ZoneAgenceDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
