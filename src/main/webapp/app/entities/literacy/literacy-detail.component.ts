import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Literacy } from './literacy.model';
import { LiteracyService } from './literacy.service';

@Component({
    selector: 'jhi-literacy-detail',
    templateUrl: './literacy-detail.component.html'
})
export class LiteracyDetailComponent implements OnInit, OnDestroy {

    literacy: Literacy;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private literacyService: LiteracyService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLiteracies();
    }

    load(id) {
        this.literacyService.find(id).subscribe((literacy) => {
            this.literacy = literacy;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLiteracies() {
        this.eventSubscriber = this.eventManager.subscribe(
            'literacyListModification',
            (response) => this.load(this.literacy.id)
        );
    }
}
