import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ZoneDepartement } from './zone-departement.model';
import { ZoneDepartementPopupService } from './zone-departement-popup.service';
import { ZoneDepartementService } from './zone-departement.service';

@Component({
    selector: 'jhi-zone-departement-delete-dialog',
    templateUrl: './zone-departement-delete-dialog.component.html'
})
export class ZoneDepartementDeleteDialogComponent {

    zoneDepartement: ZoneDepartement;

    constructor(
        private zoneDepartementService: ZoneDepartementService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.zoneDepartementService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'zoneDepartementListModification',
                content: 'Deleted an zoneDepartement'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.zoneDepartement.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.zoneDepartement.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-zone-departement-delete-popup',
    template: ''
})
export class ZoneDepartementDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private zoneDepartementPopupService: ZoneDepartementPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.zoneDepartementPopupService
                .open(ZoneDepartementDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
