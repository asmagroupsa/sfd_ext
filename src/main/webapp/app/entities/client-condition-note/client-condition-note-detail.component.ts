import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ClientConditionNote } from './client-condition-note.model';
import { ClientConditionNoteService } from './client-condition-note.service';

@Component({
    selector: 'jhi-client-condition-note-detail',
    templateUrl: './client-condition-note-detail.component.html'
})
export class ClientConditionNoteDetailComponent implements OnInit, OnDestroy {

    clientConditionNote: ClientConditionNote;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private clientConditionNoteService: ClientConditionNoteService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInClientConditionNotes();
    }

    load(id) {
        this.clientConditionNoteService.find(id).subscribe((clientConditionNote) => {
            this.clientConditionNote = clientConditionNote;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInClientConditionNotes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'clientConditionNoteListModification',
            (response) => this.load(this.clientConditionNote.id)
        );
    }
}
