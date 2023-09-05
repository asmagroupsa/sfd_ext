import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DelegationComity } from './delegation-comity.model';
import { DelegationComityPopupService } from './delegation-comity-popup.service';
import { DelegationComityService } from './delegation-comity.service';

@Component({
    selector: 'jhi-delegation-comity-delete-dialog',
    templateUrl: './delegation-comity-delete-dialog.component.html'
})
export class DelegationComityDeleteDialogComponent {

    delegationComity: DelegationComity;

    constructor(
        private delegationComityService: DelegationComityService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.delegationComityService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'delegationComityListModification',
                content: 'Deleted an delegationComity'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.delegationComity.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.delegationComity.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-delegation-comity-delete-popup',
    template: ''
})
export class DelegationComityDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private delegationComityPopupService: DelegationComityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.delegationComityPopupService
                .open(DelegationComityDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
