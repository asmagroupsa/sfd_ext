import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ClientConditionNote } from './client-condition-note.model';
import { ClientConditionNotePopupService } from './client-condition-note-popup.service';
import { ClientConditionNoteService } from './client-condition-note.service';
import { UserData } from '../../shared';

@Component({
    selector: 'jhi-client-condition-note-dialog',
    templateUrl: './client-condition-note-dialog.component.html'
})
export class ClientConditionNoteDialogComponent implements OnInit {

    clientConditionNote: ClientConditionNote;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private clientConditionNoteService: ClientConditionNoteService,
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
        if (this.clientConditionNote.id !== undefined) {
            this.subscribeToSaveResponse(this.clientConditionNoteService.update(this.clientConditionNote));
        } else {
            this.subscribeToSaveResponse(this.clientConditionNoteService.create(this.clientConditionNote));
        }
    }

    private subscribeToSaveResponse(result: Observable<ClientConditionNote>) {
        result.subscribe((res: ClientConditionNote) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: ClientConditionNote) {
        this.eventManager.broadcast({ name: 'clientConditionNoteListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-client-condition-note-popup',
    template: ''
})
export class ClientConditionNotePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private clientConditionNotePopupService: ClientConditionNotePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.clientConditionNotePopupService
                    .open(ClientConditionNoteDialogComponent as Component, params['id']);
            } else {
                this.clientConditionNotePopupService
                    .open(ClientConditionNoteDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
