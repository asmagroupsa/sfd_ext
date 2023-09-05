import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Journal } from './journal.model';
import { JournalPopupService } from './journal-popup.service';
import { JournalService } from './journal.service';

@Component({
    selector: 'jhi-journal-dialog',
    templateUrl: './journal-dialog.component.html'
})
export class JournalDialogComponent implements OnInit {

    journal: Journal;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private journalService: JournalService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.journal.id !== undefined) {
            this.subscribeToSaveResponse(
                this.journalService.update(this.journal));
        } else {
            this.subscribeToSaveResponse(
                this.journalService.create(this.journal));
        }
    }

    private subscribeToSaveResponse(result: Observable<Journal>) {
        result.subscribe((res: Journal) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Journal) {
        this.eventManager.broadcast({ name: 'journalListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-journal-popup',
    template: ''
})
export class JournalPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private journalPopupService: JournalPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.journalPopupService
                    .open(JournalDialogComponent as Component, params['id']);
            } else {
                this.journalPopupService
                    .open(JournalDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
