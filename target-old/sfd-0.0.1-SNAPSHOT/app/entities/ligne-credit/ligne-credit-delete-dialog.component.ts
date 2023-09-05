import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { LigneCredit } from './ligne-credit.model';
import { LigneCreditPopupService } from './ligne-credit-popup.service';
import { LigneCreditService } from './ligne-credit.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-ligne-credit-delete-dialog',
    templateUrl: './ligne-credit-delete-dialog.component.html'
})
export class LigneCreditDeleteDialogComponent {
    ligneCredit: LigneCredit;
    echeancesClients: any = [];

    constructor(
        private ligneCreditService: LigneCreditService,
        public principal: Principal,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) { }
    ngOnInit() {
        this.ligneCreditService.echeancesLigneCredit(this.ligneCredit.id).subscribe(
            response => {
                this.echeancesClients = response;
            });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.ligneCreditService.delete(id).subscribe(
            response => {
                this.eventManager.broadcast({
                    name: 'ligneCreditListModification',
                    content: 'Deleted an ligneCredit'
                });
                this.activeModal.dismiss(true);
                this.alertService.success(
                    'carmesfnmserviceApp.ligneCredit.deleted',
                    { param: id },
                    null
                );
            },
            e => {
                this.alertService.error(
                    'carmesfnmserviceApp.ligneCredit.deleted',
                    { param: id },
                    null
                );
            }
        );
    }
}

@Component({
    selector: 'jhi-ligne-credit-delete-popup',
    template: ''
})
export class LigneCreditDeletePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private ligneCreditPopupService: LigneCreditPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.ligneCreditPopupService.open(
                LigneCreditDeleteDialogComponent as Component,
                params['id']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
