import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { SouscriptionGouvernanceUniverselle } from './souscription-gouvernance-universelle.model';
import { SouscriptionGouvernanceUniverselleService } from './souscription-gouvernance-universelle.service';
import { SouscriptionGouvernanceUniversellePopupService } from './souscription-gouvernance-universelle-popup.service';

@Component({
    selector: 'jhi-souscription-gouvernance-universelle-delete-dialog',
    templateUrl: './souscription-gouvernance-universelle-dialog.component.html'
})
export class SouscriptionGouvernanceUniverselleDeleteDialogComponent {

    souscriptionGouvernanceUniverselle: SouscriptionGouvernanceUniverselle;

    constructor(
        private souscriptionGouvernanceUniverselleService: SouscriptionGouvernanceUniverselleService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.souscriptionGouvernanceUniverselleService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'SouscriptionGouvernanceUniverselleListModification',
                content: 'Deleted an SouscriptionGouvernanceUniverselle'
            });
            this.activeModal.dismiss(true);
        }, () => {
            this.alertService.error('carmesfnmserviceApp.SouscriptionGouvernanceUniverselle.deleted');
        });
    }
}

@Component({
    selector: 'jhi-souscriptionGouvernanceUniverselle-delete-popup',
    template: ''
})
export class SouscriptionGouvernanceUniverselleDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private souscriptionGouvernanceUniversellePopupService: SouscriptionGouvernanceUniversellePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.souscriptionGouvernanceUniversellePopupService
                .open(SouscriptionGouvernanceUniverselleDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
