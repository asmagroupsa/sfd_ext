import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ClientConditionNote } from './client-condition-note.model';
import { ClientConditionNotePopupService } from './client-condition-note-popup.service';
import { ClientConditionNoteService } from './client-condition-note.service';

@Component({
    selector: 'jhi-client-condition-note-delete-dialog',
    templateUrl: './client-condition-note-delete-dialog.component.html'
})
export class ClientConditionNoteDeleteDialogComponent {

    clientConditionNote: ClientConditionNote;

    constructor(
        private clientConditionNoteService: ClientConditionNoteService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.clientConditionNoteService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'clientConditionNoteListModification',
                content: 'Deleted an clientConditionNote'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.clientConditionNote.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.clientConditionNote.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-client-condition-note-delete-popup',
    template: ''
})
export class ClientConditionNoteDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private clientConditionNotePopupService: ClientConditionNotePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.clientConditionNotePopupService
                .open(ClientConditionNoteDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
