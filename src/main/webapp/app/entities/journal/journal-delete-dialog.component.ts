import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Journal } from './journal.model';
import { JournalPopupService } from './journal-popup.service';
import { JournalService } from './journal.service';

@Component({
    selector: 'jhi-journal-delete-dialog',
    templateUrl: './journal-delete-dialog.component.html'
})
export class JournalDeleteDialogComponent {

    journal: Journal;

    constructor(
        private journalService: JournalService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.journalService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'journalListModification',
                content: 'Deleted an journal'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.journal.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.journal.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-journal-delete-popup',
    template: ''
})
export class JournalDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private journalPopupService: JournalPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.journalPopupService
                .open(JournalDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
