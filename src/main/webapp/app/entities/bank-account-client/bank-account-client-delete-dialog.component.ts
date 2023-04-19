import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { BankAccountClient } from './bank-account-client.model';
import { BankAccountClientPopupService } from './bank-account-client-popup.service';
import { BankAccountClientService } from './bank-account-client.service';

@Component({
    selector: 'jhi-bank-account-client-detail',
    templateUrl: './bank-account-client-detail.component.html'
})
export class BankAccountClientDeleteDialogComponent {

    bank: BankAccountClient;

    constructor(
        private bankService: BankAccountClientService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.bankService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'bankListModification',
                content: 'Deleted an bank'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.bank.deleted', {param: id}, null)
        }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.bank.deleted', {param: id}, null)
        });
    }
}

@Component({
    selector: 'jhi-bank-delete-popup',
    template: ''
})
export class BankAccountClientDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private bankPopupService: BankAccountClientPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.bankPopupService
                .open(BankAccountClientDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
