import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Journal } from './journal.model';
import { JournalService } from './journal.service';

@Component({
    selector: 'jhi-journal-detail',
    templateUrl: './journal-detail.component.html'
})
export class JournalDetailComponent implements OnInit, OnDestroy {

    journal: Journal;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private journalService: JournalService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInJournals();
    }

    load(id) {
        this.journalService.find(id).subscribe((journal) => {
            this.journal = journal;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInJournals() {
        this.eventSubscriber = this.eventManager.subscribe(
            'journalListModification',
            (response) => this.load(this.journal.id)
        );
    }
}
