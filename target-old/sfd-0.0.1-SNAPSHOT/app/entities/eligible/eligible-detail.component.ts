import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Eligible } from './eligible.model';
import { EligibleService } from './eligible.service';

@Component({
    selector: 'jhi-eligible-detail',
    templateUrl: './eligible-detail.component.html'
})
export class EligibleDetailComponent implements OnInit, OnDestroy {

    eligible: Eligible;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eligibleService: EligibleService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEligibles();
    }

    load(id) {
        this.eligibleService.find(id).subscribe((eligible) => {
            this.eligible = eligible;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEligibles() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eligibleListModification',
            (response) => this.load(this.eligible.id)
        );
    }
}
